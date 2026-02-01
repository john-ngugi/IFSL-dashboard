// Recommendations Generator based on soil analysis

export interface Recommendation {
  priority: "high" | "medium" | "low";
  category: string;
  title: string;
  description: string;
  icon: string;
}

export function generateRecommendations(data: any): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // pH Recommendations
  const pH = data["SOIL PH-H2O (1:2.5)"];
  if (pH !== undefined && pH !== null) {
    if (pH < 5.5) {
      recommendations.push({
        priority: "high",
        category: "Soil pH",
        title: "Apply Agricultural Lime",
        description: `Your soil pH is ${pH.toFixed(1)}, which is too acidic. Apply agricultural lime (calcium carbonate) at 2-4 tons per hectare to raise pH to 6.0-6.5. Split applications over time for best results.`,
        icon: "🌾",
      });
    } else if (pH > 8.0) {
      recommendations.push({
        priority: "high",
        category: "Soil pH",
        title: "Apply Soil Acidifiers",
        description: `Your soil pH is ${pH.toFixed(1)}, which is too alkaline. Consider applying elemental sulfur or acidifying fertilizers. Use 200-400 kg/ha of sulfur to lower pH gradually.`,
        icon: "⚗️",
      });
    }
  }

  // Electrical Conductivity Recommendations
  const ec = data["ELECT. COND. MS/CM"];
  if (ec !== undefined && ec !== null && ec > 2.0) {
    recommendations.push({
      priority: "high",
      category: "Salinity",
      title: "Implement Salinity Management",
      description: `Your soil has elevated salinity (EC: ${ec.toFixed(2)} dS/m). Apply leaching irrigation to flush salts below root zone. Use 15-20% extra irrigation water and ensure good drainage. Consider planting salt-tolerant crops.`,
      icon: "💧",
    });
  }

  // CEC Recommendations
  const cec = data["CAT. EXCH. CAP. MEQ%"];
  if (cec !== undefined && cec !== null && cec < 5) {
    recommendations.push({
      priority: "medium",
      category: "Soil Fertility",
      title: "Improve Nutrient Retention",
      description: `Your soil has low CEC (${cec.toFixed(1)} meq%), indicating poor nutrient retention. Add organic matter through compost or manure at 10-20 tons/ha. Consider more frequent, smaller fertilizer applications.`,
      icon: "🌱",
    });
  }

  // ESP Recommendations
  const esp = data.ESP;
  if (esp !== undefined && esp !== null && esp > 15) {
    recommendations.push({
      priority: "high",
      category: "Sodicity",
      title: "Treat Sodic Soil",
      description: `Your soil is sodic (ESP: ${esp.toFixed(1)}%). Apply gypsum (calcium sulfate) at 2-5 tons/ha to replace sodium with calcium. Improve drainage and consider deep tillage to break up compacted layers.`,
      icon: "⚠️",
    });
  }

  // Organic Carbon Recommendations
  const oc = data["TOTAL ORG. CARBON %"];
  if (oc !== undefined && oc !== null && oc < 2.0) {
    recommendations.push({
      priority: "medium",
      category: "Organic Matter",
      title: "Increase Organic Matter",
      description: `Your soil has low organic carbon (${oc.toFixed(2)}%). Incorporate crop residues, apply compost or well-rotted manure at 10-15 tons/ha, and consider cover cropping to build soil organic matter.`,
      icon: "🍂",
    });
  }

  // Calcium Recommendations
  const calcium = parseFloat(data["CALCIUM MEQ%"]);
  if (!isNaN(calcium) && calcium < 2.0) {
    recommendations.push({
      priority: "medium",
      category: "Nutrients",
      title: "Supplement Calcium",
      description: `Calcium levels are low (${calcium.toFixed(2)} meq%). Apply calcium-containing amendments like agricultural lime, gypsum, or calcium nitrate. Target rate: 500-1000 kg/ha depending on soil test.`,
      icon: "🧪",
    });
  }

  // Magnesium Recommendations
  const magnesium = parseFloat(data["MAGNESIUM MEQ%"]);
  if (!isNaN(magnesium) && magnesium < 1.0) {
    recommendations.push({
      priority: "medium",
      category: "Nutrients",
      title: "Add Magnesium",
      description: `Magnesium is deficient (${magnesium.toFixed(2)} meq%). Apply dolomitic lime (contains both calcium and magnesium) or Epsom salt (magnesium sulfate) at 100-200 kg/ha.`,
      icon: "💊",
    });
  }

  // Potassium Recommendations
  const potassium = data["POTASSIUM MEQ%"];
  if (potassium !== undefined && potassium !== null && potassium < 0.24) {
    recommendations.push({
      priority: "high",
      category: "Nutrients",
      title: "Apply Potassium Fertilizer",
      description: `Potassium is critically low (${potassium.toFixed(3)} meq%). Apply potassium chloride (muriate of potash) or potassium sulfate at 100-150 kg K2O/ha before planting.`,
      icon: "🌿",
    });
  }

  // Texture-based Recommendations
  const texture = data["TEXTURE CLASS"];
  if (texture) {
    if (texture.toLowerCase().includes("sand")) {
      recommendations.push({
        priority: "low",
        category: "Soil Management",
        title: "Sandy Soil Management",
        description:
          "Your sandy soil drains quickly. Use frequent, light irrigations. Apply organic matter to improve water and nutrient retention. Consider slow-release fertilizers.",
        icon: "🏖️",
      });
    } else if (texture.toLowerCase().includes("clay")) {
      recommendations.push({
        priority: "low",
        category: "Soil Management",
        title: "Clay Soil Management",
        description:
          "Your clay soil retains water well but may have drainage issues. Avoid over-irrigation. Add organic matter and gypsum to improve structure. Consider raised beds in wet conditions.",
        icon: "🧱",
      });
    }
  }

  // Sort by priority
  const priorityOrder = { high: 1, medium: 2, low: 3 };
  recommendations.sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
  );

  return recommendations;
}

