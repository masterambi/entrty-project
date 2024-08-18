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

export interface ICartAttributes {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  created_at: Date;
  updated_at: Date;
}

export interface ICartCreationAttributes
  extends Optional<ICartAttributes, "id" | "created_at" | "updated_at"> {}

@Table({
  tableName: "carts",
  modelName: "carts",
  freezeTableName: true,
  underscored: true,
  timestamps: true,
  createdAt: true,
  updatedAt: true,
})
class Cart extends Model<ICartAttributes, ICartCreationAttributes> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER.UNSIGNED)
  declare id: number;

  @AllowNull(false)
  @Column(DataType.INTEGER.UNSIGNED)
  declare user_id: number;

  @AllowNull(false)
  @ForeignKey(() => Product)
  @Column(DataType.INTEGER.UNSIGNED)
  declare product_id: number; // No direct property declaration, use `!` to indicate it's initialized

  @AllowNull(false)
  @Column(DataType.INTEGER.UNSIGNED)
  declare quantity: number; // No direct property declaration, use `!` to indicate it's initialized

  @BelongsTo(() => Product, "product_id")
  declare product: Product; // The relation is defined here
}

export default Cart;
