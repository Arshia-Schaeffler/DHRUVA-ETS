import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi";
import { Mail, Phone, Shield, Calendar, Pencil, Lock } from "lucide-react";

const baseURL = import.meta.env.VITE_BASE_API_URL.replace("/api", "");

const ProfilePage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-500 text-lg">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-red-500 text-lg">
        User not found
      </div>
    );
  }

  const fullName = `${user.FirstName || ""} ${user.LastName || ""}`.trim();

  // ✅ Updated navigation (as per your edited routes)
  const handleBack = () => navigate(-1);
  const handleEditProfile = () => navigate("/profile/edit");
  const handleChangePassword = () => navigate("/profile/change-password");

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6 relative">

      {/* Back Button */}
      <button
        onClick={handleBack}
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
      >
        <HiArrowLeft size={20} />
        <span className="text-sm font-medium">Back</span>
      </button>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-3xl"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">

          {/* Gradient Header */}
          <div className="h-32 bg-gradient-to-r from-emerald-500 to-teal-600" />

          <div className="relative p-8">

            {/* Avatar */}
            <div className="absolute -top-16 left-8">
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                src={
                  user.Photo
                    ? `${baseURL}/uploads/${user.Photo}`
                    : `https://ui-avatars.com/api/?name=${user.FirstName}+${user.LastName}`
                }
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
              />
            </div>

            {/* Name Section */}
            <div className="ml-40 space-y-1">
              <h2 className="text-2xl font-semibold text-gray-800">
                {fullName}
              </h2>

              <p className="text-emerald-600 text-sm font-medium">
                {user.Designation || "Employee"}
              </p>

              <p className="text-sm text-gray-500">
                {user.Email}
              </p>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Info Grid */}
            <div className="grid md:grid-cols-2 gap-6 text-sm">

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">{user.Email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-gray-500">Mobile</p>
                  <p className="font-medium text-gray-800">
                    {user.Mobile || "-"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-gray-500">Role</p>
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full capitalize">
                    {user.Role}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-gray-500">Joining Date</p>
                  <p className="font-medium text-gray-800">
                    {user.JoiningDate || "-"}
                  </p>
                </div>
              </div>

            </div>

            <hr className="my-6 border-gray-200" />

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleEditProfile}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition"
              >
                <Pencil className="w-4 h-4" />
                Edit Profile
              </button>

              <button
                onClick={handleChangePassword}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl shadow-sm transition"
              >
                <Lock className="w-4 h-4" />
                Change Password
              </button>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;