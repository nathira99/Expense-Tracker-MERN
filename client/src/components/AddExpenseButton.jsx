export default function AddExpenseButton() {
  return (
    <button
      className="fixed bottom-8 right-6 h-14 w-14 rounded-full bg-black text-white text-3xl shadow-[0_10px_30px_rgba(0,0,0,0.25)] active:scale-95 transition"
      onClick={() => alert("Add Expense – next")}
    >
      +
    </button>
  );
}