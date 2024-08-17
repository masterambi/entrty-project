type ApiSuccess<T> = {
  status: number;
  data: T;
  message?: string;
  code: string | number;
};
type ApiError<E> = {
  message: string;
  code: E extends number ? E : number;
  status: number;
  data?: Record<string, unknown> | Record<string, unknown>[];
};

declare namespace Express {
  // export interface Request {
  //   user?: {
  //     external_user_id: string;
  //     uuid: string;
  //     locale: "en-US" | "id-ID";
  //   };
  //   transaction?: {
  //     token: string;
  //   };
  // }
  export interface Response {
    apiSuccess: <T>(data?: ApiSuccess<T>) => void;
    apiError: <E>(data?: ApiError<E>) => void;
  }
}
