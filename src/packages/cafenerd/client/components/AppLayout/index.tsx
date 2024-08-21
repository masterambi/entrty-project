import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import NavBar from "../NavBar";
import Aside from "../Aside";

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
