import { z, ZodError } from "zod";

const validateSchema = <T extends z.AnyZodObject, D>(schema: T, data: D) => {
  try {
    const validatedData = schema.parse(data);
    return { validatedData: validatedData, errMsg: [], isError: false };
  } catch (error) {
    if (error instanceof ZodError) {
      console.log(error.issues);
      const errorMessages = error.issues.map((issue) => ({
        message: `${issue.path[0]} is ${issue.message}`,
      }));

      return { validatedData: null, errMsg: errorMessages, isError: true };
    }

    return { validatedData: null, errMsg: [], isError: true };
  }
};

export default validateSchema;
