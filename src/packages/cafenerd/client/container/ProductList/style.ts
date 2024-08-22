import { ShoppingCartOutlined } from "@ant-design/icons";
import styled from "styled-components";

export const ProductListPage = styled.div`
  min-height: 100%;
  width: 100%;
`;

export const ProductListContainer = styled.div`
  margin: 0 auto;
  justify-content: center;
  max-width: 1296px;
  padding: 32px 16px 64px;

  @media screen and (min-width: 600px) {
    justify-content: flex-start;
  }
`;

export const ProductListContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: -8px;

  & > * {
    padding: 8px;
    width: 20%;
  }
`;

export const ShoppingCartIcon = styled(ShoppingCartOutlined)`
  && {
    color: ${(p) => p.theme.color.primary_color};

    svg {
      height: 20px;
      width: 20px;
    }
  }
`;
