import { useState, useContext } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { ThemeContext } from "../context/ThemeContext";

function Layout() {
  const { darkMode } = useContext(ThemeContext);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className={`min-h-screen ${darkMode ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"}`}>

      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="lg:ml-72 flex flex-col min-h-screen">

        <Navbar darkMode={darkMode} onMenuClick={() => setMobileOpen(true)} />

        <main className="flex-1 overflow-y-auto p-5 md:p-8 animate-fade-in">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default Layout;