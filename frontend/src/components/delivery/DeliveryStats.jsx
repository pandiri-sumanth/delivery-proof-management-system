function DeliveryStats({ total, filtered, darkMode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold ${
        darkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"
      }`}>
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
        Total: <strong>{total}</strong>
      </div>

      {filtered !== total && (
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold ${
          darkMode ? "bg-blue-900/40 text-blue-300" : "bg-blue-50 text-blue-700"
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          Showing: <strong>{filtered}</strong>
        </div>
      )}
    </div>
  );
}

export default DeliveryStats;