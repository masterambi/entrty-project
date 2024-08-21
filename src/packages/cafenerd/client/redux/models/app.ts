import { EResponseCode } from "~/lib/core/constants";
import { IRootModel } from ".";
import { createModel } from "@rematch/core";
import { notification } from "antd";

export interface IAppState {
  error: {
    code: EResponseCode | null;
    message: string;
  };
}

export const INITIAL_STATE: IAppState = {
  error: {
    code: null,
    message: "",
  },
};

export const App = createModel<IRootModel>()({
  name: "app",
  state: INITIAL_STATE,
  reducers: {
    saveError: (state, payload: IAppState["error"]) => {
      notification.error({
        message: "Error",
        description: payload.message,
        duration: 4.5,
        placement: "topRight",
      });
      return { ...state, error: payload };
    },
    clearError: (state) => {
      return { ...state, error: { code: null, message: "" } };
    },
  },
});

export default App;
