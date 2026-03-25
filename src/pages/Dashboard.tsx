import React, { useState } from "react";
import { useEffect } from "react";
import MapView from "../ui/Map";
import Navigation from "../ui/Navigation";
// import StatsCards from "../ui/Statscards";
// import FilterPanel from "../ui/Filterpanel";
import DataTable from "../ui/Datatable";
// import Charts from "../ui/Charts";
import ViewTabs from "../ui/Viewtabs";
import AnalyticsDashboard from "../ui/analyticsDashboard";
import UploadModal from "../ui/UploadModal";
import ReportsView from "../ui/ReportView";

const Dashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<
    "map" | "table" | "reports" | "analytics"
  >("map");
  const [isUploadOpen, setIsUploadOpen] = useState(false); // Update the button
  const [stats, setStats] = useState({
    total_samples: 498,
    average_score: 28.5,
    rating_distribution: {
      Excellent: 125,
      Good: 41,
      Fair: 2,
      Poor: 0,
      Critical: 330,
    },
    livestock_percentage: 60,
    total_goat_farmers: 0,
    total_poultry_farmers: 0,
    goat_percentage: 0,
    poultry_percentage: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/soil-health-summary/`,
        );
        const data = await response.json();
        setStats(data);
        console.log("Stats fetched successfully:", data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#fafbfc]">
      <Navigation />

      {/* Main Content Container */}
      <main className="flex-1 h-0 overflow-hidden">
        <div className="h-full max-w-[1920px] mx-auto">
          {/* Two Column Layout: Sidebar + Main Content */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-0 h-full">
            {/* Left Sidebar - Stats & Filters */}
            <aside className="xl:col-span-3 bg-white border-r border-neutral-200 overflow-y-auto xl:h-[calc(100vh-64px)] xl:sticky ">
              <div className="p-6 space-y-6">
                {/* Stats Cards - Vertical Stack */}
                <div className="space-y-3">
                  <h2 className="text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-4">
                    Key Metrics
                  </h2>

                  {/* Compact Stat Cards */}
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl p-4 border border-emerald-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-3xl font-bold text-emerald-900">
                          {stats.total_samples}
                        </p>
                        <p className="text-xs text-emerald-700 mt-1">
                          Total Records
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-emerald-700"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-3xl font-bold text-blue-900">
                          {stats.total_samples}
                        </p>
                        <p className="text-xs text-blue-700 mt-1">
                          With Analysis
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-blue-700"
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
                      </div>
                    </div>
                  </div>

                  {/* <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-4 border border-amber-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-3xl font-bold text-amber-900">
                          2.77
                        </p>
                        <p className="text-xs text-amber-700 mt-1">
                          Average pH
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-amber-700"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div> */}

                  <div className="bg-gradient-to-br from-rose-50 to-rose-100/50 rounded-xl p-4 border border-rose-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-3xl font-bold text-rose-900">
                          {stats.total_samples}
                        </p>
                        <p className="text-xs text-rose-700 mt-1">Locations</p>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-rose-700"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filters Section
                <div className="pt-4 border-t border-neutral-200">
                  <h2 className="text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-4">
                    Filters
                  </h2>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-2">
                        Farmer Code
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., BM01"
                        className="w-full px-3 py-2.5 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-2">
                        Farmer Name
                      </label>
                      <input
                        type="text"
                        placeholder="Search..."
                        className="w-full px-3 py-2.5 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-2">
                        Gender
                      </label>
                      <select className="w-full px-3 py-2.5 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-white transition-all">
                        <option>All Genders</option>
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-2">
                        Soil Health
                      </label>
                      <select className="w-full px-3 py-2.5 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-white transition-all">
                        <option>All Ratings</option>
                        <option>Excellent</option>
                        <option>Good</option>
                        <option>Fair</option>
                        <option>Critical</option>
                      </select>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button className="flex-1 px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors">
                        Apply
                      </button>
                      <button className="px-4 py-2.5 bg-white text-neutral-700 text-sm font-medium rounded-lg border border-neutral-300 hover:bg-neutral-50 transition-colors">
                        Reset
                      </button>
                    </div>
                  </div>
                </div> */}

                {/* Quick Actions */}
                {/* Quick Actions */}
                <div className="pt-4 border-t border-neutral-200 space-y-3">
                  <h2 className="text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-4">
                    Quick Actions
                  </h2>
                  <button
                    onClick={() => setIsUploadOpen(true)}
                    className="w-full px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                  >
                    {" "}
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add New Record
                  </button>

                  {/* <button className="w-full px-4 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Export Data
                  </button> */}
                  <button
                    onClick={() => setActiveView("reports")}
                    className="w-full px-4 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg border border-neutral-300 hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                      />
                    </svg>
                    Generate Report
                  </button>
                </div>

                {/* System Info */}
                {/* <div className="pt-4 border-t border-neutral-200">
                  <h2 className="text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-3">
                    System Status
                  </h2>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-600">Last Updated</span>
                      <span className="font-medium text-neutral-900">
                        Just now
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-600">Database</span>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="font-medium text-emerald-700">
                          Online
                        </span>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="xl:col-span-9 overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* View Tabs */}
                <div className="flex justify-start">
                  <ViewTabs
                    activeView={activeView}
                    onViewChange={setActiveView}
                  />
                </div>

                {/* Content Based on Active View */}
                {activeView === "map" && (
                  <div className="space-y-6">
                    {/* Map Section */}
                    <div className="bg-white shadow-sm border border-neutral-200 overflow-hidden">
                      <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
                        {/* <h2 className="text-md font-semibold text-neutral-900">
                          Field Locations Map
                        </h2> */}
                        <p className="text-sm text-neutral-600 mt-1">
                          Taveta Subcounty - Interactive soil sample locations
                        </p>
                      </div>
                      <div className="h-[500px]">
                        <MapView />
                      </div>
                    </div>
                    {/* Quick Stats Summary
                    <div className="lg:col-span-2 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg shadow-md p-6 text-white">
                      <h3 className="text-xl font-bold mb-6">
                        Quick Stats Summary
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                          <p className="text-4xl font-black mb-2">498</p>
                          <p className="text-sm text-white/80 uppercase tracking-wide">
                            Samples Analyzed
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-4xl font-black mb-2">28.5</p>
                          <p className="text-sm text-white/80 uppercase tracking-wide">
                            Average Health Score
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-4xl font-black mb-2">100</p>
                          <p className="text-sm text-white/80 uppercase tracking-wide">
                            Best Score
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-4xl font-black mb-2">0</p>
                          <p className="text-sm text-white/80 uppercase tracking-wide">
                            Needs Attention
                          </p>
                        </div>
                      </div>
                    </div> */}
                  </div>
                )}

                {activeView === "table" && (
                  <div className="animate-fadeIn">
                    <DataTable />
                  </div>
                )}

                {activeView === "analytics" && (
                  <div className="animate-fadeIn space-y-6">
                    <AnalyticsDashboard />

                    {/* Additional Analytics Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
                      <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                        Detailed Insights
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                          <p className="text-sm text-emerald-700 mb-1">
                            Top Performing
                          </p>
                          <p className="text-2xl font-bold text-emerald-900">
                            {stats.rating_distribution?.Excellent || 0} farmers
                          </p>
                          <p className="text-xs text-emerald-600 mt-1">
                            Excellent soil health
                          </p>
                        </div>
                        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                          <p className="text-sm text-amber-700 mb-1">
                            Needs Support
                          </p>
                          <p className="text-2xl font-bold text-amber-900">
                            {stats.rating_distribution?.Critical || 0} farmers
                          </p>
                          <p className="text-xs text-amber-600 mt-1">
                            Critical attention required
                          </p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                          <p className="text-sm text-blue-700 mb-1">
                            Livestock Integration
                          </p>
                          <p className="text-2xl font-bold text-blue-900">
                            {stats?.livestock_percentage || 0}% farmers
                          </p>
                          <p className="text-xs text-blue-600 mt-1">
                            Farmers with livestock
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeView === "reports" && (
                  <div className="animate-fadeIn">
                    <ReportsView />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={() => {
          setIsUploadOpen(false);
          // optionally refresh your map data here
        }}
      />
    </div>
  );
};

export default Dashboard;
