"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useQueryApi } from "./use-query-api";

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod: string;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phoneNumber: string;
  };
  createdAt: string;
  updatedAt: string;
  blogIds: string[]; // Associated blog posts
  notes?: string;
  donationAmount?: number; // Optional donation amount for pet welfare
}

export interface CreateOrderInput {
  items: {
    productId: string;
    quantity: number;
  }[];
  paymentMethod: string;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phoneNumber: string;
  };
  blogIds: string[];
  notes?: string;
  donationAmount?: number;
}

export interface UpdateOrderInput {
  status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus?: "pending" | "paid" | "failed" | "refunded";
  notes?: string;
}

export type OrderFilter = {
  status?: string;
  paymentStatus?: string;
  fromDate?: string;
  toDate?: string;
};

const ORDERS_ENDPOINT = "/orders";
const ORDERS_QUERY_KEY = ["orders"];

// Helper function to build filter query string
const buildFilterQueryString = (filters?: OrderFilter): string => {
  if (!filters) return "";

  const queryParams = new URLSearchParams();

  if (filters.status) queryParams.append("status", filters.status);
  if (filters.paymentStatus)
    queryParams.append("paymentStatus", filters.paymentStatus);
  if (filters.fromDate) queryParams.append("fromDate", filters.fromDate);
  if (filters.toDate) queryParams.append("toDate", filters.toDate);

  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : "";
};

// Hook for fetching user's orders with optional filters
export function useUserOrders(filters?: OrderFilter) {
  const api = useQueryApi();

  const query = useQuery({
    queryKey: [...ORDERS_QUERY_KEY, "user", filters],
    queryFn: () =>
      api.fetchData<Order[]>(
        `${ORDERS_ENDPOINT}/user${buildFilterQueryString(filters)}`
      ),
  });

  return {
    orders: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

// Hook for fetching a single order by ID
export function useOrderById(id: string) {
  const api = useQueryApi();

  const query = useQuery({
    queryKey: [...ORDERS_QUERY_KEY, id],
    queryFn: () => api.fetchById<Order>(ORDERS_ENDPOINT, id),
    enabled: !!id,
  });

  return {
    order: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

// Hook for fetching orders associated with specific blogs
export function useOrdersByBlogId(blogId: string) {
  const api = useQueryApi();

  const query = useQuery({
    queryKey: [...ORDERS_QUERY_KEY, "blog", blogId],
    queryFn: () =>
      api.fetchData<Order[]>(`${ORDERS_ENDPOINT}?blogIds=${blogId}`),
    enabled: !!blogId,
  });

  return {
    orders: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

// Hook for order mutations (create, update)
export function useOrderMutations() {
  const queryClient = useQueryClient();
  const api = useQueryApi();

  // Create a new order
  const createOrder = useMutation({
    mutationFn: (data: CreateOrderInput) =>
      api.createItem<Order, CreateOrderInput>(ORDERS_ENDPOINT, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
    },
  });

  // Update an order
  const updateOrder = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderInput }) =>
      api.updateItem<Order, UpdateOrderInput>(ORDERS_ENDPOINT, id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...ORDERS_QUERY_KEY, variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
    },
  });

  // Cancel an order
  const cancelOrder = useMutation({
    mutationFn: (id: string) =>
      api.updateItem<Order, UpdateOrderInput>(ORDERS_ENDPOINT, id, {
        status: "cancelled",
      }),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [...ORDERS_QUERY_KEY, id] });
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
    },
  });

  return {
    createOrder,
    updateOrder,
    cancelOrder,
  };
}
