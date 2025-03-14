import { create } from "zustand";
import { persist } from "zustand/middleware";

// Định nghĩa interface cho ProductImage
export interface ProductImage {
  id: string;
  imageUrl: string;
  isMain: boolean;
}

// Định nghĩa interface cho Category
export interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  modifiedAt: string;
}

// Định nghĩa interface cho Product
export interface Product {
  id: string;
  name: string;
  description: string;
  quantity: number;
  volume: number;
  price: number;
  createdAt?: string;
  modifiedAt?: string;
  isHidden?: boolean;
  productImages: ProductImage[];
  categories?: Category[];
}

// Interface cho Product Store
interface ProductStore {
  products: Record<string, Product>; // Map của productId -> Product
  lastFetchTime: number; // thời điểm cuối cùng fetch danh sách sản phẩm
  saveProduct: (product: Product) => void;
  saveProducts: (products: Product[]) => void;
  getProduct: (id: string) => Product | null;
  clearProducts: () => void;
}

// Tạo store với middleware persist để lưu vào localStorage
export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: {},
      lastFetchTime: 0,

      // Lưu một sản phẩm vào store
      saveProduct: (product: Product) => {
        if (!product || !product.id) return;

        set((state) => ({
          products: {
            ...state.products,
            [product.id]: product,
          },
        }));
      },

      // Lưu nhiều sản phẩm vào store
      saveProducts: (products: Product[]) => {
        if (!products || !products.length) return;

        const productsMap: Record<string, Product> = {};
        products.forEach((product) => {
          if (product && product.id) {
            productsMap[product.id] = product;
          }
        });

        set((state) => ({
          products: {
            ...state.products,
            ...productsMap,
          },
          lastFetchTime: Date.now(),
        }));
      },

      // Lấy sản phẩm từ store
      getProduct: (id: string) => {
        const state = get();
        return state.products[id] || null;
      },

      // Xóa tất cả sản phẩm trong store
      clearProducts: () => {
        set({
          products: {},
          lastFetchTime: 0,
        });
      },
    }),
    {
      name: "doca-products",
      partialize: (state) => ({
        products: state.products,
        lastFetchTime: state.lastFetchTime,
      }),
    }
  )
);
