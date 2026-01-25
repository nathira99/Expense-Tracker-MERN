import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddTransactionModal from "./AddTransactionModal";

export default function BottomDock({ onExpenseAdded }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <div className="relative w-[288px] h-[88px]">
          <div className="absolute bottom-0 left-0 right-0 h-14 rounded-full bg-white/90 backdrop-blur-xl shadow-[0_12px_28px_rgba(0,0,0,0.14)] flex items-center justify-between px-6">
            <button
              onClick={() => navigate("/expenses")}
              className="text-sm font-medium text-gray-700"
            >
              Transactions
            </button>
            <button
              onClick={() => navigate("/budgets")}
              className="text-sm font-medium text-gray-700"
            >
              Budgets
            </button>
          </div>

          <button
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-black text-white text-2xl flex items-center justify-center shadow-[0_12px_30px_rgba(0,0,0,0.35)] active:scale-95 transition-transform duration-150"
            onClick={() => setOpen(true)}
          >
            +
          </button>
        </div>
      </div>

      <AddTransactionModal
        open={open}
        onClose={(refresh) => {
          setOpen(false);
          if (refresh ) {
            onExpenseAdded();
          }
        }}
      />
    </>
  );
}
