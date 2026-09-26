import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// The API reports failures in two shapes depending on where the rejection
// happened: express-validator's own 400s return `{ errors: [{ msg, path }] }`
// directly, while everything else (Sequelize unique/validation errors, the
// "Image is required" guard, multer errors) goes through the global error
// handler and comes back as `{ error }`.
export function extractErrorMessage(err) {
  const data = err?.response?.data;
  if (data?.errors?.length) {
    return data.errors.map((e) => (e.path ? `${e.path}: ${e.msg}` : e.msg)).join("; ");
  }
  if (data?.error) return data.error;
  return "Something went wrong. Please try again.";
}
