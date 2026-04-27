import { pool } from "../config/db.js";

export const AuthorModel = {
  async getAll({ name } = {}) {
    const hasName = typeof name === "string" && name.trim() !== "";
    const result = await pool.query(
      hasName
        ? "SELECT * FROM authors WHERE name ILIKE $1 ORDER BY name ASC"
        : "SELECT * FROM authors ORDER BY name ASC",
      hasName ? [`%${name.trim()}%`] : [],
    );
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query("SELECT * FROM authors WHERE id = $1", [id]);
    return result.rows[0] ?? null;
  },

  async create(name, nationality) {
    const query =
      "INSERT INTO authors (name, nationality) VALUES ($1, $2) RETURNING *";
    const result = await pool.query(query, [name, nationality]);
    return result.rows[0];
  },

  async update(id, data) {
    const { name, nationality } = data;
    const result = await pool.query(
      `UPDATE authors
       SET name = COALESCE($2, name),
           nationality = COALESCE($3, nationality)
       WHERE id = $1
       RETURNING *`,
      [id, name ?? null, nationality ?? null],
    );
    return result.rows[0] ?? null;
  },

  async delete(id) {
    const result = await pool.query(
      "DELETE FROM authors WHERE id = $1 RETURNING *",
      [id],
    );
    return result.rows[0] ?? null;
  },
};
