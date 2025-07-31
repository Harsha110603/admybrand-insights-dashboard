import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import React from "react";

type ChartCardProps = {
  title: string;
  filters?: React.ReactNode;
  children: React.ReactNode;
};

export function ChartCard({ title, filters, children }: ChartCardProps) {
  return (
    <Card className="w-full shadow-md hover:shadow-lg transition">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {filters && <div>{filters}</div>}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
