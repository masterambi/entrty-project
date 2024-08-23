import { ConfigProvider } from "antd";
import React, { type FC, lazy, Suspense, useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Route, Routes, useLocation, useNavigate } from "react-router";
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "~/lib/client/components/LayoutApp";
import { EResponseCode } from "~/lib/core/constants";
import AppLayout from "./components/AppLayout";
import RequireAuth from "./components/RequireAuth";
import { THEMES } from "./constants/style";
import Login from "./container/Login";
import type { TDispatch, TRootState } from "./redux";

const ProductList = lazy(() => import("./container/ProductList"));
const Cart = lazy(() => import("./container/Cart"));

const App: FC = () => {
  const d = useDispatch<TDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const error = useSelector((state: TRootState) => state.app.error, shallowEqual);

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
