// src/models/products.ts
import { createModel } from "@rematch/core";
import type { EResponseCode } from "~/lib/core/constants";
import httpReq from "~/lib/core/helpers/httpReq";
import type { TGetProductListResponse } from "~/packages/cafenerd/server/controllers/v1/products/type";
import type { IRootModel } from ".";

export interface IProductsState {
  productList: TGetProductListResponse["data"]["products"];
}

const INITIAL_STATE: IProductsState = {
  productList: [],
};

const Product = createModel<IRootModel>()({
  name: "product",
  state: INITIAL_STATE,
  reducers: {
    setProductList(state, payload: IProductsState["productList"]) {
      return {
        ...state,
        productList: payload,
      };
    },
  },
  effects: (dispatch) => ({
    async fetchProductList() {
      try {
        const { response } = await httpReq<TGetProductListResponse>("/api/v1/products", {
          method: "GET",
        });
        if (response.data) {
          dispatch.product.setProductList(response.data.products);
        }
      } catch (e) {
        const error = e.response as ApiError<EResponseCode>;
        dispatch.app.saveError({ code: error.code, message: error.message });
      }
    },
  }),
});

export default Product;
