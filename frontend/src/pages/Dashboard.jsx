import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { ThemeContext } from "../context/ThemeContext";
import { Link } from "react-router-dom";

import {
  FaBox, FaCheckCircle, FaExclamationTriangle,
  FaChartPie, FaTruck, FaArrowUp, FaArrowRight
} from "react-icons/fa";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from "recharts";

/* ── KPI Card ── */
function KpiCard({ icon: Icon, label, value, sub, gradient, textColor, darkMode, delay = 0 }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-6 shadow-sm border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-fade-in ${
        darkMode ? "bg-slate-800 border-slate-700/60" : "bg-white border-gray-100"
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Background glow */}
      <div className={`absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-10 blur-2xl ${gradient}`} />

      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg ${gradient}`}>
        <Icon size={20} className="text-white" />
      </div>

      <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
        {label}
      </p>

      <p className={`text-4xl font-black ${textColor}`}>{value}</p>

      <div className="flex items-center gap-1.5 mt-2">
        <FaArrowUp size={10} className="text-emerald-500" />
        <span className="text-xs text-slate-500">{sub}</span>
      </div>
    </div>
  );
}

/* ── Custom Tooltip ── */
function CustomTooltip({ active, payload, label, darkMode }) {
  if (!active || !payload?.length) return null;
  return (
    <div className={`px-4 py-2.5 rounded-xl shadow-xl border text-sm font-semibold ${
      darkMode ? "bg-slate-800 border-slate-600 text-white" : "bg-white border-gray-100 text-slate-800"
    }`}>
      <p className="text-xs text-slate-400 mb-0.5">{label}</p>
      <p>{payload[0].value} deliveries</p>
    </div>
  );
}

/* ── Status badge ── */
function StatusPill({ status }) {
  const map = {
    Delivered:     "bg-emerald-50 text-emerald-700 border-emerald-200",
    "In Transit":  "bg-amber-50   text-amber-700   border-amber-200",
    "Not Delivered": "bg-red-50   text-red-700     border-red-200",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${map[status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        status === "Delivered" ? "bg-emerald-500" : status === "In Transit" ? "bg-amber-500" : "bg-red-500"
      }`} />
      {status}
    </span>
  );
}

const BAR_COLORS = ["#2563eb", "#dc2626", "#f59e0b", "#10b981"];

