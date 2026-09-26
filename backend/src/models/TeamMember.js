import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

// Shown on the About > Our Team page, grouped by `category`.
export const TEAM_CATEGORIES = ["Office Bearer", "Member"];

export const TeamMember = sequelize.define("TeamMember", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  nameMr: { type: DataTypes.STRING, allowNull: true },
  roleEn: { type: DataTypes.STRING, allowNull: false },
  roleMr: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false, defaultValue: "Member" },
  photoUrl: { type: DataTypes.STRING, allowNull: true },
  sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
});
