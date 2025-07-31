// lib/export.ts

export function exportToCSV(data: Record<string, any>[], filename = "data.csv") {
  if (!data || data.length === 0) return;

  const header = Object.keys(data[0]).join(",");
  const rows = data.map((row) =>
    Object.values(row)
      .map((val) => `"${val}"`)
      .join(",")
  );

  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

// PDF export
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportTableToPDF(data: Record<string, any>[], filename = "table.pdf") {
  if (!data || data.length === 0) return;
  const doc = new jsPDF();
  const columns = Object.keys(data[0]);
  const rows = data.map(row => columns.map(col => row[col]));
  autoTable(doc, {
    head: [columns],
    body: rows,
  });
  doc.save(filename);
}
