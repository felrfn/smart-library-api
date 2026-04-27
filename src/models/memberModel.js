import { pool } from "../config/db.js";

export const MemberModel = {
  async getAll() {
    const result = await pool.query("SELECT * FROM members ORDER BY joined_at DESC");
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query("SELECT * FROM members WHERE id = $1", [id]);
    return result.rows[0] ?? null;
  },

  async create(data) {
    const { full_name, email, member_type } = data;
    const query = `INSERT INTO members (full_name, email, member_type)
                   VALUES ($1, $2, $3)
                   RETURNING *`;
    const result = await pool.query(query, [full_name, email, member_type]);
    return result.rows[0];
  },

  async update(id, data) {
    const { full_name, email, member_type } = data;
    const result = await pool.query(
      `UPDATE members
       SET full_name = COALESCE($2, full_name),
           email = COALESCE($3, email),
           member_type = COALESCE($4, member_type)
       WHERE id = $1
       RETURNING *`,
      [id, full_name ?? null, email ?? null, member_type ?? null],
    );
    return result.rows[0] ?? null;
  },

  async delete(id) {
    const result = await pool.query(
      "DELETE FROM members WHERE id = $1 RETURNING *",
      [id],
    );
    return result.rows[0] ?? null;
  },
};
