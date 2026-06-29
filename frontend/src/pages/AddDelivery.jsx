import DeliveryForm from "../components/DeliveryForm";
import { FaPlusCircle } from "react-icons/fa";

function AddDelivery() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Page header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
          <FaPlusCircle size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight">Add Delivery</h1>
          <p className="text-sm text-slate-500 mt-0.5">Create a new delivery record and upload proofs</p>
        </div>
      </div>

      <DeliveryForm />
      
    </div>
  );
}

export default AddDelivery;