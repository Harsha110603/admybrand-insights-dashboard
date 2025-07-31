import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

type Column<T> = {
  key: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  onFilterChange?: (filteredRows: T[]) => void;
};

export function DataTable<T>({
  columns,
  data,
  pageSize = 10,
  onFilterChange,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);

  // Text filter only
  const filteredData = data.filter((row) =>
    filter
      ? columns
          .filter((col) => col.filterable)
          .some((col) =>
            String(row[col.key]).toLowerCase().includes(filter.toLowerCase())
          )
      : true
  );

  // Call parent when filter changes
  useEffect(() => {
    if (onFilterChange) onFilterChange(filteredData);
    // eslint-disable-next-line
  }, [filter, data]);

  // Sorting
  const sortedData = sortKey
    ? [...filteredData].sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (aVal === bVal) return 0;
        if (sortAsc) return aVal > bVal ? 1 : -1;
        return aVal < bVal ? 1 : -1;
      })
    : filteredData;

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const paginatedData = sortedData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  useEffect(() => {
    setPage(1); // reset to first page on filter change
  }, [filter]);

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between mb-2 gap-2">
        <input
          type="text"
          placeholder="Filter..."
          className="border px-2 py-1 rounded text-sm"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
        />
        <div className="text-xs text-muted-foreground">
          Page {page} of {totalPages}
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={String(col.key)}
                className={col.sortable ? "cursor-pointer select-none" : ""}
                onClick={() => {
                  if (!col.sortable) return;
                  if (sortKey === col.key) setSortAsc((asc) => !asc);
                  else {
                    setSortKey(col.key);
                    setSortAsc(true);
                  }
                }}
              >
                {col.label}
                {col.sortable && (
                  <span className="ml-1 text-xs">
                    {sortKey === col.key ? (sortAsc ? "▲" : "▼") : ""}
                  </span>
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((row, i) => (
            <TableRow key={i}>
              {columns.map((col) => (
                <TableCell key={String(col.key)}>
                  {col.render
                    ? col.render(row[col.key], row)
                    : String(row[col.key])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end gap-2 mt-2">
        <button
          className="px-2 py-1 border rounded text-sm"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Prev
        </button>
        <button
          className="px-2 py-1 border rounded text-sm"
          disabled={page === totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          Next
        </button>
      </div>
    </div>
  );
}
