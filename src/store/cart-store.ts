import { create } from "zustand";
import { persist } from "zustand/middleware";

// Định nghĩa kiểu dữ liệu cho sản phẩm trong giỏ hàng
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

// Định nghĩa kiểu dữ liệu cho store giỏ hàng
interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

// Tạo store giỏ hàng sử dụng middleware persist để lưu vào localStorage
export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      // Thêm sản phẩm vào giỏ hàng
      addItem: (item: CartItem) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);

          if (existingItem) {
            // Nếu sản phẩm đã tồn tại, cập nhật số lượng
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          } else {
            // Nếu là sản phẩm mới, thêm vào danh sách
            return { items: [...state.items, item] };
          }
        });
      },

      // Xoá sản phẩm khỏi giỏ hàng
      removeItem: (id: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      // Cập nhật số lượng sản phẩm
      updateQuantity: (id: string, quantity: number) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },

      // Xoá toàn bộ giỏ hàng
      clearCart: () => {
        set({ items: [] });
      },
    }),
    {
      name: "doca-cart-storage", // Tên cho localStorage key
      partialize: (state) => ({ items: state.items }), // Chỉ lưu trữ items vào localStorage
    }
  )
);
