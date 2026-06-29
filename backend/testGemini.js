require("dotenv").config();
const { generateInsights } = require("./services/geminiService");

(async () => {
  try {
    const stats = { total: 100, delivered: 90, damaged: 10 };
    const result = await generateInsights(stats);
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error(err);
  }
})();
