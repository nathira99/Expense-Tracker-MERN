import { useEffect, useState } from "react";

export default function BalanceCard({ balance }) {
  const [display, setDisplay] = useState(balance);

  useEffect(() => {
    let start = display;
    let end = balance;
    let startTime = null;
    const duration = 400;

    function animate(ts) {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setDisplay(Math.round(start + (end - start) * progress));
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [balance]);

  const tone =
    balance < 5000
      ? "text-red-500"
      : balance < 15000
      ? "text-yellow-500"
      : "text-emerald-600";

  return (
    <div className="rounded-3xl bg-white p-7 shadow-[0_20px_40px_rgba(0,0,0,0.06)]">
      <p className="text-[11px] tracking-widest uppercase text-gray-400">
        Current Balance
      </p>

      <h1 className={`mt-4 text-4xl font-semibold ${tone}`}>
        ₹{display.toLocaleString()}
      </h1>

      <p className="mt-2 text-xs text-gray-400">
        This month
      </p>
    </div>
  );
}