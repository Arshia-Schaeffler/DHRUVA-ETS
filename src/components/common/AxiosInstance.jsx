

import axios from "axios";
import { loader } from "../../context/LoaderContext"; // Adjust path as needed

const BASE_API = import.meta.env.VITE_BASE_API_URL;

const axiosInstance = axios.create({
  baseURL: BASE_API,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    //  Add token to all requests
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    //  Show global loader
    loader?.showLoader?.();
    return config;
  },
  (error) => {
    loader?.hideLoader?.();
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    loader?.hideLoader?.();
    return response;
  },
  (error) => {
    loader?.hideLoader?.();
    console.error("API error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
