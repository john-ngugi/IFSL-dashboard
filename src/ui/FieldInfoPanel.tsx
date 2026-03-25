import React, { useMemo } from "react";
import {
  classifyPH,
  classifyEC,
  classifyCEC,
  classifyESP,
  classifyNutrient,
  classifyOrganicCarbon,
} from "../utils/Soilclassifications";

import {
  generateRecommendations,
  generateSummary,
} from "../utils/Recomendatations";

interface Classification {
  category: string;
  status: "excellent" | "good" | "warning" | "poor" | "critical";
  color: string;
  bgColor: string;
  remarks?: string;
}

interface FieldData {
  field_1?: string;
  X_FIELD?: number;
  Y_FIELED?: number;
  "NAME OF FARMER"?: string;
  GENDER?: string;
  "VALUE CHAIN"?: string;
  FIELD_TYPE?: string;
  "SOIL PH-H2O (1:2.5)"?: number;
  "ELECT. COND. MS/CM"?: number;
  "TOTAL ORG. CARBON %"?: number;
  "SAND %"?: number;
  "SILT %"?: number;
  "CLAY %"?: string;
  "TEXTURE CLASS"?: string;
  "CAT. EXCH. CAP. MEQ%"?: number;
  "CALCIUM MEQ%"?: number;
  "MAGNESIUM MEQ%"?: string;
  "POTASSIUM MEQ%"?: number;
  "SODIUM MEQ%"?: number;
  "SUM MEQ%"?: number;
  "BASE %"?: number;
  ESP?: number;
  PH?: number;
  "CONDUCTIVITY, MS/CM"?: number;
  "SODIUM, ME/LITRE"?: number;
  "POTASSIUM, ME/LITRE"?: number;
  "CALCIUM, ME/LITRE"?: number;
  "MAGNESIUM, ME/LITRE"?: number;
  "CARBONATES, ME/LITRE"?: string;
  "BICARBONATES, ME/LITRE"?: number;
  "CHLORIDES, ME/LITRE"?: number;
  "SULPHATES, ME/LITRE"?: string;
  "SODIUM ADSORPTION RATIO"?: number;
  "BREEDS KEPT"?: string;
  "NO. OF GOATS KEPT"?: string;
  "FARMING SYSTEM PRACTISED"?: string;
  "FOR SALE"?: string;
  "ORGANIZED MARKETING GROUP MEMBERSHIP"?: boolean;
  "VALUE ADDITION"?: boolean;
  "GOAT VACCINATION"?: boolean;
  "SUPPLEMENTS PROVISION"?: boolean;
  "RECORD KEEPING"?: boolean;
  "MANAGEMENT PRACTICES"?: string;
  "PESTS AND PARASITES CONTROL METHODS"?: string;
  "FARMING INFORMATION SOURCES"?: string;
  "POULTRY BREEDS"?: string;
  "NUMBER OF BIRDS"?: number;
  "HATCHING TECHNIQUE"?: string;
  "PRODUCTION SYSTEM"?: string;
  "MARKET OUTLET"?: string;
  "VACCINATION AND FREQUENCY"?: boolean;
  "DISEASES COMMONLY TREATED"?: string;
  "FEEDS PREPARATION"?: boolean;
  "POULTRY FARMING INFORMATION DISSEMINATION"?: string;
}

interface FieldInfoPanelProps {
  isOpen: boolean;
  onClose: () => void;
  data: FieldData | null;
}

