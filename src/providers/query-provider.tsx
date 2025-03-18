"use client";

import React from "react";
import {
  QueryClient,
  QueryClientProvider as ReactQueryClientProvider,
} from "@tanstack/react-query";

// Default query client configuration
const queryClientConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Don't refetch on window focus by default
      retry: 1, // Only retry failed queries once
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
};

interface QueryProviderProps {
  children: React.ReactNode;
}

/**
 * QueryClientProvider component
 * Wraps the application with React Query's QueryClientProvider
 */
export function QueryProvider({ children }: QueryProviderProps) {
  // Create a client
  const [queryClient] = React.useState(
    () => new QueryClient(queryClientConfig)
  );

  return (
    <ReactQueryClientProvider client={queryClient}>
      {children}
    </ReactQueryClientProvider>
  );
}
