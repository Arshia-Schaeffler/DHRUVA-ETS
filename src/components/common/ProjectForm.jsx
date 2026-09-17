

import React, { useEffect, useState } from "react";
import { Formik, Form, useFormikContext } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import Input from "./Input";
import FormSelect from "./FormSelect";
import useAxios from "../../hooks/useAxios";
import { GET_ALL_NORMAL_USERS } from "../../utils/Strings";
import FormikMultiSelect from "./FormikMultiSelect";
import FormikDatePicker from "./FormikDatePicker";



const INITIAL_FORM_STATE = {
  ProjectCode: "",
  ProjectName: "",
  ManagerId: "",
  Department: "",
  CompletionStatus: "Pending",
  ProjectStartDate: null,
  ProjectEndDate: null,
  Members: [],
};

//  VALIDATION

const FORM_VALIDATION = Yup.object().shape({
  ProjectCode: Yup.string().trim().required("Project code is required"),
  ProjectName: Yup.string().trim().required("Project name is required"),
  ManagerId: Yup.mixed().required("Manager selection is required"),
  Department: Yup.string().required("Department is required"),
  ProjectStartDate: Yup.date().required("Start date is required"),
  Members: Yup.array().min(1, "Select at least 1 member"),
});

//  DATE FORMATTER 

const formatToDateOnly = (value) => {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
};


const ProjectForm = ({ setIsCreateUpdate, objectToEdit }) => {
  const departments = useAxios("/department/get-departments", {}, true);
  const managers = useAxios("/employee/get-manager-list", {}, true);

  const FORM_STATE = objectToEdit
    ? {
      ...INITIAL_FORM_STATE,
      ...objectToEdit,
      Members: objectToEdit?.Members?.map((m) => m.EmpId) || [],
      ProjectStartDate: objectToEdit?.ProjectStartDate || null,
      ProjectEndDate: objectToEdit?.ProjectEndDate || null,
    }
    : INITIAL_FORM_STATE;

  // create/update API
  const createProject = useAxios("/project/create-project", { method: "POST" }, false);
  const updateProject = useAxios("/project/update-project", { method: "PUT" }, false);

  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
    >
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
        Project Details
      </h2>

      {/* FORM */}

      <Formik
        initialValues={FORM_STATE}
        validationSchema={FORM_VALIDATION}
        enableReinitialize
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setSubmitting(true);

          try {
            const payload = {
              ProjectCode: values.ProjectCode.trim(),
              ProjectName: values.ProjectName.trim(),
              ManagerId: Number(values.ManagerId),
              Department: values.Department,
              CompletionStatus: "Pending",
              ProjectStartDate: formatToDateOnly(values.ProjectStartDate),
              ProjectEndDate: formatToDateOnly(values.ProjectEndDate),
              Members: values.Members.map((m) => Number(m)),
            };

            let res;

            // UPDATE
            if (objectToEdit) {
              res = await updateProject.refetch({
                data: {
                  ...payload,
                  ProjectId: objectToEdit.ProjectId || objectToEdit.Id,
                },
              });
            }

            // CREATE 
            else {
              res = await createProject.refetch({ data: payload });
            }

            // RESPONSE CHECK FIXED 
            const data = res?.data;
            const status = data?.status;

            if (status === 200 || status === 201) {
              alert(data?.message || "Project saved successfully");
              resetForm();
              setIsCreateUpdate(false);
            } else {
              alert(data?.error || data?.message || "Failed to save project");
            }
          } catch (err) {
            console.error("Form Submit Error:", err);
            alert(err.message || "Unexpected error");
          }

          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-8">

            {/* BASIC INFO  */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input name="ProjectCode" label="Project Code" />
              <Input name="ProjectName" label="Project Name" />

              <FormSelect
                name="ManagerId"
                label="Manager"
                options={
                  managers?.data?.map((item) => ({
                    value: item.EmpId,
                    label: `${item.FirstName} ${item.LastName || ""}`,
                  })) || []
                }
              />

              <FormSelect
                name="Department"
                label="Department"
                options={
                  departments?.data?.map((item) => ({
                    value: item.DepartmentName,
                    label: item.DepartmentName,
                  })) || []
                }
              />
            </div>

            {/*  MEMBERS + DATES  */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

              <DepartmentMembersSelect />

              <FormikDatePicker
                name="ProjectStartDate"
                label="Project Start Date"
                className="w-full"
                inputClassName="border rounded-lg px-3 py-2 w-full"
                placeholder="Select start date"
              />


              <FormikDatePicker
                name="ProjectEndDate"
                label="Project End Date"
                 className="w-full"
                  inputClassName="border rounded-lg px-3 py-2 w-full"
                placeholder="Select end date"
              />
            </div>

            {/*  ACTION BUTTONS  */}

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2.5 rounded-lg shadow-md"
              >
                {objectToEdit ? "Update Project" : "Create Project"}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setIsCreateUpdate(false)}
                className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-6 py-2.5 rounded-lg"
              >
                Cancel
              </motion.button>
            </div>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
};


// MEMBER DROPDOWN COMPONENT


const DepartmentMembersSelect = () => {
  const { values } = useFormikContext();
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (values?.Department) {
      setUrl(`${GET_ALL_NORMAL_USERS}?department=${values.Department}`);
    } else {
      setUrl(null);
    }
  }, [values?.Department]);

  const users = useAxios(url, {}, !!url);

  return (
    <FormikMultiSelect
      name="Members"
      label="Select Members"
      options={
        users?.data?.map((item) => ({
          value: item.EmpId,
          label: `${item.FirstName} ${item.LastName || ""}`,
        })) || []
      }
      isDisabled={!values?.Department}
    />
  );
};



ProjectForm.propTypes = {
  setIsCreateUpdate: PropTypes.func.isRequired,
  objectToEdit: PropTypes.object,
};

export default ProjectForm;
