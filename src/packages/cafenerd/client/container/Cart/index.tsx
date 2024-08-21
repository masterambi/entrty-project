import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { TDispatch, TRootState } from "~/packages/cafenerd/client/redux";
import { CartContainer, CartEmpty, CartItemsContent, CartPage } from "./style";
import { CartItem } from "./components/CartItem";
import { CheckoutSection } from "./components/CheckoutSection";
import { createFakeArray } from "~/lib/core/utils";
import { Button, Typography } from "antd";
import CartItemLoading from "./components/CartItemLoading";

const Cart = () => {
  const d = useDispatch<TDispatch>();
  const isLoadingCartItems = useSelector(
    (state: TRootState) => state.loading.effects.cart.fetchCartItems
  );
  const isLoadingCheckoutCart = useSelector(
    (state: TRootState) => state.loading.effects.cart.checkoutCart
  );
  const isLoadingDeleteCart = useSelector(
    (state: TRootState) => state.loading.effects.cart.deleteCartItem
  );
  const isLoadingUpdateQty = useSelector(
    (state: TRootState) => state.loading.effects.cart.updateCartItemQuantity
  );
  const cartItems = useSelector(
    (state: TRootState) => state.cart.cartItems,
    shallowEqual
  );
  const totalPrice = useSelector((state: TRootState) => state.cart.totalPrice);
  const totalItems = useSelector((state: TRootState) => state.cart.totalItems);
  const err = useSelector((state: TRootState) => state.app.error, shallowEqual);

  const shouldReset = !!err.code;
  const isCartEmpty = !cartItems.length && !isLoadingCartItems;

  const handleResetDone = () => {
    d.app.clearError();
  };

  const handleQuantityChange = (id: number) => async (quantity: number) => {
    await d.cart.updateCartItemQuantity({ id, quantity });
  };

  const handleRemoveCartItem = (id: number) => async () => {
    await d.cart.deleteCartItem(id);
  };

  const handleCheckoutCart = () => {
    d.cart.checkoutCart();
  };

  const renderCartItems = () => {
    if (isLoadingCartItems && cartItems.length === 0) {
      return createFakeArray(6).map((idx) => <CartItemLoading key={idx} />);
    }

    return cartItems.map((cart) => (
      <CartItem
        key={cart.id}
        image={cart.product.imageUrl}
        name={cart.product.name}
        price={cart.product.price}
        productStock={cart.product.stock}
        initialQuantity={cart.quantity}
        onQuantityChange={handleQuantityChange(cart.id)}
        onRemove={handleRemoveCartItem(cart.id)}
        isLoadingRemove={isLoadingDeleteCart}
        isLoadingUpdateQty={isLoadingUpdateQty}
        shouldReset={shouldReset}
        onResetDone={handleResetDone}
      />
    ));
  };

  useEffect(() => {
    d.cart.fetchCartItems();
    d.app.clearError();
  }, []);

  return (
    <CartPage>
      <CartContainer>
        {isCartEmpty && (
          <CartEmpty>
            <Typography.Title level={2}>Cart is empty</Typography.Title>
            <Button type="primary" size="large">
              Start Shopping
            </Button>
          </CartEmpty>
        )}
        {!isCartEmpty && (
          <>
            <CartItemsContent>{renderCartItems()}</CartItemsContent>
            <CheckoutSection
              loading={isLoadingCartItems || isLoadingCheckoutCart}
              totalPrice={totalPrice}
              totalItems={totalItems}
              onCheckoutClick={handleCheckoutCart}
            />
          </>
        )}
      </CartContainer>
    </CartPage>
  );
};

export default Cart;
