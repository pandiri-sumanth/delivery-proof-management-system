const { GoogleGenerativeAI } = require("@google/generative-ai");

let genAI = null;
let model = null;

// Initialize Gemini if key exists
if (process.env.GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });
  } catch (error) {
    console.error("Failed to initialize Gemini:", error);
  }
}

let cachedInsight = null;
let lastCacheTime = null;
const CACHE_DURATION_MS = 1000 * 60 * 15; // 15 minutes

const getDemoInsights = (stats) => {
  const damageRate = stats.total > 0 ? (stats.damaged / stats.total) * 100 : 0;
  const healthScore = Math.max(0, 100 - (damageRate * 2)).toFixed(0);
  const successScore = stats.total > 0 ? ((stats.delivered / stats.total) * 100).toFixed(0) : 0;
  
  return {
    scores: {
      healthScore: Number(healthScore),
      successScore: Number(successScore),
      damagePercentage: Number(damageRate.toFixed(1)),
      riskLevel: damageRate > 10 ? "High" : damageRate > 5 ? "Medium" : "Low",
      weeklyTrend: "Stable"
    },
    analysis: {
      performanceSummary: `Delivery operations are functioning normally with a ${successScore}% completion rate.`,
      damageAnalysis: `${damageRate.toFixed(1)}% of recent deliveries were marked as damaged.`,
      riskAssessment: "Current operational risk is within acceptable parameters.",
      operationalInsights: "Most deliveries were completed successfully.",
      recommendations: ["Improve packaging quality.", "Increase quality inspections.", "Monitor high-risk delivery routes.", "Review damaged package trends weekly."],
      nextSteps: ["Continue standard operations.", "Conduct weekly reviews of damage reports."]
    }
  };
};

const generateInsights = async (stats) => {
  if (
    !stats ||
    typeof stats.total !== "number" ||
    typeof stats.delivered !== "number" ||
    typeof stats.damaged !== "number"
  ) {
    throw new Error("Invalid delivery statistics.");
  }

    // 1. If API Key is missing, immediately go to Demo Mode
  if (!model) {
    return { mode: "🟡 Demo Mode", data: getDemoInsights(stats) };
  }

  // 2. Check Cache for Live Mode
  const now = Date.now();
  if (cachedInsight && lastCacheTime && (now - lastCacheTime < CACHE_DURATION_MS)) {
    return { mode: "🟢 Live AI Connected", data: cachedInsight };
  }

  // 3. Attempt Gemini API
  try {
    const prompt = `
You are an AI Logistics Analyst for an Enterprise Delivery Proof Management System.

Analyze these delivery statistics:
Total Deliveries: ${stats.total}
Delivered: ${stats.delivered}
Damaged: ${stats.damaged}
Pending/In Transit: ${stats.total - stats.delivered - stats.damaged}

You MUST return a valid JSON object matching the exact structure below. Do not use markdown wrappers like \`\`\`json. Return RAW JSON only.

{
  "scores": {
    "healthScore": 0-100,
    "successScore": 0-100,
    "damagePercentage": 0-100,
    "riskLevel": "Low | Medium | High | Critical",
    "weeklyTrend": "Up | Down | Stable"
  },
  "analysis": {
    "performanceSummary": "String (1-2 sentences)",
    "damageAnalysis": "String (1-2 sentences)",
    "riskAssessment": "String (1-2 sentences)",
    "operationalInsights": "String (1-2 sentences)",
    "recommendations": ["String", "String"],
    "nextSteps": ["String", "String"]
  }
}

Keep all string responses professional, business-oriented, and concise.
`;

    const result = await model.generateContent(prompt);
    let rawText = result.response.text().trim();
    
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      rawText = jsonMatch[0];
    }

    const parsedData = JSON.parse(rawText);
    
    // Update cache
    cachedInsight = parsedData;
    lastCacheTime = now;
    
    return { mode: "🟢 Live AI Connected", data: parsedData };

  } catch (error) {
    console.error("Gemini Error:", error.message || error);
    
    // 4. Rate Limit / Error Fallback (Demo Mode)
    if (cachedInsight) {
      console.log("Serving cached insights due to Gemini API failure.");
      return { mode: "🟡 Demo Mode", data: cachedInsight };
    }

    console.log("Serving generic fallback insights due to Gemini API failure.");
    return { mode: "🟡 Demo Mode", data: getDemoInsights(stats) };
  }
};

