import React, { useState } from "react";
import {
  Search,
  FileText,
  Download,
  ChevronDown,
  ChevronUp,
  X,
  Beef,
  Leaf,
  Droplets,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

interface SearchResult {
  code: string;
  farmer_name: string;
  gender: string | null;
  value_chain: string;
  field_type: string;
  farming_system: string | null;
  county: string | null;
  subcounty: string | null;
  coordinates: [number, number];
  has_soil_data: boolean;
  has_livestock_data: boolean;
  health_score: number | null;
  health_rating: string | null;
  health_color: string;
  report_url: string | null;
}

interface SearchResponse {
  query: string;
  count: number;
  results: SearchResult[];
  filters: Record<string, string | null>;
}

interface Classification {
  value: number;
  classification: string;
  rating: string;
  score: number;
}

interface LivestockInfo {
  has_goats: boolean;
  goat_count: string | null;
  breeds_kept: string | null;
  farming_system: string | null;
  for_sale: string | null;
  goat_vaccination: string | null;
  supplements_provision: string | null;
  record_keeping: string | null;
  management_practices: string | null;
  pests_control: string | null;
  marketing_group: string | null;
  value_addition: string | null;
  has_poultry: boolean;
  poultry_count: number | null;
  poultry_breeds: string | null;
  hatching_technique: string | null;
  production_system: string | null;
  market_outlet: string | null;
  poultry_vaccination: string | null;
  diseases_treated: string | null;
  feeds_preparation: string | null;
}

interface FarmerReport {
  code: string;
  farmer_name: string;
  gender: string | null;
  value_chain: string;
  field_type: string;
  location: {
    lat: number;
    lon: number;
    county: string | null;
    subcounty: string | null;
  };
  has_soil_data: boolean;
  has_livestock_data: boolean;
  health_score: number | null;
  health_rating: string | null;
  health_color: string;
  soil_data: Record<string, number | string | null> | null;
  classifications: Record<string, Classification> | null;
  recommendations: string[];
  livestock_info: LivestockInfo | null;
}

interface BulkReportResponse {
  success: boolean;
  summary: {
    total_requested: number;
    total_found: number;
    missing_codes: string[];
    breakdown: {
      soil_samples: number;
      livestock_samples: number;
      water_samples: number;
    };
    soil_health: {
      count: number;
      average_score: number | null;
      min_score: number | null;
      max_score: number | null;
      rating_distribution: Record<string, number>;
    };
  };
  farmers: FarmerReport[];
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const RATING_COLORS: Record<string, string> = {
  Excellent: "#16a34a",
  Good: "#65a30d",
  Fair: "#d97706",
  Poor: "#ea580c",
  Critical: "#dc2626",
};

const VALUE_CHAINS = [
  "All",
  "Goat",
  "Gala Goats",
  "Poultry",
  "Black Night Shade",
  "Capsicum",
  "Okra",
  "Sunflower",
  "Demo",
];
const FARMING_SYSTEMS = [
  "All",
  "Intensive",
  "Semi-intensive",
  "Tethering",
  "Communal",
  "Zero grazing",
];
const FIELD_TYPES = ["All", "Soil", "Livestock", "Water"];

function badge(text: string, color: string) {
  return (
    <span
      className="px-2 py-0.5 rounded-full text-xs font-semibold text-white"
      style={{ backgroundColor: color }}
    >
      {text}
    </span>
  );
}

function FieldTypeIcon({ type }: { type: string }) {
  if (type === "Soil") return <Leaf className="w-4 h-4 text-emerald-600" />;
  if (type === "Livestock") return <Beef className="w-4 h-4 text-purple-600" />;
  if (type === "Water") return <Droplets className="w-4 h-4 text-blue-500" />;
  return null;
}

// ── Sub-components ───────────────────────────────────────────────────────────

function SoilCard({ farmer }: { farmer: FarmerReport }) {
  const [open, setOpen] = useState(false);
  const d = farmer.soil_data!;
  const cl = farmer.classifications!;

  return (
    <div className="border border-emerald-200 rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3 bg-emerald-50 hover:bg-emerald-100 transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="font-semibold text-emerald-900 text-sm">
          Soil Analysis Data
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
      {open && (
        <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          {[
            ["pH (H₂O)", d.ph ?? d.soil_ph_h2o, cl.ph?.classification],
            [
              "EC (mS/cm)",
              d.ec ?? d.electrical_conductivity,
              cl.ec?.classification,
            ],
            [
              "Org. Carbon %",
              d.organic_carbon,
              cl.organic_carbon?.classification,
            ],
            ["CEC (cmol/kg)", d.cec, cl.cec?.classification],
            ["ESP %", d.esp, cl.esp?.classification],
            ["Texture", d.texture_class, null],
            ["Sand %", d.sand, null],
            ["Silt %", d.silt, null],
            ["Clay %", d.clay, null],
            ["Calcium meq%", d.calcium, null],
            ["Potassium meq%", d.potassium, null],
            ["Sodium meq%", d.sodium, null],
          ].map(([label, val, cls]) =>
            val !== null && val !== undefined ? (
              <div
                key={label as string}
                className="bg-white border border-neutral-200 rounded p-2"
              >
                <p className="text-xs text-neutral-500 mb-0.5">
                  {label as string}
                </p>
                <p className="font-semibold text-neutral-900">
                  {typeof val === "number" ? val.toFixed(2) : (val as string)}
                </p>
                {cls && (
                  <p className="text-xs text-neutral-400 mt-0.5 italic">
                    {cls as string}
                  </p>
                )}
              </div>
            ) : null,
          )}
        </div>
      )}
    </div>
  );
}

function LivestockCard({ info }: { info: LivestockInfo }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-purple-200 rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3 bg-purple-50 hover:bg-purple-100 transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="font-semibold text-purple-900 text-sm">
          Livestock Information
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
      {open && (
        <div className="p-4 space-y-4">
          {info.has_goats && (
            <div>
              <p className="text-xs font-bold uppercase text-purple-700 mb-2">
                🐐 Goats
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                {[
                  ["Count", info.goat_count],
                  ["Breeds", info.breeds_kept],
                  ["Farming System", info.farming_system],
                  ["For Sale", info.for_sale],
                  ["Vaccination", info.goat_vaccination],
                  ["Supplements", info.supplements_provision],
                  ["Marketing Group", info.marketing_group],
                  ["Value Addition", info.value_addition],
                  ["Record Keeping", info.record_keeping],
                  ["Management", info.management_practices],
                  ["Pest Control", info.pests_control],
                ].map(([label, val]) =>
                  val ? (
                    <div
                      key={label as string}
                      className="bg-purple-50 rounded p-2"
                    >
                      <p className="text-xs text-purple-500">
                        {label as string}
                      </p>
                      <p className="font-medium text-purple-900 text-xs">
                        {val as string}
                      </p>
                    </div>
                  ) : null,
                )}
              </div>
            </div>
          )}
          {info.has_poultry && (
            <div>
              <p className="text-xs font-bold uppercase text-amber-700 mb-2">
                🐔 Poultry
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                {[
                  ["Birds", info.poultry_count],
                  ["Breeds", info.poultry_breeds],
                  ["Hatching", info.hatching_technique],
                  ["Production System", info.production_system],
                  ["Market Outlet", info.market_outlet],
                  ["Vaccination", info.poultry_vaccination],
                  ["Diseases Treated", info.diseases_treated],
                  ["Feed Preparation", info.feeds_preparation],
                ].map(([label, val]) =>
                  val ? (
                    <div
                      key={label as string}
                      className="bg-amber-50 rounded p-2"
                    >
                      <p className="text-xs text-amber-500">
                        {label as string}
                      </p>
                      <p className="font-medium text-amber-900 text-xs">
                        {String(val)}
                      </p>
                    </div>
                  ) : null,
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FarmerReportCard({ farmer }: { farmer: FarmerReport }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`border rounded-xl overflow-hidden ${farmer.has_soil_data ? "border-emerald-200" : "border-purple-200"}`}
    >
      {/* Header */}
      <div
        className={`px-5 py-4 flex items-center justify-between cursor-pointer ${farmer.has_soil_data ? "bg-emerald-50 hover:bg-emerald-100" : "bg-purple-50 hover:bg-purple-100"} transition-colors`}
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex items-center gap-3">
          <FieldTypeIcon type={farmer.field_type} />
          <div>
            <p className="font-bold text-neutral-900">{farmer.farmer_name}</p>
            <p className="text-xs text-neutral-500">
              {farmer.code} · {farmer.value_chain} ·{" "}
              {farmer.location.county || "Unknown county"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {farmer.health_score !== null &&
            farmer.health_rating &&
            badge(
              `${farmer.health_rating} (${farmer.health_score})`,
              farmer.health_color,
            )}
          {!farmer.has_soil_data &&
            farmer.has_livestock_data &&
            badge("Livestock", "#7c3aed")}
          {open ? (
            <ChevronUp className="w-4 h-4 text-neutral-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-neutral-500" />
          )}
        </div>
      </div>

      {/* Expanded detail */}
      {open && (
        <div className="p-5 space-y-4">
          {/* Basic info grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            {[
              ["Gender", farmer.gender],
              ["Field Type", farmer.field_type],
              ["Subcounty", farmer.location.subcounty],
              [
                "Coordinates",
                `${farmer.location.lat?.toFixed(4)}, ${farmer.location.lon?.toFixed(4)}`,
              ],
            ].map(([label, val]) => (
              <div key={label as string}>
                <p className="text-xs text-neutral-400 uppercase font-semibold">
                  {label as string}
                </p>
                <p className="font-medium text-neutral-900">
                  {(val as string) || "N/A"}
                </p>
              </div>
            ))}
          </div>

          {/* Soil section */}
          {farmer.has_soil_data && farmer.soil_data && (
            <SoilCard farmer={farmer} />
          )}

          {/* Recommendations */}
          {farmer.recommendations.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="font-semibold text-amber-900 text-sm mb-2">
                Recommendations
              </p>
              <ul className="space-y-1">
                {farmer.recommendations.map((r, i) => (
                  <li key={i} className="text-sm text-amber-800 flex gap-2">
                    <span className="mt-0.5 shrink-0">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Livestock section */}
          {farmer.livestock_info && (
            <LivestockCard info={farmer.livestock_info} />
          )}
        </div>
      )}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

const ReportsView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [valueChain, setValueChain] = useState("All");
  const [farmingSystem, setFarmingSystem] = useState("All");
  const [fieldType, setFieldType] = useState("All");
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [selectedFarmers, setSelectedFarmers] = useState<Set<string>>(
    new Set(),
  );
  const [bulkReport, setBulkReport] = useState<BulkReportResponse | null>(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"search" | "report">("search");

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleSearch = async () => {
    setLoading(true);
    setBulkReport(null);
    setActiveTab("search");
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set("q", searchQuery.trim());
      if (valueChain !== "All") params.set("value_chain", valueChain);
      if (farmingSystem !== "All") params.set("farming_system", farmingSystem);
      if (fieldType !== "All") params.set("field_type", fieldType);
      params.set("limit", "500");

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/search-farmers/?${params.toString()}`,
      );
      const data = await response.json();
      setSearchResults(data);
      setSelectedFarmers(new Set());
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const toggleFarmerSelection = (code: string) => {
    setSelectedFarmers((prev) => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      return next;
    });
  };

  const selectAll = () => {
    if (searchResults)
      setSelectedFarmers(new Set(searchResults.results.map((r) => r.code)));
  };

  const clearSelection = () => setSelectedFarmers(new Set());

  const generateBulkReport = async () => {
    if (selectedFarmers.size === 0) return;
    setBulkLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/bulk-soil-report/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            codes: Array.from(selectedFarmers),
            include_recommendations: true,
          }),
        },
      );
      const data: BulkReportResponse = await response.json();
      setBulkReport(data);
      setActiveTab("report");
    } catch (error) {
      console.error("Bulk report failed:", error);
    } finally {
      setBulkLoading(false);
    }
  };

  const clearAll = () => {
    setSearchResults(null);
    setBulkReport(null);
    setSelectedFarmers(new Set());
    setSearchQuery("");
    setValueChain("All");
    setFarmingSystem("All");
    setFieldType("All");
    setActiveTab("search");
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5">
      {/* ── Search panel ────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
        <h2 className="text-2xl font-bold text-neutral-900 mb-1">
          Search & Generate Reports
        </h2>
        <p className="text-neutral-500 text-sm mb-5">
          Filter by name, code, value chain, or livestock farming method — then
          generate bulk reports.
        </p>

        {/* Text search row */}
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder="Farmer name or code (e.g. BM01, Jonah…)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            {loading ? "Searching…" : "Search"}
          </button>
          {(searchResults || bulkReport) && (
            <button
              onClick={clearAll}
              className="px-4 py-2.5 text-neutral-600 border border-neutral-300 rounded-lg hover:bg-neutral-100 flex items-center gap-1 text-sm"
            >
              <X className="w-4 h-4" /> Clear
            </button>
          )}
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap gap-3">
          {/* Value Chain */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-neutral-500 uppercase">
              Value Chain
            </label>
            <select
              value={valueChain}
              onChange={(e) => setValueChain(e.target.value)}
              className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              {VALUE_CHAINS.map((vc) => (
                <option key={vc} value={vc}>
                  {vc}
                </option>
              ))}
            </select>
          </div>

          {/* Farming System */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-neutral-500 uppercase">
              Farming System
            </label>
            <select
              value={farmingSystem}
              onChange={(e) => setFarmingSystem(e.target.value)}
              className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              {FARMING_SYSTEMS.map((fs) => (
                <option key={fs} value={fs}>
                  {fs}
                </option>
              ))}
            </select>
          </div>

          {/* Field Type */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-neutral-500 uppercase">
              Record Type
            </label>
            <select
              value={fieldType}
              onChange={(e) => setFieldType(e.target.value)}
              className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              {FIELD_TYPES.map((ft) => (
                <option key={ft} value={ft}>
                  {ft}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Tabs ──────────────────────────────────────────────── */}
      {(searchResults || bulkReport) && (
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("search")}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === "search"
                ? "bg-emerald-600 text-white"
                : "bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
            }`}
          >
            Search Results {searchResults ? `(${searchResults.count})` : ""}
          </button>
          {bulkReport && (
            <button
              onClick={() => setActiveTab("report")}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === "report"
                  ? "bg-emerald-600 text-white"
                  : "bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              Bulk Report ({bulkReport.summary.total_found} farmers)
            </button>
          )}
        </div>
      )}

      {/* ── Search results tab ──────────────────────────────── */}
      {activeTab === "search" && searchResults && (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
          {/* Toolbar */}
          <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="font-bold text-neutral-900">
                {searchResults.count} result
                {searchResults.count !== 1 ? "s" : ""}
              </p>
              {searchResults.query && (
                <p className="text-xs text-neutral-500">
                  Query: "{searchResults.query}"
                </p>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={selectAll}
                className="px-3 py-1.5 text-sm bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200"
              >
                Select All
              </button>
              <button
                onClick={clearSelection}
                className="px-3 py-1.5 text-sm bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200"
              >
                Clear
              </button>
              {selectedFarmers.size > 0 && (
                <button
                  onClick={generateBulkReport}
                  disabled={bulkLoading}
                  className="px-4 py-1.5 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2 disabled:opacity-60"
                >
                  <FileText className="w-4 h-4" />
                  {bulkLoading
                    ? "Generating…"
                    : `Generate Report (${selectedFarmers.size})`}
                </button>
              )}
            </div>
          </div>

          {/* Results list */}
          <div className="divide-y divide-neutral-100">
            {searchResults.results.length === 0 ? (
              <div className="p-12 text-center text-neutral-400 text-sm">
                No farmers found. Try adjusting your search or filters.
              </div>
            ) : (
              searchResults.results.map((result) => (
                <div
                  key={result.code}
                  className={`p-5 hover:bg-neutral-50 transition-colors ${selectedFarmers.has(result.code) ? "bg-emerald-50" : ""}`}
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={selectedFarmers.has(result.code)}
                      onChange={() => toggleFarmerSelection(result.code)}
                      className="mt-1 w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <FieldTypeIcon type={result.field_type} />
                          <span className="font-bold text-neutral-900">
                            {result.farmer_name}
                          </span>
                          <span className="text-xs text-neutral-400">
                            {result.code}
                          </span>
                        </div>
                        <div className="flex gap-2 items-center flex-wrap">
                          {result.has_soil_data &&
                            result.health_rating &&
                            result.health_score !== null &&
                            badge(
                              `${result.health_rating} · ${result.health_score}`,
                              result.health_color,
                            )}
                          {!result.has_soil_data &&
                            result.has_livestock_data &&
                            badge("Livestock", "#7c3aed")}
                          {result.field_type === "Water" &&
                            badge("Water", "#0284c7")}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-neutral-600">
                        <span>
                          <span className="font-medium">Value chain:</span>{" "}
                          {result.value_chain || "—"}
                        </span>
                        <span>
                          <span className="font-medium">County:</span>{" "}
                          {result.county || "—"}
                        </span>
                        <span>
                          <span className="font-medium">Gender:</span>{" "}
                          {result.gender || "—"}
                        </span>
                        {result.farming_system && (
                          <span>
                            <span className="font-medium">System:</span>{" "}
                            {result.farming_system}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── Bulk report tab ──────────────────────────────────── */}
      {activeTab === "report" && bulkReport && (
        <div className="space-y-4">
          {/* Summary card */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
            <h3 className="text-xl font-bold text-neutral-900 mb-4">
              Bulk Report Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
              {[
                [
                  "Total Farmers",
                  bulkReport.summary.total_found,
                  "text-neutral-900",
                ],
                [
                  "Soil Samples",
                  bulkReport.summary.breakdown.soil_samples,
                  "text-emerald-700",
                ],
                [
                  "Livestock",
                  bulkReport.summary.breakdown.livestock_samples,
                  "text-purple-700",
                ],
                [
                  "Water",
                  bulkReport.summary.breakdown.water_samples,
                  "text-blue-700",
                ],
              ].map(([label, val, cls]) => (
                <div
                  key={label as string}
                  className="bg-neutral-50 rounded-xl p-4 text-center"
                >
                  <p className={`text-2xl font-bold ${cls}`}>{val as number}</p>
                  <p className="text-xs text-neutral-500 mt-1">
                    {label as string}
                  </p>
                </div>
              ))}
            </div>

            {/* Soil health summary */}
            {bulkReport.summary.soil_health.count > 0 && (
              <div>
                <p className="text-sm font-semibold text-neutral-700 mb-3">
                  Soil Health Overview
                </p>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {[
                    ["Avg Score", bulkReport.summary.soil_health.average_score],
                    ["Min", bulkReport.summary.soil_health.min_score],
                    ["Max", bulkReport.summary.soil_health.max_score],
                  ].map(([label, val]) => (
                    <div
                      key={label as string}
                      className="bg-emerald-50 rounded-lg p-3 text-center"
                    >
                      <p className="text-lg font-bold text-emerald-800">
                        {val !== null ? val : "—"}
                      </p>
                      <p className="text-xs text-emerald-600">
                        {label as string}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(
                    bulkReport.summary.soil_health.rating_distribution,
                  )
                    .filter(([, count]) => count > 0)
                    .map(([rating, count]) => (
                      <span
                        key={rating}
                        className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                        style={{
                          backgroundColor: RATING_COLORS[rating] || "#6b7280",
                        }}
                      >
                        {rating}: {count}
                      </span>
                    ))}
                </div>
              </div>
            )}

            {bulkReport.summary.missing_codes.length > 0 && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-800 font-semibold">
                  Not found: {bulkReport.summary.missing_codes.join(", ")}
                </p>
              </div>
            )}
          </div>

          {/* Per-farmer cards */}
          <div className="space-y-3">
            {bulkReport.farmers.map((farmer) => (
              <FarmerReportCard key={farmer.code} farmer={farmer} />
            ))}
          </div>
        </div>
      )}

      {/* ── Empty state ──────────────────────────────────────── */}
      {!searchResults && !bulkReport && (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center">
            <Download className="w-10 h-10 text-emerald-700" />
          </div>
          <h3 className="text-xl font-bold text-neutral-900 mb-2">
            Generate Custom Reports
          </h3>
          <p className="text-neutral-500 text-sm max-w-sm mx-auto">
            Use the filters above to find farmers by name, value chain, or
            farming system — then select any subset and generate a detailed bulk
            report.
          </p>
        </div>
      )}
    </div>
  );
};

export default ReportsView;
