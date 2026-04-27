import { AuthorModel } from "../models/authorModel.js";

export const AuthorController = {
  async getAuthors(req, res) {
    try {
      res.json(await AuthorModel.getAll({ name: req.query.name }));
    } catch (err) {
      console.log(err)
      res.status(500).json({ error: err.message });
    }
  },

  async getAuthorById(req, res) {
    try {
      const author = await AuthorModel.getById(req.params.id);
      if (!author) return res.status(404).json({ error: "Author tidak ditemukan." });
      res.json(author);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async addAuthor(req, res) {
    try {
      res
        .status(201)
        .json(await AuthorModel.create(req.body.name, req.body.nationality));
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async updateAuthor(req, res) {
    try {
      const updated = await AuthorModel.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: "Author tidak ditemukan." });
      res.json({ message: "Author diperbarui.", data: updated });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async deleteAuthor(req, res) {
    try {
      const deleted = await AuthorModel.delete(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Author tidak ditemukan." });
      res.json({ message: "Author dihapus.", data: deleted });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};
