"use client";
export const dynamic = "force-dynamic";
import { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { exportToCSV, exportTableToPDF } from "@/lib/export";
import { MetricCard } from "@/components/ui/MetricCard";
import LineChart from "@/components/ui/charts/line-chart.tsx";
import { BarChart } from "@/components/ui/charts/BarChart";
import { PieChart } from "@/components/ui/charts/PieChart";
import { RadarChart } from "@/components/ui/charts/RadarChart";
import { DataTable } from "@/components/ui/DataTable";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

// Utility for currency
function parseCurrency(value: string) {
  return Number((value || "0").replace(/[^0-9.]/g, ""));
}

// Table columns, update keys to match CSV headers!
const tableColumns = [
  { key: "Campaign_Name", label: "Campaign", sortable: true, filterable: true },
  { key: "Clicks", label: "Clicks", sortable: true, filterable: true },
  { key: "Conversions", label: "Conversions", sortable: true, filterable: true },
  { key: "Cost", label: "Cost", sortable: true, filterable: true },
  { key: "Ad_Date", label: "Date", sortable: true, filterable: true },
  { key: "Device", label: "Device", sortable: true, filterable: true },
];

export default function Dashboard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState("all"); // "7", "30", "180", "365", "all"
  const [mounted, setMounted] = useState(false);

  // Only show UI after component is mounted (client-only)
  useEffect(() => { setMounted(true); }, []);

  // Fetch and parse CSV data
  useEffect(() => {
    fetch("/campaigns.csv")
      .then(res => res.text())
      .then(text => {
        const parsed = Papa.parse(text, { header: true });
        const rows = parsed.data.filter((row: any) => row.Campaign_Name && row.Clicks);
        setData(rows);
        setLoading(false);
      });
  }, []);

  // Date range filter for the table
  const filteredTableData = useMemo(() => {
    if (dateRange === "all") return data;
    const days = Number(dateRange);
    const today = new Date();
    return data.filter(row => {
      if (!row.Ad_Date) return false;
      // Accept both "YYYY-MM-DD" and "YYYY/MM/DD"
      const rowDate = new Date(row.Ad_Date.replace(/-/g, "/"));
      const cutoff = new Date(today);
      cutoff.setDate(today.getDate() - days + 1);
      return rowDate >= cutoff && rowDate <= today;
    });
  }, [data, dateRange]);

  // Prepare data for charts
  const lineData = useMemo(
    () => filteredTableData.map(row => ({ date: row.Ad_Date, spend: parseCurrency(row.Cost) })),
    [filteredTableData]
  );
  const barData = useMemo(
    () => filteredTableData.map(row => ({ campaign: row.Campaign_Name, conversions: Number(row.Conversions || 0) })),
    [filteredTableData]
  );
  // Pie chart: Grouped by device
  const pieData = useMemo(() => {
    const deviceGroups = filteredTableData.reduce((acc, row) => {
      const key = row.Device || "Unknown";
      acc[key] = (acc[key] || 0) + Number(row.Conversions || 0);
      return acc;
    }, {});
    return Object.entries(deviceGroups).map(([device, conversions]) => ({
      channel: device,
      conversions: Number(conversions)
    }));
  }, [filteredTableData]);
  const radarData = useMemo(() => [
    { metric: "Clicks", score: filteredTableData.reduce((sum, row) => sum + Number(row.Clicks || 0), 0) },
    { metric: "Conversions", score: filteredTableData.reduce((sum, row) => sum + Number(row.Conversions || 0), 0) },
    { metric: "Spend", score: filteredTableData.reduce((sum, row) => sum + parseCurrency(row.Cost), 0) },
  ], [filteredTableData]);

  // Metrics
  const totalSpend = filteredTableData.reduce((sum, row) => sum + parseCurrency(row.Cost), 0);
  const totalClicks = filteredTableData.reduce((sum, row) => sum + Number(row.Clicks || 0), 0);
  const totalConversions = filteredTableData.reduce((sum, row) => sum + Number(row.Conversions || 0), 0);

  // For exporting filtered table rows (if filtered), else all data
  const exportRows = filteredData.length > 0 ? filteredData : filteredTableData;

  // --- Only render UI after mounted ---
  if (!mounted) return null;

  return (
    <div className="p-6 sm:p-10 md:p-12 space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2 pb-1 bg-gradient-to-r from-[#b16cea] via-[#ff5da2] to-[#ffa34f] text-transparent bg-clip-text drop-shadow-md leading-normal">
  ADmyBRAND Insights
</h1>


        <div className="flex items-center gap-2">
          {!loading && (
            <>
              <button
  onClick={() => exportToCSV(exportRows, "dashboard-data.csv")}
  className="border border-brown-600 px-3 py-1 text-sm rounded text-blue-600"
>
  Export CSV
</button>

<button
  onClick={() => exportTableToPDF(exportRows, "dashboard-data.pdf")}
  className="border border-brown-600 px-3 py-1 text-sm rounded text-red-600"
>
  Export PDF
</button>

            </>
          )}
          <ThemeToggle />
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Spend" value={`$${totalSpend.toLocaleString()}`} />
        <MetricCard title="Total Clicks" value={totalClicks.toLocaleString()} />
        <MetricCard title="Total Conversions" value={totalConversions.toLocaleString()} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Line Chart */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Spend Over Time (Line)</h2>
          {loading ? (
            <LoadingSkeleton className="h-64 w-full" />
          ) : (
            <LineChart data={lineData} xKey="date" yKey="spend" />
          )}
        </div>
        {/* Bar Chart */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Conversions by Campaign (Bar)</h2>
          {loading ? (
            <LoadingSkeleton className="h-64 w-full" />
          ) : (
            <BarChart data={barData} xKey="campaign" yKey="conversions" />
          )}
        </div>
        {/* Pie Chart */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Conversions by Device (Pie)</h2>
          {loading ? (
            <LoadingSkeleton className="h-64 w-full" />
          ) : (
            <PieChart data={pieData} />
          )}
        </div>
        {/* Radar Chart */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Campaign Summary (Radar)</h2>
          {loading ? (
            <LoadingSkeleton className="h-64 w-full" />
          ) : (
            <RadarChart data={radarData} />
          )}
        </div>
      </div>

      {/* Data Table with Range Buttons */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Campaign Data Table</h2>
        {/* Date range button group */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            className={`border px-3 py-1 rounded text-sm ${dateRange === "7" ? "bg-blue-500 text-white" : ""}`}
            onClick={() => setDateRange("7")}
          >
            Last 7 Days
          </button>
          <button
            className={`border px-3 py-1 rounded text-sm ${dateRange === "30" ? "bg-blue-500 text-white" : ""}`}
            onClick={() => setDateRange("30")}
          >
            Last 30 Days
          </button>
          <button
            className={`border px-3 py-1 rounded text-sm ${dateRange === "180" ? "bg-blue-500 text-white" : ""}`}
            onClick={() => setDateRange("180")}
          >
            Last 6 Months
          </button>
          <button
            className={`border px-3 py-1 rounded text-sm ${dateRange === "365" ? "bg-blue-500 text-white" : ""}`}
            onClick={() => setDateRange("365")}
          >
            Last 1 Year
          </button>
          <button
            className={`border px-3 py-1 rounded text-sm ${dateRange === "all" ? "bg-blue-500 text-white" : ""}`}
            onClick={() => setDateRange("all")}
          >
            All Time
          </button>
        </div>
        <DataTable
          columns={tableColumns}
          data={filteredTableData}
          pageSize={10}
          onFilterChange={setFilteredData}
        />
      </div>
    </div>
  );
}
