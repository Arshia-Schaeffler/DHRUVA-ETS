import axiosInstance from "../../../components/common/AxiosInstance";


export const getWeeklyProjectHours = (params = {}) => {
  return axiosInstance.get(
    "/empTimesheet/report/weekly-project-hours",
    { params }
  );
};
