"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product } from "@/types";

interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const { items } = get();
        const exists = items.some((item) => item.productId === product.id);
        if (!exists) {
          set({
            items: [
              ...items,
              {
                id: `wishlist-${product.id}`,
                productId: product.id,
                product,
              },
            ],
          });
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.productId !== productId),
        });
      },

      toggleItem: (product) => {
        const { items, addItem, removeItem } = get();
        const exists = items.some((item) => item.productId === product.id);
        if (exists) {
          removeItem(product.id);
        } else {
          addItem(product);
        }
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item.productId === productId);
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "wishlist-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
