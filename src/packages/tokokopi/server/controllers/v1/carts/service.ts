import logger from "~/lib/core/helpers/logger";
import Cart, {
  ICartCreationAttributes,
} from "../../../database/models/mysql/Cart";
import Product from "../../../database/models/mysql/Product";
import Connection from "~/lib/server/connection";

interface ICreateCartParams extends ICartCreationAttributes {}
interface ICreateCartReturn {
  data?: Cart;
  error?: "product_not_found" | "stock_not_enough" | "general_error";
}
export const createCart = async (
  params: ICreateCartParams
): Promise<ICreateCartReturn> => {
  try {
    const { product_id, user_id, quantity } = params;

    logger.info(
      { product_id, user_id, quantity },
      "Carts Service - createCart Params: "
    );

    const product = await Product.findByPk(product_id);
    if (!product) return { error: "product_not_found" };

    if (product.stock < quantity) {
      return { error: "stock_not_enough" };
    }

    const [cart, isCreated] = await Cart.findOrCreate({
      where: {
        user_id,
        product_id,
      },
      defaults: { quantity, user_id, product_id },
    });

    if (!isCreated) {
      cart.quantity += quantity;

      if (product.stock < cart.quantity) {
        return { error: "stock_not_enough" };
      }

      await cart.save();
    }

    logger.info(cart, "Carts Service - createCart Data: ");
    return { data: cart };
  } catch (err) {
    logger.error(err.message || err, "Carts Service - createCart Error: ");
    return { error: "general_error" };
  }
};

interface IGetCartsByUserParams {
  user_id: number;
}
interface IGetCartsByUserReturn {
  data?: { cartItems: Cart[]; totalPrice: number; totalItems: number };
  error?: "general_error";
}
export const getCartsByUser = async (
  params: IGetCartsByUserParams
): Promise<IGetCartsByUserReturn> => {
  try {
    const { user_id } = params;

    logger.info({ user_id }, "Carts Service - getCartsByUser Params: ");

    const carts = await Cart.findAll({
      where: { user_id },
      order: [["id", "DESC"]],
      include: {
        model: Product,
        attributes: ["id", "name", "price", "stock", "image_url"],
      },
    });

    const total = carts.reduce(
      (total, cart) => {
        const tempTotalPrice = (total.totalPrice +=
          cart.quantity * cart.product.price);
        const tempTotalItem = (total.totalItems += cart.quantity);

        return {
          totalPrice: tempTotalPrice,
          totalItems: tempTotalItem,
        };
      },
      { totalPrice: 0, totalItems: 0 }
    );

    return {
      data: {
        cartItems: carts,
        totalPrice: total.totalPrice,
        totalItems: total.totalItems,
      },
    };
  } catch (err) {
    logger.error(err.message || err, "Carts Service - getCartsByUser Error: ");
    return { error: "general_error" };
  }
};

interface IUpdateCartQtyParams {
  cart_id: number;
  user_id: number;
  quantity: number;
}
interface IUpdateCartQtyReturn {
  data?: Cart;
  error?: "cart_not_found" | "stock_not_enough" | "general_error";
}
export const updateCartQty = async (
  params: IUpdateCartQtyParams
): Promise<IUpdateCartQtyReturn> => {
  try {
    const { cart_id, user_id, quantity } = params;
    logger.info(
      { cart_id, user_id, quantity },
      "Carts Service - updateCartQty Params: "
    );

    const cart = await Cart.findOne({
      where: {
        id: cart_id,
        user_id,
      },
      include: [Product],
    });

    if (!cart) return { error: "cart_not_found" };

    cart.quantity = quantity;

    if (cart.product.stock < cart.quantity) {
      return { error: "stock_not_enough" };
    }

    const updatedCart = await cart.save();

    logger.info(updatedCart.toJSON(), "Carts Service - createCart Data: ");

    return { data: updatedCart };
  } catch (err) {
    logger.error(err.message || err, "Carts Service - updateCartQty Error: ");
    return { error: "general_error" };
  }
};

interface IDeleteCartParams {
  cart_id: number;
  user_id: number;
}
interface IDeleteCartReturn {
  data?: { message: string };
  error?: "cart_not_found" | "general_error";
}
export const deleteCart = async (
  params: IDeleteCartParams
): Promise<IDeleteCartReturn> => {
  try {
    const { cart_id, user_id } = params;
    logger.info({ cart_id, user_id }, "Carts Service - deleteCart Params: ");

    const record = await Cart.destroy({
      where: {
        id: cart_id,
        user_id,
      },
    });

    if (record === 0) return { error: "cart_not_found" };

    logger.info(record, "Carts Service - createCart Data: ");

    return { data: { message: "delete cart success" } };
  } catch (err) {
    logger.error(err.message || err, "Carts Service - deleteCart Error: ");
    return { error: "general_error" };
  }
};

interface ICheckoutParams {
  user_id: number;
}
interface ICheckoutReturn {
  data?: { message: string };
  error?:
    | "cart_empty"
    | "product_not_found"
    | "stock_not_enough"
    | "general_error";
}
export const checkout = async (
  params: ICheckoutParams
): Promise<ICheckoutReturn> => {
  const { user_id } = params;
  logger.info({ user_id }, "Carts Service - checkout Params: ");
  const db = Connection.getMysqlInstance();
  const t = await db.transaction();

  try {
    const carts = await Cart.findAll({
      where: { user_id },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    if (!carts.length) {
      await t.rollback();
      return { error: "cart_empty" };
    }

    const products = await Product.findAll({
      where: { id: carts.map((cart) => cart.product_id) },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const productUpdates: { id: number; stock: number }[] = [];
    for (const cart of carts) {
      const product = products.find(
        (product) => product.id === cart.product_id
      );

      if (!product) {
        await t.rollback();
        return { error: "product_not_found" };
      }

      if (product.stock < cart.quantity) {
        await t.rollback();
        return { error: "stock_not_enough" };
      }

      product.stock -= cart.quantity;

      productUpdates.push({
        id: product.id,
        stock: product.stock,
      });
    }

    await Promise.all(
      productUpdates.map((update) =>
        Product.update(
          { stock: update.stock },
          { where: { id: update.id }, transaction: t }
        )
      )
    );

    await Cart.destroy({ where: { user_id }, transaction: t });

    await t.commit();

    logger.info({ success: true }, "Carts Service - checkout Data: ");

    return { data: { message: "checkout cart items success" } };
  } catch (err) {
    await t.rollback();
    logger.error(err.message || err, "Carts Service - checkout Error: ");
    return { error: "general_error" };
  }
};
