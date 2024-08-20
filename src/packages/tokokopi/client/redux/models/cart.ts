import {
  TCheckoutResponse,
  TCreateCartResponse,
  TDeleteCartItemResponse,
  TGetCartItemsByUserResponse,
  TReqBodyCreateCart,
  TReqBodyUpdateCartItemQty,
  TUpdateCartItemQtyResponse,
} from "~/packages/tokokopi/server/controllers/v1/carts/type";
import { IRootModel } from ".";
import { createModel } from "@rematch/core";
import httpReq from "~/lib/core/helpers/httpReq";
import { EResponseCode } from "~/lib/core/constants";

export interface ICartState {
  cartItems: TGetCartItemsByUserResponse["data"]["cartItems"];
  totalPrice: TGetCartItemsByUserResponse["data"]["totalPrice"];
  totalItems: TGetCartItemsByUserResponse["data"]["totalItems"];
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
    async addToCartItem({
      productId,
      quantity,
      onSuccess,
    }: {
      productId: number;
      quantity: number;
      onSuccess?: () => void;
    }) {
      try {
        await httpReq<TCreateCartResponse, TReqBodyCreateCart>(
          `/api/v1/carts`,
          {
            method: "POST",
            data: {
              productId,
              quantity,
            },
          }
        );

        if (onSuccess) onSuccess();
      } catch (err) {
        const error = err.response as ApiError<EResponseCode>;

        // TODO: handle error
        console.log(error);
      }
    },
    async fetchCartItems() {
      try {
        const { response } = await httpReq<TGetCartItemsByUserResponse>(
          `/api/v1/carts`,
          {
            method: "GET",
          }
        );

        if (response.data) {
          dispatch.cart.setCartItems(response.data.cartItems);
          dispatch.cart.setTotalPrice(response.data.totalPrice);
          dispatch.cart.setTotalItems(response.data.totalItems);
        }
      } catch (err) {
        const error = err.response as ApiError<EResponseCode>;

        // TODO: handle error
        console.log(error);
      }
    },
    async updateCartItemQuantity({
      id,
      quantity,
    }: {
      id: number;
      quantity: number;
    }) {
      try {
        await httpReq<TUpdateCartItemQtyResponse, TReqBodyUpdateCartItemQty>(
          `/api/v1/carts/${id}`,
          {
            method: "PUT",
            data: {
              quantity,
            },
          }
        );

        dispatch.cart.fetchCartItems(); // Refresh cart after update
      } catch (err) {
        const error = err.response as ApiError<EResponseCode>;

        // TODO: handle error
        console.log(error);
      }
    },
    async deleteCartItem(id: number) {
      try {
        await httpReq<TDeleteCartItemResponse>(`/api/v1/carts/${id}`, {
          method: "DELETE",
        });

        dispatch.cart.fetchCartItems();
      } catch (err) {
        const error = err.response as ApiError<EResponseCode>;

        // TODO: handle error
        console.log(error);
      }
    },
    async checkoutCart(payload?: { onSuccess?: () => void }) {
      try {
        await httpReq<TCheckoutResponse>(`/api/v1/carts/checkout`, {
          method: "POST",
        });

        dispatch.cart.fetchCartItems();
        if (payload && payload.onSuccess) payload.onSuccess();
      } catch (err) {
        const error = err.response as ApiError<EResponseCode>;

        // TODO: handle error
        console.log(error);
      }
    },
  }),
});

export default Cart;
