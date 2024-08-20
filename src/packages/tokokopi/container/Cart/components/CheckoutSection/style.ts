import styled from "styled-components";
import { Typography } from "antd";

export const CheckoutContent = styled.div`
  display: flex;
  padding: 16px;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
`;

export const PriceContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TotalText = styled(Typography.Text)`
  color: #888;
  font-size: 12px;
`;

export const PriceText = styled(Typography.Text)`
  font-weight: 500;
`;
