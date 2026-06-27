import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

import {
  FaChartLine,
  FaPlusCircle,
  FaBoxOpen,
  FaRobot,
  FaSignOutAlt,
  FaUserCircle
} from "react-icons/fa";

function Sidebar() {

  const navigate = useNavigate();

  const {
    darkMode,
    toggleTheme
  } = useContext(ThemeContext);

  const navLinkClass = ({ isActive }) =>
    `block px-4 py-3 rounded-lg transition ${
      isActive
        ? "bg-blue-600"
        : "hover:bg-blue-600 hover:translate-x-1"
    }`;

  const menuItems = [
    {
      path: "/dashboard",
      icon: FaChartLine,
      label: "Dashboard"
    },
    {
      path: "/add-delivery",
      icon: FaPlusCircle,
      label: "Add Delivery"
    },
    {
      path: "/records",
      icon: FaBoxOpen,
      label: "Delivery Records"
    },
    {
      path: "/ai-summary",
      icon: FaRobot,
      label: "AI Summary"
    }
  ];

  const handleLogout = () => {

    sessionStorage.removeItem(
      "isLoggedIn"
    );

    navigate("/");

  };

  return (

    <div
      className={`w-64 h-screen p-5 flex flex-col transition-all ${
        darkMode
          ? "bg-black text-white"
          : "bg-gray-900 text-white"
      }`}
    >

      <div className="mb-10">

       <h2 className="text-3xl font-extrabold text-blue-400">
         DPMS
       </h2>

        <p className="text-sm text-gray-400">
         Delivery Proof System
       </p>

      </div>

      <div className="space-y-3">
        {menuItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={navLinkClass}
          >
            <div className="flex items-center gap-3">
              <Icon />
              {label}
            </div>
          </NavLink>
        ))}
      </div>

      
      <div className="border-t border-gray-700 pt-4 mb-4">
        <div className="flex items-center gap-3">
          <FaUserCircle
            size={40}
            className="text-gray-300"
          />
          <div>
            <p className="font-semibold">
              Admin User
            </p>
            <p className="text-xs text-gray-400">
              Logistics Manager
            </p>
          </div>
        </div>
      </div>

      <div className="mt-auto space-y-3">

        <button
          onClick={toggleTheme}
          title="Toggle Theme"
          className="w-full bg-indigo-600 py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          {darkMode
            ? "☀️ Light Mode"
            : "🌙 Dark Mode"}
        </button>

        <button
          onClick={handleLogout}
          title="Logout"
          className="w-full bg-red-600 py-3 rounded-lg hover:bg-red-700 transition"
        >
          <div className="flex items-center justify-center gap-2">
            <FaSignOutAlt />
             Logout
          </div>
        </button>

      </div>

    </div>

  );
}

export default Sidebar;