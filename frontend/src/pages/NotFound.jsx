import { Link } from "react-router-dom";
import { FaMapSigns } from "react-icons/fa";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white p-4">
      <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800 text-slate-500 rounded-full flex items-center justify-center mb-6">
        <FaMapSigns size={32} />
      </div>
      <h1 className="text-4xl font-black mb-2">404 Not Found</h1>
      <p className="text-slate-500 mb-8 text-center max-w-md">
        The page you are looking for doesn't exist or has been moved.
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

export default NotFound;
