import type { CookieOptions } from "express";

const ACCESS_TOKEN_TTL = 60 * 60 * 6;
export const CONFIGURATION = {
  COOKIE_ACCESS_TOKEN: {
    NAME: "U_TK_A",
    OPT: {
      maxAge: 1000 * ACCESS_TOKEN_TTL,
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
    } as CookieOptions,
  },
  REDIS: {
    USER: {
      SESSION_DATA_PREFIX: "session:",
      SESSION_DATA_TTL: ACCESS_TOKEN_TTL,
    },
  },
};