function Dashboard() {
  const { darkMode } = useContext(ThemeContext);

  const [stats, setStats] = useState({ total: 0, delivered: 0, damaged: 0 });
  const [recentDeliveries, setRecentDeliveries] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    Promise.all([fetchStats(), fetchRecentDeliveries()]);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await API.get("/delivery/stats");
      setStats(response.data);
    } catch (error) { console.error(error); }
  };

  const fetchRecentDeliveries = async () => {
    try {
      const response = await API.get("/delivery/all");
      setRecentDeliveries(response.data.slice(0, 5));
      setActivities(response.data.slice(0, 5));
    } catch (error) { console.error(error); }
  };

  const successRate = stats.total > 0 ? ((stats.delivered / stats.total) * 100).toFixed(1) : 0;

  const chartData = [
    { name: "Delivered",     count: stats.delivered },
    { name: "Damaged",       count: stats.damaged   },
    { name: "Not Delivered", count: Math.max(0, stats.total - stats.delivered - stats.damaged) },
  ];

  const card = darkMode ? "bg-slate-800 border-slate-700/60" : "bg-white border-gray-100";

  return (
    <div className="space-y-8 stagger-children">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-black tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
            Dashboard
          </h1>
          <p className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            Real-time overview of logistics performance
          </p>
        </div>

        <Link
          to="/add-delivery"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-200"
        >
          <FaBox size={13} />
          New Delivery
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 stagger-children">
        <KpiCard icon={FaBox}                label="Total Deliveries" value={stats.total}     gradient="bg-gradient-to-br from-blue-500 to-blue-700"    textColor="text-blue-600"   sub="All time records"       darkMode={darkMode} delay={0} />
        <KpiCard icon={FaCheckCircle}        label="Delivered"        value={stats.delivered}  gradient="bg-gradient-to-br from-emerald-500 to-green-700"  textColor="text-emerald-600" sub="Successfully completed" darkMode={darkMode} delay={60} />
        <KpiCard icon={FaExclamationTriangle} label="Damaged"         value={stats.damaged}    gradient="bg-gradient-to-br from-red-500 to-rose-700"       textColor="text-red-600"    sub="Requires attention"     darkMode={darkMode} delay={120} />
        <KpiCard icon={FaChartPie}           label="Success Rate"     value={`${successRate}%`} gradient="bg-gradient-to-br from-violet-500 to-purple-700"  textColor="text-violet-600" sub="Delivery success ratio"  darkMode={darkMode} delay={180} />
      </div>

      {/* Chart */}
      <div className={`rounded-2xl border p-6 shadow-sm ${card}`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className={`text-lg font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>
              Delivery Status Overview
            </h2>
            <p className={`text-xs mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Breakdown of all delivery outcomes
            </p>
          </div>
          <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${darkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>
            Total: {stats.total}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} barSize={48}>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: darkMode ? "#94a3b8" : "#64748b", fontWeight: 600 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: darkMode ? "#94a3b8" : "#64748b" }}
            />
            <Tooltip
              content={<CustomTooltip darkMode={darkMode} />}
              cursor={{ fill: darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", radius: 8 }}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={BAR_COLORS[i]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom panels */}
      <div className="grid xl:grid-cols-2 gap-6">

        {/* Recent Deliveries */}
        <div className={`rounded-2xl border p-6 shadow-sm ${card}`}>
          <div className="flex items-center justify-between mb-5">
            <h2 className={`text-lg font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>
              Recent Deliveries
            </h2>
            <Link to="/records" className="flex items-center gap-1 text-blue-500 hover:text-blue-400 text-xs font-semibold transition-colors">
              View all <FaArrowRight size={10} />
            </Link>
          </div>

          {recentDeliveries.length > 0 ? (
            <div className="space-y-2">
              {recentDeliveries.map((d) => (
                <div
                  key={d.id}
                  className={`flex items-center justify-between p-3 rounded-xl transition-colors ${darkMode ? "hover:bg-slate-700/60" : "hover:bg-slate-50"}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                      <FaTruck size={13} className="text-white" />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold leading-tight ${darkMode ? "text-white" : "text-slate-800"}`}>
                        {d.tracking_id}
                      </p>
                      <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                        {d.receiver_name}
                      </p>
                    </div>
                  </div>
                  <StatusPill status={d.status} />
                </div>
              ))}
            </div>
          ) : (
            <p className={`text-sm text-center py-8 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
              No deliveries found
            </p>
          )}
        </div>

        {/* Recent Activity */}
        <div className={`rounded-2xl border p-6 shadow-sm ${card}`}>
          <h2 className={`text-lg font-bold mb-5 ${darkMode ? "text-white" : "text-slate-800"}`}>
            Recent Activity
          </h2>

          {activities.length > 0 ? (
            <div className="space-y-1">
              {activities.map((item, i) => {
                const isDamaged  = item.condition_status === "Damaged";
                const isDelivered = item.status === "Delivered";
                const isTransit  = item.status === "In Transit";

                const dot     = isDamaged ? "bg-red-500" : isDelivered ? "bg-emerald-500" : isTransit ? "bg-amber-500" : "bg-gray-400";
                const message = isDamaged
                  ? `${item.tracking_id} marked as damaged`
                  : isDelivered
                  ? `${item.tracking_id} delivered successfully`
                  : isTransit
                  ? `${item.tracking_id} is in transit`
                  : `${item.tracking_id} delivery failed`;

                return (
                  <div key={item.id} className="flex gap-3 group">
                    {/* Timeline line */}
                    <div className="flex flex-col items-center">
                      <div className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${dot}`} />
                      {i < activities.length - 1 && (
                        <div className={`w-px flex-1 mt-1 ${darkMode ? "bg-slate-700" : "bg-gray-100"}`} />
                      )}
                    </div>
                    <div className={`pb-4 flex-1 min-w-0`}>
                      <p className={`text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                        {message}
                      </p>
                      <p className={`text-xs mt-0.5 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                        Receiver: {item.receiver_name}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className={`text-sm text-center py-8 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
              No recent activity
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;