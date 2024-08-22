import { Link } from "react-router-dom";
import { styled } from "styled-components";

export const NavBarTitle = styled(Link)`
  font-weight: 600;
  font-size: 36px;
  margin: 0;
  color: ${(p) => p.theme.color.neutral_color};
  text-decoration: none;
`;

export const Actions = styled.div`
  display: flex;
  gap: 8px;
`;
