
import {
  FaClipboardList,
  FaCalendarAlt,
  FaUserTie,
  FaRegStickyNote,
  FaPaperclip,
} from "react-icons/fa";
import { Formik, Form } from "formik";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import FilterDatePicker from "../../components/common/FilterDatePicker";
import FormSelect from "../../components/common/FormSelect";

const ApplyLeaveForm = ({
  INITIAL_FORM_STATE,
  FORM_VALIDATION,
  isAdmin,
  empId,
  users = [],
  applyLeave,
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [attachedFile, setAttachedFile] = useState(null);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-6 md:p-8 relative overflow-hidden backdrop-blur-sm"
      >
        {/* Gradient bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00A65A] to-[#006D3C]" />

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-green-100 dark:bg-green-800 p-2 rounded-full">
            <FaClipboardList className="text-[#006D3C]" size={20} />
          </div>
          <h3 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100 tracking-wide">
            Apply for Leave
          </h3>
        </div>

        <Formik
          initialValues={INITIAL_FORM_STATE}
          validationSchema={FORM_VALIDATION}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              const formData = new FormData();
              formData.append("LeaveType", values.LeaveType);
              formData.append("StartDate", values.StartDate);
              formData.append("EndDate", values.EndDate);
              formData.append("Reason", values.Reason);
              formData.append("EmpId", isAdmin ? values.EmpId : empId);
              if (attachedFile) {
                formData.append("Document", attachedFile);
              }

              await applyLeave(formData);
              setPopupMessage(" Leave application submitted successfully!");
              setShowPopup(true);
              resetForm();
              setAttachedFile(null);
            } catch (err) {
              console.error(err);
              setPopupMessage(" Something went wrong. Please try again!");
              setShowPopup(true);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, setFieldValue, isSubmitting }) => {
            // Debug: Check if users array is received
            console.log("ApplyLeaveForm users:", users);

            // Set default EmpId for admin if empty
            useEffect(() => {
              if (isAdmin && users.length > 0 && !values.EmpId) {
                setFieldValue("EmpId", users[0].EmpId);
              }
            }, [users, isAdmin]);

            return (
              <Form className="space-y-6">
                {/* Leave Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
                  {/* Leave Type */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <FaUserTie className="text-[#006D3C]" size={14} />
                      Leave Type
                    </label>
                    <select
                      name="LeaveType"
                      value={values.LeaveType}
                      onChange={(e) => setFieldValue("LeaveType", e.target.value)}
                      className="w-full px-3 py-[10px] border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-[#00A65A] outline-none transition-all"
                    >
                      <option value="">Select Leave Type</option>
                      <option value="Sick Leave">Sick Leave</option>
                      <option value="Casual Leave">Casual Leave</option>
                      <option value="Earned Leave">Earned Leave</option>
                       <option value="Comp Off">Comp Off</option>
                    </select>
                  </div>

                  {/* Start Date */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <FaCalendarAlt size={14} className="text-[#006D3C]" />
                      Start Date
                    </label>
                    <FilterDatePicker
                      name="StartDate"
                      value={values.StartDate}
                      onChange={(val) => setFieldValue("StartDate", val)}
                    />
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <FaCalendarAlt size={14} className="text-[#006D3C]" />
                      End Date
                    </label>
                    <FilterDatePicker
                      name="EndDate"
                      value={values.EndDate}
                      onChange={(val) => setFieldValue("EndDate", val)}
                    />
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <FaRegStickyNote size={14} className="text-[#006D3C]" />
                    Reason
                  </label>
                  <textarea
                    name="Reason"
                    value={values.Reason}
                    onChange={(e) => setFieldValue("Reason", e.target.value)}
                    rows={3}
                    placeholder="Enter your reason for leave..."
                    className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#00A65A] bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 resize-none transition-all"
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <FaPaperclip size={14} className="text-[#006D3C]" />
                    Attach Document (Optional)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => setAttachedFile(e.target.files[0])}
                    className="block w-full text-sm text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer bg-white dark:bg-gray-800 p-2 focus:ring-2 focus:ring-[#00A65A] outline-none transition-all"
                  />
                  {attachedFile && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      Attached:{" "}
                      <strong className="text-[#006D3C]">{attachedFile.name}</strong>
                    </p>
                  )}
                </div>

                {/* Admin-Only Field */}
                {isAdmin && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <FaUserTie size={14} className="text-[#006D3C]" />
                      Apply on Behalf Of
                    </label>
                    <FormSelect
                      name="EmpId"
                      value={values.EmpId}
                      onChange={(val) => setFieldValue("EmpId", val)}
                      options={users.map((u) => ({
                        value: u.EmpId,
                        label: `${u.FirstName || ""} ${u.LastName || ""}`.trim(),
                      }))}
                      placeholder="Select employee"
                    />
                  </div>
                )}

                {/* Buttons */}
                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="reset"
                    className="px-5 py-2.5 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 font-medium transition-all duration-200"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#00A65A] to-[#006D3C] hover:opacity-90 text-white font-semibold shadow-md transform hover:scale-[1.03] transition-all duration-200"
                  >
                    {isSubmitting ? "Applying..." : "Submit"}
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </motion.div>

      {/* Popup Modal */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center border border-gray-200 dark:border-gray-700"
            >
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
                {popupMessage.includes("successfully") ? " Success" : " Alert"}
              </h4>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{popupMessage}</p>
              <button
                onClick={() => setShowPopup(false)}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-[#00A65A] to-[#006D3C] hover:opacity-90 text-white font-medium transition-all"
              >
                OK
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ApplyLeaveForm;
