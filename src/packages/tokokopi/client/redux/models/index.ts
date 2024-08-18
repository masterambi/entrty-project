import { Models } from "@rematch/core";
import Product from "./product";

export interface IRootModel extends Models<IRootModel> {
  product: typeof Product;
}

export const RootModel: IRootModel = {
  product: Product,
};
