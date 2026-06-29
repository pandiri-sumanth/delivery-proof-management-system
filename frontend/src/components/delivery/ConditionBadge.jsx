function ConditionBadge({ condition }) {
  const map = {
    Good:    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
    Damaged: "bg-red-50     text-red-700     border-red-200     dark:bg-red-900/30     dark:text-red-400     dark:border-red-800",
  };
  const dot = {
    Good:    "bg-emerald-500",
    Damaged: "bg-red-500",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border whitespace-nowrap ${map[condition] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot[condition] || "bg-gray-400"}`} />
      {condition}
    </span>
  );
}

export default ConditionBadge;