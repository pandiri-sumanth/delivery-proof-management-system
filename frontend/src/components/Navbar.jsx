import { FaBars, FaBell, FaSearch, FaUserCircle } from "react-icons/fa";

function Navbar({ darkMode, onMenuClick }) {
  return (
    <header
      className={`sticky top-0 z-30 flex items-center justify-between px-5 md:px-8 h-16 border-b transition-all duration-200
        ${darkMode
          ? "bg-slate-900/95 backdrop-blur-sm border-slate-700/60 shadow-lg shadow-black/20"
          : "bg-white/95 backdrop-blur-sm border-gray-100 shadow-sm"
        }`}
    >
      {/* Left — burger + title */}
      <div className="flex items-center gap-4">
        <button
          id="mobile-menu-btn"
          onClick={onMenuClick}
          aria-label="Open menu"
          className={`lg:hidden p-2 rounded-xl transition-colors ${darkMode ? "hover:bg-slate-700" : "hover:bg-gray-100"}`}
        >
          <FaBars size={18} />
        </button>

        <div>
          <h1 className={`text-base md:text-lg font-bold leading-tight tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
            Delivery Proof Management System
          </h1>
          <p className={`text-[11px] font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            Enterprise Logistics Dashboard
          </p>
        </div>
      </div>

      {/* Right — search + notifications + avatar */}
      <div className="hidden md:flex items-center gap-3">

        {/* Search */}
        <div className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-sm transition-all duration-200
          ${darkMode ? "bg-slate-800 border border-slate-700 text-slate-300" : "bg-slate-100 border border-transparent text-slate-500"}
          focus-within:ring-2 focus-within:ring-blue-500/40`}
        >
          <FaSearch size={12} className="shrink-0 opacity-60" />
          <input
            type="text"
            placeholder="Quick search..."
            aria-label="Quick search"
            className="bg-transparent outline-none w-36 text-sm placeholder-current"
          />
        </div>

        {/* Bell */}
        <button
          className={`relative p-2.5 rounded-xl transition-colors ${darkMode ? "bg-slate-800 hover:bg-slate-700 border border-slate-700" : "bg-slate-100 hover:bg-slate-200"}`}
          aria-label="Notifications"
        >
          <FaBell size={15} className={darkMode ? "text-slate-300" : "text-slate-600"} />
          {/* notification dot */}
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-white dark:ring-slate-800" />
        </button>

        {/* Avatar */}
        <div className={`flex items-center gap-3 px-3 py-1.5 rounded-xl cursor-pointer transition-colors
          ${darkMode ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}
        >
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
              <span className="text-white text-sm font-bold">A</span>
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white" />
          </div>

          <div className="hidden lg:block">
            <p className={`text-sm font-semibold leading-tight ${darkMode ? "text-white" : "text-slate-800"}`}>
              Admin User
            </p>
            <p className={`text-[11px] ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Logistics Manager
            </p>
          </div>
        </div>

      </div>
    </header>
  );
}

export default Navbar;