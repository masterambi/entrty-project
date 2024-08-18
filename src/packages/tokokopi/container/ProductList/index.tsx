import React, { useEffect, FC, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TDispatch, TRootState } from "../../client/redux";
import { ProductListContent, ProductListPage } from "./style";
import ProductCard from "./components/ProductCard";

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
    console.log(productId);
    await d.product.addToCart({ id: productId, quantity: 1 });
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
          image={product.image_url}
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
