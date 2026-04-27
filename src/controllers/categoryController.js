import { CategoryModel } from "../models/categoryModel.js";

export const CategoryController = {
  async getCategories(req, res) {
    try {
      res.json(await CategoryModel.getAll({ name: req.query.name }));
    } catch (err) {
      console.log(err)
      res.status(500).json({ error: err.message });
    }
  },

  async getCategoryById(req, res) {
    try {
      const category = await CategoryModel.getById(req.params.id);
      if (!category) return res.status(404).json({ error: "Kategori tidak ditemukan." });
      res.json(category);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async addCategory(req, res) {
    try {
      res.status(201).json(await CategoryModel.create(req.body.name));
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async updateCategory(req, res) {
    try {
      const updated = await CategoryModel.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: "Kategori tidak ditemukan." });
      res.json({ message: "Kategori diperbarui.", data: updated });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async deleteCategory(req, res) {
    try {
      const deleted = await CategoryModel.delete(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Kategori tidak ditemukan." });
      res.json({ message: "Kategori dihapus.", data: deleted });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};
