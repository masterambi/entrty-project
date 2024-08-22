import type { Models } from "@rematch/core";
import App from "./app";
import Cart from "./cart";
import Product from "./product";

export interface IRootModel extends Models<IRootModel> {
  app: typeof App;
  product: typeof Product;
  cart: typeof Cart;
}
export const RootModel: IRootModel = {
  app: App,
  product: Product,
  cart: Cart,
};
