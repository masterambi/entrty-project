import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Aside from "../Aside";
import NavBar from "../NavBar";

const { Content } = Layout;

const AppLayout = () => {
  return (
    <Layout style={{ height: "100vh" }}>
      <NavBar />

      <Layout>
        <Aside />
        <Content style={{ background: "#fff", overflow: "scroll" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
