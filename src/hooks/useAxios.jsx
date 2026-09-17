
import { useState, useEffect, useCallback, useMemo } from "react";
import axiosInstance from "../components/common/AxiosInstance";

const useAxios = (endpoint, config = {}, fetchOnMount = true, dependency = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(fetchOnMount);
  const [error, setError] = useState(null);

  const memoizedConfig = useMemo(() => config, [JSON.stringify(config)]);

  // const fetchData = useCallback(async (overrideConfig = {}) => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const response = await axiosInstance({
  //       url: endpoint,
  //       method: memoizedConfig.method || "GET",
  //       ...memoizedConfig,
  //       ...overrideConfig,
  //     });
  //     setData(response.data?.data || response.data);
  //   } catch (err) {
  //     setError(err);
  //     console.error("API Fetch Error:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [endpoint, memoizedConfig]);


  const fetchData = useCallback(async (overrideConfig = {}) => {
  setLoading(true);
  setError(null);
  try {
    const response = await axiosInstance({
      url: endpoint,
      method: memoizedConfig.method || "GET",
      ...memoizedConfig,
      ...overrideConfig,
    });

    // Save data for auto fetch cases
    setData(response.data?.data || response.data);

    // ❗ VERY IMPORTANT – return full axios response
    return response;
  } catch (err) {
    setError(err);
    console.error("API Fetch Error:", err);
    return { error: err, status: err?.response?.status || 500 };
  } finally {
    setLoading(false);
  }
}, [endpoint, memoizedConfig]);

  useEffect(() => {
    if (fetchOnMount) fetchData();
  }, [fetchData, ...(Array.isArray(dependency) ? dependency : [])]);

  return { data, loading, error, refetch: fetchData };
};

export default useAxios;

