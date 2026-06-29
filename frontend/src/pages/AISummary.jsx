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
  const [aiMode, setAiMode] = useState("");
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
      setAiMode(response.data.mode || "");
    } catch (error) {
      console.error(error);
      setAiInsight(null);
      setAiMode("🔴 Connection Failed");
    } finally {
      setLoading(false);
    }
  };

  const healthScore = aiInsight?.scores?.healthScore || Math.max(0, 100 - (stats.total > 0 ? (stats.damaged / stats.total) * 100 * 2 : 0)).toFixed(0);
  const successRate = aiInsight?.scores?.successScore || (stats.total > 0 ? ((stats.delivered / stats.total) * 100).toFixed(1) : 0);
  const riskLevel = aiInsight?.scores?.riskLevel || "Unknown";
  
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
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black tracking-tight">AI Summary</h1>
            {aiMode && (
              <span 
                className={`px-3 py-1 rounded-full text-xs font-bold border shadow-sm flex items-center gap-1.5 cursor-default
                  ${aiMode.includes("Connected") || aiMode.includes("Live") ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" : 
                    aiMode.includes("Demo") ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20" : 
                    "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20"}`}
                title={aiMode.includes("Demo") ? "Live AI is unavailable. Using built-in analytics." : ""}
              >
                {aiMode.includes("Connected") || aiMode.includes("Live") ? "🟢" : aiMode.includes("Demo") ? "🟡" : "🔴"} {aiMode.replace(/[🟢🟡🔴]/g, '').trim()}
              </span>
            )}
          </div>
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
              <span className="text-xl font-black mt-1">{riskLevel}</span>
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
                <h2 className="text-lg font-bold">Enterprise AI Analysis</h2>
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
            <div className="p-6 md:p-8 flex-1 overflow-y-auto">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-60 py-10">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-700" />
                    <div className="absolute inset-0 rounded-full border-4 border-pink-500 border-t-transparent animate-spin" />
                  </div>
                  <p className="text-sm font-semibold text-slate-500 animate-pulse">Gemini is analyzing logistics data...</p>
                </div>
              ) : aiInsight && typeof aiInsight === 'object' && aiInsight.analysis ? (
                <div className="space-y-8">
                  
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2 border-b border-white/5 pb-2">Performance Summary</h3>
                    <p className="text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                      {aiInsight.analysis.performanceSummary}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2 border-b border-white/5 pb-2">Operational Insights</h3>
                      <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                        {aiInsight.analysis.operationalInsights}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2 border-b border-white/5 pb-2">Damage Analysis</h3>
                      <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                        {aiInsight.analysis.damageAnalysis}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-pink-500 mb-3">Key Recommendations</h3>
                    <ul className="space-y-2">
                      {aiInsight.analysis.recommendations?.map((rec, idx) => (
                        <li key={idx} className="flex gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                          <span className="text-pink-500 font-black">•</span> {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-blue-500 mb-3">Next Steps</h3>
                    <ul className="space-y-2">
                      {aiInsight.analysis.nextSteps?.map((step, idx) => (
                        <li key={idx} className="flex gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                          <span className="text-blue-500 font-black">•</span> {step}
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              ) : (
                <div className="text-center text-slate-500 py-10">
                  <FaExclamationTriangle size={30} className="mx-auto mb-3 opacity-50" />
                  <p>AI Insights are temporarily unavailable.</p>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default AISummary;