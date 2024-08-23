import { Controller, Post, Middleware, Get } from "@overnightjs/core";
import type { Request, Response } from "express";
import { EResponseCode } from "~/lib/core/constants";
import logger from "~/lib/core/helpers/logger";
import * as AuthService from "./service";
import { v4 as uuidv4 } from "uuid";
import type {
  IResBodySignup,
  IResBodyLogin,
  TReqBodySignup,
  TReqBodyLogin,
  IResBodySign,
} from "./type";
import { signupValidator, loginValidator } from "./validator";
import { CONFIGURATION } from "../../../constant";
import { generateToken } from "~/lib/server/helpers/jwtToken";
import { saveSessionData } from "../../../services/redis";
import checkToken from "../../../middlewares/checkToken";

@Controller("auth")
class AuthController {
  @Post("signup")
  @Middleware(signupValidator)
  protected async signup(
    req: Request<unknown, unknown, TReqBodySignup>,
    res: Response
  ) {
    try {
      const { email, password, name } = req.body;

      logger.info(
        `Auth Controller - signup with params: ${JSON.stringify(req.body)}`
      );

      const response = await AuthService.signup({ email, password, name });

      logger.info(response, "Auth Controller - signup Data: ");

      const { error, data } = response;

      if (error === "email_already_exists") {
        return res.apiError<EResponseCode>({
          status: 400,
          code: EResponseCode.BAD_REQUEST,
          message: "Email already exists",
        });
      }

      if (error === "general_error" || !data) throw response;

      return res.apiSuccess<IResBodySignup>({
        status: 201,
        message: "Signup successful",
        code: EResponseCode.SUBMIT_DATA_SUCCESS,
        data,
      });
    } catch (e) {
      logger.error(e.message || e, "Auth Controller: signup: ");
      return res.apiError<EResponseCode>({
        status: 500,
        code: EResponseCode.GENERAL_ERROR,
        message: "error_internal_server_message",
      });
    }
  }

  @Post("login")
  @Middleware(loginValidator)
  protected async login(
    req: Request<unknown, unknown, TReqBodyLogin>,
    res: Response
  ) {
    try {
      const { email, password } = req.body;

      logger.info(
        `Auth Controller - login with params: ${JSON.stringify(req.body)}`
      );

      const response = await AuthService.login({ email, password });

      logger.info(response, "Auth Controller - login Data: ");

      const { error, data } = response;

      if (error === "invalid_credentials") {
        return res.apiError<EResponseCode>({
          status: 401,
          code: EResponseCode.UNAUTHORIZED_REQUEST,
          message: "Invalid credentials",
        });
      }

      if (error === "general_error" || !data) throw response;

      const jti = uuidv4();

      const accessToken = generateToken({
        exp: CONFIGURATION.REDIS.USER.SESSION_DATA_TTL || -1,
        sub: String(data.id),
        jti: jti,
        secretKey: process.env.ACCESS_TOKEN_SECRET || "",
      });

      await saveSessionData(jti);

      res.cookie(
        CONFIGURATION.COOKIE_ACCESS_TOKEN.NAME,
        accessToken,
        CONFIGURATION.COOKIE_ACCESS_TOKEN.OPT
      );

      return res.apiSuccess<IResBodyLogin>({
        status: 200,
        message: "Login successful",
        code: EResponseCode.GET_DATA_SUCCESS,
        data: data,
      });
    } catch (e) {
      logger.error(e.message || e, "Auth Controller: login: ");
      return res.apiError<EResponseCode>({
        status: 500,
        code: EResponseCode.GENERAL_ERROR,
        message: "error_internal_server_message",
      });
    }
  }

  @Get("sign")
  @Middleware([checkToken])
  protected async sign(req: Request, res: Response) {
    try {
      const userId = req.user?.id as string;

      logger.info(`Auth Controller - sign with params: ${{ userId }}`);

      return res.apiSuccess<IResBodySign>({
        status: 200,
        message: "Sign successful",
        code: EResponseCode.GET_DATA_SUCCESS,
        data: {
          id: +userId,
        },
      });
    } catch (e) {
      logger.error(e.message || e, "CartsController: sign: ");
      return res.apiError<EResponseCode>({
        status: 500,
        code: EResponseCode.GENERAL_ERROR,
        message: "error_internal_server_message",
      });
    }
  }
}

export default AuthController;
