import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import Product from "./Product";
import { Optional } from "sequelize";

export interface ICartItemAttributes {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICartCreationAttributes
  extends Optional<ICartItemAttributes, "id" | "createdAt" | "updatedAt"> {}

@Table({
  tableName: "cart_items",
  modelName: "cart_items",
  freezeTableName: true,
  underscored: true,
  timestamps: true,
  createdAt: true,
  updatedAt: true,
})
class CartItem extends Model<ICartItemAttributes, ICartCreationAttributes> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER.UNSIGNED)
  declare id: number;

  @AllowNull(false)
  @Column(DataType.INTEGER.UNSIGNED)
  declare userId: number;

  @AllowNull(false)
  @ForeignKey(() => Product)
  @Column(DataType.INTEGER.UNSIGNED)
  declare productId: number; // No direct property declaration, use `!` to indicate it's initialized

  @AllowNull(false)
  @Column(DataType.INTEGER.UNSIGNED)
  declare quantity: number; // No direct property declaration, use `!` to indicate it's initialized

  @BelongsTo(() => Product, {
    onDelete: "CASCADE",
  })
  declare product: Product; // The relation is defined here
}

export default CartItem;
