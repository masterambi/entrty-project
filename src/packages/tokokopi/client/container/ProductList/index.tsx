import React, { useEffect, FC, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ProductListContent, ProductListPage } from "./style";
import ProductCard from "./components/ProductCard";
import { TDispatch, TRootState } from "../../redux";

type Props = {};

const ProductList: FC = (props: Props) => {
  const d = useDispatch<TDispatch>();
  const isLoading = useSelector(
    (state: TRootState) => state.loading.effects.product.fetchProductList
  );
  const productList = useSelector(
    (state: TRootState) => state.product.productList
  );

  const handleAddToCart = (productId: number) => async () => {
    await d.cart.addToCartItem({ productId, quantity: 1 });
    console.log("move to cart page");
  };

  const content = useMemo(() => {
    if (isLoading) {
      return [...new Array(10)].map((_, idx) => (
        <ProductCard loading={true} key={idx} />
      ));
    }
    return productList.map((product) => {
      return (
        <ProductCard
          name={product.name}
          image={product.imageUrl}
          price={product.price}
          stock={product.stock}
          key={product.id}
          onCartClick={handleAddToCart(product.id)}
        />
      );
    });
  }, [isLoading, productList]);

  useEffect(() => {
    d.product.fetchProductList();
  }, []);

  return (
    <ProductListPage>
      <ProductListContent>{content}</ProductListContent>
    </ProductListPage>
  );
};

export default ProductList;
