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
    <div className={`${cardClass} ${panelClass}`}>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
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

      <h1 className="text-4xl font-bold mb-2">
        Dashboard
      </h1>

      <p
        className={`mb-6 ${
          darkMode
            ? "text-gray-400"
            : "text-gray-500"
        }`}
      >
        Monitor deliveries, proofs, and logistics performance.
      </p>

      <div className="grid md:grid-cols-4 gap-6">

        <div className={`${cardClass} border-l-4 border-blue-500 ${panelClass}`}>

          <FaBox className="text-3xl text-blue-500 mb-3"/>

          <h2 className="text-lg font-semibold">
            Total Deliveries
          </h2>

          <p className="text-4xl font-bold text-blue-600 mt-2">
            {stats.total}
          </p>

          <p className="text-xs text-gray-400 mt-2">
            Updated from latest records
          </p>

        </div>

        <div className={`${cardClass} border-l-4 border-green-500 ${panelClass}`}>

          <FaCheckCircle
            className="text-3xl text-green-500 mb-3"
          />

          <h2 className="text-lg font-semibold">
            Delivered
          </h2>

          <p className="text-4xl font-bold text-green-600 mt-2">
            {stats.delivered}
          </p>

          <p className="text-xs text-gray-400 mt-2">
            Updated from latest records
          </p>

        </div>

        <div className={`${cardClass} border-l-4 border-red-500 ${panelClass}`}>

          <FaExclamationTriangle
            className="text-3xl text-red-500 mb-3"
          />

          <h2 className="text-lg font-semibold">
            Damaged
          </h2>

          <p className="text-4xl font-bold text-red-600 mt-2">
            {stats.damaged}
          </p>

          <p className="text-xs text-gray-400 mt-2">
            Updated from latest records
          </p>

        </div>

        <div className={`${cardClass} border-l-4 border-purple-500 ${panelClass}`}>

          <FaChartPie
            className="text-3xl text-purple-500 mb-3"
          />

          <h2 className="text-lg font-semibold">
            Success Rate
          </h2>

          <p className="text-4xl font-bold text-purple-600 mt-2">
            {successRate}%
          </p>

          <p className="text-xs text-gray-400 mt-2">
            Updated from latest records
          </p>

        </div>

      </div>

      <div className={`${cardClass} ${panelClass}`}>

        <h2 className="text-2xl font-semibold mb-4">
          Delivery Status Chart
        </h2>

        <ResponsiveContainer
          width="100%"
          height={220}
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
              fill="#2563eb"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">

        <Panel title="Recent Deliveries">

          {recentDeliveries.length > 0 ? (

            <div className="space-y-3">

              {recentDeliveries.map(
                (delivery) => (

                  <div
                    key={delivery.id}
                    className={`border-b pb-2 ${
                      darkMode
                        ? "border-gray-700"
                        : "border-gray-200"
                    }`}
                  >

                    <p className="font-semibold">
                      {delivery.tracking_id}
                    </p>

                    <p>
                      {delivery.receiver_name}
                    </p>

                    <p className={
                         darkMode
                           ? "text-gray-300"
                           : "text-gray-600"
                       }>
                      {delivery.status}
                    </p>

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

                    <p>
                      {item.condition_status === "Damaged"
                        ? `⚠️ ${item.tracking_id} marked as damaged`
                        : item.status === "Delivered"
                        ? `✅ ${item.tracking_id} delivered successfully`
                        : item.status === "In Transit"
                        ? `🚚 ${item.tracking_id} is in transit`
                        : `❌ ${item.tracking_id} delivery failed`}
                    </p>

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