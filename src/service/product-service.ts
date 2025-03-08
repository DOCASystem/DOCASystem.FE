import { ProductApi } from "@/api/generated";
import apiClient from "@/api/api-client";

const productApi = new ProductApi(apiClient);

export const ProductService = {
  getProducts: async (params: {
    page?: number;
    size?: number;
    categoryIds?: string[];
    minPrice?: number;
    maxPrice?: number;
  }) => {
    try {
      return await productApi.apiV1ProductsGet(
        params.page,
        params.size,
        undefined,
        undefined,
        params.categoryIds,
        params.minPrice,
        params.maxPrice
      );
    } catch (error) {
      throw error;
    }
  },

  getProductById: async (id: string) => {
    try {
      return await productApi.apiV1ProductsIdGet(id);
    } catch (error) {
      throw error;
    }
  },

  createProduct: async (data: {
    name: string;
    description: string;
    price: number;
    quantity: number;
    mainImage: File;
    categoryIds?: string[];
  }) => {
    try {
      return await productApi.apiV1ProductsPost(
        data.name,
        data.description,
        data.price,
        data.quantity,
        0,
        false,
        data.mainImage,
        data.categoryIds
      );
    } catch (error) {
      throw error;
    }
  },
};
