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
      const data = await ProductService.getProductList({
        limit: 10,
        offset: 0,
      });

      return res.apiSuccess<any>({
        status: 200,
        message: "Success",
        code: EResponseCode.GET_DATA_SUCCESS,
        data,
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

  @Post("")
  protected async createProduct(req: Request, res: Response) {
    try {
      const { name, description, price, stock, image_url } = req.body;

      const data = await ProductService.createProduct({
        name,
        description,
        price,
        stock,
        image_url,
      });

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
