import React from "react";
import {
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

type PieChartProps = {
  data: { channel: string; conversions: number }[];
  colors?: string[];
  innerRadius?: number;
};

const DEFAULT_COLORS = [
  "#2563eb", // blue-600
  "#22c55e", // green-500
  "#f59e42", // orange-400
  "#ef4444", // red-500
  "#a855f7", // purple-500
];

export function PieChart({
  data,
  colors = DEFAULT_COLORS,
  innerRadius = 60,
}: PieChartProps) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RePieChart>
          <Pie
            data={data}
            dataKey="conversions"
            nameKey="channel"
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={innerRadius}
            label
          >
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={colors[idx % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </RePieChart>
      </ResponsiveContainer>
    </div>
    );
    }
    