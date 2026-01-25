import { useEffect, useState } from "react";
import api from "../api/axios";
import BudgetBar from "../components/BudgetBar";
import BottomDock from "../components/BottomDock";

const CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Others",
];

export default function Budgets() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [budgets, setBudgets] = useState([]);
  const [editing, setEditing] = useState(null);
  const [draftAmount, setDraftAmount] = useState("");

  useEffect(() => {
    fetchBudgets();
  }, [month]);

  const fetchBudgets = async () => {
    const res = await api.get(`/budgets?month=${month}`);
    setBudgets(res.data);
  };

  const startEdit = (category, currentAmount = "") => {
    setEditing(category);
    setDraftAmount(currentAmount);
  };

  const cancelEdit = () => {
    setEditing(null);
    setDraftAmount("");
  };

  const saveBudget = async (category) => {
    if (!draftAmount) return;

    await api.post("/budgets", {
      category,
      amount: Number(draftAmount),
      month,
    });

    cancelEdit();
    fetchBudgets();
  };

  const getBudget = (category) => budgets.find((b) => b.category === category);

  return (
    <div className="min-h-screen bg-[#F6F7FB] px-5 pt-10 pb-20 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">Budgets</h1>

      {/* Month Selector */}
      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="mb-6 w-full rounded-lg border px-3 py-2 text-sm"
      />

      <div className="space-y-6">
        {CATEGORIES.map((category) => {
          const budget = getBudget(category);
          const isEditing = editing === category;

          return (
            <div
              key={category}
              className="relative rounded-2xl bg-white/80 backdrop-blur p-5 space-y-4"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <p className="font-medium">{category}</p>

                {!isEditing ? (
                  <button
                    onClick={() => startEdit(category, budget?.amount || "")}
                    className="text-xs text-gray-500 underline"
                  >
                    {budget ? "Edit" : "Set"}
                  </button>
                ) : (
                  <div className="flex gap-3 text-xs">
                    <button
                      onClick={() => saveBudget(category)}
                      className="text-black underline"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="text-gray-400 underline"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Budget Bar */}
              {budget && (
                <BudgetBar
                  category={category}
                  used={budget.used}
                  total={budget.amount}
                  showLabel={false}
                />
              )}

              {/* Edit Input */}
              {isEditing && (
                <input
                  type="number"
                  placeholder="Set monthly limit"
                  value={draftAmount}
                  onChange={(e) => setDraftAmount(e.target.value)}
                  className="w-full rounded-lg bg-gray-100 px-3 py-2 text-sm outline-none"
                  autoFocus
                />
              )}
            </div>
          );
        })}
        <BottomDock />
      </div>
    </div>
  );
}
