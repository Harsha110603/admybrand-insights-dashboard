"use client";

import {
  RadarChart as ReRadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props = {
  data: { metric: string; score: number }[];
};

export function RadarChart({ data }: Props) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <ReRadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="metric" />
          <PolarRadiusAxis />
          <Tooltip />
          <Radar dataKey="score" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.6} />
        </ReRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
