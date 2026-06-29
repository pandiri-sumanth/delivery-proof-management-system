import { useContext } from "react";
import { CSVLink } from "react-csv";
import { FaFilePdf, FaFileCsv, FaSearch } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";

function DeliveryToolbar({
  search,
  setSearch,
  darkMode,
  onExportPDF,
  csvData
}) {

  const { hasRole } = useContext(AuthContext);

  const btnBase =
    "inline-flex items-center gap-2 h-10 px-4 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg";

  const inputBase =
    `flex items-center h-10 gap-2 px-4 rounded-xl border text-sm transition-all duration-200 ${
      darkMode
        ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus-within:border-blue-500"
        : "bg-white border-gray-200 text-gray-800 placeholder-gray-400 focus-within:border-blue-400"
    }`;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

      <h2 className="text-2xl font-bold tracking-tight">
        Delivery Records
      </h2>

      <div className="flex flex-wrap items-center gap-3">

        {hasRole(["Admin", "Operations Staff", "Logistics Manager"]) && (
          <>
            <button
              onClick={onExportPDF}
              className={`${btnBase} bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700`}
            >
              <FaFilePdf size={14} />
              Export PDF
            </button>

            <CSVLink
              data={csvData}
              filename="delivery-records.csv"
              className={`${btnBase} bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700`}
            >
              <FaFileCsv size={14} />
              Export CSV
            </CSVLink>
          </>
        )}

        <div className={inputBase} style={{ width: "300px" }}>
          <FaSearch size={13} className="shrink-0 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ID or receiver..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none min-w-0"
          />
        </div>

      </div>

    </div>
  );

}

export default DeliveryToolbar;