import { styled } from "styled-components";

export const HeaderRoot = styled.div`
  display: flex;
  position: fixed;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background-color: white;
  z-index: 1001;
`;

export const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  height: 100%;
  align-items: center;
  padding: 16px 32px;
  gap: 16px;
  max-width: 1500px;
  width: 100%;
`;
