import React, { Suspense } from "react";
import { Route, Routes } from "react-router";
import ProductList from "../container/ProductList";

type Props = {};

const App = (props: Props) => {
  return (
    <Suspense fallback={<div></div>}>
      <Routes>
        <Route path="/" element={<ProductList />} />
      </Routes>
    </Suspense>
  );
};

export default App;
