import { Sequelize, type SequelizeOptions } from "sequelize-typescript";
import Redis, { type RedisOptions } from "ioredis";
import logger from "~/lib/core/helpers/logger";

class Connection {
  private sequelize: Sequelize;
  private redis: Redis;

  getRedisInstance() {
    return this.redis;
  }

  getMysqlInstance() {
    return this.sequelize;
  }

  redisConnection(db?: number): Redis {
    if (!this.redis) {
      const options: RedisOptions = {
        host: String(process.env.REDIS_HOST),
        port: Number(process.env.REDIS_PORT || "6379"),
        db,
      };

      if (
        process.env.NODE_ENV !== "development" &&
        process.env.REDIS_PASSWORD
      ) {
        options.password = process.env.REDIS_PASSWORD;
        options.tls = { rejectUnauthorized: true };
      }

      this.redis = new Redis(options);

      return this.redis;
    }
    return this.redis;
  }

  async mysqlConnection(
    models: SequelizeOptions["models"]
  ): Promise<Sequelize | null> {
    try {
      if (!this.sequelize) {
        this.sequelize = new Sequelize({
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
        return this.sequelize;
      }

      return this.sequelize;
    } catch (err) {
      logger.error(err, "MySql Connection Error: ");
      return null;
    }
  }
}

export default new Connection();
