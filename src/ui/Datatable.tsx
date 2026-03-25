import React, { useState, useEffect } from "react";
import { Leaf, Beef, AlertCircle } from "lucide-react";

interface Sample {
  code: string;
  farmer_name: string;
  ward: string | null;
  subcounty: string | null;
  coordinates: [number, number];
  health_score: number | null;
  health_rating: string | null;
  health_color: string | null;
  field_type: string;
  value_chain: string;
  has_soil_data: boolean;
  has_livestock_data: boolean;
}

interface ApiResponse {
  count: number;
  results: Sample[];
}

interface FarmerDataTableProps {
  apiBaseUrl?: string;
}

const DataTable: React.FC<FarmerDataTableProps> = ({
  apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000",
}) => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${apiBaseUrl}/api/search-farmers/?limit=10000`,
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const jsonData = await response.json();
        setData(jsonData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiBaseUrl]);

  const getHealthBadge = (sample: Sample) => {
    if (sample.field_type === "Livestock") {
      return {
        className: "bg-purple-500 text-white",
        label: "Livestock Farmer",
      };
    }
    if (!sample.has_soil_data || !sample.health_rating) {
      return {
        className: "bg-gray-500 text-white",
        label: sample.field_type || "Unknown",
      };
    }
    const badges: Record<string, string> = {
      Excellent: "bg-emerald-500 text-white",
      Good: "bg-blue-500 text-white",
      Fair: "bg-yellow-500 text-white",
      Poor: "bg-orange-500 text-white",
      Critical: "bg-red-500 text-white",
    };
    return {
      className: badges[sample.health_rating] || "bg-gray-500 text-white",
      label:
        sample.health_score != null
          ? `${sample.health_rating} (${sample.health_score.toFixed(1)})`
          : sample.health_rating,
    };
  };

  const getFieldTypeIcon = (fieldType: string) => {
    if (fieldType === "Soil")
      return <Leaf className="w-4 h-4 text-green-600" />;
    if (fieldType === "Livestock")
      return <Beef className="w-4 h-4 text-purple-600" />;
    return <AlertCircle className="w-4 h-4 text-gray-600" />;
  };

  const TYPE_ORDER: Record<string, number> = {
    Soil: 0,
    Livestock: 1,
  };

  // Filter and search logic
  const filteredData = data?.results
    .filter((sample) => {
      const matchesSearch =
        (sample.farmer_name?.toLowerCase() || "").includes(
          searchTerm.toLowerCase(),
        ) ||
        (sample.code?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (sample.value_chain?.toLowerCase() || "").includes(
          searchTerm.toLowerCase(),
        );

      const matchesRating =
        filterRating === "all" || sample.health_rating === filterRating;

      const matchesType =
        filterType === "all" ||
        (filterType === "soil" && sample.field_type === "Soil") ||
        (filterType === "livestock" && sample.field_type === "Livestock") ||
        (filterType === "other" &&
          sample.field_type !== "Soil" &&
          sample.field_type !== "Livestock");

      return matchesSearch && matchesRating && matchesType;
    })
    .sort((a, b) => {
      const orderA = TYPE_ORDER[a.field_type] ?? 2; // unknown → 2
      const orderB = TYPE_ORDER[b.field_type] ?? 2;
      return orderA - orderB;
    });

  // Pagination logic
  const totalPages = Math.ceil((filteredData?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData?.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const exportToCSV = () => {
    if (!filteredData) return;

    const headers = [
      "Code",
      "Farmer Name",
      "Type",
      "Value Chain",
      "County",
      "Subcounty",
      "Coordinates",
      "Health Score",
      "Rating",
    ];
    const rows = filteredData.map((sample) => [
      sample.code,
      sample.farmer_name,
      sample.field_type,
      sample.value_chain,
      sample.ward || "N/A",
      sample.subcounty || "N/A",
      `${sample.coordinates[0]}, ${sample.coordinates[1]}`,
      sample.health_score?.toString(),
      sample.health_rating,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `farmer-records-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="bg-white border border-neutral-200 shadow-md p-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading farmer records...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-neutral-200 shadow-md p-8">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-neutral-900 mb-2">
            Error Loading Data
          </h3>
          <p className="text-neutral-600">{error}</p>
        </div>
      </div>
    );
  }

  const soilCount =
    data?.results.filter((s) => s.field_type === "Soil").length || 0;
  const livestockCount =
    data?.results.filter((s) => s.field_type === "Livestock").length || 0;
  const otherCount = (data?.count || 0) - soilCount - livestockCount;

  return (
    <div className="bg-white border border-neutral-200 shadow-md overflow-y-auto max-h-[70vh]">
      {/* Header */}
      <div className="p-6 border-b border-neutral-200 bg-gradient-to-r from-blue-50 to-indigo-50 sticky top-0 z-20">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
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
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900">
                Farmer Records
              </h2>
              <p className="text-sm text-neutral-600">
                {soilCount} soil, {livestockCount} livestock, {otherCount} other
              </p>
            </div>
          </div>

          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-semibold flex items-center gap-2"
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export CSV
          </button>
        </div>

        {/* Search and Filter */}
        <div className="mt-4 flex gap-3 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search by name, code, or value chain..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="soil">Soil Farmers</option>
            <option value="livestock">Livestock Farmers</option>
            <option value="other">Other</option>
          </select>
          <select
            value={filterRating}
            onChange={(e) => {
              setFilterRating(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Ratings</option>
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="p-6 bg-neutral-50 border-b border-neutral-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-neutral-200">
            <div className="flex items-center gap-2 mb-1">
              <Leaf className="w-4 h-4 text-green-600" />
              <p className="text-xs text-neutral-500 uppercase font-semibold">
                Soil Farmers
              </p>
            </div>
            <p className="text-2xl font-bold text-neutral-900">{soilCount}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-neutral-200">
            <div className="flex items-center gap-2 mb-1">
              <Beef className="w-4 h-4 text-purple-600" />
              <p className="text-xs text-neutral-500 uppercase font-semibold">
                Livestock
              </p>
            </div>
            <p className="text-2xl font-bold text-neutral-900">
              {livestockCount}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-neutral-200">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-4 h-4 text-gray-600" />
              <p className="text-xs text-neutral-500 uppercase font-semibold">
                Other
              </p>
            </div>
            <p className="text-2xl font-bold text-neutral-900">{otherCount}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-neutral-200">
            <p className="text-xs text-neutral-500 uppercase font-semibold mb-1">
              Total
            </p>
            <p className="text-2xl font-bold text-neutral-900">
              {data?.results.length ?? 0}
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                Code
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                Farmer Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                Value Chain
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                Ward
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {currentData && currentData.length > 0 ? (
              currentData.map((sample, index) => {
                const badge = getHealthBadge(sample);
                return (
                  <tr
                    key={index}
                    className="hover:bg-primary-50 transition-colors"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getFieldTypeIcon(sample.field_type)}
                        <span className="text-xs text-neutral-600">
                          {sample.field_type}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-blue-600">
                      {sample.code}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-900 font-medium">
                      {sample.farmer_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-700">
                      <div
                        className="max-w-xs truncate"
                        title={sample.value_chain}
                      >
                        {sample.value_chain}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-700">
                      {sample.ward || "N/A"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {sample.field_type === "Soil" ? (
                        <button
                          className="px-4 py-2 bg-primary-600 text-white text-xs font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
                          onClick={() => {
                            window.open(
                              `/soil-health-report/${sample.code}`,
                              "_blank",
                            );
                          }}
                        >
                          View Report
                        </button>
                      ) : (
                        <span className="px-4 py-2 bg-neutral-100 text-neutral-500 text-xs font-semibold rounded-lg">
                          N/A
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-neutral-500"
                >
                  No records found matching your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-neutral-200 flex items-center justify-between bg-neutral-50">
        <p className="text-sm text-neutral-600">
          Showing{" "}
          <span className="font-semibold">
            {filteredData && filteredData.length > 0 ? startIndex + 1 : 0}
          </span>{" "}
          to{" "}
          <span className="font-semibold">
            {Math.min(endIndex, filteredData?.length || 0)}
          </span>{" "}
          of <span className="font-semibold">{filteredData?.length || 0}</span>{" "}
          records
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 border border-neutral-300 rounded-lg text-sm hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {/* Page Numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <button
                key={i}
                onClick={() => handlePageChange(pageNum)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  currentPage === pageNum
                    ? "bg-primary-600 text-white"
                    : "border border-neutral-300 hover:bg-neutral-100"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 border border-neutral-300 rounded-lg text-sm hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
