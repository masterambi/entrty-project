import { Models } from "@rematch/core";
import Product from "./product";
import Cart from "./cart";
import App from "./app";

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
