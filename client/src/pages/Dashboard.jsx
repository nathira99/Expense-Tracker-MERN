import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { User2 } from "lucide-react";

import AppContainer from "../components/AppContainer";
import BottomDock from "../components/BottomDock";

export default function Dashboard() {
  const navigate = useNavigate();

  const [month, setMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    balance: 0,
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, [month]);

  const fetchDashboard = async () => {
    try {
      const [summaryRes, categoryRes] = await Promise.all([
        api.get(`/expenses/summary/monthly?month=${month}`),
        api.get(`/expenses/summary/category?month=${month}`),
      ]);

      setSummary(summaryRes.data);
      setCategories(categoryRes.data);
    } catch (err) {
      console.error("Dashboard error", err);
    }
  };

  /* ---------------- SMART STATUS ---------------- */

  let statusMessage = "You’re managing your money well";

  if (summary.expense > summary.income) {
    statusMessage = "Spending exceeded income this month";
  } else if (summary.income > 0) {
    const percent = Math.round(
      (summary.expense / summary.income) * 100
    );
    if (percent > 85) {
      statusMessage =
        "Careful — most of your income is already spent";
    }
  }

  /* ---------------- DONUT DATA ---------------- */

  const donutData = categories.map((c) => ({
    name: c._id,
    value: c.total,
  }));

  const COLORS = [
    "#111827",
    "#16a34a",
    "#6366f1",
    "#f59e0b",
    "#ef4444",
    "#14b8a6",
  ];

  /* ---------------- INSIGHTS ---------------- */

  const topCategory =
    categories.length > 0
      ? categories.reduce((a, b) =>
          a.total > b.total ? a : b
        )
      : null;

  const usedPercent =
    summary.income > 0
      ? Math.round((summary.expense / summary.income) * 100)
      : 0;

  const weekSpend = Math.round(summary.expense * 0.25);

  return (
    <AppContainer>
      <div className="pb-32 pt-6 space-y-6">

        {/* TOP BAR */}
        <div className="flex items-center justify-between">
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="rounded-xl border bg-white px-3 py-1.5 text-sm"
          />

          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.reload();
            }}
            className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center"
          >
            <User2 size={18} />
          </button>
        </div>

        {/* BALANCE */}
        <div className="w-full rounded-3xl bg-black p-6 text-white">
          <p className="text-xs opacity-70">
            Current Balance
          </p>
          <p className="mt-2 text-3xl font-semibold">
            ₹{summary.balance}
          </p>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
          <MetricCard
            label="Used"
            value={`${usedPercent}%`}
          />
        </div>

        {/* STATUS MESSAGE */}
        <div className="rounded-xl bg-white px-4 py-3 text-sm text-gray-700 shadow-sm">
          {statusMessage}
        </div>

        {/* SPENDING BREAKDOWN */}
        <section>
          <h3 className="mb-3 text-sm font-medium">
            Spending Breakdown
          </h3>

          <div className="rounded-2xl bg-white p-4 shadow-sm">
            {donutData.length === 0 ? (
              <p className="text-sm text-gray-400">
                No expenses this month
              </p>
            ) : (
              <div className="relative w-full aspect-square max-h-[280px] mx-auto">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={donutData}
                      dataKey="value"
                      innerRadius="65%"
                      outerRadius="90%"
                      paddingAngle={5}
                      onClick={(_, index) => {
                        const category = donutData[index].name;
                        navigate(
                          `/expenses?month=${month}&category=${encodeURIComponent(
                            category
                          )}`
                        );
                      }}
                    >
                      {donutData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={COLORS[i % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                {/* CENTER */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="text-xs text-gray-400">
                    Total Spent
                  </p>
                  <p className="mt-1 text-xl font-semibold text-gray-900">
                    ₹{summary.expense}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* INSIGHTS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <InsightCard
            label="Top Category"
            value={topCategory?._id || "-"}
          />
          <InsightCard
            label="Used"
            value={`${usedPercent}%`}
          />
          <InsightCard
            label="This Week"
            value={`₹${weekSpend}`}
          />
        </div>

      </div>

      <BottomDock onExpenseAdded={fetchDashboard} />
    </AppContainer>
  );
}

/* ---------------- COMPONENTS ---------------- */

function MetricCard({ label, value, prefix = "", color }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <p className="text-xs text-gray-400">{label}</p>
      <p
        className={`mt-1 text-lg font-semibold ${
          color || "text-gray-900"
        }`}
      >
        {prefix}
        {value}
      </p>
    </div>
  );
}

function InsightCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}