import { ConfigProvider } from "antd";
import React, { type FC, lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router";
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "~/lib/client/components/LayoutApp";
import AppLayout from "./components/AppLayout";
import { THEMES } from "./constants/style";
import { TDispatch, TRootState } from "./redux";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { EResponseCode } from "~/lib/core/constants";
import Login from "./container/Login";
import RequireAuth from "./components/RequireAuth";

const ProductList = lazy(() => import("./container/ProductList"));
const Cart = lazy(() => import("./container/Cart"));

const App: FC = () => {
  const d = useDispatch<TDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const error = useSelector(
    (state: TRootState) => state.app.error,
    shallowEqual
  );

  const isUnauthorizedUserErr =
    error.code === EResponseCode.UNAUTHORIZED_REQUEST ||
    error.code === EResponseCode.SESSION_INVALID ||
    error.code === EResponseCode.TOKEN_INVALID;

  useEffect(() => {
    d.app.sign();
  }, []);

  useEffect(() => {
    if (isUnauthorizedUserErr) {
      navigate("/login", {
        replace: true,
        state: {
          redirect: location.pathname,
        },
      });
    }
  }, [isUnauthorizedUserErr]);

  return (
    <ThemeProvider theme={THEMES}>
      <ConfigProvider>
        <GlobalStyles />
        <Suspense fallback={<AppLayout />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<AppLayout />}>
              <Route path="" element={<ProductList />} />
              <Route
                path="cart"
                element={
                  <RequireAuth>
                    <Cart />
                  </RequireAuth>
                }
              />
            </Route>
          </Routes>
        </Suspense>
      </ConfigProvider>
    </ThemeProvider>
  );
};

export default App;
