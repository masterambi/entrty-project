import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";

const ProductList = lazy(() => import("../container/ProductList"));
const Cart = lazy(() => import("../container/Cart"));

type Props = {};

const App = (props: Props) => {
  return (
    <Suspense fallback={<div></div>}>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Suspense>
  );
};

export default App;
