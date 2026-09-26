import "dotenv/config";
import { Sequelize } from "sequelize";
import { sequelize as mysqlDb } from "./config/database.js";
import { AdminUser } from "./models/AdminUser.js";
import { Testimonial } from "./models/Testimonial.js";
import { TeamMember } from "./models/TeamMember.js";
import { Project } from "./models/Project.js";
import { Event } from "./models/Event.js";
import { Blog } from "./models/Blog.js";
import { GalleryImage } from "./models/GalleryImage.js";
import { PageContent } from "./models/PageContent.js";

async function migrate() {
  console.log("Starting migration from SQLite to MySQL...");

  const sqliteDb = new Sequelize({
    dialect: "sqlite",
    storage: process.env.DB_STORAGE || "./data/dev.sqlite",
    logging: false,
  });

  try {
    await sqliteDb.authenticate();
    console.log("SQLite connected.");

    await mysqlDb.authenticate();
    console.log("MySQL connected.");

    // Sync MySQL tables (force: true will create clean tables)
    await mysqlDb.sync({ force: true });
    console.log("MySQL tables created successfully.");

    const models = [
      { name: "AdminUsers", model: AdminUser },
      { name: "Testimonials", model: Testimonial },
      { name: "TeamMembers", model: TeamMember },
      { name: "Projects", model: Project },
      { name: "Events", model: Event },
      { name: "Blogs", model: Blog },
      { name: "GalleryImages", model: GalleryImage },
      { name: "PageContents", model: PageContent },
    ];

    for (const { name, model } of models) {
      const [rows] = await sqliteDb.query(`SELECT * FROM ${name}`);
      console.log(`Fetched ${rows.length} rows from SQLite table '${name}'`);

      if (rows.length > 0) {
        const cleanedRows = rows.map((row) => {
          const item = { ...row };
          if (name === "PageContents") {
            if (typeof item.dataEn === "string") {
              try { item.dataEn = JSON.parse(item.dataEn); } catch (_) {}
            }
            if (typeof item.dataMr === "string") {
              try { item.dataMr = JSON.parse(item.dataMr); } catch (_) {}
            }
          }
          return item;
        });

        await model.bulkCreate(cleanedRows, { validate: false });
        console.log(`Migrated ${cleanedRows.length} rows to MySQL table '${name}'.`);
      }
    }

    console.log("\nMigration completed successfully! Verifying MySQL row counts:");
    for (const { name, model } of models) {
      const count = await model.count();
      console.log(`- ${name}: ${count} rows`);
    }

    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();
