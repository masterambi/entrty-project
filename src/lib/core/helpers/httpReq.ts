import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from "axios";
import { CONFIGURATION } from "~/lib/client/constants";

export interface IHttpConfig<Body> extends AxiosRequestConfig<Body> {
  data?: Body;
  method: Method;
}

interface IResponse<T> {
  response: T;
  headers: AxiosResponse["headers"];
}

export default function httpReq<
  Response = Record<string, unknown>,
  Request = Record<string, unknown>
>(url: string, config: IHttpConfig<Request>): Promise<IResponse<Response>> {
  return new Promise<IResponse<Response>>((resolve, reject) => {
    const newConfig = {
      ...config,
      withCredentials: true,
      headers: {
        "Accept-Language":
          localStorage.getItem(CONFIGURATION.LOCAL_STORAGE_LOCALE_KEY) ||
          "id-ID",
      },
    };

    axios(url, newConfig)
      .then((resp: AxiosResponse<IResponse<Response>>) => {
        resolve({ response: resp.data as Response, headers: resp.headers });
      })
      .catch((err: AxiosError<IResponse<Response>>) => {
        // Error from the server
        if (err.response) {
          reject({
            response: err.response?.data as Response,
            headers: err.response?.headers,
          });
        }

        reject({
          response: {
            code: err.code,
            message: err.message,
          },
        });
      });
  });
}
