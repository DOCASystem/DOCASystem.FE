import { useEffect, useState } from "react";
import apiMonitor, { ApiCall } from "../api/api-monitor";

export default function useApiMonitor() {
  const [apiCalls, setApiCalls] = useState<ApiCall[]>([]);
  const [filteredCalls, setFilteredCalls] = useState<ApiCall[]>([]);
  const [filter, setFilter] = useState({
    url: "",
    method: "",
    status: "",
    hasError: false,
  });

  useEffect(() => {
    // Lấy dữ liệu ban đầu
    setApiCalls(apiMonitor.getAllCalls());

    // Subscribe để cập nhật khi có thay đổi
    const unsubscribe = apiMonitor.subscribe(() => {
      setApiCalls(apiMonitor.getAllCalls());
    });

    return unsubscribe;
  }, []);

  // Áp dụng bộ lọc khi apiCalls hoặc filter thay đổi
  useEffect(() => {
    let result = [...apiCalls];

    if (filter.url) {
      result = result.filter((call) =>
        call.url.toLowerCase().includes(filter.url.toLowerCase())
      );
    }

    if (filter.method) {
      result = result.filter(
        (call) => call.method.toLowerCase() === filter.method.toLowerCase()
      );
    }

    if (filter.status) {
      const statusNumber = parseInt(filter.status);
      result = result.filter((call) => call.status === statusNumber);
    }

    if (filter.hasError) {
      result = result.filter((call) => !!call.error);
    }

    setFilteredCalls(result);
  }, [apiCalls, filter]);

  const clearLogs = () => {
    apiMonitor.clearLogs();
  };

  const updateFilter = (newFilter: Partial<typeof filter>) => {
    setFilter((prevFilter) => ({ ...prevFilter, ...newFilter }));
  };

  return {
    apiCalls: filteredCalls,
    allApiCalls: apiCalls,
    filter,
    updateFilter,
    clearLogs,
  };
}
