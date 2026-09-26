import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Sequelize } from "sequelize";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultStorage = path.resolve(__dirname, "../../data/dev.sqlite");

const dialect = process.env.DB_DIALECT || "sqlite";

const dbSslEnv = (process.env.DB_SSL || "").trim().toLowerCase();
const useDbSsl = dbSslEnv && dbSslEnv !== "0" && dbSslEnv !== "false";

let resolvedStorage = defaultStorage;
if (process.env.DB_STORAGE) {
  const directPath = path.resolve(process.env.DB_STORAGE);
  const backendRelPath = path.resolve(__dirname, "../../", process.env.DB_STORAGE);
  if (fs.existsSync(directPath)) {
    resolvedStorage = directPath;
  } else if (fs.existsSync(backendRelPath)) {
    resolvedStorage = backendRelPath;
  } else {
    resolvedStorage = directPath;
  }
}

if (dialect === "sqlite") {
  try {
    fs.mkdirSync(path.dirname(resolvedStorage), { recursive: true });
  } catch (_) {}
}

export const sequelize =
  dialect === "mysql"
    ? new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
          host: process.env.DB_HOST,
          port: process.env.DB_PORT,
          dialect: "mysql",
          logging: false,
          dialectOptions: useDbSsl ? { ssl: { rejectUnauthorized: false } } : {},
        }
      )
    : new Sequelize({
        dialect: "sqlite",
        storage: resolvedStorage,
        logging: false,
      });
