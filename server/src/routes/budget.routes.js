import express from "express";
import auth from "../middlewares/auth.middleware.js";
import {
  setBudget,
  getBudgetsWithUsage,
} from "../controllers/budget.controller.js";

const router = express.Router();

router.use(auth);

router.post("/", setBudget);
router.get("/", getBudgetsWithUsage);

export default router;