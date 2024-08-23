import type { NextFunction, Request, Response } from "express";
import { EResponseCode } from "~/lib/core/constants";
import logger from "~/lib/core/helpers/logger";
import { verifyToken } from "~/lib/server/helpers/jwtToken";
import { CONFIGURATION } from "../constant";
import { getSessionData } from "../services/redis";

const checkToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info(req.cookies, "Middleware - CheckToken Cookies: ");
    const accessToken = req.cookies[CONFIGURATION.COOKIE_ACCESS_TOKEN.NAME];

    if (!accessToken) {
      return res.apiError<EResponseCode>({
        status: 401,
        code: EResponseCode.UNAUTHORIZED_REQUEST,
        message: "Unauthorized Request",
      });
    }

    const jwtPayload = verifyToken({
      secretKey: process.env.ACCESS_TOKEN_SECRET || "",
      cookieAccessToken: accessToken,
    });
    if (!jwtPayload) {
      res.cookie(CONFIGURATION.COOKIE_ACCESS_TOKEN.NAME, "", { maxAge: -1 });
      return res.apiError<EResponseCode>({
        status: 401,
        code: EResponseCode.TOKEN_INVALID,
        message: "Token Invalid",
      });
    }

    const sessionData = await getSessionData(jwtPayload.jti || "");
    if (!sessionData) {
      res.cookie(CONFIGURATION.COOKIE_ACCESS_TOKEN.NAME, "", { maxAge: -1 });
      return res.apiError<EResponseCode>({
        status: 401,
        code: EResponseCode.TOKEN_INVALID,
        message: "Token Invalid",
      });
    }

    if (!sessionData.valid || !jwtPayload.sub) {
      res.cookie(CONFIGURATION.COOKIE_ACCESS_TOKEN.NAME, "", { maxAge: -1 });
      return res.apiError<EResponseCode>({
        status: 401,
        code: EResponseCode.TOKEN_INVALID,
        message: "Token Invalid",
      });
    }

    req.user = {
      id: jwtPayload.sub,
    };

    return next();
  } catch (e) {
    logger.error(e.message || e, "Middleware - Check Token Error: ");
    return res.apiError<EResponseCode>({
      status: 401,
      code: EResponseCode.UNAUTHORIZED_REQUEST,
      message: "Unauthorized Request",
    });
  }
};

export default checkToken;
