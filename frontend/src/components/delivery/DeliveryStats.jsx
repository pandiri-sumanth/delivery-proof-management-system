function DeliveryStats({

  total,

  filtered,

  darkMode

}) {

  return (

    <div
      className={`flex gap-6 mb-4 text-sm ${darkMode
          ? "text-gray-300"
          : "text-gray-600"
        }`}
    >

      <span>
        Total Records:{" "}
        <strong className={
          darkMode
            ? "text-white"
            : "text-black"
        }>
          {total}
        </strong>
      </span>

      <span>
        Showing:{" "}
        <strong className={
          darkMode
            ? "text-white"
            : "text-black"
        }>
          {filtered}
        </strong>
      </span>

    </div>

  );

}

export default DeliveryStats;