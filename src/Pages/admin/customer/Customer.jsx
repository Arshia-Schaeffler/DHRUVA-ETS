
import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import Swal from "sweetalert2";
import avatar1 from "../../../assets/images/team-1.jpg";
import avatar2 from "../../../assets/images/team-2.jpg";
 import axiosInstance from "../../../components/common/AxiosInstance";
  import CustomerCard from "./CustomerCard";
 import CustomerFormModal from "./CustomerForm"; // assume your modal component is here

export default function Customer() {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchCustomers = async () => {
    try {
      const response = await axiosInstance.get(`/customer/get_allCustomerDetails`);
      const enriched = response?.data?.data?.map((customer, index) => ({
        ...customer,
        image: customer.image || (index % 2 === 0 ? avatar1 : avatar2), // fallback image
      }));
      setCustomers(enriched || []);
    } catch (err) {
      console.error("Failed to fetch customers:", err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearch = (e) => setSearchQuery(e.target.value);

  const handleEdit = (customer) => {
    setEditData(customer);
    setFormModalOpen(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this customer?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setCustomers((prev) => prev.filter((c) => c.customer_id !== id));

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Customer deleted successfully",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    });
  };

  const handleClose = () => {
    setFormModalOpen(false);
    setEditData(null);
  };

  const handleSave = (newCustomer) => {
    if (editData) {
      // Edit case
      setCustomers((prev) =>
        prev.map((c) => (c.customer_id === newCustomer.customer_id ? newCustomer : c))
      );
    } else {
      // Add case
      const newWithImage = {
        ...newCustomer,
        image: customers.length % 2 === 0 ? avatar1 : avatar2,
      };
      setCustomers((prev) => [...prev, newWithImage]);
    }
    handleClose();
  };

  const filtered = customers.filter((c) =>
    (c?.customername || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-white">
          Customer Details
        </h2>
        <button
          onClick={() => setFormModalOpen(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          <FiPlus /> New Customer
        </button>
      </div>

      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search by name..."
        className="mb-4 w-60 px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {filtered.length > 0 ? (
          filtered.map((c) => (
            <CustomerCard
              key={c.customer_id}
              customer={c}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">No Customers Found</p>
        )}
      </div>

      {formModalOpen && (
        <CustomerFormModal
          onClose={handleClose}
          onSave={handleSave}
          editData={editData}
        />
      )}
    </div>
  );
}

