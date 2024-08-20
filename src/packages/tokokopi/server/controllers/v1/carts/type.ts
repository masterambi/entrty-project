import { z } from "zod";
import Cart from "../../../database/models/mysql/Cart";
import {
  createCartSchema,
  deleteCartItemParamsSchema,
  updateCartItemQtyBodySchema,
  updateCartItemQtyParamsSchema,
} from "./validator";

export interface IResBodyCreateCart extends Cart {}
export type TReqBodyCreateCart = z.infer<typeof createCartSchema>;
export type TCreateCartResponse = ApiSuccess<IResBodyCreateCart>;

export interface IResBodyGetCartItemsByUser {
  cartItems: Cart[];
  totalPrice: number;
  totalItems: number;
}
export type TGetCartItemsByUserResponse =
  ApiSuccess<IResBodyGetCartItemsByUser>;

export interface IResBodyCheckout {
  message: string;
}
export type TCheckoutResponse = ApiSuccess<IResBodyCheckout>;

export interface IResBodyUpdateCartItemQty extends Cart {}
export type TReqParamsUpdateCartItemQty = z.infer<
  typeof updateCartItemQtyParamsSchema
>;
export type TReqBodyUpdateCartItemQty = z.infer<
  typeof updateCartItemQtyBodySchema
>;
export type TUpdateCartItemQtyResponse = ApiSuccess<IResBodyUpdateCartItemQty>;

export interface IResBodyDeleteCartItem {
  message: string;
}
export type TReqParamsDeleteCartItem = z.infer<
  typeof deleteCartItemParamsSchema
>;
export type TDeleteCartItemResponse = ApiSuccess<IResBodyDeleteCartItem>;
