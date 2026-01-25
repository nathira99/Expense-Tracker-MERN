import { useState } from "react";

const CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Others",
];

export default function AddExpenseModal({ open, onClose }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [note, setNote] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop (tap to close) */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="relative w-full max-w-md rounded-t-3xl bg-white px-6 pt-6 pb-8 animate-slide-up">
        
        {/* Drag Handle (implicit close affordance) */}
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-gray-200" />

        {/* Title */}
        <p className="text-[11px] tracking-widest uppercase text-gray-400">
          Add Expense
        </p>

        {/* Amount (primary focus) */}
        <input
          type="number"
          inputMode="numeric"
          placeholder="₹0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          autoFocus
          className="mt-4 w-full bg-transparent text-4xl font-semibold text-gray-900 placeholder-gray-300 outline-none"
        />

        {/* Categories */}
        <div className="mt-6">
          <p className="mb-3 text-[11px] tracking-widest uppercase text-gray-400">
            Category
          </p>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
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

        {/* Optional Note */}
        <div className="mt-6">
          <p className="mb-2 text-[11px] tracking-widest uppercase text-gray-400">
            Note (optional)
          </p>

          <input
            type="text"
            placeholder="Add a note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full rounded-xl bg-gray-100 px-4 py-3 text-sm text-gray-800 outline-none"
          />
        </div>

        {/* Save Action */}
        <button
          className="mt-8 w-full rounded-2xl bg-black py-4 text-sm font-medium text-white active:scale-[0.98] transition-transform"
          onClick={() => {
            // TEMP: replace with real save logic later
            console.log({
              amount,
              category,
              note,
              date: new Date().toISOString(),
            });
            onClose();
          }}
          disabled={!amount}
        >
          Save Expense
        </button>
      </div>
    </div>
  );
}