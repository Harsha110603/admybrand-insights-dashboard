import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const cardThemes = [
  "from-[#ffe0c7]/80 to-[#fff0e6]/90 border-[#ffb993]",     // Light peach
  "from-[#fff5d1]/80 to-[#fdf7ea]/90 border-[#ffe49e]",     // Buttery vanilla yellow
  "from-[#ffe7ec]/80 to-[#fff6fa]/90 border-[#ffc9da]",     // Pink blush
  "from-[#eaf6fc]/80 to-[#f9fbfd]/90 border-[#bde6fa]",     // Baby blue pastel
  "from-[#e8ffea]/80 to-[#f5fff6]/90 border-[#b2ffc3]",     // Lightest mint
];





type MetricCardProps = {
  title: string;
  value: string;
  change?: string;
  positive?: boolean;
  index?: number; // Pass this when rendering multiple cards for color variety
};

export function MetricCard({
  title,
  value,
  change,
  positive = true,
  index = 0,
}: MetricCardProps) {
  const theme = cardThemes[index % cardThemes.length];

  return (
    <Card
      className={`w-full shadow-md hover:shadow-xl transition border-l-8 bg-gradient-to-r ${theme} hover:scale-[1.03] duration-150`}
    >
      <CardHeader>
        <CardTitle className="text-base text-[#3a2316] drop-shadow">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-extrabold text-[#3a2316] drop-shadow">{value}</div>
        {change && (
          <p className={`text-sm mt-1 ${positive ? "text-green-600" : "text-red-500"} drop-shadow`}>
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
