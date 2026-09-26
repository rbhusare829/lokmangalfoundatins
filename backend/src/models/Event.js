import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Event = sequelize.define("Event", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  titleEn: { type: DataTypes.STRING, allowNull: false },
  titleMr: { type: DataTypes.STRING, allowNull: false },
  descriptionEn: { type: DataTypes.TEXT, allowNull: false },
  descriptionMr: { type: DataTypes.TEXT, allowNull: false },
  imageUrl: { type: DataTypes.STRING, allowNull: true },
  documentUrl: { type: DataTypes.STRING, allowNull: true },
  eventDate: { type: DataTypes.STRING, allowNull: true },
});
