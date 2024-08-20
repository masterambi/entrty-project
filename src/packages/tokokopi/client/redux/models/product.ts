// src/models/products.ts
import { createModel } from "@rematch/core";
import { IRootModel } from ".";
import { TGetProductListResponse } from "~/packages/tokokopi/server/controllers/v1/products/type";
import httpReq from "~/lib/core/helpers/httpReq";
import { EResponseCode } from "~/lib/core/constants";

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
    setCurrentPage(state, payload: number) {
      return {
        ...state,
        currentPage: payload,
      };
    },
  },
  effects: (dispatch) => ({
    async fetchProductList() {
      try {
        const { response } = await httpReq<TGetProductListResponse>(
          `/api/v1/products`,
          { method: "GET" }
        );
        if (response.data) {
          dispatch.product.setProductList(response.data.products);
        }
      } catch (e) {
        const error = e.response as ApiError<EResponseCode>;

        // TODO: handle error
        console.log(error);
      }
    },
  }),
});

export default Product;
