import express from "express";
import { LoanController } from "../controllers/loanController.js";

const router = express.Router();

router.get("/", LoanController.getLoans);
router.post("/", LoanController.createLoan);

router.post("/:id/return", LoanController.returnLoan);

router.get("/top-borrowers", LoanController.getTopBorrowers);
export default router;
