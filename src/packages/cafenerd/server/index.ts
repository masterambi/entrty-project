import "./config/environment";
import logger from "~/lib/core/helpers/logger";
import ExpressServer from "~/lib/server";
import Connection from "~/lib/server/connection";
import V1Controller from "~/packages/cafenerd/server/controllers/v1";
import models from "./database/models/mysql";

(async () => {
  try {
    const db = await Connection.mysqlConnection(models);
    if (db) {
      await db.authenticate();
      await db.sync({ force: false });
    }

    const server = new ExpressServer({
      appName: "cafenerd",
      helmetOptions: {
        crossOriginResourcePolicy: true,
      },
      controllers: [new V1Controller()],
    });

    server.run();
  } catch (err) {
    logger.error(err.message || err, "server error: ");
    process.exit(1);
  }
})();