// Generate summary statistics
export function generateSummary(data: any): {
  overallHealth: "excellent" | "good" | "fair" | "poor";
  criticalIssues: number;
  strengths: string[];
  concerns: string[];
} {
  let score = 100;
  const criticalIssues: string[] = [];
  const strengths: string[] = [];
  const concerns: string[] = [];

  // pH scoring
  const pH = data["SOIL PH-H2O (1:2.5)"];
  if (pH !== undefined && pH !== null) {
    if (pH >= 6.1 && pH <= 7.3) {
      strengths.push("Optimal pH range");
      score += 5;
    } else if (pH < 5.0 || pH > 8.5) {
      criticalIssues.push("Critical pH levels");
      score -= 25;
    } else {
      concerns.push("pH needs adjustment");
      score -= 10;
    }
  }

  // EC scoring
  const ec = data["ELECT. COND. MS/CM"];
  if (ec !== undefined && ec !== null) {
    if (ec < 0.8) {
      strengths.push("Low salinity");
    } else if (ec > 4.0) {
      criticalIssues.push("High salinity");
      score -= 20;
    } else if (ec > 2.0) {
      concerns.push("Moderate salinity");
      score -= 10;
    }
  }

  // CEC scoring
  const cec = data["CAT. EXCH. CAP. MEQ%"];
  if (cec !== undefined && cec !== null) {
    if (cec >= 15) {
      strengths.push("Good nutrient retention");
    } else if (cec < 5) {
      concerns.push("Low nutrient holding capacity");
      score -= 15;
    }
  }

  // Organic Carbon scoring
  const oc = data["TOTAL ORG. CARBON %"];
  if (oc !== undefined && oc !== null) {
    if (oc >= 2.66) {
      strengths.push("Good organic matter");
    } else if (oc < 1.33) {
      concerns.push("Low organic matter");
      score -= 10;
    }
  }

  // ESP scoring
  const esp = data.ESP;
  if (esp !== undefined && esp !== null) {
    if (esp < 6) {
      strengths.push("Non-sodic soil");
    } else if (esp > 15) {
      criticalIssues.push("Sodic soil");
      score -= 20;
    } else {
      concerns.push("Slight sodicity");
      score -= 5;
    }
  }

  // Determine overall health
  let overallHealth: "excellent" | "good" | "fair" | "poor";
  if (score >= 90) {
    overallHealth = "excellent";
  } else if (score >= 70) {
    overallHealth = "good";
  } else if (score >= 50) {
    overallHealth = "fair";
  } else {
    overallHealth = "poor";
  }

  return {
    overallHealth,
    criticalIssues: criticalIssues.length,
    strengths,
    concerns,
  };
}
