"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product } from "@/types";

interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, quantity?: number, size?: string, color?: string) => void;
  removeItem: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

function generateCartItemId(productId: string, size?: string, color?: string): string {
  return `${productId}-${size ?? "none"}-${color ?? "none"}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1, size, color) => {
        const { items } = get();
        const itemId = generateCartItemId(product.id, size, color);
        const existingItem = items.find((item) => item.id === itemId);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === itemId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                id: itemId,
                productId: product.id,
                product,
                quantity,
                size,
                color,
              },
            ],
          });
        }
      },

      removeItem: (productId, size, color) => {
        const itemId = generateCartItemId(productId, size, color);
        set({ items: get().items.filter((item) => item.id !== itemId) });
      },

      updateQuantity: (productId, quantity, size, color) => {
        const itemId = generateCartItemId(productId, size, color);
        if (quantity <= 0) {
          set({ items: get().items.filter((item) => item.id !== itemId) });
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
