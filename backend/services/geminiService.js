const {
  GoogleGenerativeAI
} = require("@google/generative-ai");

const genAI =
  new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
  );

const model =
  genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
  });

const generateInsights = async (stats) => {
  if (
    !stats ||
    typeof stats.total !== "number" ||
    typeof stats.delivered !== "number" ||
    typeof stats.damaged !== "number"
  ) {
    return "Invalid delivery statistics.";
  }

  try {
    const prompt = `
You are an AI Logistics Analyst.

Analyze these delivery statistics.

Total Deliveries: ${stats.total}
Delivered: ${stats.delivered}
Damaged: ${stats.damaged}

Return only plain text.

Do not use markdown.
Do not use ** symbols.
Do not use headings (#).
Do not use markdown bullet points.

Write in simple professional English.

Use this exact format:

Performance Summary:
Explain the overall delivery performance.

Risk Assessment:
Explain the current risks.

Recommendations:
1.
2.
3.

Keep the response under 200 words.
`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI Insights are temporarily unavailable. Please try again later.";
  }
};

module.exports = {
  generateInsights
};