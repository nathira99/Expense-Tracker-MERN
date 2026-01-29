import { useEffect, useState } from "react";
import { Home, X, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import AppContainer from "../components/AppContainer";
import BottomDock from "../components/BottomDock";

export default function Expenses() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAmount, setEditAmount] = useState("");

  const [touchStartX, setTouchStartX] = useState(null);
  const [swipedId, setSwipedId] = useState(null);

  // 🔁 Undo state
  const [undoItem, setUndoItem] = useState(null);
  const [showUndo, setShowUndo] = useState(false);

  useEffect(() => {
    fetchItems();
  }, [filter]);

  const fetchItems = async () => {
    const query = filter === "all" ? "" : `?type=${filter}`;
    const res = await api.get(`/expenses${query}`);
    setItems(res.data);
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setEditTitle(item.title);
    setEditAmount(item.amount);
    setSwipedId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditAmount("");
  };

  const saveEdit = async (id) => {
    await api.put(`/expenses/${id}`, {
      title: editTitle,
      amount: Number(editAmount),
    });

    cancelEdit();
    fetchItems();
  };

  /* ---------------- DELETE + UNDO ---------------- */

  const deleteItem = async (item) => {
    // optimistic remove
    setItems((prev) => prev.filter((i) => i._id !== item._id));
    setUndoItem(item);
    setShowUndo(true);
    cancelEdit();

    await api.delete(`/expenses/${item._id}`);

    // auto-hide snackbar after 5s
    setTimeout(() => {
      setShowUndo(false);
      setUndoItem(null);
    }, 5000);
  };

  const undoDelete = async () => {
    if (!undoItem) return;

    await api.post("/expenses", {
      title: undoItem.title,
      amount: undoItem.amount,
      type: undoItem.type,
      category: undoItem.category,
      date: undoItem.date,
    });

    setShowUndo(false);
    setUndoItem(null);
    fetchItems();
  };

  return (
    <AppContainer>
      <div className="pt-6 pb-40 space-y-6">

        {/* HEADER */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center"
          >
            <Home size={18} />
          </button>

          <h1 className="text-lg font-semibold">Transactions</h1>
        </div>

        {/* FILTER */}
        <div className="flex flex-wrap gap-2">
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

        {/* LIST */}
        <div className="space-y-3">
          {items.length === 0 ? (
            <p className="text-sm text-gray-400">
              No transactions found
            </p>
          ) : (
            items.map((t) => {
              const isEditing = editingId === t._id;

              return (
                <div
                  key={t._id}
                  className="rounded-xl bg-white p-4 shadow-sm"
                  onClick={() => !isEditing && startEdit(t)}
                >
                  {!isEditing ? (
                    <div className="flex justify-between items-center">
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
                  ) : (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) =>
                          setEditTitle(e.target.value)
                        }
                        className="w-full rounded-lg bg-gray-100 px-3 py-2 text-sm outline-none"
                      />

                      <input
                        type="number"
                        value={editAmount}
                        onChange={(e) =>
                          setEditAmount(e.target.value)
                        }
                        className="w-full rounded-lg bg-gray-100 px-3 py-2 text-sm outline-none"
                      />

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex gap-4">
                          <button
                            onClick={() => saveEdit(t._id)}
                            className="font-medium text-black"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-gray-400"
                          >
                            Cancel
                          </button>
                        </div>

                        <button
                          onClick={() => deleteItem(t)}
                          className="flex items-center gap-1 text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* UNDO SNACKBAR */}
      {showUndo && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-3 rounded-xl flex items-center gap-4 shadow-lg z-50">
          <span className="text-sm">
            Transaction deleted
          </span>
          <button
            onClick={undoDelete}
            className="text-sm font-semibold underline"
          >
            Undo
          </button>
        </div>
      )}

      <BottomDock onExpenseAdded={fetchItems} />
    </AppContainer>
  );
}