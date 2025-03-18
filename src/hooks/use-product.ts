"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useQueryApi } from "./use-query-api";

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  tags: string[];
  petType: string[]; // e.g., "dog", "cat", "bird"
  associatedBlogId?: string; // ID of the associated blog post
}

export interface CreateProductInput {
  title: string;
  description: string;
  price: number;
  discountPercentage?: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  tags: string[];
  petType: string[];
  associatedBlogId?: string;
}

export interface UpdateProductInput {
  title?: string;
  description?: string;
  price?: number;
  discountPercentage?: number;
  stock?: number;
  brand?: string;
  category?: string;
  thumbnail?: string;
  images?: string[];
  tags?: string[];
  petType?: string[];
  associatedBlogId?: string;
}

export type ProductFilter = {
  category?: string;
  petType?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  tag?: string;
  inStock?: boolean;
};

const PRODUCTS_ENDPOINT = "/products";
const PRODUCTS_QUERY_KEY = ["products"];

// Helper function to build filter query string
const buildFilterQueryString = (filters?: ProductFilter): string => {
  if (!filters) return "";

  const queryParams = new URLSearchParams();

  if (filters.category) queryParams.append("category", filters.category);
  if (filters.petType) queryParams.append("petType", filters.petType);
  if (filters.minPrice)
    queryParams.append("minPrice", filters.minPrice.toString());
  if (filters.maxPrice)
    queryParams.append("maxPrice", filters.maxPrice.toString());
  if (filters.brand) queryParams.append("brand", filters.brand);
  if (filters.tag) queryParams.append("tag", filters.tag);
  if (filters.inStock !== undefined)
    queryParams.append("inStock", filters.inStock.toString());

  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : "";
};

// Hook for fetching all products with optional filters
export function useProducts(filters?: ProductFilter) {
  const api = useQueryApi();

  const query = useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, filters],
    queryFn: () =>
      api.fetchData<Product[]>(
        `${PRODUCTS_ENDPOINT}${buildFilterQueryString(filters)}`
      ),
  });

  return {
    products: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

// Hook for fetching a single product by ID
export function useProductById(id: string) {
  const api = useQueryApi();

  const query = useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, id],
    queryFn: () => api.fetchById<Product>(PRODUCTS_ENDPOINT, id),
    enabled: !!id,
  });

  return {
    product: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

// Hook for fetching products associated with a specific blog post
export function useProductsByBlogId(blogId: string) {
  const api = useQueryApi();

  const query = useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, "blog", blogId],
    queryFn: () =>
      api.fetchData<Product[]>(
        `${PRODUCTS_ENDPOINT}?associatedBlogId=${blogId}`
      ),
    enabled: !!blogId,
  });

  return {
    products: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

// Hook for fetching featured products
export function useFeaturedProducts() {
  const api = useQueryApi();

  const query = useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, "featured"],
    queryFn: () => api.fetchData<Product[]>(`${PRODUCTS_ENDPOINT}/featured`),
  });

  return {
    featuredProducts: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

// Hook for product mutations (create, update, delete)
export function useProductMutations() {
  const queryClient = useQueryClient();
  const api = useQueryApi();

  // Create a new product
  const createProduct = useMutation({
    mutationFn: (data: CreateProductInput) =>
      api.createItem<Product, CreateProductInput>(PRODUCTS_ENDPOINT, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
  });

  // Update a product
  const updateProduct = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductInput }) =>
      api.updateItem<Product, UpdateProductInput>(PRODUCTS_ENDPOINT, id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...PRODUCTS_QUERY_KEY, variables.id],
      });
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
  });

  // Delete a product
  const deleteProduct = useMutation({
    mutationFn: (id: string) => api.deleteItem<Product>(PRODUCTS_ENDPOINT, id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [...PRODUCTS_QUERY_KEY, id] });
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
  });

  return {
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
