import axios from "axios";
import {
  BlogApi,
  UpdateBlogRequest,
  CreateBlogRequest,
  BlogEnum,
} from "@/api/generated";
import apiClient from "@/api/api-client";

// URL API trực tiếp không được ẩn đi
const API_URL = "https://production.doca.love/api";

const blogApi = new BlogApi(apiClient);

// Interface cho mô hình blog mới
export interface AnimalImage {
  id: string;
  animalId: string;
  imageUrl: string;
  isMain: boolean;
}

export interface Animal {
  id: string;
  name: string;
  description: string;
  age: number;
  sex: string;
  createdAt: string;
  modifiedAt: string;
  animalImage: AnimalImage[];
}

export interface BlogCategory {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  modifiedAt: string;
}

// Interface cho mô hình blog
export interface Blog {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  modifiedAt: string;
  status: number;
  isHidden: boolean;
  blogCategories?: BlogCategory[];
  animals?: Animal[];
  authorName?: string;
}

// Interface cho các tham số truy vấn
export interface BlogParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  search?: string;
  isAsc?: boolean;
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
      // Sử dụng URL API trực tiếp
      console.log("[BlogService] Đang tải danh sách blogs");
      const url = `https://production.doca.love/api/v1/blogs`;

      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.size) queryParams.append("size", params.size.toString());
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.isAsc !== undefined)
        queryParams.append("isAsc", params.isAsc.toString());
      if (params.search) queryParams.append("search", params.search);

      const fullUrl = `${url}?${queryParams.toString()}`;
      console.log(`[BlogService] Gọi API trực tiếp: ${fullUrl}`);

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

        // Kiểm tra dữ liệu trả về có đúng cấu trúc không
        if (!response.data.items) {
          console.warn("[BlogService] Dữ liệu không hợp lệ:", response.data);
        }

        return {
          data: response.data,
          success: true,
        };
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
      // Sử dụng URL API trực tiếp
      console.log(`[BlogService] Đang tải chi tiết blog ID: ${id}`);
      const url = `https://production.doca.love/api/v1/blogs/${id}`;

      console.log(`[BlogService] Gọi API trực tiếp: ${url}`);

      const token = getToken();
      const response = await axios.get(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (response.status === 200) {
        console.log(
          `[BlogService] Đã tải thành công chi tiết blog: ${response.data?.name}`
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
      // Log URL API trực tiếp cho việc tạo blog
      console.log("[BlogService] Tạo blog mới với API URL trực tiếp:", API_URL);

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
      console.error("[BlogService] Lỗi khi tạo blog:", error);
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
      // Log URL API trực tiếp cho việc cập nhật blog
      console.log(
        `[BlogService] Cập nhật blog ID ${id} với API URL trực tiếp:`,
        API_URL
      );

      const updateBlogRequest: UpdateBlogRequest = {
        name: data.title,
        description: data.description,
        status: data.status,
        isHidden: data.isHidden,
      };

      return await blogApi.apiV1BlogsIdPatch(id, updateBlogRequest);
    } catch (error) {
      console.error(`[BlogService] Lỗi khi cập nhật blog ID ${id}:`, error);
      throw error;
    }
  },

  // Hàm lấy URL hình ảnh từ dữ liệu blog
  getBlogImageUrl: (blog: Blog): string => {
    // Kiểm tra nếu có animals và animalImage
    if (blog.animals && blog.animals.length > 0) {
      // Tìm trong danh sách animals
      for (const animal of blog.animals) {
        if (animal.animalImage && animal.animalImage.length > 0) {
          // Ưu tiên lấy ảnh chính (isMain=true)
          const mainImage = animal.animalImage.find((img) => img.isMain);
          if (mainImage && mainImage.imageUrl) {
            return mainImage.imageUrl;
          }

          // Nếu không có ảnh chính, lấy ảnh đầu tiên
          if (animal.animalImage[0].imageUrl) {
            return animal.animalImage[0].imageUrl;
          }
        }
      }
    }

    // Nếu không tìm thấy ảnh, trả về ảnh mặc định
    return "/images/blog-placeholder.png";
  },
};
