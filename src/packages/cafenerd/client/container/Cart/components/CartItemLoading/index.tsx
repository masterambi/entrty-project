import React, { FC } from "react";
import { Skeleton } from "antd";

const CartItemLoading: FC = () => {
  return (
    <Skeleton.Input
      active={true}
      block={true}
      style={{ height: "90px", margin: "16px" }}
    ></Skeleton.Input>
  );
};

export default CartItemLoading;
