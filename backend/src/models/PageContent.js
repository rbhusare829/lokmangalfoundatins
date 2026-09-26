import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const PageContent = sequelize.define("PageContent", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  key: { type: DataTypes.STRING, allowNull: false, unique: true },
  dataEn: { type: DataTypes.JSON, allowNull: false },
  dataMr: { type: DataTypes.JSON, allowNull: false },
});
