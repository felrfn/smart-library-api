import { BookModel } from "../models/bookModel.js";

export const BookController = {
  async getAllBooks(req, res) {
    try {
      res.json(await BookModel.getAll({ title: req.query.title }));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getBookById(req, res) {
    try {
      const book = await BookModel.getById(req.params.id);
      if (!book) return res.status(404).json({ error: "Buku tidak ditemukan." });
      res.json(book);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async createBook(req, res) {
    try {
      res.status(201).json(await BookModel.create(req.body));
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async updateBook(req, res) {
    try {
      const updated = await BookModel.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: "Buku tidak ditemukan." });
      res.json({ message: "Buku diperbarui.", data: updated });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async deleteBook(req, res) {
    try {
      const deleted = await BookModel.delete(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Buku tidak ditemukan." });
      res.json({ message: "Buku dihapus.", data: deleted });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};
