import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HiX, HiEye, HiEyeOff } from "react-icons/hi";

const ChangePassword = () => {
  const navigate = useNavigate();

  const [show, setShow] = useState(false);

  return (
    <div className="min-h-screen bg-black/40 flex items-center justify-center p-6">

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 relative"
      >
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
        >
          <HiX size={22} />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Change Password
        </h2>

        <div className="space-y-5">

          {/* Current Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Current Password
            </label>
            <input
              type={show ? "text" : "password"}
              placeholder="Enter current password"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-9 text-gray-400"
            >
              {show ? <HiEyeOff size={18} /> : <HiEye size={18} />}
            </button>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              placeholder="Confirm new password"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>

          {/* Requirements Box */}
          <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-600 space-y-2">
            <p className="font-medium text-gray-700">Password Requirements</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>At least 8 characters</li>
              <li>One uppercase letter</li>
              <li>One number</li>
              <li>One special character (!@#$%^&*)</li>
              <li>Passwords must match</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-2">
            <button className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition">
              Update Password
            </button>

            <button
              onClick={() => navigate(-1)}
              className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl shadow-sm transition"
            >
              Cancel
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default ChangePassword;
