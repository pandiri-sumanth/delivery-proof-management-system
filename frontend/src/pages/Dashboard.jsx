import { useEffect, useState } from "react";
import API from "../services/api";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import {
  FaBox,
  FaCheckCircle,
  FaExclamationTriangle,
  FaChartPie
} from "react-icons/fa";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function Dashboard() {

  const { darkMode } =
  useContext(ThemeContext);

  const [stats, setStats] = useState({
    total: 0,
    delivered: 0,
    damaged: 0
  });

  const [recentDeliveries, setRecentDeliveries] = useState([]);
  const [activities, setActivities] =
    useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      await Promise.all([fetchStats(), fetchRecentDeliveries()]);
    };

    loadDashboard();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await API.get("/delivery/stats");
      setStats(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRecentDeliveries = async () => {
    try {
      const response = await API.get("/delivery/all");

      setRecentDeliveries(response.data.slice(0, 5));
      setActivities(response.data.slice(0, 5));
    } catch (error) {
      console.error(error);
    }
  };

  const cardClass =
    "p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300";

  const panelClass = darkMode
    ? "bg-gray-800 text-white"
    : "bg-white text-black";

  const Panel = ({ title, children }) => (
    <div className={`rounded-3xl shadow-xl p-8 hover:shadow-2xl transition ${panelClass}`}>
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      {children}
    </div>
  );

  const successRate =
    stats.total > 0
      ? (
          (stats.delivered /
            stats.total) *
          100
        ).toFixed(1)
      : 0;

  const chartData = [
    {
      name: "Delivered",
      count: stats.delivered
    },
    {
      name: "Damaged",
      count: stats.damaged
    }
  ];

  return (
    <div>

      <h1 className="text-5xl font-black tracking-tight mb-2">
        Dashboard
      </h1>

      <p className={`text-lg mb-6 ${
          darkMode
            ? "text-gray-400"
            : "text-gray-500"
        }`}
      >
        Monitor deliveries, proofs, and logistics performance.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

        <div className={`relative overflow-hidden rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ${panelClass}`}>

          <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mb-5">
            <FaBox className="text-blue-600 text-2xl" />
          </div>

          <h2 className="text-lg font-semibold">
            Total Deliveries
          </h2>

          <p className="text-5xl font-extrabold text-blue-600 mt-4">
            {stats.total}
          </p>

          <p className="text-xs text-gray-400 mt-2">
            Updated from latest records
          </p>

        </div>

        <div className={`relative overflow-hidden rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ${panelClass}`}>

          <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mb-5">
            <FaCheckCircle className="text-green-600 text-2xl" />
          </div>

          <h2 className="text-lg font-semibold">
            Delivered
          </h2>

          <p className="text-5xl font-extrabold text-green-600 mt-4">
            {stats.delivered}
          </p>

          <p className="text-xs text-gray-400 mt-2">
            Updated from latest records
          </p>

        </div>

        <div className={`relative overflow-hidden rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ${panelClass}`}>

          <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mb-5">
            <FaExclamationTriangle className="text-red-600 text-2xl" />
          </div>

          <h2 className="text-lg font-semibold">
            Damaged
          </h2>

          <p className="text-5xl font-extrabold text-red-600 mt-4">
            {stats.damaged}
          </p>

          <p className="text-xs text-gray-400 mt-2">
            Updated from latest records
          </p>

        </div>

        <div className={`relative overflow-hidden rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ${panelClass}`}>

          <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center mb-5">
            <FaChartPie className="text-purple-600 text-2xl" />
          </div>

          <h2 className="text-lg font-semibold">
            Success Rate
          </h2>

          <p className="text-5xl font-extrabold text-purple-600 mt-4">
            {successRate}%
          </p>

          <p className="text-xs text-gray-400 mt-2">
            Updated from latest records
          </p>

        </div>

      </div>

      <div className={`mt-8 rounded-3xl shadow-xl p-8 ${panelClass}`}>

        <h2 className="text-2xl font-semibold mb-4">
          Delivery Status Chart
        </h2>

        <ResponsiveContainer
          width="100%"
          height={340}
        >

          <BarChart data={chartData}>

            <XAxis
              dataKey="name"
              stroke={
                darkMode
                  ? "#ffffff"
                  : "#000000"
              }
            />

            <YAxis
              stroke={
                darkMode
                  ? "#ffffff"
                  : "#000000"
              }
            />

            <Tooltip
              contentStyle={{
                backgroundColor: darkMode
                  ? "#1f2937"
                  : "#ffffff",
                border: "none",
                borderRadius: "8px",
                color: darkMode
                  ? "#ffffff"
                  : "#000000"
              }}
           />

            <Bar
              dataKey="count"
              radius={[12, 12, 0, 0]}
              fill="#2563eb"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

      <div className="grid xl:grid-cols-2 gap-8 mt-8">

        <Panel title="Recent Deliveries">

          {recentDeliveries.length > 0 ? (

            <div className="space-y-3">

              {recentDeliveries.map(
                (delivery) => (

                  <div
                    key={delivery.id}
                    className={`flex justify-between items-center py-4 border-b ${
                      darkMode
                        ? "border-gray-700"
                        : "border-gray-200"
                    }`}
                  >

                    <div>
                      <p className="font-bold">
                        {delivery.tracking_id}
                      </p>
                      <p className="text-sm text-gray-500">
                        {delivery.receiver_name}
                      </p>
                    </div>

                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      delivery.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : delivery.status === "In Transit"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {delivery.status}
                    </span>

                  </div>

                )
              )}

            </div>

          ) : (

            <p>
              No deliveries found
            </p>

          )}

        </Panel>

        <Panel title="Recent Activity">

          {activities.length > 0 ? (

            <div className="space-y-3">

              {activities.map(
                (item) => (

                  <div
                    key={item.id}
                    className={`border-b pb-2 ${
                      darkMode
                        ? "border-gray-700"
                        : "border-gray-200"
                    }`}
                  >

                    <div className="flex items-start gap-3">
                      {item.condition_status === "Damaged"
                        ? `⚠️ ${item.tracking_id} marked as damaged`
                        : item.status === "Delivered"
                        ? `✅ ${item.tracking_id} delivered successfully`
                        : item.status === "In Transit"
                        ? `🚚 ${item.tracking_id} is in transit`
                        : `❌ ${item.tracking_id} delivery failed`}
                    </div>

                  </div>

                )
              )}

            </div>

          ) : (

            <p>
              No recent activity
            </p>

          )}

        </Panel>

      </div>

    </div>
  );
}

export default Dashboard;