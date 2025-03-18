"use client";

import { useCallback } from "react";
import { useApi } from "./use-api";

/**
 * Custom hook for API data operations with consistent error handling
 */
export function useQueryApi() {
  const api = useApi();

  /**
   * Fetches data with error handling
   */
  const fetchData = useCallback(
    async <T>(endpoint: string) => {
      try {
        return await api.get<T>(endpoint);
      } catch (error) {
        api.handleApiError(error);
        throw error;
      }
    },
    [api]
  );

  /**
   * Fetches a single item by ID with error handling
   */
  const fetchById = useCallback(
    async <T>(endpoint: string, id: string | number) => {
      try {
        return await api.get<T>(`${endpoint}/${id}`);
      } catch (error) {
        api.handleApiError(error);
        throw error;
      }
    },
    [api]
  );

  /**
   * Creates a new item with error handling
   */
  const createItem = useCallback(
    async <T, D>(endpoint: string, data: D) => {
      try {
        return await api.post<T, D>(endpoint, data);
      } catch (error) {
        api.handleApiError(error);
        throw error;
      }
    },
    [api]
  );

  /**
   * Updates an existing item with error handling
   */
  const updateItem = useCallback(
    async <T, D>(endpoint: string, id: string | number, data: D) => {
      try {
        return await api.put<T, D>(`${endpoint}/${id}`, data);
      } catch (error) {
        api.handleApiError(error);
        throw error;
      }
    },
    [api]
  );

  /**
   * Deletes an item with error handling
   */
  const deleteItem = useCallback(
    async <T>(endpoint: string, id: string | number) => {
      try {
        return await api.delete<T>(`${endpoint}/${id}`);
      } catch (error) {
        api.handleApiError(error);
        throw error;
      }
    },
    [api]
  );

  return {
    fetchData,
    fetchById,
    createItem,
    updateItem,
    deleteItem,
  };
}
