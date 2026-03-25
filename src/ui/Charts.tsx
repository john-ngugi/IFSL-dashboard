import React from "react";

const Charts: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Soil Health Distribution */}
      <div className="bg-white  shadow-md p-4  border-neutral-200">
        <div className="flex items-center gap-2 mb-4">
          <svg
            className="w-5 h-5 text-primary-600"
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
          <h3 className="text-lg font-bold text-neutral-900">
            Soil Health Distribution
          </h3>
        </div>

        <div className="space-y-4">
          {/* Excellent */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-neutral-700">
                Excellent
              </span>
              <span className="text-sm font-bold text-neutral-900">
                98 farmers
              </span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-4">
              <div
                className="bg-green-500 h-4 rounded-full flex items-center justify-center"
                style={{ width: "20%" }}
              >
                <span className="text-white text-xs font-semibold">20%</span>
              </div>
            </div>
          </div>

          {/* Good */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-neutral-700">Good</span>
              <span className="text-sm font-bold text-neutral-900">
                149 farmers
              </span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-4">
              <div
                className="bg-blue-500 h-4 rounded-full flex items-center justify-center"
                style={{ width: "30%" }}
              >
                <span className="text-white text-xs font-semibold">30%</span>
              </div>
            </div>
          </div>

          {/* Fair */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-neutral-700">Fair</span>
              <span className="text-sm font-bold text-neutral-900">
                50 farmers
              </span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-4">
              <div
                className="bg-yellow-500 h-4 rounded-full flex items-center justify-center"
                style={{ width: "10%" }}
              >
                <span className="text-white text-xs font-semibold">10%</span>
              </div>
            </div>
          </div>

          {/* Critical */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-neutral-700">
                Critical
              </span>
              <span className="text-sm font-bold text-neutral-900">
                201 farmers
              </span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-4">
              <div
                className="bg-red-500 h-4 rounded-full flex items-center justify-center"
                style={{ width: "40%" }}
              >
                <span className="text-white text-xs font-semibold">40%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Livestock Summary */}
      <div className="bg-white  shadow-md p-4  border-neutral-200">
        <div className="flex items-center gap-2 mb-6">
          <svg
            className="w-5 h-5 text-primary-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
            />
          </svg>
          <h3 className="text-lg font-bold text-neutral-900">
            Livestock Summary
          </h3>
        </div>

        <div className="space-y-6">
          {/* Pie Chart Representation */}
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                {/* Farmers with Goats - 60% */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="20"
                  strokeDasharray="150.8 251.2"
                  strokeDashoffset="0"
                />
                {/* Farmers with Poultry - 40% */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="20"
                  strokeDasharray="100.5 251.2"
                  strokeDashoffset="-150.8"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-neutral-900">498</p>
                  <p className="text-xs text-neutral-600">Total</p>
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm font-medium text-neutral-700">
                  Farmers with Goats
                </span>
              </div>
              <span className="text-sm font-bold text-neutral-900">
                299 (60%)
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-500 rounded"></div>
                <span className="text-sm font-medium text-neutral-700">
                  Farmers with Poultry
                </span>
              </div>
              <span className="text-sm font-bold text-neutral-900">
                199 (40%)
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-neutral-400 rounded"></div>
                <span className="text-sm font-medium text-neutral-700">
                  Both
                </span>
              </div>
              <span className="text-sm font-bold text-neutral-900">
                98 (20%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;
