import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

import StatusBadge from "./StatusBadge";
import ConditionBadge from "./ConditionBadge";
import DeliveryImageGallery from "./DeliveryImageGallery";

function DeliveryTableRow({
  delivery,
  darkMode,
  onGalleryOpen,
  onDelete,
  isOdd
}) {

  let images = [];

  try {
    images = JSON.parse(delivery.proof_images || "[]");
  } catch {
    images = delivery.proof_images ? [delivery.proof_images] : [];
  }

  /* zebra striping */
  const rowBg = darkMode
    ? isOdd
      ? "bg-slate-800"
      : "bg-slate-800/60"
    : isOdd
      ? "bg-white"
      : "bg-gray-50/70";

  return (
    <tr
      className={`
        border-b transition-all duration-150 group cursor-default
        ${darkMode ? "border-slate-700" : "border-gray-100"}
        ${rowBg}
        hover:${darkMode ? "bg-blue-600/20" : "bg-blue-50"}
        hover:shadow-sm
      `}
    >

      <td className="py-4 px-4 text-sm font-medium text-gray-400">
        #{delivery.id}
      </td>

      <td className="py-4 px-4 text-sm font-semibold">
        {delivery.tracking_id}
      </td>

      <td className="py-4 px-4 text-sm">
        {delivery.receiver_name}
      </td>

      <td className="py-4 px-4">
        <StatusBadge status={delivery.status} />
      </td>

      <td className="py-4 px-4">
        <ConditionBadge condition={delivery.condition_status} />
      </td>

      <td className="py-4 px-4">
        <DeliveryImageGallery
          images={images}
          onGalleryOpen={onGalleryOpen}
        />
      </td>

      <td className="py-4 px-4">
        <div className="flex items-center gap-2">

          <Link to={`/edit/${delivery.id}`}>
            <button className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md">
              <FaEdit size={11} />
              Edit
            </button>
          </Link>

          <button
            onClick={() => onDelete(delivery.id)}
            className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
          >
            <FaTrash size={11} />
            Delete
          </button>

        </div>
      </td>

    </tr>
  );

}

export default DeliveryTableRow;