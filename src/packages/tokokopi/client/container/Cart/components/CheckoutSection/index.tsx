import React from "react";
import { CheckoutContent, PriceContent, PriceText, TotalText } from "./style";
import { formatCurrency } from "~/lib/core/utils";
import { Button } from "antd";

type ICheckoutSectionProps = {
  totalPrice?: number;
  totalItems?: number;
  loading?: boolean;
  onCheckoutClick?: () => void;
};

export const CheckoutSection = ({
  totalPrice,
  loading,
  totalItems,
  onCheckoutClick,
}: ICheckoutSectionProps) => {
  return (
    <CheckoutContent>
      <PriceContent>
        <TotalText>Total: </TotalText>
        <PriceText>{formatCurrency(totalPrice || 0, true)}</PriceText>
      </PriceContent>
      <Button
        onClick={onCheckoutClick}
        type="primary"
        size="large"
        disabled={loading}
      >
        Checkout ({totalItems})
      </Button>
    </CheckoutContent>
  );
};
