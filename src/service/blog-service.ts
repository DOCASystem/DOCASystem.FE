import axios from "axios";
import {
  BlogApi,
  UpdateBlogRequest,
  CreateBlogRequest,
  BlogEnum,
} from "@/api/generated";
import apiClient from "@/api/api-client";

const blogApi = new BlogApi(apiClient);

// Interface cho mô hình blog
export interface Blog {
  id: string;
  title: string;
  content: string;
  description?: string;
  createdAt: string;
  modifiedAt: string;
  blogImage?: {
    id: string;
    imageUrl: string;
  };
}

// Interface cho các tham số truy vấn
export interface BlogParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  search?: string;
}

// Hàm lấy token xác thực từ localStorage
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
};

export const BlogService = {
  getBlogs: async (params: BlogParams = { page: 1, size: 10 }) => {
    try {
      // Sử dụng URL API duy nhất
      console.log("[BlogService] Đang tải danh sách blogs");
      const url = `https://production.doca.love/api/v1/blogs`;

      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.size) queryParams.append("size", params.size.toString());
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.sortDir) queryParams.append("sortDir", params.sortDir);
      if (params.search) queryParams.append("search", params.search);

      const fullUrl = `${url}?${queryParams.toString()}`;
      console.log(`[BlogService] Gọi API: ${fullUrl}`);

      const token = getToken();
      const response = await axios.get(fullUrl, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (response.status === 200) {
        console.log(
          `[BlogService] Đã tải thành công ${
            response.data.items?.length || 0
          } blogs`
        );
        return response.data;
      } else {
        console.error(`[BlogService] Lỗi khi tải blogs: ${response.status}`);
        throw new Error(`Không thể tải danh sách blogs (${response.status})`);
      }
    } catch (error) {
      console.error("[BlogService] Lỗi khi tải blogs:", error);
      throw {
        message: "Không thể tải danh sách blogs",
        error,
      };
    }
  },

  getBlogById: async (id: string) => {
    try {
      // Sử dụng URL API duy nhất
      console.log(`[BlogService] Đang tải chi tiết blog ID: ${id}`);
      const url = `https://production.doca.love/api/v1/blogs/${id}`;

      console.log(`[BlogService] Gọi API: ${url}`);

      const token = getToken();
      const response = await axios.get(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (response.status === 200) {
        console.log(
          `[BlogService] Đã tải thành công chi tiết blog: ${response.data?.title}`
        );
        return response.data;
      } else {
        console.error(
          `[BlogService] Lỗi khi tải chi tiết blog: ${response.status}`
        );
        throw new Error(`Không thể tải chi tiết blog (${response.status})`);
      }
    } catch (error) {
      console.error(`[BlogService] Lỗi khi tải chi tiết blog:`, error);
      throw {
        message: "Không thể tải chi tiết blog",
        error,
      };
    }
  },

  createBlog: async (data: {
    title: string;
    description: string;
    status: BlogEnum;
    categoryIds: string[];
    mainImage: File;
    secondaryImages?: File[];
  }) => {
    try {
      const createBlogRequest: CreateBlogRequest = {
        name: data.title,
        description: data.description,
        status: data.status,
        blogCategoryIds: data.categoryIds,
        mainImage: data.mainImage,
        secondaryImages: data.secondaryImages || null,
        isHidden: false,
      };

      return await blogApi.apiV1BlogsPost(createBlogRequest);
    } catch (error) {
      throw error;
    }
  },

  updateBlog: async (
    id: string,
    data: {
      title?: string;
      description?: string;
      status?: BlogEnum;
      isHidden?: boolean;
    }
  ) => {
    try {
      const updateBlogRequest: UpdateBlogRequest = {
        name: data.title,
        description: data.description,
        status: data.status,
        isHidden: data.isHidden,
      };

      return await blogApi.apiV1BlogsIdPatch(id, updateBlogRequest);
    } catch (error) {
      throw error;
    }
  },
};
