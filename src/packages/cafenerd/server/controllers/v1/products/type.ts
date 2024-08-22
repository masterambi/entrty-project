import type { z } from "zod";
import type Product from "~/packages/cafenerd/server/database/models/mysql/Product";
import type { createProductSchema, getProductDetailsParamsSchema } from "./validator";

export interface IResBodyCreateProduct extends Product {}
export type TReqBodyCreateProduct = z.infer<typeof createProductSchema>;
export type TCreateProductResponse = ApiSuccess<IResBodyCreateProduct>;

export interface IResBodyGetProductDetails extends Product {}
export type TReqParamsGetProductDetails = z.infer<typeof getProductDetailsParamsSchema>;
export type TGetProductDetailsResponse = ApiSuccess<IResBodyGetProductDetails>;

export interface IResBodyGetProductList {
  products: Product[];
  total: number;
}
export type TGetProductListResponse = ApiSuccess<IResBodyGetProductList>;
