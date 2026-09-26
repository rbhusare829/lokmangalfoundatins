import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Testimonial = sequelize.define("Testimonial", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  roleEn: { type: DataTypes.STRING, allowNull: true },
  roleMr: { type: DataTypes.STRING, allowNull: true },
  messageEn: { type: DataTypes.TEXT, allowNull: false },
  messageMr: { type: DataTypes.TEXT, allowNull: false },
  photoUrl: { type: DataTypes.STRING, allowNull: true },
  sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
});
