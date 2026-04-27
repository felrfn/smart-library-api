import { MemberModel } from "../models/memberModel.js";
export const MemberController = {
  async getAllMembers(req, res) {
    try {
      res.json(await MemberModel.getAll());
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async registerMember(req, res) {
    try {
      res
        .status(201)
        .json({
          message: "Anggota terdaftar!",
          data: await MemberModel.create(req.body),
        });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};
