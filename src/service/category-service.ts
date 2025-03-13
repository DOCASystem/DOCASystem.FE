import { REAL_API_BASE_URL } from "@/utils/api-config";
import axios from "axios";

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

export const CategoryService = {
  getCategories: async (params: { page?: number; size?: number }) => {
    console.log("Gọi getCategories với params:", params);
    try {
      // Sử dụng axios trực tiếp để tránh lỗi
      const token = getToken();
      const url = `${REAL_API_BASE_URL}/api/v1/categories`;

      // Cố định size=30 nếu không được truyền vào
      const size = params.size || 30;
      // Quan trọng: API bắt đầu page từ 1, không phải từ 0
      const page = params.page || 1;

      console.log(
        `Gọi API danh mục từ URL: ${url} với page=${page}, size=${size}`
      );

      const response = await axios.get(url, {
        params: {
          page: page,
          size: size,
        },
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 giây timeout
        withCredentials: false, // Tắt credentials để tránh vấn đề CORS
      });

      console.log(
        `Kết quả API danh mục: ${response.status}, số lượng items: ${
          response.data?.items?.length || 0
        }`
      );

      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        config: response.config,
      };
    } catch (error) {
      console.error("Lỗi khi lấy danh mục:", error);

      // Nếu gặp lỗi, thử lại bằng fetch API với mode no-cors
      console.log("Đang thử lại với fetch API...");
      try {
        const token = getToken();
        // Cố định size=30
        const size = params.size || 30;
        // Quan trọng: API bắt đầu page từ 1, không phải từ 0
        const page = params.page || 1;

        const url = `${REAL_API_BASE_URL}/api/v1/categories?page=${page}&size=${size}`;
        console.log(`Thử lại với fetch, URL: ${url}`);

        const response = await fetch(url, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          // mode: "cors", // Cho phép CORS
          credentials: "omit", // Không gửi credentials
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(
          `Kết quả fetch API: ${response.status}, số lượng items: ${
            data?.items?.length || 0
          }`
        );

        return {
          data: data,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          config: {},
        };
      } catch (fetchError) {
        console.error("Lỗi khi thử lại bằng fetch API:", fetchError);
        throw error; // Ném lỗi gốc nếu cả hai cách đều thất bại
      }
    }
  },

  getCategoryById: async (id: string) => {
    try {
      // Sử dụng axios trực tiếp thay vì API client
      const token = getToken();
      const url = `${REAL_API_BASE_URL}/api/v1/categories/${id}`;

      console.log("Gọi API lấy chi tiết danh mục:", url);

      const response = await axios.get(url, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          Accept: "application/json",
        },
      });

      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        config: response.config,
      };
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

      // Sử dụng axios trực tiếp
      const url = `${REAL_API_BASE_URL}/api/v1/categories`;
      console.log("Gọi API tạo danh mục với:", data);

      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      console.log("Kết quả API tạo danh mục:", response);
      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        config: response.config,
      };
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
      // Sử dụng axios trực tiếp
      const token = getToken();
      const url = `${REAL_API_BASE_URL}/api/v1/categories/${id}`;

      const response = await axios.patch(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        config: response.config,
      };
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
