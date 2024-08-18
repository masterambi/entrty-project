import logger from "~/lib/core/helpers/logger";
import Product, {
  IProductCreationAttributes,
} from "~/packages/tokokopi/server/database/models/mysql/Product";
import { Op } from "sequelize";

interface IGetProductListParams {
  limit: number;
  offset: number;
}
interface IGetProductListReturn {
  data?: {
    products: Product[];
    total: number;
  };
  error?: string;
}

export const getProductList = async (
  params: IGetProductListParams
): Promise<IGetProductListReturn> => {
  try {
    const { limit, offset } = params;
    logger.info({ limit, offset }, "Products Service - getProducts Params: ");

    const products = await Product.findAndCountAll({
      where: {
        stock: { [Op.gt]: 0 },
      },
      limit,
      offset,
    });

    logger.info(products.count, "Products Service - getProductList Data: ");

    return { data: { products: products.rows, total: products.count } };
  } catch (err) {
    logger.error(err.message || err, "Products Service - getProducts Error: ");
    return { error: "general_error" };
  }
};

interface ICreateProductParams extends IProductCreationAttributes {}
interface ICreateProductReturn {
  data?: Product;
  error?: "general_error";
}
export const createProduct = async (
  params: ICreateProductParams
): Promise<ICreateProductReturn> => {
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

    logger.info(product.toJSON(), "Products Service - createProduct Data: ");
    return { data: product };
  } catch (err) {
    logger.error(
      err.message || err,
      "Products Service - createProduct Error: "
    );
    return { error: "general_error" };
  }
};
