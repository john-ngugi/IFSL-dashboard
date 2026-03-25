import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Lightbulb,
  AlertTriangle,
  Info,
  CheckCircle,
  Zap,
  Printer,
} from "lucide-react";

// Add this style tag in the component or in a separate CSS file
const printStyles = `
  @media print {
    body {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    
    .no-print {
      display: none !important;
    }
    
    .print-break {
      page-break-after: always;
    }
  }
`;

// interface SoilReportProps {
//   sampleCode: string;
//   apiBaseUrl?: string;
// }

interface ApiResponse {
  sample: {
    code: string;
    farmer_name: string;
    value_chain: string;
    county: string | null;
    subcounty: string | null;
    x_field: number;
    y_field: number;
    soil_ph_h2o: number;
    electrical_conductivity: number;
    total_organic_carbon: number;
    cation_exchange_capacity: number;
    potassium: number;
    esp: number;
    calcium: number;
    magnesium: number;
    sodium: number;
  };
  health_score: {
    total_score: number;
    rating: string;
    color: string;
    component_scores: {
      ph: number;
      cec: number;
      ec: number;
      esp: number;
      organic_carbon: number;
    };
  };
  recommendations: {
    critical: any[];
    high: Array<{
      priority: string;
      action: string;
      detail: string;
      benefits: string;
    }>;
    medium: Array<{
      priority: string;
      action: string;
      detail: string;
      benefits: string;
    }>;
    low: Array<{
      priority: string;
      action: string;
      detail: string;
      benefits: string;
    }>;
  };
  classifications: {
    ph: { classification: string; rating: string };
    cec: { classification: string; rating: string };
    ec: { classification: string; rating: string };
    esp: { classification: string; rating: string };
  };
}

