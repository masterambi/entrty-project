import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Image } from "antd";
import debounce from "lodash.debounce";
import React, { type FC, useCallback, useEffect, useState } from "react";
import { formatCurrency } from "~/lib/core/utils";
import {
  CartItemContainer,
  CartItemContent,
  ProductPrice,
  ProductTitle,
  QuantityControl,
  QuantityInput,
  SpinButton,
} from "./style";

export interface ICartItemProps {
  image: string;
  name: string;
  price: number;
  initialQuantity: number;
  productStock: number;
  shouldReset?: boolean;
  isLoadingRemove?: boolean;
  isLoadingUpdateQty?: boolean;
  onQuantityChange?: (newQuantity: number) => Promise<void>;
  onRemove?: () => void;
  onResetDone?: () => void;
}
export const CartItem: FC<ICartItemProps> = ({
  image,
  name,
  price,
  initialQuantity,
  productStock,
  shouldReset,
  isLoadingRemove,
  isLoadingUpdateQty,
  onQuantityChange,
  onRemove,
  onResetDone,
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [isChangingQty, setIsChangingQty] = useState(false);

  const handleQuantityChange = (newQuantity: number) => {
    setIsChangingQty(true);
    let value = newQuantity < 1 ? 1 : newQuantity;
    value = newQuantity > productStock ? productStock : value;
    setQuantity(value);
    debouncedOnChange(value);
  };

  const incrementQuantity = () => {
    handleQuantityChange(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      handleQuantityChange(quantity - 1);
    }
  };

  const debouncedOnChange = useCallback(
    debounce((newQuantity: number) => {
      onQuantityChange?.(newQuantity);
      setIsChangingQty(false);
    }, 300),
    [onQuantityChange, initialQuantity],
  );

  useEffect(() => {
    if (shouldReset) setQuantity(initialQuantity);
    if (shouldReset && onResetDone) onResetDone();
  }, [shouldReset]);

  return (
    <CartItemContainer>
      <Image width={90} src={image} />
      <CartItemContent>
        <ProductTitle ellipsis={true}>{name}</ProductTitle>
        <ProductPrice>{formatCurrency(price, true)}</ProductPrice>

        <QuantityControl>
          {quantity > 1 ? (
            <SpinButton disabled={isLoadingUpdateQty} size="small" onClick={decrementQuantity}>
              <MinusOutlined />
            </SpinButton>
          ) : (
            <SpinButton
              disabled={isChangingQty || isLoadingRemove || isLoadingUpdateQty}
              size="small"
              onClick={onRemove}
            >
              <DeleteOutlined />
            </SpinButton>
          )}

          <QuantityInput
            size="small"
            min={1}
            value={quantity}
            onChange={(e) => handleQuantityChange(Number(e.currentTarget.value))}
            inputMode="numeric"
            type="number"
          />
          <SpinButton
            disabled={productStock === quantity || isLoadingUpdateQty}
            size="small"
            onClick={incrementQuantity}
          >
            <PlusOutlined />
          </SpinButton>
        </QuantityControl>
      </CartItemContent>
    </CartItemContainer>
  );
};
