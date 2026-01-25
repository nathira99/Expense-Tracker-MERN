import Budget from "../models/Budget.js";
import Expense from "../models/Expense.js";
import mongoose from "mongoose";

/**
 * Create / Update Budget
 */
export const setBudget = async (req, res) => {
  try {
    const { category, amount, month } = req.body;

    if (!category || !amount || !month) {
      return res.status(400).json({ message: "All fields required" });
    }

    const budget = await Budget.findOneAndUpdate(
      { userId: req.userId, category, month },
      { amount },
      { upsert: true, new: true }
    );

    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Budget vs Expense (SMART PART)
 */
export const getBudgetsWithUsage = async (req, res) => {
  try {
    const { month } = req.query;

    const budgets = await Budget.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.userId),
          month,
        },
      },
      {
        $lookup: {
          from: "expenses",
          let: { category: "$category" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$category", "$$category"] },
                    { $eq: ["$type", "expense"] },
                    { $eq: ["$userId", new mongoose.Types.ObjectId(req.userId)] },
                  ],
                },
              },
            },
            {
              $group: {
                _id: null,
                total: { $sum: "$amount" },
              },
            },
          ],
          as: "used",
        },
      },
      {
        $addFields: {
          used: { $ifNull: [{ $arrayElemAt: ["$used.total", 0] }, 0] },
        },
      },
    ]);

    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};