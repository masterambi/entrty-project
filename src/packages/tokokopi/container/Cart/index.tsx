import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TDispatch, TRootState } from "~/packages/tokokopi/client/redux";
import { CartItemsContent, CartPage } from "./style";
import { CartItem } from "./components/CartItem";
import { CheckoutSection } from "./components/CheckoutSection";

const Cart = () => {
  const d = useDispatch<TDispatch>();
  const isLoadingCartItems = useSelector(
    (state: TRootState) => state.loading.effects.cart.fetchCartItems
  );
  const isLoadingCheckoutCart = useSelector(
    (state: TRootState) => state.loading.effects.cart.checkoutCart
  );
  const cartItems = useSelector((state: TRootState) => state.cart.cartItems);
  const totalPrice = useSelector((state: TRootState) => state.cart.totalPrice);
  const totalItems = useSelector((state: TRootState) => state.cart.totalItems);

  const handleQuantityChange = (id: number) => async (quantity: number) => {
    await d.cart.updateCartItemQuantity({ id, quantity });
  };

  const handleRemoveCartItem = (id: number) => async () => {
    await d.cart.deleteCartItem(id);
  };

  const handleCheckoutCart = () => {
    d.cart.checkoutCart();
  };

  const content = useMemo(() => {
    if (isLoadingCartItems && cartItems.length === 0) {
      return [...new Array(5)].map((_, idx) => <div key={idx}>loading</div>);
    }

    return cartItems.map((cart) => (
      <CartItem
        key={cart.id}
        image={cart.product.image_url}
        name={cart.product.name}
        price={cart.product.price}
        productStock={cart.product.stock}
        initialQuantity={cart.quantity}
        onQuantityChange={handleQuantityChange(cart.id)}
        onRemove={handleRemoveCartItem(cart.id)}
      />
    ));
  }, [cartItems, isLoadingCartItems]);

  useEffect(() => {
    d.cart.fetchCartItems();
  }, []);

  return (
    <CartPage>
      <CartItemsContent>{content}</CartItemsContent>
      <CheckoutSection
        loading={isLoadingCartItems || isLoadingCheckoutCart}
        totalPrice={totalPrice}
        totalItems={totalItems}
        onCheckoutClick={handleCheckoutCart}
      />
    </CartPage>
  );
};

export default Cart;
