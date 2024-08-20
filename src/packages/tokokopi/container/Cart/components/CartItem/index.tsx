import React, { FC, useCallback, useState } from "react";
import { Image } from "antd";
import {
  CartItemContainer,
  CartItemContent,
  ProductPrice,
  ProductTitle,
  QuantityControl,
  QuantityInput,
  SpinButton,
} from "./style";
import { formatCurrency } from "~/lib/core/utils";
import debounce from "lodash.debounce";

export interface ICartItemProps {
  image: string;
  name: string;
  price: number;
  initialQuantity: number;
  productStock: number;
  onQuantityChange?: (newQuantity: number) => Promise<void>;
  onRemove?: () => void;
}
export const CartItem: FC<ICartItemProps> = ({
  image,
  name,
  price,
  initialQuantity,
  productStock,
  onQuantityChange,
  onRemove,
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleQuantityChange = (newQuantity: number) => {
    const value = newQuantity < 1 ? 1 : newQuantity;
    setQuantity(value);
    debouncedOnChange(value);
  };

  const incrementQuantity = () => {
    handleQuantityChange(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      handleQuantityChange(quantity - 1);
    } else {
      onRemove && onRemove();
    }
  };

  const debouncedOnChange = useCallback(
    debounce(async (newQuantity: number) => {
      try {
        onQuantityChange && (await onQuantityChange(newQuantity)); // Assume this returns a Promise
      } catch (err) {
        setQuantity(initialQuantity); // Revert to the original quantity on failure
      }
    }, 300),
    [onQuantityChange, initialQuantity]
  );

  return (
    <CartItemContainer>
      <Image width={90} src={image} />
      <CartItemContent>
        <ProductTitle ellipsis={true}>{name}</ProductTitle>
        <ProductPrice>{formatCurrency(price, true)}</ProductPrice>

        <QuantityControl>
          <SpinButton size="small" onClick={decrementQuantity}>
            -
          </SpinButton>
          <QuantityInput
            size="small"
            min={1}
            value={quantity}
            onChange={(e) =>
              handleQuantityChange(Number(e.currentTarget.value))
            }
            inputMode="numeric"
            type="number"
          />
          <SpinButton
            disabled={productStock === quantity}
            size="small"
            onClick={incrementQuantity}
          >
            +
          </SpinButton>
        </QuantityControl>
      </CartItemContent>
    </CartItemContainer>
  );
};
