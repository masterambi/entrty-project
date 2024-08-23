import logger from "~/lib/core/helpers/logger";
import connnection from "~/lib/server/connection";
import { CONFIGURATION } from "../constant";
import type { ISessionData } from "../types";

export const saveSessionData = async (jti: string) => {
  try {
    logger.info(jti, "Service - Save Session Data: ");

    const redis = connnection.getRedisInstance();

    const key = `${CONFIGURATION.REDIS.USER.SESSION_DATA_PREFIX}${jti}`;
    await redis.set(
      key,
      JSON.stringify({ valid: true }),
      "EX",
      CONFIGURATION.REDIS.USER.SESSION_DATA_TTL,
    );
  } catch (e) {
    logger.error(e?.message || e, "Service - Save Session Data Error: ");
  }
};

export const getSessionData = async (jti: string): Promise<ISessionData | null> => {
  try {
    const redis = connnection.getRedisInstance();
    const key = `${CONFIGURATION.REDIS.USER.SESSION_DATA_PREFIX}${jti}`;
    const cacheSession = await redis.get(key);
    if (!cacheSession) {
      return null;
    }
    return JSON.parse(cacheSession) as ISessionData;
  } catch (e) {
    logger.error(e?.message || e, "Service - Get Session Data Error: ");
    return null;
  }
};
