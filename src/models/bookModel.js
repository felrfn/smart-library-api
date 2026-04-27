import { pool } from "../config/db.js";

export const BookModel = {
  async getAll({ title } = {}) {
    const hasTitle = typeof title === "string" && title.trim() !== "";
    const base = `SELECT b.*, a.name as author_name, c.name as category_name
                  FROM books b
                  LEFT JOIN authors a ON b.author_id = a.id
                  LEFT JOIN categories c ON b.category_id = c.id`;
    const result = await pool.query(
      hasTitle ? `${base} WHERE b.title ILIKE $1` : base,
      hasTitle ? [`%${title.trim()}%`] : [],
    );
    return result.rows;
  },

  async getById(id) {
    const query = `SELECT b.*, a.name as author_name, c.name as category_name
                   FROM books b
                   LEFT JOIN authors a ON b.author_id = a.id
                   LEFT JOIN categories c ON b.category_id = c.id
                   WHERE b.id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0] ?? null;
  },

  async create(data) {
    const { isbn, title, author_id, category_id, total_copies } = data;
    const query = `INSERT INTO books (isbn, title, author_id, category_id, total_copies, available_copies)
                   VALUES ($1, $2, $3, $4, $5, $5)
                   RETURNING *`;
    const result = await pool.query(query, [
      isbn,
      title,
      author_id,
      category_id,
      total_copies,
    ]);
    return result.rows[0];
  },

  async update(id, data) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const current = await client.query(
        "SELECT total_copies, available_copies FROM books WHERE id = $1 FOR UPDATE",
        [id],
      );
      if (!current.rows[0]) {
        await client.query("ROLLBACK");
        return null;
      }

      const { total_copies: curTotal, available_copies: curAvail } = current.rows[0];
      const borrowed = Number(curTotal) - Number(curAvail);

      const nextTotal =
        data.total_copies === undefined || data.total_copies === null
          ? Number(curTotal)
          : Number(data.total_copies);

      if (Number.isNaN(nextTotal) || nextTotal < 0) {
        throw new Error("total_copies tidak valid.");
      }
      if (nextTotal < borrowed) {
        throw new Error("total_copies tidak boleh lebih kecil dari jumlah buku yang sedang dipinjam.");
      }

      const nextAvail = Math.max(0, nextTotal - borrowed);

      const result = await client.query(
        `UPDATE books
         SET isbn = COALESCE($2, isbn),
             title = COALESCE($3, title),
             author_id = COALESCE($4, author_id),
             category_id = COALESCE($5, category_id),
             total_copies = $6,
             available_copies = $7
         WHERE id = $1
         RETURNING *`,
        [
          id,
          data.isbn ?? null,
          data.title ?? null,
          data.author_id ?? null,
          data.category_id ?? null,
          nextTotal,
          nextAvail,
        ],
      );

      await client.query("COMMIT");
      return result.rows[0] ?? null;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  async delete(id) {
    const result = await pool.query(
      "DELETE FROM books WHERE id = $1 RETURNING *",
      [id],
    );
    return result.rows[0] ?? null;
  },
};
