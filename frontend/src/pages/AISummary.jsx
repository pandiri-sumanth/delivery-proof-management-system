import { useEffect, useState } from "react";
import API from "../services/api";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

function AISummary() {

  const { darkMode } =
  useContext(ThemeContext);

  const [stats, setStats] = useState({
    total: 0,
    delivered: 0,
    damaged: 0
  });

  const [aiInsight, setAiInsight] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchStats(), fetchAIInsights()]);
    };

    loadData();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await API.get("/delivery/stats");
      setStats(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAIInsights = async () => {
    try {
      setLoading(true);
      const response = await API.get("/delivery/ai-insights");
      setAiInsight(response.data.insight);
    } catch (error) {
      console.error(error);
      setAiInsight("Unable to generate AI insights.");
    } finally {
      setLoading(false);
    }
  };

  const damageRate =
    stats.total > 0
      ? ((stats.damaged / stats.total) * 100).toFixed(1)
      : 0;

  const successRate =
    stats.total > 0
      ? (
          (stats.delivered /
            stats.total) *
          100
        ).toFixed(1)
      : 0;

  const healthScore =
    Math.max(
      0,
      100 -
        Number(damageRate) * 2
    ).toFixed(0);

  const riskLevel =
    damageRate < 5
      ? "Low"
      : damageRate < 15
      ? "Medium"
      : "High";

  return (
    <div>

      <h1 className="text-4xl font-bold mb-8">
        AI Summary
      </h1>

      <div
        className={`p-8 rounded-xl shadow ${
          darkMode
            ? "bg-gray-800 text-white"
            : "bg-white text-black"
       }`}
     >

        <h2 className="text-2xl font-bold mb-6">
          Delivery Insights
        </h2>

        <div className="grid md:grid-cols-3 gap-4 mb-8">

          <div
            className={`p-5 rounded-xl ${
              darkMode
                ? "bg-gray-700"
                : "bg-blue-50"
            }`}
          >
            <p className="text-sm text-gray-500">
              AI Health Score
            </p>

            <h3 className="text-3xl font-bold text-blue-600">
              {healthScore}
            </h3>
          </div>

          <div
            className={`p-5 rounded-xl ${
              darkMode
                ? "bg-gray-700"
                : "bg-green-50"
            }`}
          >
            <p className="text-sm text-gray-500">
              Success Rate
            </p>

            <h3 className="text-3xl font-bold text-green-600">
              {successRate}%
            </h3>
          </div>

          <div
            className={`p-5 rounded-xl ${
              darkMode
                ? "bg-gray-700"
                : "bg-red-50"
            }`}
          >
            <p className="text-sm text-gray-500">
              Risk Level
            </p>

            <h3 className="text-3xl font-bold text-red-600">
              {riskLevel}
            </h3>
          </div>

        </div>

        <div
          className={`p-5 rounded-xl mb-8 ${
            darkMode
              ? "bg-gray-700"
              : "bg-white"
          }`}
        >

          <div className="flex justify-between mb-2">

            <span>
              Logistics Health
            </span>

            <span>
              {healthScore}%
            </span>

          </div>

          <div className="w-full bg-gray-300 rounded-full h-4">

            <div
              className={`h-4 rounded-full transition-all duration-700 ${
                healthScore >= 80
                  ? "bg-green-500"
                  : healthScore >= 60
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
              style={{
                width: `${healthScore}%`
              }}
            />

          </div>

        </div>

        <div className="space-y-4">

          <p>
            📦 Total Deliveries:
            <span className="font-bold ml-2">
              {stats.total}
            </span>
          </p>

          <p>
            ✅ Delivered:
            <span className="font-bold ml-2 text-green-600">
              {stats.delivered}
            </span>
          </p>

          <p>
            ❌ Damaged:
            <span className="font-bold ml-2 text-red-600">
              {stats.damaged}
            </span>
          </p>

          <p>
            📊 Damage Rate:
            <span className="font-bold ml-2">
              {damageRate}%
            </span>
          </p>

          <p>
            🚀 Success Rate:
            <span className="font-bold ml-2 text-purple-600">
              {successRate}%
            </span>
          </p>

        </div>

        <div
          className={`mt-8 p-4 rounded-lg ${
            darkMode
              ? "bg-gray-700"
              : "bg-blue-50"
         }`}
        >


          <h3 className="font-bold text-lg mb-4">
            AI Analysis
          </h3>

          <button
            type="button"
            onClick={fetchAIInsights}
            disabled={loading}
            className={`mb-4 bg-blue-600 text-white px-4 py-2 rounded-lg transition ${
              loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700"
            }`}
          >
            {loading ? "Generating..." : "🔄 Refresh AI Insights"}
          </button>


          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
              healthScore >= 80
                ? "bg-green-500 text-white"
                : healthScore >= 60
                ? "bg-yellow-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {healthScore >= 80
              ? "Healthy System"
              : healthScore >= 60
              ? "Monitor Closely"
              : "Critical Attention"}
          </span>

          {loading ? (
            <p className="animate-pulse">
              🤖 Generating AI Insights...
            </p>
          ) : (
            <div
              className={`whitespace-pre-line leading-7 ${
                darkMode
                  ? "text-gray-300"
                  : "text-gray-700"
              }`}
            >
              {aiInsight}
            </div>
          )}

        </div>

        <div
          className={`mt-6 p-5 rounded-xl ${
            darkMode
              ? "bg-gray-700"
              : "bg-purple-50"
          }`}
        >

          <h3 className="font-bold text-lg mb-3">
            AI Recommendation
          </h3>

          <p>

            {damageRate > 10
              ? "High damage rate detected. Review packaging process and transportation handling."
              : damageRate > 5
              ? "Monitor shipment quality closely to avoid future losses."
              : "Operations are stable. Continue maintaining current logistics standards."}

          </p>

        </div>


      </div>

    </div>
  );
}

export default AISummary;