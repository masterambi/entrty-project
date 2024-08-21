import React, { useEffect, FC, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  ProductListContainer,
  ProductListContent,
  ProductListPage,
} from "./style";
import ProductCard from "./components/ProductCard";
import { TDispatch, TRootState } from "../../redux";
import { Button, Modal } from "antd";
import { useNavigate } from "react-router-dom";

const ProductList: FC = () => {
  const d = useDispatch<TDispatch>();

  const navigate = useNavigate();

  const isLoading = useSelector(
    (state: TRootState) => state.loading.effects.product.fetchProductList
  );
  const productList = useSelector(
    (state: TRootState) => state.product.productList
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSuccessAddToCart = () => {
    setIsModalOpen(true);
  };

  const handleAddToCart = (productId: number) => async () => {
    d.cart.addToCartItem({
      productId,
      quantity: 1,
      onSuccess: handleSuccessAddToCart,
    });
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
    d.app.clearError();
  }, []);

  useEffect(() => {
    d.product.fetchProductList();
  }, []);

  return (
    <ProductListPage>
      <ProductListContainer>
        <ProductListContent>{content}</ProductListContent>
      </ProductListContainer>

      <Modal
        title="Product Added to Cart"
        open={isModalOpen}
        centered
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalOpen(false)}>
            Continue Shopping
          </Button>,
          <Button key="submit" type="primary" onClick={() => navigate("/cart")}>
            Go to Cart
          </Button>,
        ]}
      >
        <p>You can continue shopping or move to cart page</p>
      </Modal>
    </ProductListPage>
  );
};

export default ProductList;
