import { FC, ReactNode } from "react";
import { Layout } from "antd";
import { Actions, NavBarTitle } from "./style";

interface INavBarProps {
  actions?: ReactNode[];
}
const NavBar: FC<INavBarProps> = ({ actions }) => {
  return (
    <Layout.Header>
      <NavBarTitle to="/">Cafenerd</NavBarTitle>
      {!!actions && <Actions>{actions}</Actions>}
    </Layout.Header>
  );
};

export default NavBar;
