import { ShopOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
const { Sider } = Layout;

const menuKeys = ["/", "/cart"];

const Aside = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedKeys = useMemo(() => {
    const pathname = location.pathname;
    return menuKeys.includes(pathname) ? [pathname] : [""];
  }, [location.pathname]);

  const handleRedirect = (key: string) => {
    navigate(`${key}`);
  };

  return (
    <Sider width={260}>
      <Menu
        theme="dark"
        selectedKeys={selectedKeys}
        style={{ minHeight: "100%" }}
        items={[
          {
            key: "/",
            icon: <ShopOutlined />,
            label: "Products",
            onClick: (val) => handleRedirect(val.key),
          },
          {
            key: "/cart",
            icon: <ShoppingCartOutlined />,
            label: "Cart",
            onClick: (val) => handleRedirect(val.key),
          },
        ]}
      />
    </Sider>
  );
};

export default Aside;
