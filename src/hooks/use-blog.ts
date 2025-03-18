"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useQueryApi } from "./use-query-api";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  publishedAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  categories: string[];
  tags: string[];
  relatedProductIds: string[]; // IDs of related products
  petType: string[]; // e.g., "dog", "cat", "bird"
  readTime: number; // in minutes
  featured: boolean;
}

export interface CreateBlogInput {
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  categories: string[];
  tags: string[];
  relatedProductIds: string[];
  petType: string[];
  readTime: number;
  featured?: boolean;
}

export interface UpdateBlogInput {
  title?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  categories?: string[];
  tags?: string[];
  relatedProductIds?: string[];
  petType?: string[];
  readTime?: number;
  featured?: boolean;
}

export type BlogFilter = {
  category?: string;
  petType?: string;
  tag?: string;
  author?: string;
  featured?: boolean;
  searchQuery?: string;
};

const BLOGS_ENDPOINT = "/blogs";
const BLOGS_QUERY_KEY = ["blogs"];

// Helper function to build filter query string
const buildFilterQueryString = (filters?: BlogFilter): string => {
  if (!filters) return "";

  const queryParams = new URLSearchParams();

  if (filters.category) queryParams.append("category", filters.category);
  if (filters.petType) queryParams.append("petType", filters.petType);
  if (filters.tag) queryParams.append("tag", filters.tag);
  if (filters.author) queryParams.append("author", filters.author);
  if (filters.featured !== undefined)
    queryParams.append("featured", filters.featured.toString());
  if (filters.searchQuery) queryParams.append("search", filters.searchQuery);

  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : "";
};

// Hook for fetching all blog posts with optional filters
export function useBlogs(filters?: BlogFilter) {
  const api = useQueryApi();

  const query = useQuery({
    queryKey: [...BLOGS_QUERY_KEY, filters],
    queryFn: () =>
      api.fetchData<BlogPost[]>(
        `${BLOGS_ENDPOINT}${buildFilterQueryString(filters)}`
      ),
  });

  return {
    blogs: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

// Hook for fetching a single blog post by ID
export function useBlogById(id: string) {
  const api = useQueryApi();

  const query = useQuery({
    queryKey: [...BLOGS_QUERY_KEY, id],
    queryFn: () => api.fetchById<BlogPost>(BLOGS_ENDPOINT, id),
    enabled: !!id,
  });

  return {
    blog: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

// Hook for fetching a single blog post by slug
export function useBlogBySlug(slug: string) {
  const api = useQueryApi();

  const query = useQuery({
    queryKey: [...BLOGS_QUERY_KEY, "slug", slug],
    queryFn: () => api.fetchData<BlogPost>(`${BLOGS_ENDPOINT}/slug/${slug}`),
    enabled: !!slug,
  });

  return {
    blog: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

// Hook for fetching blogs related to a product
export function useBlogsByProductId(productId: string) {
  const api = useQueryApi();

  const query = useQuery({
    queryKey: [...BLOGS_QUERY_KEY, "product", productId],
    queryFn: () =>
      api.fetchData<BlogPost[]>(
        `${BLOGS_ENDPOINT}?relatedProductIds=${productId}`
      ),
    enabled: !!productId,
  });

  return {
    blogs: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

// Hook for fetching featured blog posts
export function useFeaturedBlogs() {
  const api = useQueryApi();

  const query = useQuery({
    queryKey: [...BLOGS_QUERY_KEY, "featured"],
    queryFn: () => api.fetchData<BlogPost[]>(`${BLOGS_ENDPOINT}?featured=true`),
  });

  return {
    featuredBlogs: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

// Hook for blog mutations (create, update, delete)
export function useBlogMutations() {
  const queryClient = useQueryClient();
  const api = useQueryApi();

  // Create a new blog post
  const createBlog = useMutation({
    mutationFn: (data: CreateBlogInput) =>
      api.createItem<BlogPost, CreateBlogInput>(BLOGS_ENDPOINT, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BLOGS_QUERY_KEY });
    },
  });

  // Update a blog post
  const updateBlog = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBlogInput }) =>
      api.updateItem<BlogPost, UpdateBlogInput>(BLOGS_ENDPOINT, id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...BLOGS_QUERY_KEY, variables.id],
      });
      queryClient.invalidateQueries({ queryKey: BLOGS_QUERY_KEY });
    },
  });

  // Delete a blog post
  const deleteBlog = useMutation({
    mutationFn: (id: string) => api.deleteItem<BlogPost>(BLOGS_ENDPOINT, id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [...BLOGS_QUERY_KEY, id] });
      queryClient.invalidateQueries({ queryKey: BLOGS_QUERY_KEY });
    },
  });

  return {
    createBlog,
    updateBlog,
    deleteBlog,
  };
}
