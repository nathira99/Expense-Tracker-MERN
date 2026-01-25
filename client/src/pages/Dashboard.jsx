import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { User2Icon } from "lucide-react"
import UsedRing from "../components/UserdRing";
import BottomDock from "../components/BottomDock";

export default function Dashboard() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    balance: 0,
  });

  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [trend, setTrend] = useState([]);

  const totalBudget = budgets.reduce((s, b) => s + b.amount, 0);
  const totalUsed = budgets.reduce((s, b) => s + b.used, 0);
  const usedPercent =
    totalBudget > 0 ? Math.round((totalUsed / totalBudget) * 100) : 0;

  useEffect(() => {
    fetchDashboard();
  }, [month]);

  const fetchDashboard = async () => {
    try {
      const [summaryRes, categoryRes, budgetRes, trendRes] = await Promise.all([
        api.get(`/expenses/summary/monthly?month=${month}`),
        api.get(`/expenses/summary/category?month=${month}`),
        api.get(`/budgets?month=${month}`),
        api.get(`/expenses/summary/trend?month=${month}`),
      ]);

      setSummary(summaryRes.data);
      setCategories(categoryRes.data);
      setBudgets(budgetRes.data);
      setTrend(trendRes.data);
    } catch (err) {
      console.error("Dashboard fetch error", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F7FB] pb-32">
      <div className="max-w-md mx-auto px-5 pt-6 space-y-8">
        {/* TOP BAR */}
        <div className="flex items-center justify-between">
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-sm"
          />

          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.reload();
            }}
            className="w-7 h-7 pl-0.5 rounded-full bg-black text-white text-sm shadow"
          >
            <User2Icon />
          </button>
        </div>

        {/* BALANCE (HERO) */}
        <div className="rounded-[28px] bg-gradient-to-br from-black to-gray-800 p-6 text-white shadow-lg">
          <p className="text-xs opacity-70">Current Balance</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">
            ₹{summary.balance}
          </p>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-3 gap-3 items-stretch">
          <MetricCard
            label="Income"
            value={summary.income}
            prefix="₹"
            color="text-emerald-600"
          />
          <MetricCard
            label="Expense"
            value={summary.expense}
            prefix="₹"
            color="text-red-500"
          />

          <UsedRing
            percent={usedPercent}
            used={totalUsed}
            total={totalBudget}
          />
        </div>

        {/* CATEGORY BAR CHART */}
        <ChartCard title="Spending by Category">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={categories}>
              <XAxis
                dataKey="_id"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis hide />
              <Tooltip cursor={{ fill: "rgba(0,0,0,0.04)" }} />
              <Bar dataKey="total" radius={[8, 8, 0, 0]} fill="#000" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* TREND LINE CHART */}
        <ChartCard title="Income vs Expense">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16a34a" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>

                <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="day"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis hide />

              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  fontSize: "12px",
                }}
              />

              {/* Income (background, calmer) */}
              <Area
                type="monotone"
                dataKey="income"
                stroke="#16a34a"
                strokeWidth={2}
                fill="url(#incomeFill)"
                dot={false}
              />

              {/* Expense (foreground, stronger) */}
              <Area
                type="monotone"
                dataKey="expense"
                stroke="#ef4444"
                strokeWidth={2.5}
                fill="url(#expenseFill)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <BottomDock onExpenseAdded={fetchDashboard} />
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function MetricCard({ label, value, prefix = "", color, subtle }) {
  return (
    <div className="rounded-2xl bg-white/90 backdrop-blur p-4 shadow-sm">
      <p className="text-xs text-gray-400">{label}</p>
      <p className={`mt-1 text-lg font-semibold ${color || "text-gray-900"}`}>
        {prefix}
        {value}
      </p>
      {subtle && <p className="mt-1 text-[11px] text-gray-400">{subtle}</p>}
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="rounded-2xl bg-white/90 backdrop-blur p-4 shadow-sm">
      <p className="mb-3 text-sm font-medium text-gray-800">{title}</p>
      {children}
    </div>
  );
}
