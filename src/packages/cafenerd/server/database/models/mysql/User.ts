import { Optional } from "sequelize";
import { Model } from "sequelize-typescript";

export interface IUserAttributes {
  id: number;
  email: string;
  name: string;
  role: "customer" | "admin";
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface IUserCreationAttributes
  extends Optional<
    IUserAttributes,
    "id" | "createdAt" | "updatedAt" | "deletedAt"
  > {}

class User extends Model<IUserAttributes, IUserCreationAttributes> {}
