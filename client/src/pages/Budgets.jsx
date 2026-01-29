import { useEffect, useState } from "react";
import api from "../api/axios";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BudgetBar from "../components/BudgetBar";
import AppContainer from "../components/AppContainer";
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

  const navigate = useNavigate();

  return (
    <AppContainer>
      <div className="pt-6 pb-32 space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center"
            >
              <Home size={18} />
            </button>

            <h1 className="text-lg font-semibold">Budgets</h1>
          </div>

          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="rounded-xl border bg-white px-3 py-1.5 text-sm"
          />
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CATEGORIES.map((category) => {
            const budget = getBudget(category);
            const isEditing = editing === category;

            return (
              <div
                key={category}
                className="rounded-2xl bg-white/80 backdrop-blur p-5 space-y-4"
              >
                {/* HEADER */}
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

                {/* BUDGET BAR */}
                {budget && !isEditing && (
                  <BudgetBar
                    category={category}
                    used={budget.used}
                    total={budget.amount}
                    showLabel={false}
                  />
                )}

                {/* EDIT INPUT */}
                {isEditing && (
                  <input
                    type="number"
                    placeholder="Set monthly limit"
                    value={draftAmount}
                    onChange={(e) => setDraftAmount(e.target.value)}
                    className="w-full rounded-xl bg-gray-100 px-4 py-2 text-sm outline-none"
                    autoFocus
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <BottomDock />
    </AppContainer>
  );
}
