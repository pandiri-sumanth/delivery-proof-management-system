import { useState, useRef, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import API from "../services/api";
import { ThemeContext } from "../context/ThemeContext";
import { FaCloudUploadAlt, FaTrash, FaImage } from "react-icons/fa";

function DeliveryForm() {
  const { darkMode } = useContext(ThemeContext);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState({
    tracking_id: "",
    receiver_name: "",
    status: "",
    condition_status: "",
    remarks: ""
  });

  const [proofImages, setProofImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Generate previews when proofImages change
  useEffect(() => {
    const newPreviews = proofImages.map(file => URL.createObjectURL(file));
    setImagePreviews(newPreviews);
    
    // Cleanup URLs to avoid memory leaks
    return () => {
      newPreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [proofImages]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setProofImages(prev => [...prev, ...files]);
    }
  };

  const removeImage = (indexToRemove) => {
    setProofImages(prev => prev.filter((_, index) => index !== indexToRemove));
    // Reset file input so same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
      setProofImages(prev => [...prev, ...files]);
    }
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
        data.append("proof_images", image);
      });

      const response = await API.post("/delivery", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      console.log("SUCCESS RESPONSE:", response);

      toast.success("Delivery Saved Successfully");

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
      console.log("FULL ERROR:", error);
      toast.error("Failed to Save Delivery");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full border px-4 py-3 rounded-xl text-sm transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-500/40 ${
    darkMode 
      ? "bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500" 
      : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500"
  }`;
  
  const labelClass = `block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? "text-slate-400" : "text-slate-500"}`;

  return (
    <div className={`p-6 sm:p-8 rounded-2xl border shadow-sm ${
      darkMode ? "bg-slate-800 text-white border-slate-700/60" : "bg-white text-slate-900 border-gray-100"
    }`}>
      <form onSubmit={handleSubmit} className="space-y-8">

        {/* ── Grid Layout for Inputs ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div>
            <label className={labelClass}>Tracking ID</label>
            <input
              type="text"
              name="tracking_id"
              placeholder="e.g. TRK-987654321"
              value={formData.tracking_id}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Receiver Name</label>
            <input
              type="text"
              name="receiver_name"
              placeholder="e.g. John Doe"
              value={formData.receiver_name}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Delivery Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="" disabled>Select Status</option>
              <option value="Delivered">Delivered</option>
              <option value="In Transit">In Transit</option>
              <option value="Not Delivered">Not Delivered</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Package Condition</label>
            <select
              name="condition_status"
              value={formData.condition_status}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="" disabled>Select Condition</option>
              <option value="Good">Good</option>
              <option value="Damaged">Damaged</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className={labelClass}>Remarks (Optional)</label>
            <textarea
              name="remarks"
              placeholder="Any additional notes about the delivery..."
              value={formData.remarks}
              onChange={handleChange}
              className={`${inputClass} min-h-[100px] resize-y`}
            />
          </div>
        </div>

        {/* ── Drag and Drop Upload Zone ── */}
        <div className="border-t pt-8 border-gray-200 dark:border-slate-700/60">
          <label className={labelClass}>Proof Images</label>
          
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`mt-2 flex flex-col items-center justify-center w-full min-h-[200px] border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 ${
              isDragging 
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                : darkMode 
                  ? "border-slate-600 bg-slate-700/30 hover:bg-slate-700/50" 
                  : "border-gray-300 bg-gray-50 hover:bg-gray-100"
            }`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FaCloudUploadAlt size={48} className={`mb-4 ${isDragging ? "text-blue-500" : "text-gray-400"}`} />
              <p className={`mb-2 text-sm font-semibold ${darkMode ? "text-slate-300" : "text-gray-700"}`}>
                <span className="text-blue-500">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                JPG, PNG, WEBP (Max multiple files allowed)
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="mt-6">
              <h4 className={`text-sm font-semibold mb-3 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                Selected Files ({proofImages.length})
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {imagePreviews.map((url, index) => (
                  <div key={index} className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-slate-600 bg-black/5 aspect-square">
                    <img src={url} alt="Preview" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 hover:scale-110 transition-all"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Submit Button ── */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all duration-200 ${
              loading
                ? "bg-blue-400 cursor-not-allowed shadow-none"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-600/30 hover:shadow-blue-500/40 hover:-translate-y-0.5"
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                Saving...
              </>
            ) : (
              "Save Delivery"
            )}
          </button>
        </div>

      </form>
    </div>
  );
}

export default DeliveryForm;