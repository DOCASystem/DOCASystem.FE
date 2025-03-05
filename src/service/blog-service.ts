import {
  BlogApi,
  UpdateBlogRequest,
  CreateBlogRequest,
  BlogEnum,
} from "@/api/generated";
import apiClient from "@/api/api-client";

const blogApi = new BlogApi(apiClient);

export const BlogService = {
  getBlogs: async (params: {
    page?: number;
    size?: number;
    categoryIds?: string[];
    status?: BlogEnum;
    name?: string;
  }) => {
    try {
      return await blogApi.apiV1BlogsGet(
        params.page,
        params.size,
        params.name,
        undefined, // createAt
        params.categoryIds,
        params.status
      );
    } catch (error) {
      throw error;
    }
  },

  getBlogById: async (id: string) => {
    try {
      return await blogApi.apiV1BlogsIdGet(id);
    } catch (error) {
      throw error;
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
