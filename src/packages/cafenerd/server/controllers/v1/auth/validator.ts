import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { EResponseCode } from "~/lib/core/constants";
import logger from "~/lib/core/helpers/logger";
import validateSchema from "~/lib/core/helpers/validateSchema";

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});
export const signupValidator = async (req: Request, res: Response, next: NextFunction) => {
  const { errMsg, isError } = validateSchema(signupSchema, req.body);
  logger.info(errMsg, "Application Middleware - signupValidator Err Msg: ");

  if (isError) {
    return res.apiError<EResponseCode>({
      status: 400,
      code: EResponseCode.BAD_REQUEST,
      message: errMsg[0].message,
    });
  }

  return next();
};

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export const loginValidator = async (req: Request, res: Response, next: NextFunction) => {
  const { errMsg, isError } = validateSchema(loginSchema, req.body);
  logger.info(errMsg, "Application Middleware - loginValidator Err Msg: ");

  if (isError) {
    return res.apiError<EResponseCode>({
      status: 400,
      code: EResponseCode.BAD_REQUEST,
      message: errMsg[0].message,
    });
  }

  return next();
};
