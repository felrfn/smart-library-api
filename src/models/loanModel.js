import { pool } from "../config/db.js";
export const LoanModel = {
  async createLoan(book_id, member_id, due_date) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const bookCheck = await client.query(
        "SELECT available_copies FROM books WHERE id = $1",
        [book_id],
      );
      if (bookCheck.rows[0].available_copies <= 0)
        throw new Error("Buku stok habis.");
      await client.query(
        "UPDATE books SET available_copies = available_copies - 1 WHERE id = $1",
        [book_id],
      );
      const result = await client.query(
        `INSERT INTO loans (book_id, member_id, due_date) VALUES ($1, $2, $3) RETURNING *`,
        [book_id, member_id, due_date],
      );
      await client.query("COMMIT");
      return result.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
  async getAllLoans() {
    const query = `SELECT l.*, b.title as book_title, m.full_name as member_name FROM loans l JOIN books b ON l.book_id = b.id JOIN members m ON l.member_id = m.id`;
    const result = await pool.query(query);
    return result.rows;
  },
};
