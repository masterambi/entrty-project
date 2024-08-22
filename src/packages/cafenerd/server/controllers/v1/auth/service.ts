import logger from "~/lib/core/helpers/logger";
import User from "../../../database/models/mysql/User";
import * as bcrypt from "bcrypt";

interface ISignupParams {
  email: string;
  password: string;
  name: string;
}
interface ISignupReturn {
  data?: User;
  error?: "email_already_exists" | "general_error";
}
export const signup = async (params: ISignupParams): Promise<ISignupReturn> => {
  try {
    const { email, password, name } = params;

    logger.info({ email, name }, "Auth Service - signup Params: ");

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return { error: "email_already_exists" };
    }

    const user = await User.create({ email, password, name });

    logger.info(user, "Auth Service - signup Data: ");
    return { data: user };
  } catch (err) {
    logger.error(err.message || err, "Auth Service - signup Error: ");
    return { error: "general_error" };
  }
};

interface ILoginParams {
  email: string;
  password: string;
}
interface ILoginReturn {
  data?: User;
  error?: "invalid_credentials" | "general_error";
}
export const login = async (params: ILoginParams): Promise<ILoginReturn> => {
  try {
    const { email, password } = params;

    logger.info({ email }, "Auth Service - login Params: ");

    const user = await User.findOne({
      where: { email },
    });
    if (!user) {
      return { error: "invalid_credentials" };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { error: "invalid_credentials" };
    }

    logger.info({ user }, "Auth Service - login Data: ");
    return { data: user };
  } catch (err) {
    logger.error(err.message || err, "Auth Service - login Error: ");
    return { error: "general_error" };
  }
};
