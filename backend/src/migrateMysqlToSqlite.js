import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Sequelize } from "sequelize";
import { AdminUser } from "./models/AdminUser.js";
import { Testimonial } from "./models/Testimonial.js";
import { TeamMember } from "./models/TeamMember.js";
import { Project } from "./models/Project.js";
import { Event } from "./models/Event.js";
import { Blog } from "./models/Blog.js";
import { GalleryImage } from "./models/GalleryImage.js";
import { PageContent } from "./models/PageContent.js";
import { SaptahikIssue } from "./models/SaptahikIssue.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sqliteStorage = path.resolve(__dirname, "../data/dev.sqlite");

async function migrate() {
  console.log("Exporting from MySQL to SQLite...");

  const mysqlDb = new Sequelize(
    process.env.DB_NAME || "lokmangal_foundation",
    process.env.DB_USER || "root",
    process.env.DB_PASSWORD || "",
    {
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 3306,
      dialect: "mysql",
      logging: false,
    }
  );

  const sqliteDb = new Sequelize({
    dialect: "sqlite",
    storage: sqliteStorage,
    logging: false,
  });

  try {
    await mysqlDb.authenticate();
    console.log("MySQL connected.");

    await sqliteDb.authenticate();
    console.log("SQLite connected.");

    const tables = [
      { name: "adminusers", model: AdminUser },
      { name: "testimonials", model: Testimonial },
      { name: "teammembers", model: TeamMember },
      { name: "projects", model: Project },
      { name: "events", model: Event },
      { name: "blogs", model: Blog },
      { name: "galleryimages", model: GalleryImage },
      { name: "pagecontents", model: PageContent },
      { name: "saptahikissues", model: SaptahikIssue },
    ];

    for (const { name, model } of tables) {
      const [rows] = await mysqlDb.query(`SELECT * FROM ${name}`);
      console.log(`Fetched ${rows.length} rows from MySQL table '${name}'`);

      // Initialize table in SQLite
      model.init(model.rawAttributes, { sequelize: sqliteDb, tableName: name });
      await model.sync({ force: true });

      if (rows.length > 0) {
        for (const row of rows) {
          const item = { ...row };
          if (name === "pagecontents") {
            if (typeof item.dataEn === "string") {
              try { item.dataEn = JSON.parse(item.dataEn); } catch (_) {}
            }
            if (typeof item.dataMr === "string") {
              try { item.dataMr = JSON.parse(item.dataMr); } catch (_) {}
            }
          }
          await model.create(item);
        }
        console.log(`Saved ${rows.length} rows to SQLite table '${name}'`);
      }
    }

    console.log("Migration MySQL -> SQLite completed successfully!");
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    await mysqlDb.close();
    await sqliteDb.close();
  }
}

migrate();
