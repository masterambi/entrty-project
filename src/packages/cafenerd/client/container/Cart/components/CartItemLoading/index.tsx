import { Skeleton } from "antd";
import React, { type FC } from "react";

const CartItemLoading: FC = () => {
  return <Skeleton.Input active={true} block={true} style={{ height: "90px", margin: "16px" }} />;
};

export default CartItemLoading;
