import {
  FaBars,
  FaBell,
  FaSearch,
  FaUserCircle
} from "react-icons/fa";

function Navbar({
  darkMode,
  onMenuClick
}) {
  return (
    <header
      className={`sticky top-0 z-30 flex items-center justify-between px-6 py-4 shadow-md ${
        darkMode
          ? "bg-gray-900 border-b border-gray-800"
          : "bg-white border-b border-gray-200"
      }`}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-2xl"
        >
          <FaBars />
        </button>

        <div>
          <h1 className="text-2xl font-bold">
            Delivery Proof Management System
          </h1>

          <p
            className={`text-sm ${
              darkMode
                ? "text-gray-400"
                : "text-gray-500"
            }`}
          >
            Smart Logistics Dashboard
          </p>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-3">

        <div
          className={`flex items-center px-4 py-2 rounded-xl ${
            darkMode
              ? "bg-gray-800"
              : "bg-gray-100"
          }`}
        >
          <FaSearch className="mr-2" />

          <input
            type="text"
            placeholder="Search..."
            className={`outline-none bg-transparent ${
              darkMode
                ? "text-white"
                : "text-black"
            }`}
          />
        </div>

        <button
          className={`p-3 rounded-xl ${
            darkMode
              ? "bg-gray-800"
              : "bg-gray-100"
          }`}
        >
          <FaBell />
        </button>

        <div className="flex items-center gap-3">

          <FaUserCircle
            size={40}
            className="text-blue-500"
          />

          <div>

            <p className="font-semibold">
              Admin User
            </p>

            <p className="text-xs text-gray-500">
              Logistics Manager
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}

export default Navbar;