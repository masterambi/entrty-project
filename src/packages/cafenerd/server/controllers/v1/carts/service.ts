import logger from "~/lib/core/helpers/logger";
import Connection from "~/lib/server/connection";
import CartItem, {
  type ICartCreationAttributes,
} from "../../../database/models/mysql/CartItem";
import Product from "../../../database/models/mysql/Product";

interface ICreateCartParams extends ICartCreationAttributes {}
interface ICreateCartReturn {
  data?: CartItem;
  error?: "product_not_found" | "stock_not_enough" | "general_error";
}
export const createCart = async (
  params: ICreateCartParams
): Promise<ICreateCartReturn> => {
  try {
    const { productId, userId, quantity } = params;

    logger.info(
      { productId, userId, quantity },
      "Carts Service - createCart Params: "
    );

    const product = await Product.findByPk(productId);
    if (!product) return { error: "product_not_found" };

    if (product.stock < quantity) {
      return { error: "stock_not_enough" };
    }

    const [cart, isCreated] = await CartItem.findOrCreate({
      where: {
        userId,
        productId,
      },
      defaults: { quantity, userId, productId },
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

interface IGetCartItemsByUserParams {
  userId: string;
}
interface IGetCartItemsByUserReturn {
  data?: { cartItems: CartItem[]; totalPrice: number; totalItems: number };
  error?: "general_error";
}
export const getCartItemsByUser = async (
  params: IGetCartItemsByUserParams
): Promise<IGetCartItemsByUserReturn> => {
  try {
    const { userId } = params;

    logger.info({ userId }, "Carts Service - getCartItemsByUser Params: ");

    const carts = await CartItem.findAll({
      where: { userId },
      order: [["id", "DESC"]],
      include: {
        model: Product,
        attributes: ["id", "name", "price", "stock", "imageUrl"],
      },
    });

    const total = carts.reduce(
      (total, cart) => {
        const tempTotalPrice =
          total.totalPrice + cart.quantity * cart.product.price;
        const tempTotalItem = total.totalItems + cart.quantity;

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
    logger.error(
      err.message || err,
      "Carts Service - getCartItemsByUser Error: "
    );
    return { error: "general_error" };
  }
};

interface IUpdateCartItemQtyParams {
  cartItemId: string;
  userId: number;
  quantity: number;
}
interface IUpdateCartItemQtyReturn {
  data?: CartItem;
  error?: "cart_item_not_found" | "stock_not_enough" | "general_error";
}
export const updateCartItemQty = async (
  params: IUpdateCartItemQtyParams
): Promise<IUpdateCartItemQtyReturn> => {
  try {
    const { cartItemId, userId, quantity } = params;
    logger.info(
      { cartItemId, userId, quantity },
      "Carts Service - updateCartItemQty Params: "
    );

    const cart = await CartItem.findOne({
      where: {
        id: cartItemId,
        userId,
      },
      include: [Product],
    });

    if (!cart) return { error: "cart_item_not_found" };

    cart.quantity = quantity;

    if (cart.product.stock < cart.quantity) {
      return { error: "stock_not_enough" };
    }

    const updatedCart = await cart.save();

    logger.info(
      updatedCart.toJSON(),
      "Carts Service - updateCartItemQty Data: "
    );

    return { data: updatedCart };
  } catch (err) {
    logger.error(
      err.message || err,
      "Carts Service - updateCartItemQty Error: "
    );
    return { error: "general_error" };
  }
};

interface IDeleteCartItemParams {
  cartItemId: number;
  userId: number;
}
interface IDeleteCartItemReturn {
  data?: { message: string };
  error?: "cart_item_not_found" | "general_error";
}
export const deleteCartItem = async (
  params: IDeleteCartItemParams
): Promise<IDeleteCartItemReturn> => {
  try {
    const { cartItemId, userId } = params;
    logger.info(
      { cartItemId, userId },
      "Carts Service - deleteCartItem Params: "
    );

    const record = await CartItem.destroy({
      where: {
        id: cartItemId,
        userId,
      },
    });

    if (record === 0) return { error: "cart_item_not_found" };

    logger.info(record, "Carts Service - createCart Data: ");

    return { data: { message: "Delete cart item success" } };
  } catch (err) {
    logger.error(err.message || err, "Carts Service - deleteCartItem Error: ");
    return { error: "general_error" };
  }
};

interface ICheckoutParams {
  userId: string;
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
  const { userId } = params;
  logger.info({ userId }, "Carts Service - checkout Params: ");
  const db = Connection.getMysqlInstance();
  const t = await db.transaction();

  try {
    const carts = await CartItem.findAll({
      where: { userId },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    if (!carts.length) {
      await t.rollback();
      return { error: "cart_empty" };
    }

    const products = await Product.findAll({
      where: { id: carts.map((cart) => cart.productId) },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const productUpdates: { id: number; stock: number }[] = [];
    for (const cart of carts) {
      const product = products.find((product) => product.id === cart.productId);

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

    await CartItem.destroy({ where: { userId }, transaction: t });

    await t.commit();

    logger.info({ success: true }, "Carts Service - checkout Data: ");

    return { data: { message: "Checkout cart items success" } };
  } catch (err) {
    await t.rollback();
    logger.error(err.message || err, "Carts Service - checkout Error: ");
    return { error: "general_error" };
  }
};