const SoilHealthReport: React.FC = () => {
  const { farmerCode } = useParams<{ farmerCode: string }>();
  const sampleCode = farmerCode;

  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sampleCode) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${apiBaseUrl}/soil-health/${sampleCode}/`,
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
  }, [sampleCode]);

  // const getScoreColor = (score: number) => {
  //   if (score >= 80) return "from-emerald-500 to-emerald-600";
  //   if (score >= 60) return "from-lime-500 to-emerald-500";
  //   if (score >= 40) return "from-yellow-500 to-lime-500";
  //   return "from-orange-500 to-yellow-500";
  // };

  const getPriorityConfig = (priority: string) => {
    const normalizedPriority = priority.toLowerCase();
    switch (normalizedPriority) {
      case "high":
      case "critical":
        return {
          bg: "bg-rose-50",
          border: "border-rose-200",
          icon: "text-rose-600",
          iconBg: "bg-rose-100",
          label: "bg-rose-500 text-white",
        };
      case "medium":
        return {
          bg: "bg-amber-50",
          border: "border-amber-200",
          icon: "text-amber-600",
          iconBg: "bg-amber-100",
          label: "bg-amber-500 text-white",
        };
      default:
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          icon: "text-blue-600",
          iconBg: "bg-blue-100",
          label: "bg-blue-500 text-white",
        };
    }
  };

  if (loading) {
    return (
      <>
        <style>{printStyles}</style>
        <div className="max-w-5xl mx-auto p-8 bg-gradient-to-br from-neutral-50 to-neutral-100 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-neutral-600 text-lg">
              Loading soil health data...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-8 bg-gradient-to-br from-neutral-50 to-neutral-100 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
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
          <h2 className="text-xl font-bold text-neutral-900 mb-2 text-center">
            Error Loading Data
          </h2>
          <p className="text-neutral-600 text-center">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  // Map API data to component format
  const {
    sample,
    health_score,
    recommendations: apiRecommendations,
    classifications,
  } = data;

  // Combine all recommendations
  const allRecommendations = [
    ...apiRecommendations.critical.map((rec) => ({
      priority: "high" as const,
      title: rec.priority,
      description: `${rec.action}\n${rec.detail}`,
      benefit: rec.benefits,
    })),
    ...apiRecommendations.high.map((rec) => ({
      priority: "high" as const,
      title: rec.priority,
      description: `${rec.action}\n${rec.detail}`,
      benefit: rec.benefits,
    })),
    ...apiRecommendations.medium.map((rec) => ({
      priority: "medium" as const,
      title: rec.priority,
      description: `${rec.action}\n${rec.detail}`,
      benefit: rec.benefits,
    })),
    ...apiRecommendations.low.map((rec) => ({
      priority: "low" as const,
      title: rec.priority,
      description: `${rec.action}\n${rec.detail}`,
      benefit: rec.benefits,
    })),
  ];

  // Build detailed scores
  const detailedScores = [
    {
      label: "pH Level",
      value: `Value: ${sample.soil_ph_h2o.toFixed(2)}`,
      classification: classifications.ph.classification,
      rating: classifications.ph.rating,
      score: health_score.component_scores.ph,
    },
    {
      label: "Potassium (K)",
      value: `Value: ${sample.potassium.toFixed(2)} cmol/kg`,
      classification: "Available from soil data",
      rating: "N/A",
      score: 0,
    },
    {
      label: "Electrical Conductivity (Salinity)",
      value: `Value: ${sample.electrical_conductivity.toFixed(2)} dS/m`,
      classification: classifications.ec.classification,
      rating: classifications.ec.rating,
      score: health_score.component_scores.ec,
    },
    {
      label: "Organic Carbon",
      value: `Value: ${sample.total_organic_carbon.toFixed(2)}%`,
      classification: "Measured",
      rating: "N/A",
      score: health_score.component_scores.organic_carbon,
    },
    {
      label: "Cation Exchange Capacity (CEC)",
      value: `Value: ${sample.cation_exchange_capacity.toFixed(2)} cmol/kg`,
      classification: classifications.cec.classification,
      rating: classifications.cec.rating,
      score: health_score.component_scores.cec,
    },
    {
      label: "Exchangeable Sodium % (ESP)",
      value: `Value: ${sample.esp.toFixed(2)}%`,
      classification: classifications.esp.classification,
      rating: classifications.esp.rating,
      score: health_score.component_scores.esp,
    },
    {
      label: "Calcium (Ca)",
      value: `Value: ${sample.calcium.toFixed(2)} cmol/kg`,
      classification: "Available from soil data",
      rating: "N/A",
      score: 0,
    },
    {
      label: "Magnesium (Mg)",
      value: `Value: ${sample.magnesium.toFixed(2)} cmol/kg`,
      classification: "Available from soil data",
      rating: "N/A",
      score: 0,
    },
  ];

  const overallScore = health_score.total_score;
  const coordinates = `${sample.y_field.toFixed(4)}, ${sample.x_field.toFixed(4)}`;

  return (
    <>
      <style>{printStyles}</style>
      <div className="max-w-5xl mx-auto p-8 bg-neutral-50 min-h-screen">
        {/* Header Card */}
        <div className="bg-white shadow-sm border border-neutral-200 overflow-hidden mb-6">
          <div className="bg-neutral-800 px-8 py-6">
            <h1 className="text-2xl font-bold text-white mb-2">
              Soil Health Analysis Report
            </h1>
            <p className="text-neutral-300 text-sm">
              Comprehensive soil assessment and management recommendations
            </p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <p className="text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-2">
                  Sample ID
                </p>
                <p className="text-lg font-bold text-neutral-900">
                  {sample.code}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-2">
                  Farmer Name
                </p>
                <p className="text-lg font-semibold text-neutral-900">
                  {sample.farmer_name}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-2">
                  County
                </p>
                <p className="text-lg font-semibold text-neutral-900">
                  {sample.county || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-2">
                  Subcounty
                </p>
                <p className="text-lg font-semibold text-neutral-900">
                  {sample.subcounty || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-2">
                  Value Chain
                </p>
                <p className="text-lg font-semibold text-neutral-900">
                  {sample.value_chain}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-2">
                  Coordinates
                </p>
                <p className="text-lg font-semibold text-neutral-900">
                  {coordinates}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Health Score */}
        <div className="bg-white shadow-sm border border-neutral-200 overflow-hidden mb-6">
          <div className="px-8 py-6 border-b border-neutral-200">
            <h2 className="text-xl font-bold text-neutral-900">
              Overall Soil Health Score
            </h2>
            <p className="text-sm text-neutral-600 mt-1">
              Your soil health score is considered{" "}
              <span
                className="font-semibold"
                style={{
                  color: health_score.color,
                  WebkitPrintColorAdjust: "exact",
                  printColorAdjust: "exact",
                }}
              >
                {health_score.rating}
              </span>{" "}
              with a score of {overallScore.toFixed(1)}/100
            </p>
          </div>

          <div className="p-8">
            {/* Progress Bar */}
            <div className="relative h-10 bg-neutral-100 border border-neutral-200 overflow-hidden mb-4">
              <div
                className={`absolute left-0 top-0 h-full transition-all duration-1000 flex items-center justify-end pr-4`}
                style={{
                  width: `${overallScore}%`,
                  background: (() => {
                    if (overallScore >= 80)
                      return "linear-gradient(90deg, #047857 0%, #059669 50%, #10b981 100%)"; // Emerald
                    if (overallScore >= 60)
                      return "linear-gradient(90deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%)"; // Blue
                    if (overallScore >= 40)
                      return "linear-gradient(90deg, #b45309 0%, #d97706 50%, #f59e0b 100%)"; // Amber
                    return "linear-gradient(90deg, #b91c1c 0%, #dc2626 50%, #ef4444 100%)"; // Red
                  })(),
                }}
              >
                <span className="text-white font-bold text-sm drop-shadow-sm">
                  {overallScore.toFixed(1)}
                </span>
              </div>
            </div>
            {/* Score Scale */}
            <div className="flex justify-between text-xs text-neutral-500 mb-8">
              <span>0</span>
              <span>25</span>
              <span>50</span>
              <span>75</span>
              <span>100</span>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 border border-red-300"
                  style={{
                    background:
                      "linear-gradient(90deg, #b91c1c 0%, #dc2626 50%, #ef4444 100%)",
                    WebkitPrintColorAdjust: "exact",
                    printColorAdjust: "exact",
                  }}
                ></div>
                <span className="text-sm text-neutral-700">Poor (0-40)</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 border border-amber-300"
                  style={{
                    background:
                      "linear-gradient(90deg, #b45309 0%, #d97706 50%, #f59e0b 100%)",
                    WebkitPrintColorAdjust: "exact",
                    printColorAdjust: "exact",
                  }}
                ></div>
                <span className="text-sm text-neutral-700">Fair (40-60)</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 border border-blue-300"
                  style={{
                    background:
                      "linear-gradient(90deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%)",
                    WebkitPrintColorAdjust: "exact",
                    printColorAdjust: "exact",
                  }}
                ></div>
                <span className="text-sm text-neutral-700">Good (60-80)</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 border border-emerald-300"
                  style={{
                    background:
                      "linear-gradient(90deg, #047857 0%, #059669 50%, #10b981 100%)",
                    WebkitPrintColorAdjust: "exact",
                    printColorAdjust: "exact",
                  }}
                ></div>
                <span className="text-sm text-neutral-700">
                  Excellent (80-100)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Component Scores */}
        <div className="bg-white shadow-sm border border-neutral-200 overflow-hidden mb-6">
          <div className="px-8 py-6 border-b border-neutral-200">
            <h2 className="text-xl font-bold text-neutral-900">
              Detailed Component Scores
            </h2>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {detailedScores.map((item, index) => (
                <div
                  key={index}
                  className="border-l-4 border-neutral-300 pl-4 py-3"
                >
                  <h3 className="font-semibold text-neutral-900 mb-1">
                    {item.label}
                  </h3>
                  <p className="text-sm text-neutral-600 mb-2">{item.value}</p>
                  <div className="inline-block">
                    <span className="px-3 py-1 bg-neutral-100 border border-neutral-200 text-neutral-700 text-xs font-medium rounded">
                      {item.classification}
                    </span>
                    {item.rating !== "N/A" && (
                      <span className="ml-2 px-3 py-1 bg-neutral-100 border border-neutral-200 text-neutral-700 text-xs font-medium rounded">
                        {item.rating}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Management Recommendations */}
        <div className="bg-white shadow-sm border border-neutral-200 overflow-hidden mb-6">
          <div className="px-8 py-6 border-b border-neutral-200 bg-neutral-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-neutral-700 rounded flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-neutral-900">
                  Management Recommendations
                </h2>
                <p className="text-sm text-neutral-600">
                  Prioritized actions to improve soil health
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="space-y-4">
              {allRecommendations.map((rec, index) => {
                const config = getPriorityConfig(rec.priority);
                return (
                  <div
                    key={index}
                    className={`${config.bg} border ${config.border} p-6 transition-all hover:shadow-sm`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className={`${config.iconBg} w-10 h-10 rounded flex items-center justify-center flex-shrink-0`}
                      >
                        {rec.priority === "high" ? (
                          <AlertTriangle className={`w-5 h-5 ${config.icon}`} />
                        ) : rec.priority === "medium" ? (
                          <Info className={`w-5 h-5 ${config.icon}`} />
                        ) : (
                          <CheckCircle className={`w-5 h-5 ${config.icon}`} />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span
                            className={`${config.label} px-3 py-1 text-xs font-semibold uppercase tracking-wide rounded`}
                            style={{
                              WebkitPrintColorAdjust: "exact",
                              printColorAdjust: "exact",
                            }}
                          >
                            {rec.title}
                          </span>
                        </div>

                        <p className="text-neutral-900 font-medium mb-3 whitespace-pre-line leading-relaxed">
                          {rec.description}
                        </p>

                        <div className="flex items-start gap-2 bg-neutral-50 border border-neutral-200 rounded p-3">
                          <Zap className="w-4 h-4 text-neutral-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-1">
                              Benefit
                            </p>
                            <p className="text-sm text-neutral-700">
                              {rec.benefit}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Print Button */}
        <div className="flex justify-center no-print">
          <button
            onClick={() => window.print()}
            className="px-8 py-3 bg-neutral-800 text-white font-semibold rounded hover:bg-neutral-900 transition-all shadow-sm hover:shadow flex items-center gap-3 group"
          >
            <Printer className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Print Report
          </button>
        </div>
      </div>
    </>
  );
};

export default SoilHealthReport;
