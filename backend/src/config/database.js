import path from "path";
import { fileURLToPath } from "url";
import { Sequelize } from "sequelize";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultStorage = path.resolve(__dirname, "../../data/dev.sqlite");

const dialect = process.env.DB_DIALECT || "sqlite";

// Managed MySQL providers (Aiven, PlanetScale, Railway, ...) require TLS and
// reject plain connections outright, while a local/self-hosted MySQL usually
// has no cert to verify -- so this is an explicit opt-in via DB_SSL rather
// than inferred, matching the TRUST_PROXY/STORAGE_DRIVER pattern elsewhere.
const dbSslEnv = (process.env.DB_SSL || "").trim().toLowerCase();
const useDbSsl = dbSslEnv && dbSslEnv !== "0" && dbSslEnv !== "false";

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
        storage: process.env.DB_STORAGE ? path.resolve(process.env.DB_STORAGE) : defaultStorage,
        logging: false,
      });

