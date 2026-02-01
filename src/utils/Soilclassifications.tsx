// Soil Classification Utilities

export interface SoilClassification {
  category: string;
  status: "excellent" | "good" | "warning" | "poor" | "critical";
  color: string;
  bgColor: string;
  remarks?: string;
}

// pH Classification
export function classifyPH(pH: number | undefined | null): SoilClassification {
  if (pH === undefined || pH === null) {
    return {
      category: "Unknown",
      status: "warning",
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    };
  }

  if (pH < 4.5) {
    return {
      category: "Ultra Acidic",
      status: "critical",
      color: "text-red-700",
      bgColor: "bg-red-100",
      remarks: "Often toxic to most plants; aluminum toxicity common",
    };
  } else if (pH >= 4.5 && pH <= 5.0) {
    return {
      category: "Extremely Acidic",
      status: "critical",
      color: "text-red-600",
      bgColor: "bg-red-100",
      remarks: "Few crops tolerate; major nutrient deficiencies",
    };
  } else if (pH >= 5.1 && pH <= 5.5) {
    return {
      category: "Strongly Acidic",
      status: "poor",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      remarks: "Requires liming for most crops",
    };
  } else if (pH >= 5.6 && pH <= 6.0) {
    return {
      category: "Moderately Acidic",
      status: "warning",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      remarks: "Tolerated by acid-loving crops (e.g., potatoes, blueberries)",
    };
  } else if (pH >= 6.1 && pH <= 6.5) {
    return {
      category: "Slightly Acidic",
      status: "good",
      color: "text-green-600",
      bgColor: "bg-green-100",
      remarks: "Ideal for most crops; good nutrient availability",
    };
  } else if (pH >= 6.6 && pH <= 7.3) {
    return {
      category: "Neutral",
      status: "excellent",
      color: "text-green-700",
      bgColor: "bg-green-100",
      remarks: "Optimal for most crops; balanced nutrient availability",
    };
  } else if (pH >= 7.4 && pH <= 7.8) {
    return {
      category: "Slightly Alkaline",
      status: "warning",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      remarks: "May reduce availability of phosphorus and micronutrients",
    };
  } else if (pH >= 7.9 && pH <= 8.4) {
    return {
      category: "Moderately Alkaline",
      status: "poor",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      remarks: "Micronutrient deficiencies (e.g., iron, zinc) more likely",
    };
  } else {
    return {
      category: "Strongly Alkaline",
      status: "critical",
      color: "text-red-600",
      bgColor: "bg-red-100",
      remarks: "Often indicates sodic soils; poor structure and plant growth",
    };
  }
}

// Electrical Conductivity Classification
export function classifyEC(ec: number | undefined | null): SoilClassification {
  if (ec === undefined || ec === null) {
    return {
      category: "Unknown",
      status: "warning",
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    };
  }

  if (ec < 0.2) {
    return {
      category: "Very Low",
      status: "excellent",
      color: "text-green-700",
      bgColor: "bg-green-100",
      remarks: "Non-saline; suitable for most crops",
    };
  } else if (ec >= 0.2 && ec <= 0.8) {
    return {
      category: "Low",
      status: "good",
      color: "text-green-600",
      bgColor: "bg-green-100",
      remarks: "Mostly non-saline; some sensitive crops may be affected",
    };
  } else if (ec > 0.8 && ec <= 2.0) {
    return {
      category: "Moderate",
      status: "warning",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      remarks: "Slightly saline; affects salt-sensitive crops",
    };
  } else if (ec > 2.0 && ec <= 4.0) {
    return {
      category: "Saline",
      status: "poor",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      remarks: "Moderately affects growth of many common crops",
    };
  } else if (ec > 4.0 && ec <= 8.0) {
    return {
      category: "Strongly Saline",
      status: "critical",
      color: "text-red-600",
      bgColor: "bg-red-100",
      remarks: "Only salt-tolerant crops perform well",
    };
  } else if (ec > 8.0 && ec <= 16.0) {
    return {
      category: "Very Strongly Saline",
      status: "critical",
      color: "text-red-700",
      bgColor: "bg-red-100",
      remarks: "Severe effects on most crops; reclamation may be needed",
    };
  } else {
    return {
      category: "Extremely Saline",
      status: "critical",
      color: "text-red-800",
      bgColor: "bg-red-200",
      remarks: "Unsuitable for conventional agriculture without treatment",
    };
  }
}

