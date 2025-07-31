import React from "react";
import {
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type BarChartProps = {
  data: any[]; // <-- Accepts any shape now
  xKey?: string;
  yKey?: string;
  color?: string;
};

export function BarChart({
  data,
  xKey = "month",
  yKey = "spend",
  color = "#22c55e", // Tailwind green-500
}: BarChartProps) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <ReBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} className="text-xs" />
          <YAxis className="text-xs" />
          <Tooltip />
          <Bar dataKey={yKey} fill={color} />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
}