const FieldInfoPanel: React.FC<FieldInfoPanelProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  if (!data) return null;

  const renderValue = (value: any) => {
    if (value === null || value === undefined || value === "") return "N/A";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    return value.toString();
  };
  // console.log("Field Data:", data);
  const classifications = useMemo(() => {
    if (!data) return null;
    return {
      pH: classifyPH(data["SOIL PH-H2O (1:2.5)"]),
      ec: classifyEC(data["ELECT. COND. MS/CM"]),
      cec: classifyCEC(data["CAT. EXCH. CAP. MEQ%"]),
      esp: classifyESP(data.ESP),
      organicCarbon: classifyOrganicCarbon(data["TOTAL ORG. CARBON %"]),
      calcium: classifyNutrient(data["CALCIUM MEQ%"], "calcium"),
      magnesium: classifyNutrient(data["MAGNESIUM MEQ%"], "magnesium"),
      potassium: classifyNutrient(data["POTASSIUM MEQ%"], "potassium"),
      sodium: classifyNutrient(data["SODIUM MEQ%"], "sodium"),
    };
  }, [data]);
  // console.log("Field Data:", data);
  const recommendations = useMemo(() => {
    if (!data) return [];
    return generateRecommendations(data);
  }, [data]);

  const summary = useMemo(() => {
    if (!data) return null;
    return generateSummary(data);
  }, [data]);

  const ClassificationBadge: React.FC<{ classification: Classification }> = ({
    classification,
  }) => (
    <div className="flex items-center gap-2 mt-1">
      <span
        className={`px-2.5 py-1 rounded text-xs font-medium ${classification.bgColor} ${classification.color} border ${classification.color.replace("text-", "border-")}/20`}
      >
        {classification.category}
      </span>
    </div>
  );

  const StatusIndicator: React.FC<{ status: Classification["status"] }> = ({
    status,
  }) => {
    const colors = {
      excellent: "bg-accent-safe",
      good: "bg-accent-hope",
      warning: "bg-status-warning",
      poor: "bg-medical-400",
      critical: "bg-primary-600",
    };
    return (
      <div
        className={`w-2 h-2 rounded-full ${colors[status]} ring-2 ring-white`}
      ></div>
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-primary-50 border-l-4 border-primary-600 text-neutral-900";
      case "medium":
        return "bg-status-warning/5 border-l-4 border-status-warning text-neutral-900";
      case "low":
        return "bg-accent-care/5 border-l-4 border-accent-care text-neutral-900";
      default:
        return "bg-neutral-50 border-l-4 border-neutral-300 text-neutral-900";
    }
  };

  return (
    <>
      <div
        className={`fixed top-20 right-0 h-[calc(100vh-5rem)] w-full md:max-w-full lg:max-w-[480px] xl:max-w-[650px] bg-neutral-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-5 flex items-center justify-between border-b border-primary-800">
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold tracking-tight">
              Field Analysis Report
            </h2>
            <p className="text-sm text-white/90 font-medium mt-1">
              {data["NAME OF FARMER"] || "Unknown Farmer"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-md flex items-center justify-center transition-all duration-200"
            aria-label="Close panel"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="h-[calc(100%-88px)] overflow-y-auto p-6 space-y-6 bg-neutral-50">
          {data["FIELD_TYPE"] === "Soil" && summary && (
            <section className="bg-white  border border-neutral-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 px-6 py-4 border-b border-neutral-200">
                <h3 className="text-base font-semibold text-neutral-900 tracking-tight">
                  Soil Health Overview
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-neutral-50 rounded-md p-4 border border-neutral-200">
                    <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-2">
                      Overall Status
                    </p>
                    <p
                      className={`text-2xl font-semibold capitalize ${
                        summary.overallHealth === "excellent"
                          ? "text-accent-safe"
                          : summary.overallHealth === "good"
                            ? "text-accent-care"
                            : summary.overallHealth === "fair"
                              ? "text-status-warning"
                              : "text-primary-600"
                      }`}
                    >
                      {summary.overallHealth}
                    </p>
                  </div>
                  <div className="bg-neutral-50 rounded-md p-4 border border-neutral-200">
                    <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-2">
                      Critical Issues
                    </p>
                    <p className="text-2xl font-semibold text-primary-600">
                      {summary.criticalIssues}
                    </p>
                  </div>
                  <div className="bg-neutral-50 rounded-md p-4 border border-neutral-200">
                    <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-2">
                      Strengths
                    </p>
                    <p className="text-2xl font-semibold text-accent-safe">
                      {summary.strengths.length}
                    </p>
                  </div>
                </div>

                {summary.strengths.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-neutral-700 mb-3">
                      Strengths
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {summary.strengths.map((strength, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-accent-safe/10 text-accent-safe border border-accent-safe/20 rounded text-xs font-medium"
                        >
                          {strength}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {summary.concerns.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-neutral-700 mb-3">
                      Areas for Improvement
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {summary.concerns.map((concern, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-status-warning/10 text-status-warning border border-status-warning/20 rounded text-xs font-medium"
                        >
                          {concern}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}
          {recommendations.length > 0 && (
            <section className="bg-white rounded-md border border-neutral-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 px-6 py-4 border-b border-neutral-200">
                <h3 className="text-base font-semibold text-neutral-900 tracking-tight">
                  Recommendations
                </h3>
              </div>
              <div className="p-6 space-y-3">
                {recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className={`rounded-md p-4 ${getPriorityColor(rec.priority)}`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-600">
                            {rec.category}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded bg-white border border-neutral-200 font-medium text-neutral-700">
                            {rec.priority} priority
                          </span>
                        </div>
                        <h4 className="font-semibold text-sm text-neutral-900 mb-1">
                          {rec.title}
                        </h4>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-700 leading-relaxed">
                      {rec.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
          <section className="bg-white border border-neutral-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 px-6 py-4 border-b border-neutral-200">
              <h3 className="text-base font-semibold text-neutral-900 tracking-tight">
                Basic Information
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-1">
                    Farmer Name
                  </p>
                  <p className="text-sm font-medium text-neutral-900">
                    {renderValue(data["NAME OF FARMER"])}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-1">
                    Gender
                  </p>
                  <p className="text-sm font-medium text-neutral-900">
                    {renderValue(data.GENDER)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-1">
                    Value Chain
                  </p>
                  <p className="text-sm font-medium text-neutral-900">
                    {renderValue(data["VALUE CHAIN"])}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-1">
                    Field Type
                  </p>
                  <p className="text-sm font-medium text-neutral-900">
                    {renderValue(data.FIELD_TYPE)}
                  </p>
                </div>
              </div>
            </div>
          </section>
          <section className="bg-white rounded-md border border-neutral-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 px-6 py-4 border-b border-neutral-200">
              <h3 className="text-base font-semibold text-neutral-900 tracking-tight">
                Location
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-1">
                    Longitude (X)
                  </p>
                  <p className="text-sm font-mono text-neutral-900">
                    {renderValue(data.X_FIELD)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-1">
                    Latitude (Y)
                  </p>
                  <p className="text-sm font-mono text-neutral-900">
                    {renderValue(data.Y_FIELED)}
                  </p>
                </div>
              </div>
            </div>
          </section>
          {data["FIELD_TYPE"] === "Soil" && (
            <section className="bg-white rounded-md border border-neutral-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 px-6 py-4 border-b border-neutral-200">
                <h3 className="text-base font-semibold text-neutral-900 tracking-tight">
                  Soil Properties & Analysis
                </h3>
              </div>
              <div className="p-6 space-y-4">
                {classifications && (
                  <>
                    <div className="bg-neutral-50 border border-neutral-200 rounded-md p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <StatusIndicator status={classifications.pH.status} />
                          <p className="text-sm font-semibold text-neutral-700">
                            Soil pH
                          </p>
                        </div>
                        <p className="text-lg font-semibold text-neutral-900">
                          {renderValue(data["SOIL PH-H2O (1:2.5)"])}
                        </p>
                      </div>
                      <ClassificationBadge
                        classification={classifications.pH}
                      />
                      {classifications.pH.remarks && (
                        <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                          {classifications.pH.remarks}
                        </p>
                      )}
                    </div>

                    <div className="bg-neutral-50 border border-neutral-200 rounded-md p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <StatusIndicator status={classifications.ec.status} />
                          <p className="text-sm font-semibold text-neutral-700">
                            Electrical Conductivity
                          </p>
                        </div>
                        <p className="text-lg font-semibold text-neutral-900">
                          {renderValue(data["ELECT. COND. MS/CM"])} dS/m
                        </p>
                      </div>
                      <ClassificationBadge
                        classification={classifications.ec}
                      />
                      {classifications.ec.remarks && (
                        <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                          {classifications.ec.remarks}
                        </p>
                      )}
                    </div>

                    <div className="bg-neutral-50 border border-neutral-200 rounded-md p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <StatusIndicator
                            status={classifications.cec.status}
                          />
                          <p className="text-sm font-semibold text-neutral-700">
                            Cation Exchange Capacity
                          </p>
                        </div>
                        <p className="text-lg font-semibold text-neutral-900">
                          {renderValue(data["CAT. EXCH. CAP. MEQ%"])} meq%
                        </p>
                      </div>
                      <ClassificationBadge
                        classification={classifications.cec}
                      />
                      {classifications.cec.remarks && (
                        <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                          {classifications.cec.remarks}
                        </p>
                      )}
                    </div>

                    {data.ESP !== undefined && (
                      <div className="bg-neutral-50 border border-neutral-200 rounded-md p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <StatusIndicator
                              status={classifications.esp.status}
                            />
                            <p className="text-sm font-semibold text-neutral-700">
                              Exchangeable Sodium Percentage
                            </p>
                          </div>
                          <p className="text-lg font-semibold text-neutral-900">
                            {renderValue(data.ESP)}%
                          </p>
                        </div>
                        <ClassificationBadge
                          classification={classifications.esp}
                        />
                        {classifications.esp.remarks && (
                          <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                            {classifications.esp.remarks}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="bg-neutral-50 border border-neutral-200 rounded-md p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <StatusIndicator
                            status={classifications.organicCarbon.status}
                          />
                          <p className="text-sm font-semibold text-neutral-700">
                            Total Organic Carbon
                          </p>
                        </div>
                        <p className="text-lg font-semibold text-neutral-900">
                          {renderValue(data["TOTAL ORG. CARBON %"])}%
                        </p>
                      </div>
                      <ClassificationBadge
                        classification={classifications.organicCarbon}
                      />
                      {classifications.organicCarbon.remarks && (
                        <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                          {classifications.organicCarbon.remarks}
                        </p>
                      )}
                    </div>

                    <div className="bg-neutral-50 border border-neutral-200 rounded-md p-4">
                      <p className="text-sm font-semibold text-neutral-700 mb-3">
                        Soil Texture
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-1">
                            Texture Class
                          </p>
                          <p className="text-sm font-medium text-neutral-900">
                            {renderValue(data["TEXTURE CLASS"])}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-1">
                            Sand
                          </p>
                          <p className="text-sm font-medium text-neutral-900">
                            {renderValue(data["SAND %"])}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-1">
                            Silt
                          </p>
                          <p className="text-sm font-medium text-neutral-900">
                            {renderValue(data["SILT %"])}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-1">
                            Clay
                          </p>
                          <p className="text-sm font-medium text-neutral-900">
                            {renderValue(data["CLAY %"])}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </section>
          )}
          {data["FIELD_TYPE"] === "Soil" && classifications && (
            <section className="bg-white rounded-md border border-neutral-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 px-6 py-4 border-b border-neutral-200">
                <h3 className="text-base font-semibold text-neutral-900 tracking-tight">
                  Nutrient Analysis
                </h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-neutral-50 border border-neutral-200 rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <StatusIndicator
                        status={classifications.calcium.status}
                      />
                      <p className="text-sm font-semibold text-neutral-700">
                        Calcium
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-neutral-900">
                      {renderValue(data["CALCIUM MEQ%"])} meq%
                    </p>
                  </div>
                  <ClassificationBadge
                    classification={classifications.calcium}
                  />
                </div>

                <div className="bg-neutral-50 border border-neutral-200 rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <StatusIndicator
                        status={classifications.magnesium.status}
                      />
                      <p className="text-sm font-semibold text-neutral-700">
                        Magnesium
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-neutral-900">
                      {renderValue(data["MAGNESIUM MEQ%"])} meq%
                    </p>
                  </div>
                  <ClassificationBadge
                    classification={classifications.magnesium}
                  />
                </div>

                <div className="bg-neutral-50 border border-neutral-200 rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <StatusIndicator
                        status={classifications.potassium.status}
                      />
                      <p className="text-sm font-semibold text-neutral-700">
                        Potassium
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-neutral-900">
                      {renderValue(data["POTASSIUM MEQ%"])} meq%
                    </p>
                  </div>
                  <ClassificationBadge
                    classification={classifications.potassium}
                  />
                </div>

                <div className="bg-neutral-50 border border-neutral-200 rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <StatusIndicator status={classifications.sodium.status} />
                      <p className="text-sm font-semibold text-neutral-700">
                        Sodium
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-neutral-900">
                      {renderValue(data["SODIUM MEQ%"])} meq%
                    </p>
                  </div>
                  <ClassificationBadge
                    classification={classifications.sodium}
                  />
                </div>
              </div>
            </section>
          )}
          {(data["BREEDS KEPT"] || data["NO. OF GOATS KEPT"]) && (
            <section className="bg-white rounded-md border border-neutral-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 px-6 py-4 border-b border-neutral-200">
                <h3 className="text-base font-semibold text-neutral-900 tracking-tight">
                  Goat Farming
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-1">
                      Breeds
                    </p>
                    <p className="text-sm font-medium text-neutral-900">
                      {renderValue(data["BREEDS KEPT"])}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-1">
                      Number of Goats
                    </p>
                    <p className="text-sm font-medium text-neutral-900">
                      {renderValue(data["NO. OF GOATS KEPT"])}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-1">
                      Vaccination
                    </p>
                    <p className="text-sm font-medium text-neutral-900">
                      {renderValue(data["GOAT VACCINATION"])}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-1">
                      Record Keeping
                    </p>
                    <p className="text-sm font-medium text-neutral-900">
                      {renderValue(data["RECORD KEEPING"])}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}
          {(data["POULTRY BREEDS"] || data["NUMBER OF BIRDS"]) && (
            <section className="bg-white rounded-md border border-neutral-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 px-6 py-4 border-b border-neutral-200">
                <h3 className="text-base font-semibold text-neutral-900 tracking-tight">
                  Poultry Farming
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-1">
                      Breeds
                    </p>
                    <p className="text-sm font-medium text-neutral-900">
                      {renderValue(data["POULTRY BREEDS"])}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-1">
                      Number of Birds
                    </p>
                    <p className="text-sm font-medium text-neutral-900">
                      {renderValue(data["NUMBER OF BIRDS"])}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-1">
                      Production System
                    </p>
                    <p className="text-sm font-medium text-neutral-900">
                      {renderValue(data["PRODUCTION SYSTEM"])}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-1">
                      Market Outlet
                    </p>
                    <p className="text-sm font-medium text-neutral-900">
                      {renderValue(data["MARKET OUTLET"])}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {data["FIELD_TYPE"] === "livestock" && (
            <section className="bg-white rounded-md border border-neutral-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 px-6 py-4 border-b border-neutral-200">
                <h3 className="text-base font-semibold text-neutral-900 tracking-tight">
                  Farming Practices
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-1">
                      Farming System
                    </p>
                    <p className="text-sm font-medium text-neutral-900">
                      {renderValue(data["FARMING SYSTEM PRACTISED"])}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-1">
                      Value Addition
                    </p>
                    <p className="text-sm font-medium text-neutral-900">
                      {renderValue(data["VALUE ADDITION"])}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-1">
                      Marketing Group
                    </p>
                    <p className="text-sm font-medium text-neutral-900">
                      {renderValue(
                        data["ORGANIZED MARKETING GROUP MEMBERSHIP"],
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default FieldInfoPanel;
