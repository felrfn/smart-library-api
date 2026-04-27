import { MemberModel } from "../models/memberModel.js";

export const MemberController = {
  async getAllMembers(req, res) {
    try {
      res.json(await MemberModel.getAll());
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getMemberById(req, res) {
    try {
      const member = await MemberModel.getById(req.params.id);
      if (!member) return res.status(404).json({ error: "Member tidak ditemukan." });
      res.json(member);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async registerMember(req, res) {
    try {
      res.status(201).json({
        message: "Anggota terdaftar!",
        data: await MemberModel.create(req.body),
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async updateMember(req, res) {
    try {
      const updated = await MemberModel.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: "Member tidak ditemukan." });
      res.json({ message: "Member diperbarui.", data: updated });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async deleteMember(req, res) {
    try {
      const deleted = await MemberModel.delete(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Member tidak ditemukan." });
      res.json({ message: "Member dihapus.", data: deleted });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};
