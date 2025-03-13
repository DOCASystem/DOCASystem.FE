import { CategoryApi, Configuration } from "@/api/generated";
import { REAL_API_BASE_URL } from "@/utils/api-config";

// Hàm lấy token an toàn từ localStorage
const getToken = () => {
  if (typeof window !== "undefined") {
    try {
      const token = localStorage.getItem("token");
      console.log(
        "Token đọc từ localStorage:",
        token ? "Có token" : "Không có token"
      );
      return token || "";
    } catch (error) {
      console.error("Lỗi khi đọc token từ localStorage:", error);
      return "";
    }
  }
  return "";
};

// Tạo instance mới của API client
const getCategoryApiInstance = () => {
  // Tạo cấu hình với Authorization header
  const token = getToken();
  const config = new Configuration({
    basePath: REAL_API_BASE_URL,
    baseOptions: {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    },
  });

  return new CategoryApi(config);
};

// Hàm retry khi gọi API thất bại
const retryApiCall = async <T>(
  apiCall: () => Promise<T>,
  maxRetries = 2
): Promise<T> => {
  let lastError: Error | unknown;
  for (let retry = 0; retry <= maxRetries; retry++) {
    try {
      if (retry > 0) {
        console.log(`Đang thử lại lần ${retry}/${maxRetries}...`);
        // Đợi một khoảng thời gian trước khi thử lại
        await new Promise((resolve) => setTimeout(resolve, retry * 500));
      }
      return await apiCall();
    } catch (error) {
      console.error(`Lỗi khi gọi API (lần thử ${retry}/${maxRetries}):`, error);
      lastError = error;
    }
  }
  // Nếu đã hết số lần thử, ném ra lỗi cuối cùng
  throw lastError;
};

// Hàm thử gọi API mà không sử dụng retry để tránh chặn luồng quá lâu khi server gặp lỗi
const safeApiCall = async <T>(apiCall: () => Promise<T>): Promise<T | null> => {
  try {
    return await apiCall();
  } catch (error: unknown) {
    // Kiểm tra nếu lỗi là do mạng hoặc server
    const axiosError = error as {
      response?: { status: number };
      message?: string;
    };
    if (axiosError?.response?.status === 500) {
      console.error(
        "Lỗi server (500):",
        axiosError?.message || "Lỗi không xác định"
      );
      console.log(
        "Server có thể đang bảo trì hoặc gặp sự cố. Vui lòng thử lại sau."
      );
      return null;
    }
    throw error;
  }
};

export const CategoryService = {
  getCategories: async (params: { page?: number; size?: number }) => {
    console.log("Gọi getCategories với params:", params);
    try {
      const categoryApi = getCategoryApiInstance();
      return await categoryApi.apiV1CategoriesGet(params.page, params.size);
    } catch (error) {
      console.error("Lỗi khi lấy danh mục:", error);
      throw error;
    }
  },

  getCategoryById: async (id: string) => {
    try {
      const categoryApi = getCategoryApiInstance();
      return await categoryApi.apiV1CategoriesIdGet(id);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin danh mục:", error);
      throw error;
    }
  },

  createCategory: async (data: { name: string; description: string }) => {
    try {
      console.log("CategoryService.createCategory được gọi với data:", data);

      // Kiểm tra nếu window là undefined (SSR)
      if (typeof window === "undefined") {
        console.error(
          "CategoryService.createCategory: window is undefined (Server-side rendering)"
        );
        throw new Error("Cannot create category on server side");
      }

      const token = getToken();
      console.log("Token được sử dụng:", token ? "Có token" : "Không có token");

      if (!token) {
        throw new Error("Không tìm thấy token, vui lòng đăng nhập lại");
      }

      // Khởi tạo API client
      const categoryApi = getCategoryApiInstance();

      if (!categoryApi) {
        throw new Error("categoryApi không được khởi tạo");
      }

      console.log("Gọi API tạo danh mục với:", data);
      const response = await categoryApi.apiV1CategoriesPost(data);
      console.log("Kết quả API tạo danh mục:", response);
      return response;
    } catch (error) {
      console.error("Lỗi từ API tạo danh mục:", error);
      throw error;
    }
  },

  updateCategory: async (
    id: string,
    data: { name: string; description: string }
  ) => {
    try {
      const categoryApi = getCategoryApiInstance();
      return await categoryApi.apiV1CategoriesIdPatch(id, data);
    } catch (error) {
      console.error("Lỗi khi cập nhật danh mục:", error);
      throw error;
    }
  },

  deleteCategory: async (id: string) => {
    try {
      // Hiện tại API có thể không hỗ trợ xóa danh mục
      console.log("Chức năng xóa danh mục chưa được hỗ trợ:", id);
      return null;
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
      throw error;
    }
  },
};
