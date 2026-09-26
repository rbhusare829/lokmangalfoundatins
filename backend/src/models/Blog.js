import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Blog = sequelize.define("Blog", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  slug: { type: DataTypes.STRING, allowNull: false, unique: true },
  titleEn: { type: DataTypes.STRING, allowNull: false },
  titleMr: { type: DataTypes.STRING, allowNull: false },
  excerptEn: { type: DataTypes.TEXT, allowNull: false },
  excerptMr: { type: DataTypes.TEXT, allowNull: false },
  contentEn: { type: DataTypes.TEXT, allowNull: false },
  contentMr: { type: DataTypes.TEXT, allowNull: false },
  publishedDate: { type: DataTypes.STRING, allowNull: true },
  imageUrl: { type: DataTypes.STRING, allowNull: true },
});
