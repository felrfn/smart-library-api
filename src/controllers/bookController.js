import { BookModel } from "../models/bookModel.js";
export const BookController = {
  async getAllBooks(req, res) {
    try {
      res.json(await BookModel.getAll());
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
};
