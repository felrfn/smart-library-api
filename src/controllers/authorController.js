import { AuthorModel } from "../models/authorModel.js";
export const AuthorController = {
  async getAuthors(req, res) {
    try {
      res.json(await AuthorModel.getAll());
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
      console.log("LOG ERROR: ", err);
      res.status(400).json({ error: err.message });
    }
  },
};
