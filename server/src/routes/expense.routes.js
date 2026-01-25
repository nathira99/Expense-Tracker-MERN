import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getMonthlySummary,
  getCategoryBreakdown,
  getMonthlyTrend,
} from "../controllers/expense.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createExpense);
router.get("/", getExpenses);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);
router.get("/summary/monthly", getMonthlySummary);
router.get("/summary/trend", getMonthlyTrend);
router.get("/summary/category", getCategoryBreakdown);

export default router;
