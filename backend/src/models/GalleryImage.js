import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const GalleryImage = sequelize.define("GalleryImage", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  // Free-text, not a fixed enum: admins can type a brand-new category from
  // the admin UI's combobox and the public Gallery page picks it up
  // automatically. SQLite doesn't enforce Sequelize ENUM constraints, so this
  // worked by accident there, but MySQL enforces them strictly -- a hardcoded
  // ENUM here would reject any category outside the original four.
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  titleEn: { type: DataTypes.STRING, allowNull: false },
  titleMr: { type: DataTypes.STRING, allowNull: false },
  imageUrl: { type: DataTypes.STRING, allowNull: false },
  sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
});
