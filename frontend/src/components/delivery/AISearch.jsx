import { useState } from "react";
import { FaRobot, FaSearch, FaTimes, FaSpinner } from "react-icons/fa";
import API from "../../services/api";
import { toast } from "react-toastify";

function AISearch({ onSearchResults, onClearSearch, darkMode }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await API.post("/delivery/ai-search", { query });
      setActiveFilters(response.data.filters);
      onSearchResults(response.data.results);
      toast.success("AI Search applied successfully!");
    } catch (error) {
      console.error("AI Search Error:", error);
      toast.error("Failed to process AI search query.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setActiveFilters(null);
    onClearSearch();
  };

  return (
    <div className={`w-full p-4 rounded-xl border mb-6 transition-colors ${darkMode ? "bg-slate-800 border-slate-700/60" : "bg-pink-50/50 border-pink-100"}`}>
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg">
            <FaRobot size={18} className="text-white" />
          </div>
          <div>
            <h3 className={`text-sm font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>AI Natural Search</h3>
            <p className={`text-[11px] font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}>"Show damaged deliveries today"</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2 relative">
          <div className="relative flex-1">
            <FaSearch className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? "text-slate-400" : "text-slate-400"}`} size={14} />
            <input
              type="text"
              placeholder="Ask AI to filter records..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={`w-full pl-10 pr-10 py-2.5 rounded-lg text-sm border focus:ring-2 focus:ring-pink-500/50 outline-none transition-colors
                ${darkMode 
                  ? "bg-slate-900 border-slate-700 text-white placeholder-slate-500" 
                  : "bg-white border-slate-200 text-slate-800 placeholder-slate-400"}`}
            />
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500"
              >
                <FaTimes size={14} />
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="shrink-0 px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-sm font-semibold rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
          >
            {loading ? <FaSpinner className="animate-spin" /> : <FaSearch />}
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

      </div>

      {activeFilters && Object.keys(activeFilters).length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 items-center">
          <span className={`text-xs font-bold uppercase tracking-wider ${darkMode ? "text-slate-400" : "text-slate-500"}`}>AI Filters Applied:</span>
          {Object.entries(activeFilters).map(([key, val]) => (
            val ? (
              <span key={key} className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300 border border-pink-200 dark:border-pink-800">
                {key}: {val}
              </span>
            ) : null
          ))}
        </div>
      )}
    </div>
  );
}

export default AISearch;
