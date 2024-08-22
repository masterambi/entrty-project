import { Controller, Get, Middleware, Post } from "@overnightjs/core";
import type { Request, Response } from "express";
import { EResponseCode } from "~/lib/core/constants";
import logger from "~/lib/core/helpers/logger";
import * as ProductService from "./service";
import type {
  IResBodyCreateProduct,
  IResBodyGetProductDetails,
  IResBodyGetProductList,
  TReqBodyCreateProduct,
} from "./type";
import {
  createProductValidator,
  getProductDetailsValidator,
} from "./validator";

@Controller("products")
class ProductsController {
  @Get("")
  protected async getProductList(req: Request, res: Response) {
    try {
      const response = await ProductService.getProductList({
        limit: 99,
        offset: 0,
      });

      logger.info(response, "Products Controller - getProductList Data: ");

      const { error, data } = response;

      if (error === "general_error" || !data) {
        throw response;
      }

      return res.apiSuccess<IResBodyGetProductList>({
        status: 200,
        message: "Success",
        code: EResponseCode.GET_DATA_SUCCESS,
        data: data,
      });
    } catch (e) {
      logger.error(e.message || e, "Products Controller: getProductList: ");
      return res.apiError<EResponseCode>({
        status: 500,
        code: EResponseCode.GENERAL_ERROR,
        message: "error_internal_server_message",
      });
    }
  }

  @Get(":productId")
  @Middleware(getProductDetailsValidator)
  protected async getProductDetails(req: Request, res: Response) {
    try {
      const { productId } = req.params;

      logger.info(
        `Products Controller - getProductDetails with params: ${req.params}`
      );

      const response = await ProductService.getProductDetails({
        productId: productId,
      });

      logger.info(response, "Products Controller - getProductDetails Data: ");

      const { error, data } = response;

      if (error === "product_not_found") {
        return res.apiError<EResponseCode>({
          status: 404,
          code: EResponseCode.NOT_FOUND,
          message: "Product not found",
        });
      }

      if (error === "general_error" || !data) {
        throw response;
      }

      return res.apiSuccess<IResBodyGetProductDetails>({
        status: 200,
        message: "Success",
        code: EResponseCode.GET_DATA_SUCCESS,
        data: data.product,
      });
    } catch (e) {
      logger.error(e.message || e, "Products Controller: getProductDetails: ");
      return res.apiError<EResponseCode>({
        status: 500,
        code: EResponseCode.GENERAL_ERROR,
        message: "error_internal_server_message",
      });
    }
  }

  @Post("")
  @Middleware(createProductValidator)
  protected async createProduct(
    req: Request<unknown, unknown, TReqBodyCreateProduct>,
    res: Response
  ) {
    try {
      const { name, description, price, stock, imageUrl } = req.body;

      logger.info(
        `Products Controller - createProduct with params: ${req.body}`
      );

      const response = await ProductService.createProduct({
        name,
        description,
        price,
        stock,
        imageUrl,
      });

      logger.info(response, "Products Controller - createProduct Data: ");

      const { error, data } = response;

      if (error === "general_error" || !data) throw response;

      return res.apiSuccess<IResBodyCreateProduct>({
        status: 200,
        message: "Success",
        code: EResponseCode.GET_DATA_SUCCESS,
        data,
      });
    } catch (e) {
      logger.error(e.message || e, "Products Controller: createProduct: ");
      return res.apiError<EResponseCode>({
        status: 500,
        code: EResponseCode.GENERAL_ERROR,
        message: "error_internal_server_message",
      });
    }
  }
}

export default ProductsController;
