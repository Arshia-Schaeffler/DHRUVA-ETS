
import { useState, useEffect } from "react";
 import axiosInstance from "../../../components/common/AxiosInstance";


export default function CustomerFormModal({ onClose, onSave, editData }) {
  const [form, setForm] = useState({
    customername: "",
    email: "",
    contact: "",
    address: "",
  });

  useEffect(() => {
    if (editData) {
      setForm(editData);
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editData) {
        const res = await axiosInstance.put(
          `/customer/updatedCustomerDetails?customer_id=${editData.customer_id}`,
          form
        );
        onSave(res.data.data);
      } else {
        const res = await axiosInstance.post(`/customer/create-customerDetails`, form);
        onSave(res.data.data);
      }
    } catch (err) {
      console.error("Error saving customer:", err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4 text-center">
          {editData ? "Edit Customer" : "Add New Customer"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="customername"
            placeholder="Customer Name"
            value={form.customername}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
            required
          />
          <input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
            required
          />
         
            <input
              name="contact"
              placeholder="Mobile"
              value={form.contact}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
              required
            />
         
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100 dark:text-white dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              {editData ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
