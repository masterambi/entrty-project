import { NextFunction, Request, Response } from "express";
import { EResponseCode } from "~/lib/core/constants";
import logger from "~/lib/core/helpers/logger";
import validateSchema from "~/lib/core/helpers/validateSchema";
import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  stock: z.number(),
  imageUrl: z.string(),
});
export const createProductValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { errMsg, isError } = validateSchema(createProductSchema, req.body);
  logger.info(
    errMsg,
    "Application Middleware - createProductValidator Err Msg: "
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

export const getProductDetailsParamsSchema = z.object({
  productId: z.string(),
});
export const getProductDetailsValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { errMsg, isError } = validateSchema(
    getProductDetailsParamsSchema,
    req.params
  );
  logger.info(
    errMsg,
    "Application Middleware - createProductValidator Err Msg: "
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
