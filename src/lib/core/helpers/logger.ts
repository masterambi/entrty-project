import logger from "pino";

const redaction: string[] = [
  "email",
  "*.email",
  "password",
  "*.password",
  "description",
  "*.description",
  "*.description_text",
  "mobile_number",
  "*.mobile_number",
];

console.log(process.env.NODE_ENV);

export default logger({
  redact: {
    paths: redaction,
  },
  transport: {
    target: "pino-pretty",
    options: {
      colorize: process.env.NODE_ENV === "development",
      singleLine: process.env.NODE_ENV !== "development",
      ignore: "time",
    },
  },
  timestamp: logger.stdTimeFunctions.isoTime,
});