// Cation Exchange Capacity Classification
export function classifyCEC(
  cec: number | undefined | null,
): SoilClassification {
  if (cec === undefined || cec === null) {
    return {
      category: "Unknown",
      status: "warning",
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    };
  }

  if (cec < 5) {
    return {
      category: "Very Low",
      status: "poor",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      remarks:
        "Common in sandy soils; low nutrient retention; needs frequent fertilization",
    };
  } else if (cec >= 5 && cec < 15) {
    return {
      category: "Low to Moderate",
      status: "warning",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      remarks: "Loamy soils; moderate fertility; may need nutrient management",
    };
  } else if (cec >= 15 && cec <= 25) {
    return {
      category: "High",
      status: "good",
      color: "text-green-600",
      bgColor: "bg-green-100",
      remarks: "Clay loams and silty soils; good nutrient-holding capacity",
    };
  } else {
    return {
      category: "Very High",
      status: "excellent",
      color: "text-green-700",
      bgColor: "bg-green-100",
      remarks:
        "Heavy clay or organic soils (e.g., peat); high fertility and buffering capacity",
    };
  }
}

// Exchangeable Sodium Percentage Classification
export function classifyESP(
  esp: number | undefined | null,
): SoilClassification {
  if (esp === undefined || esp === null) {
    return {
      category: "Unknown",
      status: "warning",
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    };
  }

  if (esp < 6) {
    return {
      category: "Non-sodic",
      status: "excellent",
      color: "text-green-700",
      bgColor: "bg-green-100",
      remarks: "Normal soil; good structure and permeability",
    };
  } else if (esp >= 6 && esp <= 15) {
    return {
      category: "Slightly Sodic",
      status: "warning",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      remarks:
        "Beginning to show signs of sodicity; structure may start to deteriorate",
    };
  } else if (esp > 15 && esp <= 30) {
    return {
      category: "Moderately Sodic",
      status: "poor",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      remarks:
        "Poor infiltration; reduced permeability; moderate risk to plants",
    };
  } else {
    return {
      category: "Strongly Sodic",
      status: "critical",
      color: "text-red-700",
      bgColor: "bg-red-100",
      remarks: "Severe structural degradation; high pH; toxic to most plants",
    };
  }
}

// Nutrient Classification (Mehlich Method)
export interface NutrientRange {
  deficiency: number;
  adequate: [number, number];
  excessive: number;
}

export const nutrientRanges: Record<string, NutrientRange> = {
  sodium: {
    deficiency: 0,
    adequate: [0, 2.0],
    excessive: 2.0,
  },
  potassium: {
    deficiency: 0.24,
    adequate: [0.24, 1.5],
    excessive: 1.5,
  },
  calcium: {
    deficiency: 2.0,
    adequate: [2.0, 15.0],
    excessive: 15.0,
  },
  magnesium: {
    deficiency: 1.0,
    adequate: [1.0, 3.0],
    excessive: 3.0,
  },
};

export function classifyNutrient(
  value: number | undefined | null | string,
  nutrientType: keyof typeof nutrientRanges,
): SoilClassification {
  // Convert string to number if needed
  const numValue = typeof value === "string" ? parseFloat(value) : value;

  if (numValue === undefined || numValue === null || isNaN(numValue)) {
    return {
      category: "Unknown",
      status: "warning",
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    };
  }

  const range = nutrientRanges[nutrientType];

  if (numValue < range.deficiency) {
    return {
      category: "Deficient",
      status: "critical",
      color: "text-red-600",
      bgColor: "bg-red-100",
      remarks: "Below optimal levels; supplementation recommended",
    };
  } else if (numValue >= range.adequate[0] && numValue <= range.adequate[1]) {
    return {
      category: "Adequate",
      status: "excellent",
      color: "text-green-600",
      bgColor: "bg-green-100",
      remarks: "Optimal nutrient levels",
    };
  } else {
    return {
      category: "Excessive",
      status: "poor",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      remarks: "Above optimal levels; may cause imbalances",
    };
  }
}

// Organic Carbon Classification
export function classifyOrganicCarbon(
  oc: number | undefined | null,
): SoilClassification {
  if (oc === undefined || oc === null) {
    return {
      category: "Unknown",
      status: "warning",
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    };
  }

  if (oc < 1.33) {
    return {
      category: "Low",
      status: "poor",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      remarks: "Low organic matter; soil health improvement needed",
    };
  } else if (oc >= 1.33 && oc < 2.66) {
    return {
      category: "Moderate",
      status: "warning",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      remarks: "Moderate organic matter levels",
    };
  } else if (oc >= 2.66 && oc <= 5.32) {
    return {
      category: "Adequate",
      status: "good",
      color: "text-green-600",
      bgColor: "bg-green-100",
      remarks: "Good organic matter content",
    };
  } else {
    return {
      category: "High",
      status: "excellent",
      color: "text-green-700",
      bgColor: "bg-green-100",
      remarks: "Excellent organic matter content",
    };
  }
}
