import { FiPower, FiBell, FiUser } from "react-icons/fi";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import schaefflerLogo from "../../assets/schaeffler.png";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ open }) => {
  const { logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const handleLogout = () => {
    Swal.fire({
      title: 'Logout?',
      text: 'You will be logged out.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout',
    }).then((result) => {
      if (result.isConfirmed) logout();
    });
  };

  // Close menu if clicked outside
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className={`fixed top-0 left-0 h-16 flex items-center justify-between px-6 backdrop-blur-xl bg-white/70 dark:bg-gray-900/60 shadow-md z-30 transition-all duration-300
     ${open ? "md:ml-[240px] md:w-[calc(100%-240px)]" : "md:ml-[64px] md:w-[calc(100%-64px)]"}
`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <img src={schaefflerLogo} alt="Logo" className="h-14 w-auto" />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">

        {/* Notification Icon */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="relative p-2 rounded-full hover:bg-green-100 dark:hover:bg-gray-800 transition-all"
          title="Notifications"
        >
          <FiBell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
        </motion.button>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setProfileOpen(!profileOpen)}
            className="p-2 rounded-full hover:bg-green-100 dark:hover:bg-gray-800 transition-all"
            title="Profile"
          >
            <FiUser size={20} />
          </motion.button>

          {profileOpen && (
  <motion.div
    initial={{ opacity: 0, y: -5 }}
    animate={{ opacity: 1, y: 0 }}
    className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 
               shadow-xl rounded-xl border dark:border-gray-700 
               overflow-hidden z-50"
  >
    {/* User Info Section */}
    {/* <div className="px-4 py-3 border-b dark:border-gray-700">
      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 capitalize">
  {user?.role}
</p>
<p className="text-xs text-gray-500 dark:text-gray-400">
  {user?.email}
</p>
    </div> */}

    {/* Menu Items */}
    <div className="py-2 text-sm">

      <Link
        to="/profile"
        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 
                   dark:hover:bg-gray-700 transition"
      >
        <FiUser size={16} />
        <span>My Profile</span>
      </Link>

      <Link
        to="/profile/edit"
        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 
                   dark:hover:bg-gray-700 transition"
      >
        ✏️ <span>Edit Profile</span>
      </Link>

      <Link
        to="/profile/change-password"
        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 
                   dark:hover:bg-gray-700 transition"
      >
        🔒 <span>Change Password</span>
      </Link>

      <div className="border-t my-2 dark:border-gray-700"></div>

      <button
        onClick={handleLogout}
        className="w-full text-left flex items-center gap-3 px-4 py-2 
                   text-red-500 hover:bg-red-50 dark:hover:bg-gray-700 transition"
      >
        <FiPower size={16} />
        <span>Logout</span>
      </button>

    </div>
  </motion.div>
)}
        </div>

        {/* Logout */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleLogout}
          className="p-2 rounded-full hover:bg-red-100 text-red-500 hover:text-red-600 transition-all"
          title="Logout"
        >
          <FiPower size={20} />
        </motion.button>
      </div>
    </header>
  );
};

export default Navbar;
