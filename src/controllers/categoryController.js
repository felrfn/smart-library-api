import { CategoryModel } from "../models/categoryModel.js";
export const CategoryController = {
  async getCategories(req, res) {
    try {
      res.json(await CategoryModel.getAll());
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
};
