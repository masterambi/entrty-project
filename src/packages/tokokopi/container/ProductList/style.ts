import styled from "styled-components";

export const ProductListPage = styled.div`
  max-width: 1264px;
  min-height: 100%;
  padding: 0 16px;
  margin: 0 auto;
`;

export const ProductListContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin: 0 auto;
  justify-content: center;

  @media screen and (min-width: 600px) {
    justify-content: flex-start;
  }
`;
