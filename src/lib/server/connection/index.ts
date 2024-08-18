import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import logger from "~/lib/core/helpers/logger";

class Connection {
  private static sequelize: Sequelize;

  static getMysqlInstance() {
    return Connection.sequelize;
  }

  static async mysqlConnection(
    models: SequelizeOptions["models"]
  ): Promise<Sequelize | null> {
    console.log({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
    });
    try {
      if (!Connection.sequelize) {
        Connection.sequelize = new Sequelize({
          dialect: "mysql",
          models,
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT) || 3306,
          database: process.env.DB_NAME,
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          pool: {
            min: 1,
            max: process.env.NODE_ENV === "development" ? 2 : 8,
            acquire: 60000,
            idle: 15000,
          },
          logging: (sql) => {
            if (process.env.NODE_ENV === "development") {
              logger.info(sql, "sql ===> ");
              return true;
            }
            return false;
          },
        });

        logger.info("TOKOKOPI ======> Mysql connected: ");
        return Connection.sequelize;
      }

      return Connection.sequelize;
    } catch (err) {
      logger.error(err, "MySql Connection Error: ");
      return null;
    }
  }
}

export default Connection;
