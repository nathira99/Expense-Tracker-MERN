import { useEffect, useState } from "react";
import api from "../api/axios";
import BottomDock from "../components/BottomDock";

export default function Expenses() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [touchStartX, setTouchStartX] = useState(null);
  const [swipedId, setSwipedId] = useState(null);

  useEffect(() => {
    fetchItems();
  }, [filter]);

  const fetchItems = async () => {
    const query = filter === "all" ? "" : `?type=${filter}`;
    const res = await api.get(`/expenses${query}`);
    setItems(res.data);
  };

  const deleteItem = async (id) => {
    await api.delete(`/expenses/${id}`);
    setItems((prev) => prev.filter((i) => i._id !== id));
  };

  return (
    <div className="min-h-screen bg-[#F6F7FB] px-5 pt-10 pb-32 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">Transactions</h1>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {["all", "expense", "income"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm
              ${
                filter === f
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
          >
            {f === "all"
              ? "All"
              : f === "expense"
              ? "Expenses"
              : "Income"}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-gray-400">
            No transactions found
          </p>
        ) : (
          items.map((t) => (
            <div
              key={t._id}
              className="relative overflow-hidden rounded-xl"
              onTouchStart={(e) =>
                setTouchStartX(e.touches[0].clientX)
              }
              onTouchEnd={(e) => {
                if (touchStartX === null) return;
                const diff =
                  e.changedTouches[0].clientX - touchStartX;
                if (diff < -60) setSwipedId(t._id);
                else setSwipedId(null);
                setTouchStartX(null);
              }}
            >
              {/* Delete action */}
              <div className="absolute inset-y-0 right-0 w-20 bg-red-500 flex items-center justify-center">
                <button
                  onClick={() => deleteItem(t._id)}
                  className="text-white text-sm font-medium"
                >
                  Delete
                </button>
              </div>

              {/* Transaction card */}
              <div
                className={`relative z-10 flex justify-between items-center bg-white p-4 shadow-sm transition-transform duration-300
                  ${
                    swipedId === t._id
                      ? "-translate-x-20"
                      : "translate-x-0"
                  }
                `}
              >
                <div>
                  <p className="text-sm font-medium">
                    {t.title}
                  </p>
                  <p className="text-xs text-gray-400">
                    {t.category}
                  </p>
                </div>

                <p
                  className={`text-sm font-semibold ${
                    t.type === "income"
                      ? "text-emerald-600"
                      : "text-red-500"
                  }`}
                >
                  {t.type === "income" ? "+" : "-"}₹{t.amount}
                </p>
              </div>
            </div>
          ))
        )}
        <BottomDock />
      </div>
    </div>
  );
}