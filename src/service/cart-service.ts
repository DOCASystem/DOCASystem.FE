import axios from "axios";
import { getToken } from "@/auth/auth-service";
import { BlogService } from "./blog-service";

// URL API duy nhất
const API_URL = "https://production.doca.love";

// Định nghĩa custom event cho cart update
export const CART_UPDATED_EVENT = "cart-updated";

// Hàm để emit event khi giỏ hàng thay đổi
export const emitCartUpdatedEvent = () => {
  if (typeof window !== "undefined") {
    const event = new CustomEvent(CART_UPDATED_EVENT);
    window.dispatchEvent(event);
  }
};

// Interface cho thông tin thêm vào giỏ hàng
export interface AddToCartPayload {
  productId: string;
  blogId?: string;
  quantity: number;
}

// Interface cho kết quả giỏ hàng
export interface CartItemResponse {
  productId: string;
  blogId: string;
  productName: string;
  blogName: string;
  productDescription: string;
  blogDescription: string;
  price: number;
  quantity: number;
  volume: number;
  mainImage: string;
  productQuantity: number;
}

// Interface cho thông tin cập nhật giỏ hàng
export interface UpdateCartPayload {
  productId: string;
  blogId?: string;
  quantity: number;
}

// Service cho giỏ hàng
export const CartService = {
  // Thêm sản phẩm vào giỏ hàng
  addToCart: async (payload: AddToCartPayload) => {
    try {
      console.log("[CartService] Thêm sản phẩm vào giỏ hàng:", payload);

      // Nếu không có blogId, tạo một random blogId
      if (!payload.blogId) {
        try {
          const response = await BlogService.getBlogs({
            page: 1,
            size: 10,
          });

          if (response.data.items && response.data.items.length > 0) {
            // Chọn ngẫu nhiên một blog
            const randomIndex = Math.floor(
              Math.random() * response.data.items.length
            );
            payload.blogId = response.data.items[randomIndex].id;
            console.log(
              "[CartService] Đã chọn ngẫu nhiên blog ID:",
              payload.blogId
            );
          }
        } catch (error) {
          console.error("[CartService] Lỗi khi lấy danh sách blog:", error);
        }
      }

      const token = getToken();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const cartApiUrl = `${API_URL}/api/v1/carts`;
      console.log(`[CartService] Gọi API giỏ hàng: ${cartApiUrl}`);

      const response = await axios.post(cartApiUrl, payload, { headers });

      console.log("[CartService] Thêm vào giỏ hàng thành công:", response.data);

      // Emit event sau khi thêm thành công
      emitCartUpdatedEvent();

      return response.data;
    } catch (error) {
      console.error("[CartService] Lỗi khi thêm vào giỏ hàng:", error);
      throw error;
    }
  },

  // Lấy danh sách giỏ hàng
  getCart: async () => {
    try {
      console.log("[CartService] Đang lấy thông tin giỏ hàng");

      const token = getToken();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const cartApiUrl = `${API_URL}/api/v1/carts`;
      console.log(`[CartService] Gọi API giỏ hàng: ${cartApiUrl}`);

      const response = await axios.get<CartItemResponse[]>(cartApiUrl, {
        headers,
      });

      console.log("[CartService] Lấy giỏ hàng thành công:", response.data);
      return response.data;
    } catch (error) {
      console.error("[CartService] Lỗi khi lấy giỏ hàng:", error);
      throw error;
    }
  },

  // Xóa sản phẩm khỏi giỏ hàng
  removeFromCart: async (cartItemId: string) => {
    try {
      console.log("[CartService] Xóa sản phẩm khỏi giỏ hàng:", cartItemId);

      const token = getToken();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const cartApiUrl = `${API_URL}/api/v1/carts/${cartItemId}`;
      console.log(`[CartService] Gọi API xóa giỏ hàng: ${cartApiUrl}`);

      const response = await axios.delete(cartApiUrl, { headers });

      console.log("[CartService] Xóa khỏi giỏ hàng thành công");

      // Emit event sau khi xóa thành công
      emitCartUpdatedEvent();

      return response.data;
    } catch (error) {
      console.error("[CartService] Lỗi khi xóa khỏi giỏ hàng:", error);
      throw error;
    }
  },

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  updateCartQuantity: async (cartItemId: string, quantity: number) => {
    try {
      console.log("[CartService] Cập nhật số lượng sản phẩm:", {
        cartItemId,
        quantity,
      });

      const token = getToken();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const cartApiUrl = `${API_URL}/api/v1/carts/${cartItemId}`;
      console.log(`[CartService] Gọi API cập nhật giỏ hàng: ${cartApiUrl}`);

      const payload = { quantity };
      const response = await axios.patch(cartApiUrl, payload, { headers });

      console.log("[CartService] Cập nhật giỏ hàng thành công:", response.data);

      // Emit event sau khi cập nhật thành công
      emitCartUpdatedEvent();

      return response.data;
    } catch (error) {
      console.error("[CartService] Lỗi khi cập nhật giỏ hàng:", error);
      throw error;
    }
  },

  // Phương thức mới để cập nhật số lượng sản phẩm trong giỏ hàng với API PATCH
  updateCartItem: async (payload: UpdateCartPayload) => {
    try {
      console.log("[CartService] Cập nhật giỏ hàng:", payload);

      const token = getToken();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const cartApiUrl = `${API_URL}/api/v1/carts`;
      console.log(`[CartService] Gọi API PATCH giỏ hàng: ${cartApiUrl}`);

      const response = await axios.patch(cartApiUrl, payload, { headers });

      console.log("[CartService] Cập nhật giỏ hàng thành công:", response.data);

      // Emit event sau khi cập nhật thành công
      emitCartUpdatedEvent();

      return response.data;
    } catch (error) {
      console.error("[CartService] Lỗi khi cập nhật giỏ hàng:", error);
      throw error;
    }
  },
};
