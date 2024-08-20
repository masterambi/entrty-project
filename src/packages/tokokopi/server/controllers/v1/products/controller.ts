import { Controller, Get, Post } from "@overnightjs/core";
import { Request, Response } from "express";
import * as ProductService from "./service";
import { EResponseCode } from "~/lib/core/constants";
import logger from "~/lib/core/helpers/logger";

@Controller("products")
class ProductsController {
  @Get("")
  protected async getProductList(req: Request, res: Response) {
    try {
      const response = await ProductService.getProductList({
        limit: 99,
        offset: 0,
      });

      const { error } = response;

      if (error === "general_error") {
        throw response;
      }

      return res.apiSuccess<any>({
        status: 200,
        message: "Success",
        code: EResponseCode.GET_DATA_SUCCESS,
        data: response.data,
      });
    } catch (e) {
      logger.error(e.message || e, "ProductsController: getProductList: ");
      return res.apiError<EResponseCode>({
        status: 500,
        code: EResponseCode.GENERAL_ERROR,
        message: "error_internal_server_message",
      });
    }
  }

  @Get(":id")
  protected async getProductDetails(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const { data } = await ProductService.getProductDetails({
        id: +id,
      });

      return res.apiSuccess<any>({
        status: 200,
        message: "Success",
        code: EResponseCode.GET_DATA_SUCCESS,
        data,
      });
    } catch (e) {
      logger.error(e.message || e, "ProductsController: getProductDetails: ");
      return res.apiError<EResponseCode>({
        status: 500,
        code: EResponseCode.GENERAL_ERROR,
        message: "error_internal_server_message",
      });
    }
  }

  @Post("")
  protected async createProduct(req: Request, res: Response) {
    try {
      const { name, description, price, stock, image_url } = req.body;

      const { data, error } = await ProductService.createProduct({
        name,
        description,
        price,
        stock,
        image_url,
      });

      if (error === "general_error") throw error;

      return res.apiSuccess<any>({
        status: 200,
        message: "Success",
        code: EResponseCode.GET_DATA_SUCCESS,
        data,
      });
    } catch (e) {
      logger.error(e.message || e, "ProductsController: createProduct: ");
      return res.apiError<EResponseCode>({
        status: 500,
        code: EResponseCode.GENERAL_ERROR,
        message: "error_internal_server_message",
      });
    }
  }
}

export default ProductsController;
