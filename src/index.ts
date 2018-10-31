import "reflect-metadata"; // this shim is required
import { createExpressServer } from "routing-controllers";
import connection from "./connection";

(async () => {
  const bodyParser = require("body-parser");
  const logger = require("./infrastructure/logger");
  const https = require("https");
  const path = require("path");
  const config = require("./infrastructure/config");
  const healthCheck = require("login.dfe.healthcheck");
  const { getErrorHandler } = require("login.dfe.express-error-handling");
  
  var dbMigrationPromise = connection.then(c => 
    // Run migrations on start up; only boot up if migrations succeed!
    c.runMigrations({ transaction: true })
  );

  dbMigrationPromise.catch(err => {
    throw new Error("Could not migrate database");
  });

  dbMigrationPromise.then(() => {
    const app = createExpressServer({
      controllers: [__dirname + "/controllers/*.js"]
    });

    app.use(bodyParser.urlencoded({ extended: true }));
    app.set("view engine", "ejs");
    app.set("views", path.resolve(__dirname, "app"));
    app.set("layout", "layouts/layout");

    app.use(
      "/healthcheck",
      healthCheck({
        config
      })
    );

    // Error handing
    app.use(
      getErrorHandler({
        logger
      })
    );

    if (config.hostingEnvironment.env === "dev") {
      app.proxy = true;

      const options = {
        key: config.hostingEnvironment.sslKey,
        cert: config.hostingEnvironment.sslCert,
        requestCert: false,
        rejectUnauthorized: false
      };
      const server = https.createServer(options, app);

      server.listen(config.hostingEnvironment.port, () => {
        logger.info(
          `Dev server listening on https://${config.hostingEnvironment.host}:${config.hostingEnvironment.port}`
        );
      });
    } else {
      app.set("trust proxy", 1);
      app.listen(process.env.PORT, () => {
        logger.info(`Server listening on http://${config.hostingEnvironment.host}:${config.hostingEnvironment.port}`);
      });
    }
  });
})();
