import { type RematchDispatch, type RematchRootState, init } from "@rematch/core";
import loadingPlugin, { type ExtraModelsFromLoading } from "@rematch/loading";
import type { Middleware } from "redux";
import logger from "redux-logger";
import { type IRootModel, RootModel } from "./models";

const middlewares: Middleware[] = [];

if (process.env.APP_ENV !== "production") {
  middlewares.push(logger as Middleware);
}

const Store = init<IRootModel, ExtraModelsFromLoading<IRootModel>>({
  models: RootModel,
  plugins: [loadingPlugin()],
  redux: {
    middlewares,
    devtoolOptions: {
      disabled: process.env.APP_ENV === "production",
    },
  },
});

export default Store;
export type TStore = typeof Store;
export type TDispatch = RematchDispatch<IRootModel>;
export type TRootState = RematchRootState<IRootModel, ExtraModelsFromLoading<IRootModel>>;
