import { pool } from "../config/db.js";

export const CategoryModel = {
  async getAll({ name } = {}) {
    const hasName = typeof name === "string" && name.trim() !== "";
    const result = await pool.query(
      hasName
        ? "SELECT * FROM categories WHERE name ILIKE $1 ORDER BY name ASC"
        : "SELECT * FROM categories ORDER BY name ASC",
      hasName ? [`%${name.trim()}%`] : [],
    );
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query("SELECT * FROM categories WHERE id = $1", [
      id,
    ]);
    return result.rows[0] ?? null;
  },

  async create(name) {
    const query = "INSERT INTO categories (name) VALUES ($1) RETURNING *";
    const result = await pool.query(query, [name]);
    return result.rows[0];
  },

  async update(id, data) {
    const { name } = data;
    const result = await pool.query(
      `UPDATE categories
       SET name = COALESCE($2, name)
       WHERE id = $1
       RETURNING *`,
      [id, name ?? null],
    );
    return result.rows[0] ?? null;
  },

  async delete(id) {
    const result = await pool.query(
      "DELETE FROM categories WHERE id = $1 RETURNING *",
      [id],
    );
    return result.rows[0] ?? null;
  },
};
