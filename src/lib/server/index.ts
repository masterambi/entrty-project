import http from "http";
import helmet, { HelmetOptions } from "helmet";
import { Server } from "@overnightjs/core";
import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import { EResponseCode } from "../core/constants";

interface IExpressServer {
  initialize: () => void;
  run: () => void;
}

interface IServerOptions {
  appName?: string;
  controllers?: unknown[];
  staticPath?: string;
  helmetOptions?: HelmetOptions;
}

class ExpressServer extends Server implements IExpressServer {
  private options?: IServerOptions;

  constructor(options?: IServerOptions) {
    super(process.env.NODE_ENV === "development");
    this.options = options;
    this.initialize();
  }

  public initialize(): void {
    this.app.disable("x-powered-by");
    this.app.use(helmet({ ...this.options?.helmetOptions }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());

    this.app.use((_: Request, res: Response, next: NextFunction) => {
      res.apiSuccess = (param) => {
        res.status(param?.status || 200).json({
          success: true,
          message: param?.message || "OK",
          code: param?.code || EResponseCode.GET_DATA_SUCCESS,
          data: param?.data || null,
          status: param?.status || 200,
        });
      };
      res.apiError = (param) => {
        res.status(param?.status || 500).json({
          success: false,
          code: param?.code || EResponseCode.GENERAL_ERROR,
          message: param?.message ? param?.message : "ERROR",
          data: param?.data || null,
          status: param?.status || 500,
        });
      };

      return next();
    });

    super.addControllers([...(this.options?.controllers || [])]);
  }

  public run(): void {
    this.app.listen(process.env.PORT, () => {
      const server = http.createServer(this.app);
      const handleShutdown = (signal: string): void => {
        const exitCode = signal === "uncaughtException" ? 1 : 0;
        console.log(
          `${this.options?.appName} stop running.. Receiving Signal: ${signal}`
        );
        server.close((): void => {
          process.exit(exitCode);
        });
      };

      server.on("listening", () => {
        console.log(`\n${String("•").repeat(30)}`);
        console.log("ENV\t:", process.env.NODE_ENV);
        console.log("PORT\t:", process.env.PORT);
        console.log(`${String("•").repeat(30)}\n`);
      });

      process
        .on("SIGTERM", handleShutdown)
        .on("SIGINT", handleShutdown)
        .on("uncaughtException", (error: string, origin: string) => {
          console.log("uncaughtException origin: ", origin);
          console.log("uncaughtException: ", error);
        });

      process.on("exit", (code) => {
        console.log(
          `${this.options?.appName} is going to exit with code: ${code}`
        );
      });

      return server.listen.apply(server);
    });
  }
}

export default ExpressServer;
