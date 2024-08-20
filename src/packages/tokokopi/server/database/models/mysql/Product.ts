import { Optional } from "sequelize";
import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

export interface IProductAttributes {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductCreationAttributes
  extends Optional<IProductAttributes, "id" | "createdAt" | "updatedAt"> {}

@Table({
  tableName: "products",
  modelName: "product",
  freezeTableName: true,
  underscored: true,
  timestamps: true,
  createdAt: true,
  updatedAt: true,
})
class Product extends Model<IProductAttributes, IProductCreationAttributes> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER.UNSIGNED)
  declare id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare name: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  declare description: string;

  @AllowNull(false)
  @Column(DataType.DECIMAL(19, 0))
  declare price: number;

  @AllowNull(false)
  @Column(DataType.INTEGER.UNSIGNED)
  declare stock: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare imageUrl: string;
}

export default Product;
