"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "./use-product";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface BlogAssociation {
  blogId: string;
  title: string;
  image: string;
}

interface CartState {
  items: CartItem[];
  associatedBlogs: BlogAssociation[];
  donationAmount: number;

  // Actions
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  // Blog associations
  addBlogAssociation: (blogId: string, title: string, image: string) => void;
  removeBlogAssociation: (blogId: string) => void;

  // Donation
  setDonationAmount: (amount: number) => void;

  // Cart calculations
  getSubtotal: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      associatedBlogs: [],
      donationAmount: 0,

      // Add item to cart
      addItem: (product: Product, quantity: number) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.productId === product.id
          );

          if (existingItem) {
            // Update existing item
            return {
              items: state.items.map((item) =>
                item.productId === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          } else {
            // Add new item
            return {
              items: [
                ...state.items,
                {
                  productId: product.id,
                  name: product.title,
                  price: product.price,
                  quantity,
                  image: product.thumbnail,
                },
              ],
            };
          }
        });
      },

      // Remove item from cart
      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },

      // Update item quantity
      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        }));
      },

      // Clear cart
      clearCart: () => {
        set({
          items: [],
          associatedBlogs: [],
          donationAmount: 0,
        });
      },

      // Add blog association
      addBlogAssociation: (blogId: string, title: string, image: string) => {
        set((state) => {
          const existingBlog = state.associatedBlogs.find(
            (blog) => blog.blogId === blogId
          );

          if (existingBlog) {
            return state; // Blog already associated
          } else {
            return {
              associatedBlogs: [
                ...state.associatedBlogs,
                { blogId, title, image },
              ],
            };
          }
        });
      },

      // Remove blog association
      removeBlogAssociation: (blogId: string) => {
        set((state) => ({
          associatedBlogs: state.associatedBlogs.filter(
            (blog) => blog.blogId !== blogId
          ),
        }));
      },

      // Set donation amount
      setDonationAmount: (amount: number) => {
        set({ donationAmount: Math.max(0, amount) });
      },

      // Calculate subtotal
      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      // Calculate total (subtotal + donation)
      getTotal: () => {
        return get().getSubtotal() + get().donationAmount;
      },

      // Get total item count
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: "doca-pet-cart",
    }
  )
);

// React hook for accessing the cart
export function useCart() {
  const cart = useCartStore();
  return cart;
}
