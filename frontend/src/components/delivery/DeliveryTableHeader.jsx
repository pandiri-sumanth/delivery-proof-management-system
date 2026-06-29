function DeliveryTableHeader({ darkMode }) {

  const thBase = `py-4 px-4 text-left text-xs font-semibold uppercase tracking-wider ${
    darkMode ? "text-slate-400" : "text-gray-500"
  }`;

  return (
    <thead
      className={`sticky top-0 z-10 ${
        darkMode
          ? "bg-slate-900 border-b border-slate-700"
          : "bg-gray-50 border-b border-gray-200"
      }`}
    >
      <tr>
        <th className={thBase}>ID</th>
        <th className={thBase}>Tracking ID</th>
        <th className={thBase}>Receiver</th>
        <th className={thBase}>Status</th>
        <th className={thBase}>Condition</th>
        <th className={thBase}>Proof</th>
        <th className={thBase}>Actions</th>
      </tr>
    </thead>
  );

}

export default DeliveryTableHeader;