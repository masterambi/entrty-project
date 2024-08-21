import styled from "styled-components";

export const CartPage = styled.div`
  min-height: 100%;
  padding: 16px 16px 64px;
`;

export const CartContainer = styled.div`
  max-width: 500px;
  height: 100%;
  margin: 0 auto;
`;

export const CartEmpty = styled.div`
  padding-top: 64px;
  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;
`;

export const CartItemsContent = styled.ul`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding: 0;
`;
