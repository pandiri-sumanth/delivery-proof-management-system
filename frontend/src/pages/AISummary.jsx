import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { ThemeContext } from "../context/ThemeContext";
import { FaRobot, FaHeartbeat, FaChartLine, FaShieldAlt, FaSyncAlt, FaInfoCircle, FaCheckCircle, FaExclamationTriangle, FaBox } from "react-icons/fa";

/* ── Circular Progress Ring ── */
function ProgressRing({ radius, stroke, progress, colorClass, label, value }) {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="-rotate-90">
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="text-gray-200 dark:text-slate-700/50"
        />
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transition: "stroke-dashoffset 1s ease-out" }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className={colorClass}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-black">{value}</span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">{label}</span>
      </div>
    </div>
  );
}

function AISummary() {
  const { darkMode } = useContext(ThemeContext);

  const [stats, setStats] = useState({ total: 0, delivered: 0, damaged: 0 });
  const [aiInsight, setAiInsight] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([fetchStats(), fetchAIInsights()]);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await API.get("/delivery/stats");
      setStats(response.data);
    } catch (error) { console.error(error); }
  };

  const fetchAIInsights = async () => {
    try {
      setLoading(true);
      const response = await API.get("/delivery/ai-insights");
      setAiInsight(response.data.insight);
    } catch (error) {
      console.error(error);
      setAiInsight("Unable to generate AI insights at this moment.");
    } finally {
      setLoading(false);
    }
  };

  const damageRate = stats.total > 0 ? ((stats.damaged / stats.total) * 100).toFixed(1) : 0;
  const successRate = stats.total > 0 ? ((stats.delivered / stats.total) * 100).toFixed(1) : 0;
  const healthScore = Math.max(0, 100 - Number(damageRate) * 2).toFixed(0);

  const riskLevel = damageRate < 5 ? "Low" : damageRate < 15 ? "Medium" : "High";
  
  const riskColor = riskLevel === "Low" ? "text-emerald-500" : riskLevel === "Medium" ? "text-amber-500" : "text-red-500";
  const healthColor = healthScore >= 80 ? "text-emerald-500" : healthScore >= 60 ? "text-amber-500" : "text-red-500";
  const successColor = "text-blue-500";

  const cardBase = `rounded-2xl border shadow-sm ${darkMode ? "bg-slate-800 text-white border-slate-700/60" : "bg-white text-slate-900 border-gray-100"}`;

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Page header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-pink-500 rounded-2xl blur-lg opacity-40" />
          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg">
            <FaRobot size={22} className="text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight">AI Summary</h1>
          <p className="text-sm text-slate-500 mt-0.5">Gemini-powered insights and logistics health analysis</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left Column: KPI Rings & Stats */}
        <div className="lg:col-span-1 space-y-6">
          
          <div className={`${cardBase} p-8 flex flex-col items-center justify-center`}>
            <ProgressRing radius={80} stroke={12} progress={healthScore} colorClass={healthColor} label="Health Score" value={healthScore} />
            <div className="mt-6 w-full flex items-center justify-between text-sm px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-700/30">
              <span className="font-semibold text-slate-500">System Status</span>
              <span className={`font-bold ${healthScore >= 80 ? "text-emerald-500" : healthScore >= 60 ? "text-amber-500" : "text-red-500"}`}>
                {healthScore >= 80 ? "Optimal" : healthScore >= 60 ? "Needs Monitoring" : "Critical"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className={`${cardBase} p-5 flex flex-col items-center text-center`}>
              <FaChartLine size={24} className={`mb-3 ${successColor}`} />
              <span className="text-2xl font-black">{successRate}%</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">Success</span>
            </div>
            <div className={`${cardBase} p-5 flex flex-col items-center text-center`}>
              <FaShieldAlt size={24} className={`mb-3 ${riskColor}`} />
              <span className="text-2xl font-black">{riskLevel}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">Risk Level</span>
            </div>
          </div>

          <div className={`${cardBase} p-6`}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm"><FaBox className="text-blue-500" /> Total</div>
                <span className="font-bold">{stats.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm"><FaCheckCircle className="text-emerald-500" /> Delivered</div>
                <span className="font-bold">{stats.delivered}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm"><FaExclamationTriangle className="text-red-500" /> Damaged</div>
                <span className="font-bold">{stats.damaged}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: AI Insights & Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className={`${cardBase} flex flex-col h-full`}>
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-700/60">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                  <FaRobot size={14} className="text-pink-600 dark:text-pink-400" />
                </div>
                <h2 className="text-lg font-bold">Gemini Analysis</h2>
              </div>
              <button
                onClick={fetchAIInsights}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
              >
                <FaSyncAlt className={loading ? "animate-spin" : ""} size={12} />
                {loading ? "Analyzing..." : "Refresh"}
              </button>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 flex-1">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-60">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-700" />
                    <div className="absolute inset-0 rounded-full border-4 border-pink-500 border-t-transparent animate-spin" />
                  </div>
                  <p className="text-sm font-semibold text-slate-500 animate-pulse">Gemini is analyzing logistics data...</p>
                </div>
              ) : (
                <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none prose-p:leading-relaxed prose-li:marker:text-pink-500">
                  {/* Basic markdown rendering via CSS classes + whitespace */}
                  <div className="whitespace-pre-wrap font-medium text-slate-700 dark:text-slate-300">
                    {aiInsight}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Recommendation Alert */}
          <div className={`p-5 rounded-2xl border-l-4 flex gap-4 ${
            damageRate > 10 
              ? "bg-red-50 dark:bg-red-900/10 border-red-500 text-red-900 dark:text-red-200"
              : damageRate > 5
              ? "bg-amber-50 dark:bg-amber-900/10 border-amber-500 text-amber-900 dark:text-amber-200"
              : "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-500 text-emerald-900 dark:text-emerald-200"
          }`}>
            <FaInfoCircle size={20} className="shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold mb-1">Actionable Recommendation</h4>
              <p className="text-sm opacity-90 leading-relaxed">
                {damageRate > 10
                  ? "High damage rate detected. Immediate review of packaging materials and transportation handling protocols is required."
                  : damageRate > 5
                  ? "Monitor shipment quality closely. Slight increase in damages could indicate early signs of handling issues."
                  : "Operations are stable and performing optimally. Continue maintaining current logistics standards."}
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

export default AISummary;