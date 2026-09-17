

import React, { createContext, useState, useContext, useEffect } from "react";

// Create Context
const LoaderContext = createContext();

// Create Singleton Access
let loaderInstance = null;

// Public API for global use (e.g., inside Axios)
export const loader = {
  showLoader: () => loaderInstance?.showLoader(),
  hideLoader: () => loaderInstance?.hideLoader(),
};

// Provider Component
export const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const showLoader = () => setLoading(true);
  const hideLoader = () => setLoading(false);

  // Assign to singleton
  useEffect(() => {
    loaderInstance = { showLoader, hideLoader };
  }, []);

  return (
    <LoaderContext.Provider value={{ loading, showLoader, hideLoader }}>
      {children}
    </LoaderContext.Provider>
  );
};

// Custom hook to use loader
export const useLoader = () => useContext(LoaderContext);
