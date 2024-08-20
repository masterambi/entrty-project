import styled from "styled-components";
import { Button, Input, Typography } from "antd";

export const CartItemContainer = styled.li`
  padding: 16px;
  display: flex;
  gap: 16px;
  border-bottom: 1px solid #333;
`;

export const CartItemImage = styled.img`
  height: 90px;
  width: 90px;
`;

export const CartItemContent = styled.div`
  padding: 4px 0;
  flex-grow: 1;
`;

export const ProductTitle = styled(Typography.Title).attrs({
  level: 2,
  ellipsis: { rows: 1 },
})`
  && {
    color: #888;
    font-weight: 400;
    font-size: 14px;
    margin: 0;
    margin-bottom: 4px;
    display: block;
  }
`;

export const ProductPrice = styled(Typography.Paragraph).attrs({
  ellipsis: { rows: 1 },
})`
  && {
    font-weight: 500;
    margin: 0;
    display: block;
    margin-bottom: 4px;
  }
`;

export const QuantityControl = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

export const SpinButton = styled(Button).attrs({ size: "small" })`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  padding: 0;
`;

export const QuantityInput = styled(Input)`
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  && {
    width: 36px;
    margin: 0 8px;
  }
`;
