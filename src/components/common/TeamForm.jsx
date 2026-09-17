

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axiosInstance from "./AxiosInstance";
import FilterDatePicker from "./FilterDatePicker";

const TeamForm = ({ objectToEdit, setIsCreateUpdate, refetch, onUpdateLocal }) => {
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    Mobile: "",
    JoiningDate: "",
    department: "",   
    Designation: "",
    Role: "",
    UserName: "",
    Password: "",
    status: "Active", 
    Photo: null,
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [departments, setDepartments] = useState([]);

  
  //  Fetch Departments

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axiosInstance.get("/department/get-departments");
        if (res.status === 200 && Array.isArray(res.data.data)) {
          setDepartments(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load departments:", err);
      }
    };
    fetchDepartments();
  }, []);

 
  //  Populate fields when edit
 
  useEffect(() => {
    if (objectToEdit) {
      setIsEdit(true);

      setFormData({
        FirstName: objectToEdit.FirstName || "",
        LastName: objectToEdit.LastName || "",
        Email: objectToEdit.Email || "",
        Mobile: objectToEdit.Mobile || "",
        JoiningDate: objectToEdit.JoiningDate || "",
        department: objectToEdit.department || "",  
        Designation: objectToEdit.Designation || "",
        Role: objectToEdit.Role || "",
        UserName: objectToEdit.UserName || "",
        Password: "",
        status: objectToEdit.status || "Active",    
        Photo: objectToEdit.Photo || null,
      });
    } else {
      setIsEdit(false);
      setFormData({
        FirstName: "",
        LastName: "",
        Email: "",
        Mobile: "",
        JoiningDate: "",
        department: "",
        Designation: "",
        Role: "",
        UserName: "",
        Password: "",
        status: "Active",
        Photo: null,
      });
      setPhotoFile(null);
    }
  }, [objectToEdit]);

  //  Input change
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

 
  //  File selection
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhotoFile(file);
  };

  //  Submit Logic
 
  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "FirstName",
      "LastName",
      "Email",
      "Mobile",
      "JoiningDate",
      "department",
      "Designation",
      "Role",
      "UserName",
    ];

    for (let f of requiredFields) {
      if (!formData[f]?.trim()) {
        return alert(`${f} is required`);
      }
    }

    if (!isEdit && !formData.Password.trim()) {
      return alert("Password is required for new user");
    }

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));
      if (photoFile) data.append("Photo", photoFile);

    
      //  Edit Mode
   
      if (isEdit) {
        const response = await axiosInstance.put(
          `/employee/editUser/${objectToEdit.EmpId}`,
          data,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (response.status === 200) {
          const updated = { ...objectToEdit, ...formData };
          onUpdateLocal?.(updated);
          alert("Employee updated successfully!");
          setIsCreateUpdate(false);
        }
      }

      
      //  Add Mode
     
      else {
        const response = await axiosInstance.post(
          `/employee/register`,
          data,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (response.status === 200 || response.status === 201) {
          alert("New Employee Added Successfully!");
          refetch?.();
          setIsCreateUpdate(false);
        }
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save employee.");
    }
  };

  // Animation
  const fadeInUp = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 max-w-3xl mx-auto mt-8"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-bold text-center mb-8">
        {isEdit ? "Edit Team Member" : "Add Team Member"}
      </h2>

      <motion.form
        onSubmit={handleSubmit}
        className="space-y-8"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        {/* FORM GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputField label="First Name" name="FirstName" value={formData.FirstName} onChange={handleChange} />
          <InputField label="Last Name" name="LastName" value={formData.LastName} onChange={handleChange} />
          <InputField label="Email" name="Email" type="email" value={formData.Email} onChange={handleChange} />
          <InputField label="Mobile" name="Mobile" value={formData.Mobile} onChange={handleChange} />

          {/* Joining Date */}
          <div>
            <label className="block font-medium mb-1">Joining Date</label>
            <FilterDatePicker
              name="JoiningDate"
              value={formData.JoiningDate}
              onChange={(name, value) =>
                setFormData((p) => ({
                  ...p,
                  JoiningDate: value || "",
                }))
              }
            />
          </div>

          {/* Status */}
          <SelectField
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={["Active", "Idle"]}
          />

          {/* Department */}
          <div>
            <label className="block font-medium mb-1">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="border p-2 rounded-lg w-full dark:bg-gray-900"
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d.Id} value={d.DepartmentName}>
                  {d.DepartmentName}
                </option>
              ))}
            </select>
          </div>

          <SelectField
            label="Designation"
            name="Designation"
            value={formData.Designation}
            onChange={handleChange}
            options={["Project Engineer", "Software Tester", "Project Manager", "Team Lead"]}
          />

          <SelectField
            label="Role"
            name="Role"
            value={formData.Role}
            onChange={handleChange}
            options={["User", "Manager", "Admin"]}
          />

          <InputField label="Username" name="UserName" value={formData.UserName} onChange={handleChange} />

          {!isEdit && (
            <InputField label="Password" name="Password" type="password" value={formData.Password} onChange={handleChange} />
          )}
        </div>

        {/* PHOTO UPLOAD */}
        <div>
          <label className="block font-medium mb-1">Profile Photo</label>
          <input type="file" accept="image/*" onChange={handleFileChange} className="border p-2 rounded-lg w-full" />

          {(photoFile || formData.Photo) && (
            <img
              src={
                photoFile
                  ? URL.createObjectURL(photoFile)
                  : `${import.meta.env.VITE_BASE_API_URL.replace("/api", "")}/uploads/${formData.Photo}`
              }
              className="w-24 h-24 mt-3 rounded-xl object-cover border"
            />
          )}
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => setIsCreateUpdate(false)}
            className="bg-gray-400 px-6 py-2 rounded-lg text-white"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="bg-green-700 px-6 py-2 rounded-lg text-white"
          >
            {isEdit ? "Update" : "Save"}
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
};


// REUSABLE INPUT FIELD

const InputField = ({ label, name, value, onChange, type = "text" }) => (
  <div>
    <label className="block font-medium mb-1">{label}</label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      className="border p-2 rounded-lg w-full dark:bg-gray-900"
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block font-medium mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="border p-2 rounded-lg w-full dark:bg-gray-900"
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export default TeamForm;
