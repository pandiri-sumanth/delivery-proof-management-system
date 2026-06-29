import { useState, useContext } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

import { ThemeContext } from "../context/ThemeContext";

function Layout() {

  const { darkMode } =
    useContext(ThemeContext);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  return (

    <div
      className={`min-h-screen ${
        darkMode
          ? "bg-slate-900 text-white"
          : "bg-slate-100 text-black"
      }`}
    >

      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="lg:ml-72">

        <Navbar
          darkMode={darkMode}
          onMenuClick={() =>
            setMobileOpen(true)
          }
        />

        <main
          className="
            h-[calc(100vh-80px)]
            overflow-y-auto
            p-4
            md:p-8
          "
        >

          <Outlet />

        </main>

      </div>

    </div>

  );

}

export default Layout;