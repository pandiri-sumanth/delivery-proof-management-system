function StatusBadge({ status }) {

  const styles = {
    Delivered: "bg-green-600",
    "In Transit": "bg-yellow-500",
    "Not Delivered": "bg-red-600"
  };

  return (

    <span
      className={`px-3 py-1 rounded-full text-white text-sm ${styles[status] || "bg-gray-500"
        }`}
    >
      {status}
    </span>

  );

}

export default StatusBadge;