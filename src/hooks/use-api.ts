"use client";

import { useState, useCallback } from "react";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { showErrorToast } from "@/components/common/toast";

// API error type
export interface ApiError {
  message: string;
  statusCode?: number;
  error?: string;
}

// Default base URL from environment variables
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || ""}/api`;

/**
 * Custom hook for making API requests
 * Provides error handling and response formatting
 */
export function useApi() {
  const [baseUrl] = useState(API_BASE_URL);

  /**
   * Makes a GET request to the specified endpoint
   */
  const get = useCallback(
    async <T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> => {
      try {
        const response = await axios.get<T>(`${baseUrl}${endpoint}`, {
          ...config,
          headers: {
            "Content-Type": "application/json",
            ...config?.headers,
          },
        });
        return response.data;
      } catch (error) {
        const err = error as AxiosError<ApiError>;
        const errorMessage =
          err.response?.data?.message ||
          "An error occurred while fetching data";
        throw new Error(errorMessage);
      }
    },
    [baseUrl]
  );

  /**
   * Makes a POST request to the specified endpoint
   */
  const post = useCallback(
    async <T, D = unknown>(
      endpoint: string,
      data?: D,
      config?: AxiosRequestConfig
    ): Promise<T> => {
      try {
        const response = await axios.post<T>(`${baseUrl}${endpoint}`, data, {
          ...config,
          headers: {
            "Content-Type": "application/json",
            ...config?.headers,
          },
        });
        return response.data;
      } catch (error) {
        const err = error as AxiosError<ApiError>;
        const errorMessage =
          err.response?.data?.message ||
          "An error occurred while submitting data";
        throw new Error(errorMessage);
      }
    },
    [baseUrl]
  );

  /**
   * Makes a PUT request to the specified endpoint
   */
  const put = useCallback(
    async <T, D = unknown>(
      endpoint: string,
      data?: D,
      config?: AxiosRequestConfig
    ): Promise<T> => {
      try {
        const response = await axios.put<T>(`${baseUrl}${endpoint}`, data, {
          ...config,
          headers: {
            "Content-Type": "application/json",
            ...config?.headers,
          },
        });
        return response.data;
      } catch (error) {
        const err = error as AxiosError<ApiError>;
        const errorMessage =
          err.response?.data?.message ||
          "An error occurred while updating data";
        throw new Error(errorMessage);
      }
    },
    [baseUrl]
  );

  /**
   * Makes a DELETE request to the specified endpoint
   */
  const del = useCallback(
    async <T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> => {
      try {
        const response = await axios.delete<T>(`${baseUrl}${endpoint}`, {
          ...config,
          headers: {
            "Content-Type": "application/json",
            ...config?.headers,
          },
        });
        return response.data;
      } catch (error) {
        const err = error as AxiosError<ApiError>;
        const errorMessage =
          err.response?.data?.message ||
          "An error occurred while deleting data";
        throw new Error(errorMessage);
      }
    },
    [baseUrl]
  );

  /**
   * Handles API errors and shows a toast notification
   */
  const handleApiError = useCallback((error: unknown) => {
    let errorMessage = "An error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (error instanceof AxiosError && error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    showErrorToast(errorMessage);
    return errorMessage;
  }, []);

  return {
    get,
    post,
    put,
    delete: del,
    handleApiError,
  };
}
