import React from "react";

export function LoadingSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-muted rounded-md w-full h-full p-4 space-y-3 ${className}`}
      role="status"
      aria-label="Loading"
    >
      <div className="h-5 w-1/4 bg-gray-300 dark:bg-gray-700 rounded" />
      <div className="h-6 w-1/2 bg-gray-300 dark:bg-gray-700 rounded" />
      <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded" />
    </div>
  );
}
