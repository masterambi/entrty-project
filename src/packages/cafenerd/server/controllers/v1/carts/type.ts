import { z } from "zod";
import CartItem from "../../../database/models/mysql/CartItem";
import {
  createCartSchema,
  deleteCartItemParamsSchema,
  updateCartItemQtyBodySchema,
  updateCartItemQtyParamsSchema,
} from "./validator";

export interface IResBodyCreateCart extends CartItem {}
export type TReqBodyCreateCart = z.infer<typeof createCartSchema>;
export type TCreateCartResponse = ApiSuccess<IResBodyCreateCart>;

export interface IResBodyGetCartItemsByUser {
  cartItems: CartItem[];
  totalPrice: number;
  totalItems: number;
}
export type TGetCartItemsByUserResponse =
  ApiSuccess<IResBodyGetCartItemsByUser>;

export interface IResBodyCheckout {
  message: string;
}
export type TCheckoutResponse = ApiSuccess<IResBodyCheckout>;

export interface IResBodyUpdateCartItemQty extends CartItem {}
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
