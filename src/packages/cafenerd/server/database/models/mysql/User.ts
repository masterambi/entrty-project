import * as bcrypt from "bcrypt";
import type { Optional } from "sequelize";
import {
  AllowNull,
  AutoIncrement,
  BeforeSave,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";

export interface IUserAttributes {
  id: number;
  email: string;
  password: string;
  name: string;
  role: "customer" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserCreationAttributes
  extends Optional<IUserAttributes, "id" | "createdAt" | "updatedAt" | "role"> {}

@Table({
  tableName: "users",
  modelName: "user",
  freezeTableName: true,
  underscored: true,
  timestamps: true,
  createdAt: true,
  updatedAt: true,
})
class User extends Model<IUserAttributes, IUserCreationAttributes> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER.UNSIGNED)
  declare id: number;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  declare email: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare password: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare name: string;

  @AllowNull(false)
  @Default("customer")
  @Column(DataType.ENUM("customer", "admin"))
  declare role: "customer" | "admin";

  @BeforeSave
  static async hashPassword(instance: User) {
    if (instance.changed("password") && instance.password) {
      const salt = await bcrypt.genSalt(10);
      instance.password = await bcrypt.hash(instance.password, salt);
    }
  }

  toJSON() {
    const { password, ...attributes } = this.get();
    return attributes;
  }
}

export default User;
