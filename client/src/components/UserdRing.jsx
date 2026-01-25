import { RadialBarChart, RadialBar } from "recharts";

export default function UsedRing({ percent, used, total }) {
  const data = [
    {
      value: percent,
      fill:
        percent > 90
          ? "#ef4444"
          : percent > 70
          ? "#facc15"
          : "#16a34a",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-between rounded-2xl bg-white/90 backdrop-blur p-4 shadow-sm h-full">
      
      <div className="relative w-[96px] h-[96px]">
        <RadialBarChart
          width={96}
          height={96}
          cx={48}
          cy={48}
          innerRadius={36}
          outerRadius={46}
          barSize={8}
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <RadialBar
            dataKey="value"
            cornerRadius={8}
          />
        </RadialBarChart>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-lg font-semibold">{percent}%</p>
          <p className="text-[11px] text-gray-400">Used</p>
        </div>
      </div>
    </div>
  );
}