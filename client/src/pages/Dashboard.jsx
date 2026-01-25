import BalanceCard from "../components/BalanceCard";
import SummarySwipe from "../components/SummarySwipe";
import BudgetBar from "../components/BudgetBar";
import StatusStrip from "../components/StatusStripe";
import BottomDock from "../components/BottomDock";

export default function Dashboard() {
  const income = 40000;
  const expenses = 20550;
  const balance = income - expenses;

  const budgets = [
    { category: "Food", used: 4000, total: 4000 },
    { category: "Transport", used: 500, total: 2500 },
    { category: "Shopping", used: 4200, total: 5000 },
  ];

  return (
    <div className="min-h-screen bg-[#F6F7FB]">
      <div className="max-w-md mx-auto px-5 pt-10 pb-32">
        {" "}
        <BalanceCard balance={balance} />
        <StatusStrip balance={balance} income={income} expenses={expenses} />
        <SummarySwipe income={income} expenses={expenses} />
        <div className="mt-6 space-y-4">
          {budgets.map((b) => (
            <BudgetBar key={b.category} {...b} />
          ))}
        </div>
        <BottomDock />
      </div>
    </div>
  );
}
