import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import expenseRoutes from "./routes/expense.routes.js";
import budgetRoutes from "./routes/budget.routes.js"

const app = express();

app.use(cors({
  origin: ["http://localhost:5173",
    "https://smart-expense-tracker-fe.onrender.com"
  ],
  credentials: true,
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/budgets", budgetRoutes);


app.get("/", (req, res) => {
  res.send("API running");
});

export default app;