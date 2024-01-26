import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type CartProduct = {
  price: number;
  priceId: string;
  name: string;
  image: string;
  quantity: number;
};

interface StoreState {
  cart: CartProduct[];
  addToCart: (product: CartProduct) => void;
  subFromCart: (priceId: string) => void;
  clearCart: () => void;
}

export const useStore = create<StoreState>()(
  devtools(
    persist(
      (set) => ({
        cart: [],
        addToCart: (product) =>
          set(
            (state) => {
              const productIndex = state.cart.findIndex(
                (item) => item.priceId === product.priceId,
              );

              if (productIndex === -1) {
                return {
                  cart: [...state.cart, product],
                };
              }

              const cart = [...state.cart];
              cart[productIndex]!.quantity += 1;

              return {
                cart,
              };
            },
            false,
            "addToCart",
          ),

        subFromCart: (priceId) =>
          set(
            (state) => {
              console.log("id", priceId);
              const productIndex = state.cart.findIndex(
                (product) => product.priceId === priceId,
              );

              console.log("productIndex", productIndex);

              if (productIndex === -1) {
                return {
                  cart: [...state.cart],
                };
              }

              const cart = [...state.cart];
              cart[productIndex]!.quantity -= 1;

              if (cart[productIndex]!.quantity === 0) {
                cart.splice(productIndex, 1);
              }

              return {
                cart,
              };
            },
            false,
            "subFromCart",
          ),

        clearCart: () =>
          set(
            () => ({
              cart: [],
            }),
            false,
            "clearCart",
          ),
      }),
      { name: "globalStore" },
    ),
  ),
);
