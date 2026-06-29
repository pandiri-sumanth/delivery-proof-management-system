import { Link } from "react-router-dom";
import { FaPlusCircle, FaClipboardList } from "react-icons/fa";
import DeliveryTable from "../components/DeliveryTable";

function DeliveryRecords() {
  return (
    <div className="space-y-10">

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

        <div>

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white">

              <FaClipboardList size={22} />

            </div>

            <div>

              <h1 className="text-4xl font-black tracking-tight">
                Delivery Records
              </h1>

              <p className="text-gray-500 dark:text-gray-400 mt-1">
                View, search, edit and manage all delivery records.
              </p>

            </div>

          </div>

        </div>

        <Link
          to="/add-delivery"
          className="inline-flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1"
        >

          <FaPlusCircle />

          Add Delivery

        </Link>

      </div>

      <div>

        <DeliveryTable />

      </div>

    </div>
  );
}

export default DeliveryRecords;