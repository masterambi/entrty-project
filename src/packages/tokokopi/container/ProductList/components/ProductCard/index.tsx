import React, { FC } from "react";

import { ShoppingCartOutlined } from "@ant-design/icons";

import { Card, Button, Skeleton } from "antd";
import { formatCurrency } from "~/lib/core/utils";

interface IProductCartProps {
  image?: string;
  name?: string;
  price?: number;
  stock?: number;
  loading?: boolean;
  onCartClick?: () => void;
}

export const ProductCard: FC<IProductCartProps> = ({
  image,
  name,
  price,
  stock,
  loading,
  onCartClick,
}) => {
  return (
    <Card
      style={{ width: 240 }}
      hoverable
      loading={loading}
      cover={
        !loading ? (
          <img alt={name} src={image} />
        ) : (
          <Skeleton.Image
            active={true}
            style={{ height: 240, width: "100%" }}
          />
        )
      }
      actions={[
        <Button onClick={onCartClick}>
          <ShoppingCartOutlined key="cart" />
          Add to Cart
        </Button>,
      ]}
    >
      <Card.Meta
        title={name}
        description={
          <>
            <p>{formatCurrency(price || 0, true)}</p>
            <p>Stock: {stock}</p>
          </>
        }
      />
    </Card>
  );
};

export default ProductCard;
