import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Project = sequelize.define("Project", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  slug: { type: DataTypes.STRING, allowNull: false, unique: true },
  titleEn: { type: DataTypes.STRING, allowNull: false },
  titleMr: { type: DataTypes.STRING, allowNull: false },
  summaryEn: { type: DataTypes.TEXT, allowNull: false },
  summaryMr: { type: DataTypes.TEXT, allowNull: false },
  objectiveEn: { type: DataTypes.TEXT, allowNull: true },
  objectiveMr: { type: DataTypes.TEXT, allowNull: true },
  descriptionEn: { type: DataTypes.TEXT, allowNull: true },
  descriptionMr: { type: DataTypes.TEXT, allowNull: true },
  statEn: { type: DataTypes.STRING, allowNull: true },
  statMr: { type: DataTypes.STRING, allowNull: true },
  videoUrl: { type: DataTypes.STRING, allowNull: true },
  coverImageUrl: { type: DataTypes.STRING, allowNull: true },
  sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
});
