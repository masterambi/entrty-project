import {
  Controller,
  Delete,
  Get,
  Middleware,
  Post,
  Put,
} from "@overnightjs/core";
import type { Request, Response } from "express";
import { EResponseCode } from "~/lib/core/constants";
import logger from "~/lib/core/helpers/logger";
import * as CatsService from "./service";
import {
  createCartValidator,
  deleteCartItemValidator,
  updateCartItemQtyBodyValidator,
  updateCartItemQtyParamsValidator,
} from "./validator";

import type {
  IResBodyCheckout,
  IResBodyCreateCart,
  IResBodyDeleteCartItem,
  IResBodyGetCartItemsByUser,
  IResBodyUpdateCartItemQty,
  TReqBodyCreateCart,
  TReqBodyUpdateCartItemQty,
  TReqParamsDeleteCartItem,
  TReqParamsUpdateCartItemQty,
} from "./type";
import checkToken from "../../../middlewares/checkToken";

@Controller("carts")
class CartsController {
  @Get("cart-items")
  @Middleware([checkToken])
  protected async getCartItemsByUser(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      const params = {
        userId: userId as string,
      };

      logger.info(
        params,
        "Carts Controller - getCartItemsByUser with params: "
      );

      const response = await CatsService.getCartItemsByUser(params);

      logger.info(response, "Carts Controller - getCartItemsByUser Data: ");

      const { data, error } = response;

      if (error === "general_error" || !data) {
        throw response;
      }

      return res.apiSuccess<IResBodyGetCartItemsByUser>({
        status: 200,
        message: "Success",
        code: EResponseCode.GET_DATA_SUCCESS,
        data,
      });
    } catch (e) {
      logger.error(e.message || e, "CartsController: getCartItemsByUser: ");
      return res.apiError<EResponseCode>({
        status: 500,
        code: EResponseCode.GENERAL_ERROR,
        message: "error_internal_server_message",
      });
    }
  }

  @Post("checkout")
  @Middleware([checkToken])
  protected async checkout(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      const params = {
        userId: userId as string,
      };

      logger.info(params, "Carts Controller - checkout with params: ");

      const response = await CatsService.checkout(params);

      logger.info(response, "Carts Controller - checkout Data: ");

      const { error, data } = response;

      if (error === "cart_empty") {
        return res.apiError<EResponseCode>({
          status: 400,
          message: "Cart items is empty",
          code: EResponseCode.CART_EMPTY,
        });
      }

      if (error === "product_not_found") {
        return res.apiError<EResponseCode>({
          status: 404,
          message: "Product is not found",
          code: EResponseCode.NOT_FOUND,
        });
      }

      if (error === "stock_not_enough") {
        return res.apiError<EResponseCode>({
          status: 400,
          message: "Product stock is not enough",
          code: EResponseCode.PRODUCT_STOCK_NOT_ENOUGH,
        });
      }

      if (error === "general_error" || !data) {
        throw response;
      }

      return res.apiSuccess<IResBodyCheckout>({
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

  @Post("cart-items")
  @Middleware([createCartValidator, checkToken])
  protected async createCart(
    req: Request<unknown, unknown, TReqBodyCreateCart>,
    res: Response
  ) {
    try {
      const userId = req.user?.id as string;
      const { productId, quantity } = req.body;

      const params = {
        userId: +userId,
        productId,
        quantity,
      };

      logger.info(params, "Carts Controller - createCart with params: ");

      const response = await CatsService.createCart(params);

      logger.info(response, "Carts Controller - createCart Data: ");

      const { data, error } = response;

      if (error === "product_not_found") {
        return res.apiError<EResponseCode>({
          status: 404,
          code: EResponseCode.NOT_FOUND,
          message: "Product is not found",
        });
      }

      if (error === "stock_not_enough") {
        return res.apiError<EResponseCode>({
          status: 400,
          code: EResponseCode.NOT_FOUND,
          message: "Product stock is not enough",
        });
      }

      if (error === "general_error" || !data) {
        throw response;
      }

      return res.apiSuccess<IResBodyCreateCart>({
        status: 201,
        message: "Success",
        code: EResponseCode.SUBMIT_DATA_SUCCESS,
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

  @Put("cart-items/:cartItemId")
  @Middleware([
    updateCartItemQtyParamsValidator,
    updateCartItemQtyBodyValidator,
    checkToken,
  ])
  protected async updateCartItemQty(
    req: Request<
      TReqParamsUpdateCartItemQty,
      unknown,
      TReqBodyUpdateCartItemQty
    >,
    res: Response
  ) {
    try {
      const userId = req.user?.id as string;
      const { quantity } = req.body;
      const { cartItemId } = req.params;

      const params = {
        userId: +userId,
        quantity: quantity,
        cartItemId: cartItemId,
      };

      logger.info(params, "Carts Controller - updateCartItemQty with params: ");

      const response = await CatsService.updateCartItemQty(params);

      logger.info(response, "Carts Controller - updateCartItemQty Data: ");

      const { data, error } = response;

      if (error === "cart_item_not_found") {
        return res.apiError<EResponseCode>({
          status: 404,
          code: EResponseCode.NOT_FOUND,
          message: "Cart item is not found",
        });
      }

      if (error === "stock_not_enough") {
        return res.apiError<EResponseCode>({
          status: 404,
          code: EResponseCode.PRODUCT_STOCK_NOT_ENOUGH,
          message: "Product stock is not enough",
        });
      }

      if (error === "general_error" || !data) {
        throw response;
      }

      return res.apiSuccess<IResBodyUpdateCartItemQty>({
        status: 200,
        message: "Success",
        code: EResponseCode.GET_DATA_SUCCESS,
        data,
      });
    } catch (e) {
      logger.error(e.message || e, "CartsController: updateCartItemQty: ");
      return res.apiError<EResponseCode>({
        status: 500,
        code: EResponseCode.GENERAL_ERROR,
        message: "error_internal_server_message",
      });
    }
  }

  @Delete("cart-items/:cartItemId")
  @Middleware([deleteCartItemValidator, checkToken])
  protected async deleteCartItem(
    req: Request<TReqParamsDeleteCartItem>,
    res: Response
  ) {
    try {
      const userId = req.user?.id as string;
      const { cartItemId } = req.params;

      const params = {
        cartItemId: +cartItemId,
        userId: +userId,
      };

      logger.info(
        req.params,
        "Carts Controller - deleteCartItem with params: "
      );

      const response = await CatsService.deleteCartItem(params);

      logger.info(response, "Carts Controller - deleteCartItem Data: ");

      const { data, error } = response;

      if (error === "cart_item_not_found") {
        return res.apiError<EResponseCode>({
          status: 404,
          code: EResponseCode.NOT_FOUND,
          message: "Cart item is not found",
        });
      }

      if (error === "general_error" || !data) {
        throw response;
      }

      return res.apiSuccess<IResBodyDeleteCartItem>({
        status: 200,
        message: "Success",
        code: EResponseCode.GET_DATA_SUCCESS,
        data,
      });
    } catch (e) {
      logger.error(e.message || e, "CartsController: deleteCartItem: ");
      return res.apiError<EResponseCode>({
        status: 500,
        code: EResponseCode.GENERAL_ERROR,
        message: "error_internal_server_message",
      });
    }
  }
}

export default CartsController;
