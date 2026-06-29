import { Link } from "react-router-dom";
import { FaPlusCircle, FaClipboardList } from "react-icons/fa";
import DeliveryTable from "../components/DeliveryTable";

function DeliveryRecords() {
  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <FaClipboardList size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Delivery Records</h1>
            <p className="text-sm text-slate-500 mt-0.5">View, search, edit and manage all records</p>
          </div>
        </div>

        <Link
          to="/add-delivery"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-blue-600/25 transition-all duration-200 hover:-translate-y-0.5"
        >
          <FaPlusCircle size={13} />
          Add Delivery
        </Link>
      </div>

      {/* Table card */}
      <DeliveryTable />

    </div>
  );
}

export default DeliveryRecords;