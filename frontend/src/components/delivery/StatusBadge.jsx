function StatusBadge({ status }) {
  const map = {
    Delivered:       "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
    "In Transit":    "bg-amber-50   text-amber-700   border-amber-200   dark:bg-amber-900/30   dark:text-amber-400   dark:border-amber-800",
    "Not Delivered": "bg-red-50     text-red-700     border-red-200     dark:bg-red-900/30     dark:text-red-400     dark:border-red-800",
  };
  const dot = {
    Delivered:       "bg-emerald-500",
    "In Transit":    "bg-amber-500",
    "Not Delivered": "bg-red-500",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border whitespace-nowrap ${map[status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot[status] || "bg-gray-400"}`} />
      {status}
    </span>
  );
}

export default StatusBadge;