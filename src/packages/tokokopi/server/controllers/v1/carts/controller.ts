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
      const response = await CatsService.getCartsByUser({
        user_id: 1,
      });

      if (response.error === "general_error") {
        throw response;
      }

      const { data } = response;

      return res.apiSuccess<any>({
        status: 200,
        message: "Success",
        code: EResponseCode.GET_DATA_SUCCESS,
        data: {
          total_price: data?.totalPrice,
          total_items: data?.totalItems,
          cart_items: data?.cartItems,
        },
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
      const response = await CatsService.checkout({
        user_id: 1,
      });

      const { error } = response;

      if (error === "cart_empty") {
        return res.apiError<any>({
          status: 400,
          message: "Cart is empty",
          code: EResponseCode.CART_EMPTY,
        });
      }

      if (error === "product_not_found") {
        return res.apiError<any>({
          status: 400,
          message: "Product not found",
          code: EResponseCode.PRODUCT_NOT_FOUND,
        });
      }

      if (error === "stock_not_enough") {
        return res.apiError<any>({
          status: 400,
          message: "Product not found",
          code: EResponseCode.PRODUCT_STOCK_NOT_ENOUGH,
        });
      }

      if (error === "general_error") {
        throw response;
      }

      const { data } = response;

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

      const { data } = await CatsService.createCart({
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
