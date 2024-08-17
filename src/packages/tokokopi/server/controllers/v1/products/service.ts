import logger from "~/lib/core/helpers/logger";
import Product, {
  IProductCreationAttributes,
} from "~/packages/tokokopi/server/database/models/mysql/Product";

interface IGetProductListParams {
  limit: number;
  offset: number;
}
interface IGetProductListReturn {
  products: Product[];
  total: number;
}

export const getProductList = async (
  params: IGetProductListParams
): Promise<IGetProductListReturn> => {
  try {
    const { limit, offset } = params;
    logger.info({ limit, offset }, "Products Service - getProducts Params: ");

    const products = await Product.findAndCountAll({ limit, offset });

    logger.info(products.count, "Products Service - getProductList Data: ");

    return { products: products.rows, total: products.count };
  } catch (err) {
    logger.error(err.message || err, "Products Service - getProducts Error: ");
    throw err;
  }
};

interface ICreateProductParams extends IProductCreationAttributes {}
export const createProduct = async (
  params: ICreateProductParams
): Promise<Product> => {
  try {
    const { name, description, price, stock, image_url } = params;
    logger.info(
      { name, description, price, stock, image_url },
      "Products Service - createProduct Params: "
    );

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      image_url,
    });

    logger.info(product, "Products Service - createProduct Data: ");
    return product;
  } catch (err) {
    logger.error(
      err.message || err,
      "Products Service - createProduct Error: "
    );
    throw err;
  }
};
