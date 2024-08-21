import React, { FC, useState } from "react";

import { ShoppingCartOutlined } from "@ant-design/icons";

import { Card, Button, Skeleton, Image } from "antd";
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
  const [isImageLoading, setIsImageLoading] = useState(true);

  const imageLoading = loading || isImageLoading;

  const handleLoadImage = () => {
    setIsImageLoading(false);
  };

  return (
    <div>
      <Card
        hoverable
        loading={loading}
        bordered={false}
        style={{ overflow: "hidden" }}
        cover={
          <>
            <Skeleton.Image
              active={true}
              style={{
                ...(!imageLoading ? { display: "none" } : {}),
                height: 200,
                width: "100%",
              }}
            />
            <Image
              alt={name}
              src={image}
              onLoad={handleLoadImage}
              style={{
                overflow: "hidden",
                ...(imageLoading ? { display: "none" } : {}),
              }}
            />
          </>
        }
        actions={
          !loading
            ? [
                <Button size="large" type="primary" onClick={onCartClick}>
                  <ShoppingCartOutlined key="cart" />
                  Add to Cart
                </Button>,
              ]
            : [
                <Skeleton.Button
                  active={true}
                  style={{ width: 140 }}
                  size="large"
                />,
              ]
        }
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
    </div>
  );
};

export default ProductCard;
