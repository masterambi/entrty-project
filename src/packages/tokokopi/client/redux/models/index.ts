import { Models } from "@rematch/core";
import Product from "./product";
import Cart from "./cart";

export interface IRootModel extends Models<IRootModel> {
  product: typeof Product;
  cart: typeof Cart;
}

export const RootModel: IRootModel = {
  product: Product,
  cart: Cart,
};
