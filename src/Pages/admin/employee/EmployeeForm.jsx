import { Formik, Form } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import Input from "../../../components/common/Input";
import FormSelect from "../../../components/common/FormSelect";
import FormikDatePicker from "../../../components/common/FormikDatePicker";
import axiosInstance from "../../../components/common/AxiosInstance";

/* =======================
   INITIAL STATE
======================= */
const INITIAL_FORM_STATE = {
  EmpID: "",
  Name: "",
  LastName: "",
  Email: "",
  Mobile: "",
  Role: "user",
  Department: "",
  UserName: "",
  Designation: "",
  Status: "Active",
  JoiningDate: "",
  avatar: "",
};

const departmentOptions = [
  { value: "Admin-HR", label: "Admin-HR" },
  { value: "Project-Automation", label: "Project-Automation" },
  { value: "IT", label: "IT" },
  { value: "Sales", label: "Sales" },
];

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const FORM_VALIDATION = Yup.object({
  Name: Yup.string().required("First Name required"),
  LastName: Yup.string().required("Last Name required"),
  Email: Yup.string().email().required("Email required"),
  Mobile: Yup.string().required("Mobile required"),
  Department: Yup.string().required("Department required"),
  UserName: Yup.string().required("Username required"),
  Designation: Yup.string().required("Designation required"),
  JoiningDate: Yup.date().required("Joining Date required"),
});

/* =======================
   VIEW MODE ROW
======================= */
const ViewRow = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-sm font-medium text-gray-800">
      {value || "-"}
    </span>
  </div>
);

/* =======================
   MAIN COMPONENT
======================= */
const EmployeeForm = ({ initialValues, mode, onSuccess, onCancel }) => {
  const isView = mode === "view";
  const isEdit = mode === "edit";

  /* =======================
     VIEW MODE UI
  ======================= */
 if (isView) {
  return (
    <div className="bg-white rounded-xl p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <div className="flex items-center gap-4">
          <img
            src={initialValues?.avatar || "https://i.pravatar.cc/150"}
            alt="avatar"
            className="h-16 w-16 rounded-full object-cover border"
          />

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {initialValues?.Name} {initialValues?.LastName}
            </h2>
            <p className="text-sm text-gray-500">
              {initialValues?.Designation || "Employee"}
            </p>
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            initialValues?.Status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {initialValues?.Status}
        </span>
      </div>

      {/* BODY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PERSONAL INFO */}
        <div className="bg-gray-50 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase">
            Personal Information
          </h3>

          <div className="space-y-3">
            <ViewRow label="First Name" value={initialValues?.Name} />
            <ViewRow label="Last Name" value={initialValues?.LastName} />
            <ViewRow label="Email" value={initialValues?.Email} />
            <ViewRow label="Mobile" value={initialValues?.Mobile} />
          </div>
        </div>

        {/* WORK INFO */}
        <div className="bg-gray-50 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase">
            Work Information
          </h3>

          <div className="space-y-3">
            <ViewRow label="Employee ID" value={initialValues?.EmpID} />
            <ViewRow label="Username" value={initialValues?.UserName} />
            <ViewRow label="Department" value={initialValues?.Department} />
            <ViewRow label="Designation" value={initialValues?.Designation} />
            <ViewRow
              label="Joining Date"
              value={initialValues?.JoiningDate}
            />
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex justify-end mt-6">
        <button
          onClick={onCancel}
          className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  );
}

  /* =======================
     ADD / EDIT MODE
  ======================= */
  return (
    <Formik
      initialValues={initialValues || INITIAL_FORM_STATE}
      validationSchema={FORM_VALIDATION}
      enableReinitialize
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const payload = {
            FirstName: values.Name,
            LastName: values.LastName,
            Email: values.Email,
            Mobile: values.Mobile,
            Role: values.Role,
            JoiningDate: values.JoiningDate,
            department: values.Department,
            status: values.Status,
            UserName: values.UserName,
            Designation: values.Designation,
          };

          if (isEdit) {
            await axiosInstance.put(
              `/employee/editUser/${values.EmpID}`,
              payload
            );
          } else {
            await axiosInstance.post("/employee/addUser", payload);
          }

          onSuccess();
        } catch (err) {
          alert(err?.response?.data?.message || "Error");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input name="Name" label="First Name" />
          <Input name="LastName" label="Last Name" />
          <Input name="Email" label="Email" />
          <Input name="Mobile" label="Mobile" />
          <Input name="UserName" label="Username" />
          <Input name="Designation" label="Designation" />

          <FormSelect
            name="Department"
            label="Department"
            options={departmentOptions}
          />

          <FormSelect
            name="Status"
            label="Status"
            options={statusOptions}
          />

          <FormikDatePicker
            name="JoiningDate"
            label="Joining Date"
          />

          <div className="col-span-full flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#006633] text-white rounded"
            >
              {isEdit ? "Update" : "Submit"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

EmployeeForm.propTypes = {
  initialValues: PropTypes.object,
  mode: PropTypes.string.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default EmployeeForm;

