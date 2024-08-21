import { NextFunction, Request, Response } from "express";
import { EResponseCode } from "~/lib/core/constants";
import logger from "~/lib/core/helpers/logger";
import validateSchema from "~/lib/core/helpers/validateSchema";
import { z } from "zod";

export const createCartSchema = z.object({
  productId: z.number().min(1),
  quantity: z.number().min(1),
});
export const createCartValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { errMsg, isError } = validateSchema(createCartSchema, req.body);
  logger.info(errMsg, "Application Middleware - createCartValidator Err Msg: ");

  if (isError) {
    res.apiError<EResponseCode>({
      status: 400,
      code: EResponseCode.BAD_REQUEST,
      message: errMsg[0].message,
    });
  }

  return next();
};

export const updateCartItemQtyParamsSchema = z.object({
  cartItemId: z.string(),
});
export const updateCartItemQtyParamsValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { errMsg, isError } = validateSchema(updateCartItemQtyParamsSchema, {
    ...req.params,
  });

  logger.info(
    errMsg,
    "Application Middleware - updateCartItemQtyParamsValidator Err Msg: "
  );

  if (isError) {
    res.apiError<EResponseCode>({
      status: 400,
      code: EResponseCode.BAD_REQUEST,
      message: errMsg[0].message,
    });
  }

  return next();
};
export const updateCartItemQtyBodySchema = z.object({
  quantity: z.number().min(1),
});
export const updateCartItemQtyBodyValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { errMsg, isError } = validateSchema(updateCartItemQtyBodySchema, {
    ...req.body,
  });

  logger.info(
    errMsg,
    "Application Middleware - updateCartItemQtyBodyValidator Err Msg: "
  );

  if (isError) {
    res.apiError<EResponseCode>({
      status: 400,
      code: EResponseCode.BAD_REQUEST,
      message: errMsg[0].message,
    });
  }

  return next();
};

export const deleteCartItemParamsSchema = z.object({
  cartItemId: z.string(),
});
export const deleteCartItemValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { errMsg, isError } = validateSchema(
    deleteCartItemParamsSchema,
    req.params
  );
  logger.info(
    errMsg,
    "Application Middleware - deleteCartItemValidator Err Msg: "
  );

  if (isError) {
    res.apiError<EResponseCode>({
      status: 400,
      code: EResponseCode.BAD_REQUEST,
      message: errMsg[0].message,
    });
  }

  return next();
};
