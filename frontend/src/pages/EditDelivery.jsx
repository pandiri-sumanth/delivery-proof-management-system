import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

function EditDelivery() {

  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } =
  useContext(ThemeContext);

  const [formData, setFormData] = useState({
    tracking_id: "",
    receiver_name: "",
    status: "",
    condition_status: "",
    remarks: ""
  });

  const [proofImages, setProofImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const imageBaseURL = `${API.defaults.baseURL}/uploads`;

  useEffect(() => {
    fetchDelivery();
  }, []);

  const fetchDelivery = async () => {

    try {

      const response = await API.get(
        `/delivery/${id}`
      );

      setFormData(response.data);

      if (response.data.proof_images) {
        try {
          setExistingImages(JSON.parse(response.data.proof_images));
        } catch {
          setExistingImages([response.data.proof_images]);
        }
      }

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to Load Delivery"
      );

    }

  };

  const handleChange = (e) => {

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));

  };

  const handleFileChange = (e) => {
    setProofImages(Array.from(e.target.files));
  };

  const removeExistingImage = (imageToRemove) => {
    setExistingImages((prev) =>
      prev.filter((image) => image !== imageToRemove)
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

      data.append(
        "existingImages",
        JSON.stringify(existingImages)
      );

      proofImages.forEach((file) => {
        data.append(
          "proof_images",
          file
        );
      });

      await API.put(
        `/delivery/${id}`,
        data,
        {
          headers: {
            "Content-Type":
              "multipart/form-data"
          }
        }
      );

      toast.success(
        "Delivery Updated Successfully"
      );

      setTimeout(() => {

        navigate("/records");

      }, 1000);

    } catch (error) {

      console.error(error);

      toast.error(
        "Update Failed"
      );

    } finally {
      setLoading(false);
    }

  };

  return (

    <div>

      <h1 className="text-4xl font-bold mb-8">
        Edit Delivery
      </h1>

      <div
        className={`p-8 rounded-xl shadow-md max-w-4xl ${
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
            className={`w-full border p-3 rounded-lg h-32 ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-white text-black"
            }`}
          />

          <div>
            <label className="block mb-2 font-medium">
              Current Images
            </label>

            <div className="flex gap-3 flex-wrap mb-4">
              {existingImages.length > 0 ? (
                existingImages.map((image, index) => (
                  <div key={`${image}-${index}`} className="relative">
                    <img
                      src={`${imageBaseURL}/${image}`}
                      alt="Proof"
                      className="w-24 h-24 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(image)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6 rounded-full hover:bg-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">
                  No images available.
                </p>
              )}
            </div>

            <label className="block mb-2 font-medium">
              Upload New Images
            </label>

            <input
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleFileChange}
              className={`w-full border p-3 rounded-lg ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white text-black"
              }`}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-600 text-white px-6 py-3 rounded-lg ${
              loading ? "bg-blue-300 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            {loading ? "Updating..." : "Update Delivery"}
          </button>

        </form>

      </div>

    </div>

  );
}

export default EditDelivery;