function ConditionBadge({ condition }) {

  const styles = {
    Good: "bg-green-600",
    Damaged: "bg-red-600"
  };

  return (

    <span
      className={`px-3 py-1 rounded-full text-white text-sm ${styles[condition] || "bg-gray-500"
        }`}
    >
      {condition}
    </span>

  );

}

export default ConditionBadge;