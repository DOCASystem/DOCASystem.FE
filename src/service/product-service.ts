import { ProductApi, Configuration } from "@/api/generated";
import { REAL_API_BASE_URL } from "@/utils/api-config";

// Hàm lấy token an toàn từ localStorage
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token") || "";
  }
  return "";
};

// Tạo instance mới của API client
const getProductApiInstance = () => {
  // Tạo cấu hình với Authorization header
  const config = new Configuration({
    basePath: REAL_API_BASE_URL,
    baseOptions: {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    },
  });

  return new ProductApi(config);
};

export const ProductService = {
  getProducts: async (params: {
    page?: number;
    size?: number;
    categoryIds?: string[];
    minPrice?: number;
    maxPrice?: number;
  }) => {
    try {
      const productApi = getProductApiInstance();
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
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      throw error;
    }
  },

  getProductById: async (id: string) => {
    try {
      const productApi = getProductApiInstance();
      return await productApi.apiV1ProductsIdGet(id);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin sản phẩm:", error);
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
      const productApi = getProductApiInstance();
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
      console.error("Lỗi khi tạo sản phẩm:", error);
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
      const productApi = getProductApiInstance();
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
      console.error("Lỗi khi cập nhật sản phẩm:", error);
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
      const productApi = getProductApiInstance();
      // Tạo request phù hợp với API
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
      console.error("Lỗi khi cập nhật hình ảnh sản phẩm:", error);
      throw error;
    }
  },

  // Các phương thức khác đã được chuyển sang category-service.ts
};
