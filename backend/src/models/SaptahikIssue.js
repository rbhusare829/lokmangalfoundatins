import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

// One weekly issue of the Lokmangal Saptahik: a PDF plus a cover image (the
// admin panel renders the PDF's first page as the cover when none is
// uploaded). Only the date and the PDF are required; the site labels an
// untitled issue by its date and week of the month. issueDate is a real
// date, not free text like Blog.publishedDate, because the public archive
// sorts by it and groups issues by year, month and week.
export const SaptahikIssue = sequelize.define("SaptahikIssue", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  titleMr: { type: DataTypes.STRING, allowNull: true },
  titleEn: { type: DataTypes.STRING, allowNull: true },
  issueNumber: { type: DataTypes.STRING, allowNull: true },
  issueDate: { type: DataTypes.DATEONLY, allowNull: false },
  coverImageUrl: { type: DataTypes.STRING, allowNull: true },
  pdfUrl: { type: DataTypes.STRING, allowNull: false },
});
