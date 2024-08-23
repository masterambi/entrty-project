import jwt, { type JwtPayload } from "jsonwebtoken";
import moment from "moment-timezone";

import logger from "~/lib/core/helpers/logger";

interface IGenerateAccessTokenParams {
  jti: string;
  exp: number; // in seconds
  sub: string;
  secretKey: string;
}
export const generateToken = ({
  jti,
  exp,
  sub,
  secretKey,
}: IGenerateAccessTokenParams): string | null => {
  try {
    const accessToken = jwt.sign(
      {
        sub: sub,
        jti: jti,
        exp: moment().add(exp, "seconds").unix(),
        nbf: moment().unix(),
        iat: moment().unix(),
      },
      secretKey,
    );
    logger.info("Lib/Helper - Generate Token JWT Sign: ");
    logger.info(accessToken);

    return accessToken;
  } catch (e) {
    logger.error(e?.message || e, "Lib/Helper - Generate Token Error: ");
    return null;
  }
};

interface IVerifyAccessTokenParams {
  cookieAccessToken: string;
  secretKey: string;
}
export const verifyToken = ({
  cookieAccessToken,
  secretKey,
}: IVerifyAccessTokenParams): JwtPayload | null => {
  try {
    const decodedToken = jwt.verify(cookieAccessToken, secretKey, {
      ignoreExpiration: false,
      ignoreNotBefore: false,
    }) as JwtPayload;
    logger.info(decodedToken, "Lib/Helper - Verify token (DECODED): ");

    return decodedToken;
  } catch (e) {
    logger.error(e?.message || e, "Lib/Helper - Verify Token Error: ");
    return null;
  }
};
