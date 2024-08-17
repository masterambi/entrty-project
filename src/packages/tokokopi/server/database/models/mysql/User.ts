import { Optional } from "sequelize";
import { Model } from "sequelize-typescript";

export interface IUserAttributes {
  id: number;
  email: string;
  name: string;
  role: "customer" | "admin";
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}

export interface IUserCreationAttributes
  extends Optional<
    IUserAttributes,
    "id" | "created_at" | "updated_at" | "deleted_at"
  > {}

class User extends Model<IUserAttributes, IUserCreationAttributes> {}
