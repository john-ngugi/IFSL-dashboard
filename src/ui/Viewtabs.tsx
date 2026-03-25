import React from "react";

interface ViewTabsProps {
  onViewChange: (view: "map" | "table" | "reports" | "analytics") => void;
  activeView: "map" | "table" | "reports" | "analytics";
}

const ViewTabs: React.FC<ViewTabsProps> = ({ onViewChange, activeView }) => {
  return (
    <div className="bg-gray-50 shadow-md border border-neutral-200 flex overflow-x-auto overflow-hidden w-full">
      <button
        onClick={() => onViewChange("map")}
        className={`px-4 sm:px-6 py-3 font-semibold text-sm flex items-center gap-2 transition-colors shrink-0 ${
          activeView === "map"
            ? "bg-primary-500 text-white"
            : "text-neutral-700 hover:bg-neutral-100"
        }`}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
          />
        </svg>
        <span className="hidden sm:inline">Map View</span>
      </button>

      <button
        onClick={() => onViewChange("table")}
        className={`px-4 sm:px-6 py-3 font-semibold text-sm flex items-center gap-2 transition-colors shrink-0 ${
          activeView === "table"
            ? "bg-primary-600 text-white"
            : "text-neutral-700 hover:bg-neutral-100"
        }`}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        <span className="hidden sm:inline">Data Table</span>
      </button>

      <button
        onClick={() => onViewChange("reports")}
        className={`px-4 sm:px-6 py-3 font-semibold text-sm flex items-center gap-2 transition-colors shrink-0 ${
          activeView === "reports"
            ? "bg-primary-600 text-white"
            : "text-neutral-700 hover:bg-neutral-100"
        }`}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <span className="hidden sm:inline">Reports</span>
      </button>

      <button
        onClick={() => onViewChange("analytics")}
        className={`px-4 sm:px-6 py-3 font-semibold text-sm flex items-center gap-2 transition-colors shrink-0 ${
          activeView === "analytics"
            ? "bg-primary-600 text-white"
            : "text-neutral-700 hover:bg-neutral-100"
        }`}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <span className="hidden sm:inline">Analytics</span>
      </button>
    </div>
  );
};

export default ViewTabs;
