import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import API from "../services/api";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

function DeliveryTable() {

  const { darkMode } =
  useContext(ThemeContext);

  const [deliveries, setDeliveries] = useState([]);

  const [search, setSearch] = useState("");

  const [selectedImages, setSelectedImages] =
    useState([]);

  const [selectedIndex, setSelectedIndex] =
    useState(0);

  const [showModal, setShowModal] =
    useState(false);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const response = await API.get("/delivery/all");
      setDeliveries(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {

  const result = await Swal.fire({
    title: "Delete Delivery?",
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Delete"
  });

  if (!result.isConfirmed) {
    return;
  }

  try {

    await API.delete(
      `/delivery/${id}`
    );

    toast.success(
      "Delivery Deleted Successfully"
    );

    fetchDeliveries();

  } catch (error) {

    console.error(error);

    toast.error(
      "Failed to Delete Delivery"
    );

  }

};

const openGallery = (
  images,
  index = 0
) => {

  setSelectedImages(images);

  setSelectedIndex(index);

  setShowModal(true);

};

const nextImage = () => {

  setSelectedIndex(
    (prev) =>
      prev === selectedImages.length - 1
        ? 0
        : prev + 1
  );

};

const prevImage = () => {

  setSelectedIndex(
    (prev) =>
      prev === 0
        ? selectedImages.length - 1
        : prev - 1
  );

};

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(
      "Delivery Proof Management Report",
      14,
      20
    );

    autoTable(doc, {
      startY: 30,
      head: [[
        "ID",
        "Tracking ID",
        "Receiver",
        "Status",
        "Condition",
        "Proof"
      ]],
      body: deliveries.map((delivery) => [
        delivery.id,
        delivery.tracking_id,
        delivery.receiver_name,
        delivery.status,
        delivery.condition_status,
        delivery.proof_images
          ? "Available"
          : "No Proof"
      ])
    });

    doc.save("delivery-report.pdf");
  };

  const searchTerm = search.toLowerCase();

  const filteredDeliveries = deliveries.filter(
    (delivery) =>
      delivery.tracking_id
        ?.toLowerCase()
        .includes(searchTerm) ||
      delivery.receiver_name
        ?.toLowerCase()
        .includes(searchTerm)
  );

  const csvData = deliveries.map((delivery) => ({
    ID: delivery.id,
    TrackingID: delivery.tracking_id,
    Receiver: delivery.receiver_name,
    Status: delivery.status,
    Condition: delivery.condition_status,
    ProofImages: delivery.proof_images || "No Proof",
    Remarks: delivery.remarks
  }));

  return (
    <div
      className={`p-6 rounded-xl shadow ${
        darkMode
          ? "bg-gray-800 text-white"
          : "bg-white text-black"
      }`}
   >

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold">
          Delivery Records
        </h2>

        <div className="flex gap-3">

          <button
            onClick={generatePDF}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Export PDF
          </button>

          <CSVLink
            data={csvData}
            filename="delivery-records.csv"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Export CSV
          </CSVLink>

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className={`border p-2 rounded-lg ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-white text-black"
           }`}
          />

        </div>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full border-collapse">

          <thead>

            <tr
              className={
                darkMode
                  ? "bg-gray-700"
                  : "bg-gray-100"
             }
            >

              <th className="p-3 text-left">
                ID
              </th>

              <th className="p-3 text-left">
                Tracking ID
              </th>

              <th className="p-3 text-left">
                Receiver
              </th>

              <th className="p-3 text-left">
                Status
              </th>

              <th className="p-3 text-left">
                Condition
              </th>

              <th className="p-3 text-left">
                Proof
              </th>

              <th className="p-3 text-left">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredDeliveries.length > 0 ? (

              filteredDeliveries.map((delivery) => (

                <tr
                  key={delivery.id}
                  className={`border-b ${
                    darkMode
                      ? "border-gray-600 hover:bg-blue-600 hover:translate-x-1"
                      : "hover:bg-gray-50"
                  }`}
                >

                  <td className="p-3">
                    {delivery.id}
                  </td>

                  <td className="p-3">
                    {delivery.tracking_id}
                  </td>

                  <td className="p-3">
                    {delivery.receiver_name}
                  </td>

                  <td className="p-3">

                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm ${
                        delivery.status === "Delivered"
                          ? "bg-green-600"
                          : delivery.status === "In Transit"
                          ? "bg-yellow-500"
                          : "bg-red-600"
                      }`}
                    >
                      {delivery.status}
                    </span>

                  </td>

                  <td className="p-3">

                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm ${
                        delivery.condition_status === "Good"
                          ? "bg-green-600"
                          : "bg-red-600"
                      }`}
                    >
                      {delivery.condition_status}
                    </span>

                  </td>

                  <td className="p-3">

  {delivery.proof_images ? (

    (() => {

      let images = [];

      try {

        images = JSON.parse(
          delivery.proof_images || "[]"
        );

      } catch {

        images = delivery.proof_images
          ? [delivery.proof_images]
          : [];

      }

      return (

        <div
          onClick={() =>
            openGallery(images, 0)
          }
          className="cursor-pointer flex items-center gap-2"
        >

          <img
            src={images[0]}
            alt="Proof"
            className="w-16 h-16 object-cover rounded-lg border"
          />

          {images.length > 1 && (

            <span
              className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
            >
              +{images.length - 1}
            </span>

          )}

        </div>

      );

    })()

  ) : (

    <span
      className={
        darkMode
          ? "text-gray-300"
          : "text-gray-400"
      }
    >
      No Proof
    </span>

  )}

</td>

                  <td className="p-3 space-x-2">

                    <Link
                      to={`/edit/${delivery.id}`}
                    >
                      <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                        Edit
                      </button>
                    </Link>

                    <button
                      onClick={() =>
                        handleDelete(delivery.id)
                      }
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="7"
                  className="text-center p-4"
                >
                  No delivery records found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    {showModal && (

      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">

        <div
          className={`relative p-6 rounded-2xl animate-[fadeIn_.3s_ease-in-out] max-w-4xl w-full ${
            darkMode
              ? "bg-gray-900"
              : "bg-white"
          }`}
        >

          <button
            onClick={() =>
              setShowModal(false)
            }
            className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded"
          >
            ✕
          </button>

          <img
            src={selectedImages[selectedIndex]}
            alt="Proof"
            className="w-full max-h-[70vh] object-contain rounded-lg"
          />

          <div className="flex gap-2 mt-4 justify-center flex-wrap">

            {selectedImages.map(
              (image, index) => (

                <img
                  key={`${image}-${index}`}
                  src={image}
                  alt="Thumbnail"
                  onClick={() =>
                    setSelectedIndex(index)
                  }
                  className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 transition ${
                    selectedIndex === index
                      ? "border-blue-500 scale-110"
                      : "border-gray-400"
                  }`}
                />

              )
            )}

          </div>

          <div className="flex justify-between mt-4">

            <button
              onClick={prevImage}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              ← Previous
            </button>

            <span
              className={
                darkMode
                  ? "text-white"
                  : "text-black"
              }
            >
              {selectedIndex + 1}
              {" / "}
              {selectedImages.length}
            </span>

            <button
              onClick={nextImage}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Next →
            </button>

          </div>

        </div>

      </div>

    )}

    </div>
  );
}

export default DeliveryTable;