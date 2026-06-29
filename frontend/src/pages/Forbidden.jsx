import { Link } from "react-router-dom";
import { FaLock } from "react-icons/fa";

function Forbidden() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white p-4">
      <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-6">
        <FaLock size={32} />
      </div>
      <h1 className="text-4xl font-black mb-2">403 Forbidden</h1>
      <p className="text-slate-500 mb-8 text-center max-w-md">
        You do not have permission to access this page. Please contact your administrator if you believe this is a mistake.
      </p>
      <Link
        to="/dashboard"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}

export default Forbidden;
