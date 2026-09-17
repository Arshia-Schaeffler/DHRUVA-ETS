import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HiX } from "react-icons/hi";

const EditProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: `${user.FirstName} ${user.LastName}`,
    designation: user.Designation || "",
    email: user.Email || "",
    mobile: user.Mobile || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="min-h-screen bg-black/40 flex items-center justify-center p-6">

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 relative"
      >
        {/* Close Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
        >
          <HiX size={22} />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Edit Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
          </div>

          {/* Designation */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Designation
            </label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Mobile
            </label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition shadow-sm"
            >
              Save Changes
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition shadow-sm"
            >
              Cancel
            </button>
          </div>

        </form>
      </motion.div>
    </div>
  );
};

export default EditProfile;