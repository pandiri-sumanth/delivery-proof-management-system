import { useEffect, useState, useRef, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";
import { ThemeContext } from "../context/ThemeContext";
import { FaEdit, FaCloudUploadAlt, FaTrash } from "react-icons/fa";

function EditDelivery() {
  const { id } = useParams();
  const navigate = useNavigate();
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
  const [existingImages, setExistingImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    fetchDelivery();
  }, []);

  useEffect(() => {
    const newPreviews = proofImages.map(file => URL.createObjectURL(file));
    setImagePreviews(newPreviews);
    return () => newPreviews.forEach(url => URL.revokeObjectURL(url));
  }, [proofImages]);

  const fetchDelivery = async () => {
    try {
      const response = await API.get(`/delivery/${id}`);
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
      toast.error("Failed to Load Delivery");
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const removeExistingImage = (imageToRemove) => {
    setExistingImages((prev) => prev.filter((image) => image !== imageToRemove));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setProofImages(prev => [...prev, ...files]);
    }
  };

  const removeNewImage = (indexToRemove) => {
    setProofImages(prev => prev.filter((_, index) => index !== indexToRemove));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => { setIsDragging(false); };

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
      data.append("existingImages", JSON.stringify(existingImages));
      proofImages.forEach((file) => {
        data.append("proof_images", file);
      });

      await API.put(`/delivery/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      toast.success("Delivery Updated Successfully");
      setTimeout(() => navigate("/records"), 1000);
    } catch (error) {
      console.error(error);
      toast.error("Update Failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full border px-4 py-3 rounded-xl text-sm transition-all duration-200 outline-none focus:ring-2 focus:ring-amber-500/40 ${
    darkMode 
      ? "bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-amber-500" 
      : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-amber-500"
  }`;
  
  const labelClass = `block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? "text-slate-400" : "text-slate-500"}`;

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
          <FaEdit size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight">Edit Delivery</h1>
          <p className="text-sm text-slate-500 mt-0.5">Modify delivery details and manage proofs</p>
        </div>
      </div>

      <div className={`p-6 sm:p-8 rounded-2xl border shadow-sm ${
        darkMode ? "bg-slate-800 text-white border-slate-700/60" : "bg-white text-slate-900 border-gray-100"
      }`}>
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* ── Grid Layout for Inputs ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Tracking ID</label>
              <input type="text" name="tracking_id" value={formData.tracking_id} onChange={handleChange} className={inputClass} required />
            </div>

            <div>
              <label className={labelClass}>Receiver Name</label>
              <input type="text" name="receiver_name" value={formData.receiver_name} onChange={handleChange} className={inputClass} required />
            </div>

            <div>
              <label className={labelClass}>Delivery Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className={inputClass} required>
                <option value="" disabled>Select Status</option>
                <option value="Delivered">Delivered</option>
                <option value="In Transit">In Transit</option>
                <option value="Not Delivered">Not Delivered</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Package Condition</label>
              <select name="condition_status" value={formData.condition_status} onChange={handleChange} className={inputClass} required>
                <option value="" disabled>Select Condition</option>
                <option value="Good">Good</option>
                <option value="Damaged">Damaged</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className={labelClass}>Remarks (Optional)</label>
              <textarea name="remarks" value={formData.remarks} onChange={handleChange} className={`${inputClass} min-h-[100px] resize-y`} />
            </div>
          </div>

          {/* ── Images Section ── */}
          <div className="border-t pt-8 border-gray-200 dark:border-slate-700/60">
            
            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="mb-8">
                <label className={labelClass}>Current Proofs</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-2">
                  {existingImages.map((image, index) => (
                    <div key={`${image}-${index}`} className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-slate-600 bg-black/5 aspect-square">
                      <img src={image} alt="Proof" className="w-full h-full object-cover" onError={(e) => { e.target.src = "https://placehold.co/100x100?text=No+Image"; }} />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <button type="button" onClick={() => removeExistingImage(image)} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 hover:scale-110 transition-all">
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Drag and Drop Upload */}
            <label className={labelClass}>Upload New Images</label>
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`mt-2 flex flex-col items-center justify-center w-full min-h-[200px] border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 ${
                isDragging 
                  ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20" 
                  : darkMode 
                    ? "border-slate-600 bg-slate-700/30 hover:bg-slate-700/50" 
                    : "border-gray-300 bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FaCloudUploadAlt size={48} className={`mb-4 ${isDragging ? "text-amber-500" : "text-gray-400"}`} />
                <p className={`mb-2 text-sm font-semibold ${darkMode ? "text-slate-300" : "text-gray-700"}`}>
                  <span className="text-amber-500">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-slate-400">JPG, PNG, WEBP (Max multiple files allowed)</p>
              </div>
              <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,.webp" multiple onChange={handleFileChange} className="hidden" />
            </div>

            {/* New Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="mt-6">
                <h4 className={`text-sm font-semibold mb-3 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                  New Selected Files ({proofImages.length})
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {imagePreviews.map((url, index) => (
                    <div key={index} className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-slate-600 bg-black/5 aspect-square">
                      <img src={url} alt="Preview" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <button type="button" onClick={(e) => { e.stopPropagation(); removeNewImage(index); }} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 hover:scale-110 transition-all">
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
                  ? "bg-amber-400 cursor-not-allowed shadow-none"
                  : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-amber-500/30 hover:shadow-amber-500/40 hover:-translate-y-0.5"
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  Updating...
                </>
              ) : (
                "Update Delivery"
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default EditDelivery;