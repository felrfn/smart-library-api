import { LoanModel } from "../models/loanModel.js";

export const LoanController = {
  async createLoan(req, res) {
    try {
      res.status(201).json({
        message: "Peminjaman dicatat!",
        data: await LoanModel.createLoan(
          req.body.book_id,
          req.body.member_id,
          req.body.due_date,
        ),
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async returnLoan(req, res) {
    try {
      const result = await LoanModel.returnLoan(req.params.id);
      res.json({ message: "Buku berhasil dikembalikan.", data: result });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async getLoans(req, res) {
    try {
      res.json(await LoanModel.getAllLoans());
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getTopBorrowers(req, res) {
    try {
      const topBorrowers = await LoanModel.getTopBorrowers();
      res.json({
        message: "Top 3 peminjam buku berhasil diambil",
        data: topBorrowers,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
