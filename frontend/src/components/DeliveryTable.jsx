import { useEffect, useState, useContext } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import API from "../services/api";
import { ThemeContext } from "../context/ThemeContext";

import DeliveryToolbar from "./delivery/DeliveryToolbar";
import DeliveryStats from "./delivery/DeliveryStats";
import DeliveryTableHeader from "./delivery/DeliveryTableHeader";
import DeliveryTableRow from "./delivery/DeliveryTableRow";
import ImageModal from "./delivery/ImageModal";
import AISearch from "./delivery/AISearch";

function DeliveryTable() {

  const { darkMode } =
    useContext(ThemeContext);

  const [deliveries, setDeliveries] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [selectedImages, setSelectedImages] =
    useState([]);

  const [selectedIndex, setSelectedIndex] =
    useState(0);

  const [showModal, setShowModal] =
    useState(false);

  const [aiResults, setAiResults] = useState(null);
  const [isAISearchActive, setIsAISearchActive] = useState(false);

  const handleAISearchResults = (results) => {
    setAiResults(results);
    setIsAISearchActive(true);
  };

  const handleClearAISearch = () => {
    setAiResults(null);
    setIsAISearchActive(false);
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const response =
        await API.get("/delivery/all");
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

  const sourceData = isAISearchActive ? aiResults : deliveries;

  const filteredDeliveries = sourceData.filter(
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
    ProofImages:
      delivery.proof_images || "No Proof",
    Remarks: delivery.remarks
  }));

  return (

    <div
      className={`p-6 rounded-2xl border shadow-sm ${darkMode
          ? "bg-slate-800 text-white border-slate-700/60"
          : "bg-white text-slate-900 border-gray-100"
        }`}
    >

      <DeliveryToolbar
        search={search}
        setSearch={setSearch}
        darkMode={darkMode}
        onExportPDF={generatePDF}
        csvData={csvData}
      />

      <AISearch 
        darkMode={darkMode} 
        onSearchResults={handleAISearchResults} 
        onClearSearch={handleClearAISearch} 
      />

      <DeliveryStats
        total={deliveries.length}
        filtered={filteredDeliveries.length}
        darkMode={darkMode}
      />

      <div className="overflow-x-auto overflow-y-auto max-h-[600px] rounded-xl border border-gray-100 dark:border-slate-700">

        <table className="w-full border-collapse">

          <DeliveryTableHeader
            darkMode={darkMode}
          />

          <tbody>

            {filteredDeliveries.length > 0 ? (

              filteredDeliveries.map(
                (delivery, index) => (

                  <DeliveryTableRow
                    key={delivery.id}
                    delivery={delivery}
                    darkMode={darkMode}
                    onGalleryOpen={openGallery}
                    onDelete={handleDelete}
                    isOdd={index % 2 === 0}
                  />

                )
              )

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

        <ImageModal
          images={selectedImages}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          darkMode={darkMode}
          onClose={() => setShowModal(false)}
        />

      )}

    </div>

  );

}

export default DeliveryTable;