import { FC, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { FormProps } from "antd";
import { Button, Form, Input, Layout, Typography } from "antd";
import NavBar from "../../components/NavBar";
import { useDispatch } from "react-redux";
import { TDispatch } from "../../redux";
import { EResponseCode } from "~/lib/core/constants";

interface TLoginHistoryState {
  redirect?: string;
}

type TLoginField = {
  email: string;
  password: string;
};

const Login: FC = () => {
  const d = useDispatch<TDispatch>();
  const location = useLocation();
  const navigate = useNavigate();

  const { redirect } = location.state as TLoginHistoryState;

  const [form] = Form.useForm();

  const handleOnSuccess = () => {
    navigate(redirect ? redirect : "/", { replace: true });
  };

  const handleOnError = (error: ApiError<EResponseCode>) => {
    if (error.code !== EResponseCode.UNAUTHORIZED_REQUEST) return;
    form.setFields([
      { name: "email", errors: [error.message] },
      { name: "password", errors: [error.message] },
    ]);
  };

  const handleOnClickLogin: FormProps<TLoginField>["onFinish"] = ({
    email,
    password,
  }) => {
    d.app.login({
      email,
      password,
      onSuccess: handleOnSuccess,
      onError: handleOnError,
    });
  };

  useEffect(() => {
    d.app.clearError();
  }, []);

  return (
    <Layout style={{ height: "100vh" }}>
      <NavBar />

      <Layout>
        <Layout.Content
          style={{
            background: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Form
            form={form}
            name="login_form"
            layout="vertical"
            size="large"
            style={{
              maxWidth: 400,
              width: "100%",
              padding: "32px 16px 96px",
            }}
            initialValues={{ remember: true }}
            onFinish={handleOnClickLogin}
            autoComplete="off"
          >
            <Typography.Title level={1}>Login</Typography.Title>
            <Form.Item<TLoginField>
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item<TLoginField>
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item style={{ marginTop: "40px" }}>
              {/* <Space> */}
              <Button type="primary" htmlType="submit">
                Login
              </Button>
              {/* </Space> */}
            </Form.Item>
          </Form>
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default Login;
