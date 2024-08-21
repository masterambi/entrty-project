import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
import { THEMES } from "./constants/style";
import { ThemeProvider } from "styled-components";
import { ConfigProvider } from "antd";
import { GlobalStyles } from "~/lib/client/components/LayoutApp";
import AppLayout from "./components/AppLayout";

const ProductList = lazy(() => import("./container/ProductList"));
const Cart = lazy(() => import("./container/Cart"));

type Props = {};

const App = (props: Props) => {
  return (
    <ThemeProvider theme={THEMES}>
      <ConfigProvider>
        <GlobalStyles />
        <Suspense fallback={<div></div>}>
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
