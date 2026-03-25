import React, { useState, useEffect } from "react";

interface Sample {
  code: string;
  farmer_name: string;
  county: string | null;
  subcounty: string | null;
  coordinates: [number, number];
  health_score: number | null;
  health_rating: string | null;
  health_color: string | null;
  field_type: string;
  value_chain: string;
  has_soil_data: boolean;
  has_livestock_data: boolean;
  farming_system: string | null;
}

interface ApiResponse {
  count: number;
  results: Sample[];
}

interface AnalyticsDashboardProps {
  apiBaseUrl?: string;
}

import {
  Users,
  BarChart3,
  AlertTriangle,
  AlertCircle,
  Target,
  TrendingUp,
  Map,
  Trophy,
  Star,
  Lightbulb,
  Sparkles,
  Medal,
  Leaf,
  Beef,
} from "lucide-react";

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000",
}) => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${apiBaseUrl}/api/search-farmers/?limit=10000`,
        );
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiBaseUrl]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center gap-3">
        <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-neutral-600">Loading analytics...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <p className="text-red-600 font-medium">
          {error ?? "No data available"}
        </p>
      </div>
    );
  }

  // ===== SPLIT BY TYPE =====
  const soilFarmers = data.results.filter((s) => s.field_type === "Soil");
  const livestockFarmers = data.results.filter(
    (s) => s.field_type === "Livestock",
  );
  const unknownFarmers = data.results.filter(
    (s) => s.field_type !== "Soil" && s.field_type !== "Livestock",
  );
  const total = data.results.length;

  // ===== SOIL HEALTH RATINGS =====
  const ratingCounts = {
    Excellent: soilFarmers.filter((s) => s.health_rating === "Excellent")
      .length,
    Good: soilFarmers.filter((s) => s.health_rating === "Good").length,
    Fair: soilFarmers.filter((s) => s.health_rating === "Fair").length,
    Poor: soilFarmers.filter((s) => s.health_rating === "Poor").length,
    Critical: soilFarmers.filter(
      (s) => s.health_rating === "Critical" && (s.health_score ?? 0) > 0,
    ).length,
  };

  const ratingPercentages = Object.fromEntries(
    Object.entries(ratingCounts).map(([k, v]) => [
      k,
      soilFarmers.length > 0
        ? ((v / soilFarmers.length) * 100).toFixed(1)
        : "0",
    ]),
  );

  // ===== SCORE STATS (soil only) =====
  const validScores = soilFarmers
    .filter((s) => (s.health_score ?? 0) > 0)
    .map((s) => s.health_score as number);

  const avgHealthScore =
    validScores.length > 0
      ? (validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1)
      : "0";

  const sortedScores = [...validScores].sort((a, b) => a - b);
  const minScore = sortedScores.length > 0 ? sortedScores[0] : 0;
  const maxScore =
    sortedScores.length > 0 ? sortedScores[sortedScores.length - 1] : 0;
  const medianScore =
    sortedScores.length > 0
      ? sortedScores[Math.floor(sortedScores.length / 2)]
      : 0;

  // ===== FARMERS AT RISK =====
  const farmersAtRisk =
    ratingCounts.Critical + ratingCounts.Fair + ratingCounts.Poor;
  const riskPercentage =
    soilFarmers.length > 0
      ? ((farmersAtRisk / soilFarmers.length) * 100).toFixed(1)
      : "0";

  // ===== TOP / BOTTOM PERFORMERS =====
  const rankedFarmers = [...soilFarmers]
    .filter((s) => s.health_score !== null && s.health_score !== undefined)
    .sort((a, b) => (b.health_score ?? 0) - (a.health_score ?? 0));
  const topPerformers = rankedFarmers.slice(0, 5);
  const bottomPerformers = rankedFarmers.slice(-5).reverse();

  // ===== GEOGRAPHIC DISTRIBUTION =====
  const countyDistribution: Record<string, number> = {};
  data.results.forEach((s) => {
    const county = s.county || "Unknown";
    countyDistribution[county] = (countyDistribution[county] || 0) + 1;
  });
  const topCounties = Object.entries(countyDistribution)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // ===== SUBCOUNTY HEALTH (soil only) =====
  const subcountyHealth: Record<string, { total: number; count: number }> = {};
  soilFarmers.forEach((s) => {
    const sub = s.subcounty || "Unknown";
    if (!subcountyHealth[sub]) subcountyHealth[sub] = { total: 0, count: 0 };
    if ((s.health_score ?? 0) > 0) {
      subcountyHealth[sub].total += s.health_score as number;
      subcountyHealth[sub].count += 1;
    }
  });
  const topSubcounties = Object.entries(subcountyHealth)
    .filter(([, d]) => d.count >= 3)
    .map(([name, d]) => ({
      name,
      avg: d.count > 0 ? d.total / d.count : 0,
      count: d.count,
    }))
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 5);

  // ===== LIVESTOCK VALUE CHAINS =====
  const livestockValueChains: Record<string, number> = {};
  livestockFarmers.forEach((s) => {
    const chain = s.value_chain || "Unknown";
    livestockValueChains[chain] = (livestockValueChains[chain] || 0) + 1;
  });
  const topLivestockChains = Object.entries(livestockValueChains)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // ===== IMPROVEMENT POTENTIAL =====
  const improvementPotential = soilFarmers.filter(
    (s) => (s.health_score ?? 0) > 0 && (s.health_score ?? 0) < 70,
  ).length;
  const improvementPercentage =
    soilFarmers.length > 0
      ? ((improvementPotential / soilFarmers.length) * 100).toFixed(1)
      : "0";

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* KEY METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Farmers"
            value={total.toString()}
            subtitle={`${soilFarmers.length} soil · ${livestockFarmers.length} livestock`}
            icon={<Users className="w-5 h-5" />}
            color="bg-blue-500"
          />
          <MetricCard
            title="Avg Soil Health Score"
            value={avgHealthScore}
            subtitle={`from ${soilFarmers.length} soil samples`}
            icon={<Leaf className="w-5 h-5" />}
            color="bg-emerald-500"
          />
          <MetricCard
            title="Soil Farmers at Risk"
            value={farmersAtRisk.toString()}
            subtitle={`${riskPercentage}% (Critical + Poor + Fair)`}
            icon={<AlertTriangle className="w-5 h-5" />}
            color="bg-amber-500"
          />
          <MetricCard
            title="Livestock Farmers"
            value={livestockFarmers.length.toString()}
            subtitle="Separate tracking needed"
            icon={<Beef className="w-5 h-5" />}
            color="bg-purple-500"
          />
        </div>

        {/* FARMER TYPE DISTRIBUTION */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <h2 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-neutral-700" />
            Farmer Type Distribution
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Soil Farmers",
                count: soilFarmers.length,
                icon: <Leaf className="w-8 h-8 text-green-600" />,
                bg: "bg-green-50",
                border: "border-green-200",
              },
              {
                label: "Livestock Farmers",
                count: livestockFarmers.length,
                icon: <Beef className="w-8 h-8 text-purple-600" />,
                bg: "bg-purple-50",
                border: "border-purple-200",
              },
              {
                label: "Unknown / Water",
                count: unknownFarmers.length,
                icon: <AlertCircle className="w-8 h-8 text-gray-600" />,
                bg: "bg-gray-50",
                border: "border-gray-200",
              },
              {
                label: "Total Farmers",
                count: total,
                icon: <Users className="w-8 h-8 text-blue-600" />,
                bg: "bg-blue-50",
                border: "border-blue-200",
              },
            ].map(({ label, count, icon, bg, border }) => (
              <div
                key={label}
                className={`text-center p-4 ${bg} rounded-lg border ${border}`}
              >
                <div className="flex items-center justify-center mb-2">
                  {icon}
                </div>
                <p className="text-2xl font-bold text-neutral-900">{count}</p>
                <p className="text-xs text-neutral-600 mt-1">{label}</p>
                <p className="text-xs text-neutral-500">
                  {total > 0 ? ((count / total) * 100).toFixed(1) : "0"}%
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* HEALTH DISTRIBUTION + LIVESTOCK VALUE CHAINS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Rating Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <h2 className="text-lg font-bold text-neutral-900 mb-1 flex items-center gap-2">
              <Leaf className="w-6 h-6 text-neutral-700" />
              Soil Health Rating Distribution
            </h2>
            <p className="text-sm text-neutral-500 mb-4">
              Based on {soilFarmers.length} soil farmers
            </p>
            <div className="space-y-3">
              {(["Excellent", "Good", "Fair", "Poor", "Critical"] as const).map(
                (rating) => {
                  const count = ratingCounts[rating];
                  const pct = parseFloat(ratingPercentages[rating] ?? "0");
                  const colors: Record<string, string> = {
                    Excellent: "bg-emerald-500",
                    Good: "bg-blue-500",
                    Fair: "bg-yellow-500",
                    Poor: "bg-orange-500",
                    Critical: "bg-red-500",
                  };
                  return (
                    <div key={rating}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-neutral-700">
                          {rating}
                        </span>
                        <span className="text-sm text-neutral-600">
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${colors[rating]}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          </div>

          {/* Livestock Value Chains */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <h2 className="text-lg font-bold text-neutral-900 mb-1 flex items-center gap-2">
              <Beef className="w-6 h-6 text-neutral-700" />
              Livestock Value Chains
            </h2>
            <p className="text-sm text-neutral-500 mb-4">
              {livestockFarmers.length} livestock farmers
            </p>
            <div className="space-y-3">
              {topLivestockChains.length > 0 ? (
                topLivestockChains.map(([chain, count]) => {
                  const pct =
                    livestockFarmers.length > 0
                      ? ((count / livestockFarmers.length) * 100).toFixed(1)
                      : "0";
                  return (
                    <div key={chain}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-neutral-700">
                          {chain}
                        </span>
                        <span className="text-sm text-neutral-600">
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-purple-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-neutral-500 text-center py-4">
                  No livestock farmers found
                </p>
              )}
            </div>
          </div>
        </div>

        {/* SCORE STATISTICS */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <h2 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-neutral-700" />
            Soil Health Score Statistics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatBox label="Minimum Score" value={minScore.toFixed(1)} />
            <StatBox label="Maximum Score" value={maxScore.toFixed(1)} />
            <StatBox label="Median Score" value={medianScore.toFixed(1)} />
            <StatBox label="Average Score" value={avgHealthScore} />
          </div>
        </div>

        {/* GEOGRAPHIC ANALYSIS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Counties */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <h2 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <Map className="w-6 h-6 text-neutral-700" />
              Top Counties by Farmer Count
            </h2>
            <div className="space-y-3">
              {topCounties.map(([county, count], index) => (
                <div key={county} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-600">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1 flex justify-between">
                    <span className="font-medium text-neutral-900">
                      {county}
                    </span>
                    <span className="text-sm text-neutral-600">
                      {count} farmers
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Subcounties by Health */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <h2 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-neutral-700" />
              Top Subcounties by Avg Soil Health
            </h2>
            <div className="space-y-3">
              {topSubcounties.length > 0 ? (
                topSubcounties.map(({ name, avg, count }, index) => (
                  <div key={name} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-emerald-600">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1 flex justify-between">
                      <span className="font-medium text-neutral-900">
                        {name}
                      </span>
                      <span className="text-sm text-neutral-600">
                        {avg.toFixed(1)} avg · {count} farmers
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-neutral-500 text-center py-4">
                  Not enough subcounty data (min 3 soil farmers per subcounty)
                </p>
              )}
            </div>
          </div>
        </div>

        {/* TOP & BOTTOM PERFORMERS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performers */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <h2 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <Star className="w-6 h-6 text-neutral-700" />
              Top 5 Soil Health Performers
            </h2>
            <div className="space-y-2">
              {topPerformers.length > 0 ? (
                topPerformers.map((farmer) => (
                  <div
                    key={farmer.code}
                    className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Medal className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">
                          {farmer.farmer_name}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {farmer.code} · {farmer.subcounty ?? "—"}
                        </p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-emerald-600">
                      {farmer.health_score?.toFixed(1) ?? "N/A"}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-neutral-500 text-center py-4">
                  No soil data available
                </p>
              )}
            </div>
          </div>

          {/* Bottom Performers */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <h2 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-neutral-700" />
              Bottom {Math.min(5, bottomPerformers.length)} Performers (Need
              Support)
            </h2>
            <div className="space-y-2">
              {bottomPerformers.length > 0 ? (
                bottomPerformers.map((farmer) => (
                  <div
                    key={farmer.code}
                    className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">
                          {farmer.farmer_name}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {farmer.code} · {farmer.subcounty ?? "—"}
                        </p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-red-600">
                      {farmer.health_score?.toFixed(1) ?? "N/A"}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-neutral-500 text-center py-4">
                  No soil data available
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ACTION INSIGHTS */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-200 p-6">
          <h2 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-neutral-700" />
            Key Insights & Recommendations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InsightCard
              title="Soil Improvement Potential"
              value={`${improvementPotential} farmers`}
              description={`${improvementPercentage}% of soil farmers score below 70 and could benefit from targeted interventions`}
              icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
            />
            <InsightCard
              title="Livestock Tracking"
              value={`${livestockFarmers.length} farmers`}
              description="Livestock farmers need different metrics — consider a separate tracking system for animal health"
              icon={<Beef className="w-6 h-6 text-blue-600" />}
            />
            <InsightCard
              title="Priority Action"
              value={`${farmersAtRisk} at-risk cases`}
              description={`${ratingCounts.Critical} critical, ${ratingCounts.Poor} poor, ${ratingCounts.Fair} fair — need immediate support`}
              icon={<AlertCircle className="w-6 h-6 text-blue-600" />}
            />
            <InsightCard
              title="Success Rate"
              value={`${ratingPercentages["Excellent"]}% excellent`}
              description="Learn from top soil performers to replicate success across other farmers"
              icon={<Sparkles className="w-6 h-6 text-blue-600" />}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Helper Components ──────────────────────────────────────────────────────────

const MetricCard: React.FC<{
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, subtitle, icon, color }) => (
  <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
    <div
      className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center text-white mb-3`}
    >
      {icon}
    </div>
    <h3 className="text-sm font-medium text-neutral-600 mb-1">{title}</h3>
    <p className="text-3xl font-bold text-neutral-900">{value}</p>
    {subtitle && <p className="text-xs text-neutral-500 mt-1">{subtitle}</p>}
  </div>
);

const StatBox: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="text-center p-4 bg-neutral-50 rounded-lg">
    <p className="text-2xl font-bold text-neutral-900">{value}</p>
    <p className="text-xs text-neutral-600 mt-1">{label}</p>
  </div>
);

const InsightCard: React.FC<{
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}> = ({ title, value, description, icon }) => (
  <div className="bg-white rounded-lg p-4 border border-blue-200">
    <div className="flex items-start gap-3">
      {icon}
      <div>
        <h3 className="font-semibold text-neutral-900 mb-1">{title}</h3>
        <p className="text-lg font-bold text-blue-600 mb-1">{value}</p>
        <p className="text-sm text-neutral-600">{description}</p>
      </div>
    </div>
  </div>
);

export default AnalyticsDashboard;
