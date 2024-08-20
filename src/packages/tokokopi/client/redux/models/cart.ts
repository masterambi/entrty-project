import { IRootModel } from ".";
import { TProduct } from "./product";
import { createModel } from "@rematch/core";

export type TCart = {
  id: number;
  user_id: number;
  product_id: number;
  product: TProduct;
  quantity: number;
};

export interface ICartState {
  cartItems: TCart[];
  totalPrice: number;
  totalItems: number;
}

const INITIAL_STATE: ICartState = {
  cartItems: [],
  totalPrice: 0,
  totalItems: 0,
};

const Cart = createModel<IRootModel>()({
  name: "cart",
  state: INITIAL_STATE,
  reducers: {
    setCartItems(state, payload: ICartState["cartItems"]) {
      return {
        ...state,
        cartItems: payload,
      };
    },
    setTotalPrice(state, payload: ICartState["totalPrice"]) {
      return {
        ...state,
        totalPrice: payload,
      };
    },
    setTotalItems(state, payload: ICartState["totalItems"]) {
      return {
        ...state,
        totalItems: payload,
      };
    },
  },
  effects: (dispatch) => ({
    async addToCartItem({ id, quantity }: { id: number; quantity: number }) {
      await fetch(`/api/v1/carts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
        },
        body: JSON.stringify({
          product_id: id,
          quantity,
        }),
      });
    },
    async fetchCartItems() {
      const response = await fetch(`/api/v1/carts`);
      const responseJSON = await response.json();
      dispatch.cart.setCartItems(responseJSON.data.cart_items);
      dispatch.cart.setTotalPrice(responseJSON.data.total_price);
      dispatch.cart.setTotalItems(responseJSON.data.total_items);
    },
    updateCartItemQuantity: async ({
      id,
      quantity,
    }: {
      id: number;
      quantity: number;
    }) => {
      await fetch(`/api/v1/carts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
        },
        body: JSON.stringify({
          quantity,
        }),
      });

      dispatch.cart.fetchCartItems(); // Refresh cart after update
    },
    deleteCartItem: async (id) => {
      await fetch(`/api/v1/carts/${id}`, {
        method: "DELETE",
      });
      dispatch.cart.fetchCartItems();
    },
    checkoutCart: async () => {
      await fetch(`/api/v1/carts/checkout`, {
        method: "POST",
      });
      dispatch.cart.fetchCartItems();
    },
  }),
});

export default Cart;
