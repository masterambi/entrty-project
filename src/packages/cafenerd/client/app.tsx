import { ConfigProvider } from "antd";
import React, { type FC, lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "~/lib/client/components/LayoutApp";
import AppLayout from "./components/AppLayout";
import { THEMES } from "./constants/style";

const ProductList = lazy(() => import("./container/ProductList"));
const Cart = lazy(() => import("./container/Cart"));

const App: FC = () => {
  return (
    <ThemeProvider theme={THEMES}>
      <ConfigProvider>
        <GlobalStyles />
        <Suspense fallback={<AppLayout />}>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route path="" element={<ProductList />} />
              <Route path="cart" element={<Cart />} />
            </Route>
          </Routes>
        </Suspense>
      </ConfigProvider>
    </ThemeProvider>
  );
};

export default App;
