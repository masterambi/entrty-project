import type { z } from "zod";
import type User from "~/packages/cafenerd/server/database/models/mysql/User";
import type { signupSchema, loginSchema } from "./validator";

export interface IResBodySignup extends User {}
export type TReqBodySignup = z.infer<typeof signupSchema>;
export type TSignupResponse = ApiSuccess<IResBodySignup>;

export interface IResBodyLogin extends User {}
export type TReqBodyLogin = z.infer<typeof loginSchema>;
export type TLoginResponse = ApiSuccess<IResBodyLogin>;
