import { createModel } from "@rematch/core";
import { notification } from "antd";
import { EResponseCode } from "~/lib/core/constants";
import type { IRootModel } from ".";
import httpReq from "~/lib/core/helpers/httpReq";
import {
  TLoginResponse,
  TReqBodyLogin,
  TSignResponse,
} from "~/packages/cafenerd/server/controllers/v1/auth/type";

export interface IAppState {
  error: {
    code: EResponseCode | null;
    message: string;
  };
  user: {
    id: string;
  };
}

export const INITIAL_STATE: IAppState = {
  error: {
    code: null,
    message: "",
  },
  user: {
    id: "",
  },
};

export const App = createModel<IRootModel>()({
  name: "app",
  state: INITIAL_STATE,
  reducers: {
    saveUser: (state, payload: IAppState["user"]) => {
      return { ...state, user: { ...payload } };
    },
    saveError: (state, payload: IAppState["error"]) => {
      const isUnauthorizedUserErr =
        payload.code === EResponseCode.UNAUTHORIZED_REQUEST ||
        payload.code === EResponseCode.SESSION_INVALID ||
        payload.code === EResponseCode.TOKEN_INVALID;

      if (!isUnauthorizedUserErr) {
        notification.error({
          message: "Error",
          description: payload.message,
          duration: 4.5,
          placement: "topRight",
        });
      }

      return { ...state, error: payload };
    },
    clearError: (state) => {
      return { ...state, error: { code: null, message: "" } };
    },
  },
  effects: (dispatch) => ({
    async login({
      email,
      password,
      onSuccess,
      onError,
    }: {
      email: string;
      password: string;
      onSuccess?: () => void;
      onError?: (err: ApiError<EResponseCode>) => void;
    }) {
      try {
        const { response } = await httpReq<TLoginResponse, TReqBodyLogin>(
          "/api/v1/auth/login",
          {
            method: "POST",
            data: {
              email,
              password,
            },
          }
        );

        if (response.data) {
          dispatch.app.saveUser({ id: String(response.data.id) });
        }

        if (onSuccess) onSuccess();
      } catch (err) {
        const error = err.response as ApiError<EResponseCode>;
        dispatch.app.saveError({ code: error.code, message: error.message });
        if (onError) onError(error);
      }
    },

    async sign(params?: { onError?: (err?: ApiError<EResponseCode>) => void }) {
      try {
        const { response } = await httpReq<TSignResponse>("/api/v1/auth/sign", {
          method: "GET",
        });

        if (response.data) {
          dispatch.app.saveUser({ id: String(response.data.id) });
        }
      } catch (err) {
        const error = err.response as ApiError<EResponseCode>;
        dispatch.app.saveError({ code: error.code, message: error.message });
        if (params?.onError) params.onError(error);
      }
    },
  }),
});

export default App;
