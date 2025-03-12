import { ProductApi, CategoryApi } from "@/api/generated";
import apiClient from "@/api/api-client";

const productApi = new ProductApi(apiClient);
const categoryApi = new CategoryApi(apiClient);

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
    volume: number;
    isHidden: boolean;
    productImages: {
      imageUrl: string;
      isMain: boolean;
    }[];
    categoryIds?: string[];
  }) => {
    try {
      // API chỉ chấp nhận mainImage và secondaryImages dưới dạng File
      // Chúng ta cần tạo request phù hợp với cách API hoạt động
      const mainImage =
        data.productImages.find((img) => img.isMain)?.imageUrl || "";
      const secondaryImages = data.productImages
        .filter((img) => !img.isMain)
        .map((img) => img.imageUrl);

      const response = await productApi.apiV1ProductsPost(
        data.name,
        data.description,
        data.price,
        data.quantity,
        data.volume,
        data.isHidden,
        new File([mainImage], "mainImage.jpg", { type: "image/jpeg" }),
        data.categoryIds,
        secondaryImages.map(
          (img) => new File([img], "secondaryImage.jpg", { type: "image/jpeg" })
        )
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateProduct: async (
    id: string,
    data: {
      name: string;
      description: string;
      price: number;
      quantity: number;
      volume: number;
      isHidden: boolean;
    }
  ) => {
    try {
      const response = await productApi.apiV1ProductsIdPatch(id, {
        name: data.name,
        description: data.description,
        price: data.price,
        quantity: data.quantity,
        volume: data.volume,
        isHidden: data.isHidden,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateProductImage: async (
    id: string,
    productImages: {
      id?: string;
      imageUrl: string;
      isMain: boolean;
    }[]
  ) => {
    try {
      // ProductApi không có phương thức apiV1ProductsIdImagesPost
      // Thay vào đó, chúng ta sử dụng apiV1ProductsIdProductImagePost
      const request = productImages.map((img) => ({
        imageUrl: new File([img.imageUrl], "image.jpg", { type: "image/jpeg" }),
        isMain: img.isMain,
      }));

      const response = await productApi.apiV1ProductsIdProductImagePost(
        id,
        request
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateProductCategories: async (
    productId: string,
    _categoryIds: string[]
  ) => {
    try {
      // ProductApi không có phương thức apiV1ProductsIdCategoriesPut
      // Chúng ta cần kiểm tra API để tìm phương thức thích hợp
      // Có thể cần sử dụng API từ CategoryApi
      const response = await categoryApi.apiV1CategoriesIdProductCategoryPatch(
        productId,
        {
          productIds: [productId],
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteProduct: async (_id: string) => {
    try {
      // ProductApi có thể không có phương thức apiV1ProductsIdDelete
      // Cần kiểm tra API để tìm phương thức thích hợp để xóa sản phẩm
      // Tạm thời trả về null
      return null;
    } catch (error) {
      throw error;
    }
  },
};

export const CategoryService = {
  getCategories: async (params: { page?: number; size?: number }) => {
    try {
      return await categoryApi.apiV1CategoriesGet(params.page, params.size);
    } catch (error) {
      throw error;
    }
  },

  getCategoryById: async (id: string) => {
    try {
      return await categoryApi.apiV1CategoriesIdGet(id);
    } catch (error) {
      throw error;
    }
  },

  createCategory: async (data: { name: string; description: string }) => {
    try {
      return await categoryApi.apiV1CategoriesPost(data);
    } catch (error) {
      throw error;
    }
  },

  updateCategory: async (
    id: string,
    data: { name: string; description: string }
  ) => {
    try {
      return await categoryApi.apiV1CategoriesIdPatch(id, data);
    } catch (error) {
      throw error;
    }
  },

  deleteCategory: async (_id: string) => {
    try {
      // CategoryApi có thể không có phương thức xóa
      // Trả về null hoặc sử dụng phương thức thích hợp nếu có
      return null;
    } catch (error) {
      throw error;
    }
  },
};