const parseQueryLocally = (query) => {
  const q = query.toLowerCase();
  const filters = {};
  
  // Status
  if (q.includes("delivered") || q.includes("completed")) filters.status = "Delivered";
  else if (q.includes("pending")) filters.status = "Pending";
  else if (q.includes("transit")) filters.status = "In Transit";
  else if (q.includes("cancelled")) filters.status = "Cancelled";

  // Condition
  if (q.includes("damaged") || q.includes("broken")) filters.condition_status = "Damaged";
  else if (q.includes("good") || q.includes("perfect")) filters.condition_status = "Good";
  else if (q.includes("lost")) filters.condition_status = "Lost";

  // Date
  if (q.includes("today")) filters.dateRange = "today";
  else if (q.includes("week")) filters.dateRange = "this_week";
  else if (q.includes("month")) filters.dateRange = "this_month";
  else if (q.includes("yesterday")) filters.dateRange = "yesterday"; // Note: we should handle yesterday in controller

  // Explicit tracking ID or receiver detection
  const trkMatch = q.match(/(trk|sh)[0-9a-z]+/i);
  if (trkMatch) {
    filters.search = trkMatch[0];
  } else {
    const receiverMatch = q.match(/receiver\s+([a-z0-9]+)/i);
    if (receiverMatch) {
      filters.search = receiverMatch[1];
    }
  }

  return filters;
};

const generateSearchFilters = async (query) => {
  if (!query) return { mode: "Local", filters: {} };

  // 1. Attempt Rule-Based Parsing First
  const localFilters = parseQueryLocally(query);
  
  // If local parser found meaningful specific filters, use them! (Hybrid Search)
  if (Object.keys(localFilters).length > 0) {
    // Check if it's just a raw text search without status/condition/date
    if (Object.keys(localFilters).length === 1 && localFilters.search) {
       // Just a normal text search, fine to return locally
       return { mode: "Local", filters: localFilters };
    }
    return { mode: "Local", filters: localFilters };
  }

  // 2. If it's a complex query (no rules matched) and Gemini exists, use Gemini
  if (!model) {
    return { mode: "Demo Mode", filters: { search: query } };
  }

  try {
    const prompt = `
You are a Natural Language to SQL/Filter AI for a Delivery Management System.
Given the user's natural language search query, convert it into a set of filter parameters in JSON format.

The possible filters are:
- status (String: 'Pending', 'In Transit', 'Delivered', 'Cancelled')
- condition_status (String: 'Good', 'Damaged', 'Lost')
- dateRange (String: 'today', 'this_week', 'this_month')
- search (String: name of person, tracking ID, or general keyword)

Query: "${query}"

You MUST return a valid JSON object matching the exact structure below. Do not use markdown wrappers. Return RAW JSON only. Omit properties that do not apply.

{
  "status": "Pending | In Transit | Delivered | Cancelled",
  "condition_status": "Good | Damaged | Lost",
  "dateRange": "today | this_week | this_month",
  "search": "keyword"
}
`;

    const result = await model.generateContent(prompt);
    let rawText = result.response.text().trim();
    
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      rawText = jsonMatch[0];
    }

    return { mode: "Live AI", filters: JSON.parse(rawText) };
  } catch (error) {
    console.error("Gemini Search Error:", error.message || error);
    
    // Fallback to basic search if Gemini rate limits
    return { mode: "Demo Mode", filters: { search: query } };
  }
};

module.exports = {
  generateInsights,
  generateSearchFilters
};
