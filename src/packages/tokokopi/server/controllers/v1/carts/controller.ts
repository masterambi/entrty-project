import { Controller, Delete, Get, Post, Put } from "@overnightjs/core";
import { Request, Response } from "express";
import * as CatsService from "./service";
import { EResponseCode } from "~/lib/core/constants";
import logger from "~/lib/core/helpers/logger";

@Controller("carts")
class CartsController {
  @Get("")
  protected async getCartsByUser(req: Request, res: Response) {
    try {
      const { data } = await CatsService.getCartsByUser({
        user_id: 1,
      });

      return res.apiSuccess<any>({
        status: 200,
        message: "Success",
        code: EResponseCode.GET_DATA_SUCCESS,
        data,
      });
    } catch (e) {
      logger.error(e.message || e, "CartsController: getCartsByUser: ");
      return res.apiError<EResponseCode>({
        status: 500,
        code: EResponseCode.GENERAL_ERROR,
        message: "error_internal_server_message",
      });
    }
  }

  @Post("checkout")
  protected async checkout(req: Request, res: Response) {
    try {
      const { data } = await CatsService.checkout({
        user_id: 1,
      });

      return res.apiSuccess<any>({
        status: 201,
        message: "Success",
        code: EResponseCode.GET_DATA_SUCCESS,
        data,
      });
    } catch (e) {
      logger.error(e.message || e, "CartsController: checkout: ");
      return res.apiError<EResponseCode>({
        status: 500,
        code: EResponseCode.GENERAL_ERROR,
        message: "error_internal_server_message",
      });
    }
  }

  @Post("")
  protected async createCart(req: Request, res: Response) {
    try {
      const { product_id, quantity } = req.body;

      console.log(req.body);

      const { data, error } = await CatsService.createCart({
        product_id: product_id,
        user_id: 1,
        quantity: quantity,
      });

      return res.apiSuccess<any>({
        status: 201,
        message: "Success",
        code: EResponseCode.GET_DATA_SUCCESS,
        data,
      });
    } catch (e) {
      logger.error(e.message || e, "CartsController: createCart: ");
      return res.apiError<EResponseCode>({
        status: 500,
        code: EResponseCode.GENERAL_ERROR,
        message: "error_internal_server_message",
      });
    }
  }

  @Put(":id")
  protected async updateCartQty(req: Request, res: Response) {
    try {
      const { quantity } = req.body;
      const { id } = req.params;

      const { data } = await CatsService.updateCartQty({
        cart_id: Number(id) || -1,
        user_id: 1,
        quantity: quantity,
      });

      return res.apiSuccess<any>({
        status: 200,
        message: "Success",
        code: EResponseCode.GET_DATA_SUCCESS,
        data,
      });
    } catch (e) {
      logger.error(e.message || e, "CartsController: updateCartQty: ");
      return res.apiError<EResponseCode>({
        status: 500,
        code: EResponseCode.GENERAL_ERROR,
        message: "error_internal_server_message",
      });
    }
  }

  @Delete(":id")
  protected async deleteCart(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const { data } = await CatsService.deleteCart({
        cart_id: Number(id) || -1,
        user_id: 1,
      });

      return res.apiSuccess<any>({
        status: 200,
        message: "Success",
        code: EResponseCode.GET_DATA_SUCCESS,
        data,
      });
    } catch (e) {
      logger.error(e.message || e, "CartsController: deleteCart: ");
      return res.apiError<EResponseCode>({
        status: 500,
        code: EResponseCode.GENERAL_ERROR,
        message: "error_internal_server_message",
      });
    }
  }
}

export default CartsController;
