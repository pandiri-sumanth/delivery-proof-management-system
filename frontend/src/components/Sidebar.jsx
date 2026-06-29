import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

import {
  FaChartLine,
  FaPlusCircle,
  FaBoxOpen,
  FaRobot,
  FaSignOutAlt,
  FaUserCircle,
  FaMoon,
  FaSun,
  FaTimes,
  FaBox
} from "react-icons/fa";

function Sidebar({ mobileOpen, setMobileOpen }) {

  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  const menuItems = [
    { path: "/dashboard",    icon: FaChartLine,  label: "Dashboard",        color: "from-blue-500 to-cyan-500" },
    { path: "/add-delivery", icon: FaPlusCircle, label: "Add Delivery",     color: "from-violet-500 to-purple-600" },
    { path: "/records",      icon: FaBoxOpen,    label: "Delivery Records",  color: "from-amber-500 to-orange-500" },
    { path: "/ai-summary",   icon: FaRobot,      label: "AI Summary",       color: "from-pink-500 to-rose-600" },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen w-72 z-50
          transform transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          bg-[#0d1117] border-r border-white/5
          flex flex-col select-none
        `}
      >
        {/* Subtle gradient glow at top */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-blue-600/10 to-transparent pointer-events-none" />

        {/* ── Logo ── */}
        <div className="relative px-6 pt-6 pb-5 border-b border-white/5">
          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 rounded-xl blur-md opacity-50" />
                <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <FaBox size={18} className="text-white" />
                </div>
              </div>

              <div>
                <h1 className="text-white text-xl font-black tracking-tight">DPMS</h1>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Delivery Proof Management</p>
              </div>
            </div>

            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white transition-colors"
            >
              <FaTimes size={18} />
            </button>

          </div>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">

          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 pb-2">
            Main Menu
          </p>

          {menuItems.map(({ path, icon: Icon, label, color }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `group relative flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-white/10 text-white shadow-md"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active left bar */}
                  {isActive && (
                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-gradient-to-b ${color}`} />
                  )}

                  {/* Icon bubble */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                    isActive
                      ? `bg-gradient-to-br ${color} shadow-lg`
                      : "bg-white/5 group-hover:bg-white/10"
                  }`}>
                    <Icon size={15} className={isActive ? "text-white" : "text-slate-400 group-hover:text-white"} />
                  </div>

                  <span className="text-sm font-semibold">{label}</span>

                  {/* Hover arrow */}
                  <svg
                    className={`ml-auto transition-all duration-200 ${
                      isActive ? "opacity-0" : "opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5"
                    }`}
                    width="14" height="14" fill="none" viewBox="0 0 24 24"
                  >
                    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
            </NavLink>
          ))}

        </nav>

        {/* ── Footer ── */}
        <div className="px-3 pb-5 space-y-3 border-t border-white/5 pt-4">

          {/* User card */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5">
            <div className="relative flex-shrink-0">
              <FaUserCircle size={36} className="text-slate-400" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0d1117]" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">Admin User</p>
              <p className="text-[11px] text-slate-400 truncate">Logistics Manager</p>
            </div>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 bg-white/5 hover:bg-white/10 hover:text-white transition-all duration-200"
          >
            {darkMode ? <FaSun size={14} /> : <FaMoon size={14} />}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl text-sm font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200"
          >
            <FaSignOutAlt size={14} />
            Sign Out
          </button>

          <p className="text-center text-[10px] text-slate-600 pt-1">Version 2.0</p>

        </div>

      </aside>
    </>
  );

}

export default Sidebar;