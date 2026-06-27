import { useState, useRef, useContext } from "react";
import { toast } from "react-toastify";
import API from "../services/api";
import { ThemeContext } from "../context/ThemeContext";

function DeliveryForm() {

  const { darkMode } = useContext(ThemeContext);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    tracking_id: "",
    receiver_name: "",
    status: "",
    condition_status: "",
    remarks: ""
  });

  const [proofImages, setProofImages] =
  useState([]);

  const handleChange = (e) => {

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));

  };

  const handleFileChange = (e) => {

    setProofImages(
      Array.from(e.target.files)
    );

  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    setLoading(true);

    try {

      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      proofImages.forEach((image) => {
        data.append(
          "proof_images",
          image
        );
      });

      await API.post(
        "/delivery",
        data,
        {
          headers: {
            "Content-Type":
              "multipart/form-data"
          }
        }
      );

      toast.success(
        "Delivery Saved Successfully"
      );

      setFormData({
        tracking_id: "",
        receiver_name: "",
        status: "",
        condition_status: "",
        remarks: ""
      });

      setProofImages([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to Save Delivery"
      );

    } finally {
      setLoading(false);
    }

  };

  return (

    <div>

      <h2 className="text-2xl font-bold mb-6">
        Add Delivery
      </h2>

      <div
        className={`p-8 rounded-xl shadow ${
          darkMode
            ? "bg-gray-800 text-white"
            : "bg-white text-black"
       }`}
      >

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        <input
          type="text"
          name="tracking_id"
          placeholder="Tracking ID"
          value={formData.tracking_id}
          onChange={handleChange}
          className={`w-full border p-3 rounded-lg ${
            darkMode
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-white text-black"
         }`}
          required
        />

        <input
          type="text"
          name="receiver_name"
          placeholder="Receiver Name"
          value={formData.receiver_name}
          onChange={handleChange}
          className={`w-full border p-3 rounded-lg ${
            darkMode
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-white text-black"
         }`}
          required
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className={`w-full border p-3 rounded-lg ${
            darkMode
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-white text-black"
         }`}
          required
        >
          <option value="">
            Select Status
          </option>

          <option value="Delivered">
            Delivered
          </option>

          <option value="In Transit">
            In Transit
          </option>

          <option value="Not Delivered">
            Not Delivered
          </option>

        </select>

        <select
          name="condition_status"
          value={formData.condition_status}
          onChange={handleChange}
          className={`w-full border p-3 rounded-lg ${
            darkMode
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-white text-black"
        }`}
          required
        >
          <option value="">
            Select Condition
          </option>

          <option value="Good">
            Good
          </option>

          <option value="Damaged">
            Damaged
          </option>

        </select>

        <textarea
          name="remarks"
          placeholder="Remarks"
          value={formData.remarks}
          onChange={handleChange}
          className={`w-full border p-3 rounded-lg h-28 ${
            darkMode
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-white text-black"
          }`}
        />

        <div>

          <label className={`block mb-2 font-medium ${
            darkMode
              ? "text-white"
              : "text-black"
          }`}>
            Upload Delivery Proof
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            multiple
            onChange={handleFileChange}
            className={`w-full border p-3 rounded-lg ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-white text-black"
           }`}
          />

          {proofImages.length > 0 && (
            <div className="mt-2">
              <p className="font-medium">Selected Files:</p>
              {proofImages.map((image) => (
                <p
                  key={`${image.name}-${image.size}`}
                  className="text-sm"
                >
                  {image.name}
                </p>
              ))}
            </div>
          )}

        </div>

        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-3 rounded-lg ${
            loading
              ? "bg-blue-300 text-white"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {loading ? "Saving..." : "Save Delivery"}
        </button>


      </form>

      </div>

    </div>

  );
}

export default DeliveryForm;