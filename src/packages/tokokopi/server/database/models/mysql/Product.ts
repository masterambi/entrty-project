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
  image_url: string;
  created_at: Date;
  updated_at: Date;
}

export interface IProductCreationAttributes
  extends Optional<IProductAttributes, "id" | "created_at" | "updated_at"> {}

@Table({
  tableName: "products",
  modelName: "products",
  freezeTableName: true,
  underscored: true,
  timestamps: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
})
class Product extends Model<IProductAttributes, IProductCreationAttributes> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER.UNSIGNED)
  id!: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  name!: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  description!: string;

  @AllowNull(false)
  @Column(DataType.DECIMAL(19, 0))
  price!: number;

  @AllowNull(false)
  @Column(DataType.INTEGER.UNSIGNED)
  stock!: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  image_url!: string;
}

export default Product;
