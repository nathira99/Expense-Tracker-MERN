export default function StatusStrip({ income, expenses }) {
  let text = "You're on track this month";
  let color = "text-emerald-600";

  if (expenses > income * 0.9) {
    text = "Careful — spending is very high";
    color = "text-red-500";
  } else if (expenses > income * 0.7) {
    text = "Spending is higher than usual";
    color = "text-yellow-500";
  }

  return (
    <p className={`mt-4 text-sm font-medium ${color}`}>
      {text}
    </p>
  );
}