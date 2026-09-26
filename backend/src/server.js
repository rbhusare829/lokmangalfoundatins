import "dotenv/config";
import { app } from "./app.js";
import { sequelize } from "./config/database.js";
import "./models/AdminUser.js";
import "./models/GalleryImage.js";
import "./models/Testimonial.js";
import "./models/TeamMember.js";
import "./models/Project.js";
import "./models/Event.js";
import "./models/Blog.js";
import "./models/SaptahikIssue.js";
import "./models/PageContent.js";

const PORT = process.env.PORT || 4000;

// Fail fast and loud on missing config, rather than letting the app start
// and only break later — e.g. a missing JWT_SECRET makes jwt.sign()/verify()
// throw at login time instead of at startup.
function checkRequiredEnv() {
  const missing = [];
  if (!process.env.JWT_SECRET) missing.push("JWT_SECRET");
  if (process.env.DB_DIALECT === "mysql") {
    for (const key of ["DB_HOST", "DB_NAME", "DB_USER"]) {
      if (!process.env[key]) missing.push(key);
    }
  }
  if (process.env.STORAGE_DRIVER === "s3") {
    for (const key of ["AWS_REGION", "AWS_S3_BUCKET", "AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"]) {
      if (!process.env[key]) missing.push(key);
    }
  }
  if (missing.length > 0) {
    throw new Error(`Missing required environment variable(s): ${missing.join(", ")}. Check your .env file.`);
  }
}

process.on("unhandledRejection", (err) => {
  console.error("Unhandled promise rejection:", err);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  process.exit(1);
});

async function start() {
  try {
    checkRequiredEnv();
    await sequelize.authenticate();
    await sequelize.sync();
    console.log(`Database connected (${sequelize.getDialect()})`);

    app.listen(PORT, () => {
      console.log(`API listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
