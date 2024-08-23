import React, { type FC, type ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import type { TDispatch, TRootState } from "~/packages/cafenerd/client/redux";
import type { TLoginHistoryState } from "../../container/Login";

interface IRequireAuthBody {
  children?: ReactNode;
}
const RequireAuth: FC<IRequireAuthBody> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const d = useDispatch<TDispatch>();

  const userId = useSelector((state: TRootState) => state.app.user.id);

  const handleError = () => {
    navigate("/login", {
      replace: true,
      state: {
        redirect: location.pathname,
      } as TLoginHistoryState,
    });
  };

  useEffect(() => {
    if (userId) return;
    d.app.sign({ onError: handleError });
  }, []);

  if (userId) return children;

  return <div>Loading...</div>;
};

export default RequireAuth;
