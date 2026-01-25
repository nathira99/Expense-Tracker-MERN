import { useEffect, useState } from "react";
import api from "../api/axios";

const EXPENSE_FALLBACK = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Others",
];

const INCOME_CATEGORIES = [
  "Salary",
  "Business",
  "Freelance",
  "Gift",
  "Other",
];

export default function AddTransactionModal({ open, onClose }) {
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (open) {
      loadCategories();
    }
  }, [open, type]);

  const loadCategories = async () => {
    try {
      if (type === "income") {
        setCategories(INCOME_CATEGORIES);
        setCategory(INCOME_CATEGORIES[0]);
        return;
      }

      // Expense → use budget categories if available
      const month = new Date().toISOString().slice(0, 7);
      const res = await api.get(`/budgets?month=${month}`);

      if (res.data.length > 0) {
        const cats = res.data.map((b) => b.category);
        setCategories(cats);
        setCategory(cats[0]);
      } else {
        setCategories(EXPENSE_FALLBACK);
        setCategory(EXPENSE_FALLBACK[0]);
      }
    } catch {
      setCategories(EXPENSE_FALLBACK);
      setCategory(EXPENSE_FALLBACK[0]);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => onClose(false)}
      />

      {/* Bottom Sheet */}
      <div className="relative w-full max-w-md rounded-t-3xl bg-white px-6 pt-6 pb-8 animate-slide-up">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-gray-200" />

        {/* Type Toggle */}
        <div className="flex rounded-full bg-gray-100 p-1 mb-4">
          {["expense", "income"].map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`flex-1 rounded-full py-2 text-sm font-medium transition
                ${
                  type === t
                    ? "bg-black text-white"
                    : "text-gray-600"
                }
              `}
            >
              {t === "expense" ? "Expense" : "Income"}
            </button>
          ))}
        </div>

        {/* Amount */}
        <input
          type="number"
          placeholder="₹0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          autoFocus
          className="w-full bg-transparent text-4xl font-semibold text-gray-900 outline-none"
        />

        {/* Categories */}
        <div className="mt-6">
          <p className="mb-3 text-[11px] tracking-widest uppercase text-gray-400">
            {type === "expense" ? "Category" : "Source"}
          </p>

          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full px-4 py-2 text-sm transition
                  ${
                    category === c
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-700"
                  }
                `}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div className="mt-6">
          <p className="mb-2 text-[11px] tracking-widest uppercase text-gray-400">
            Note (optional)
          </p>

          <input
            type="text"
            placeholder={
              type === "expense"
                ? "e.g. Lunch with friends"
                : "e.g. April salary"
            }
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full rounded-xl bg-gray-100 px-4 py-3 text-sm outline-none"
          />
        </div>

        {/* Save */}
        <button
          disabled={!amount || !category}
          className="mt-8 w-full rounded-2xl bg-black py-4 text-sm font-medium text-white active:scale-[0.98]"
          onClick={async () => {
            try {
              await api.post("/expenses", {
                title: note || category,
                amount: Number(amount),
                type,
                category,
                date: new Date().toISOString(),
              });

              setAmount("");
              setNote("");
              onClose(true);
            } catch {
              alert("Failed to save transaction");
            }
          }}
        >
          Save {type === "expense" ? "Expense" : "Income"}
        </button>
      </div>
    </div>
  );
}