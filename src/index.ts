import { createConnection } from "typeorm";

(async () => {
  const express = require("express");
  const bodyParser = require("body-parser");
  const nunjucks = require("nunjucks");
  const logger = require("./infrastructure/logger");
  const https = require("https");
  const path = require("path");
  const config = require("./infrastructure/config");
  const helmet = require("helmet");
  const sanitization = require("login.dfe.sanitization");
  const healthCheck = require("login.dfe.healthcheck");
  const { getErrorHandler } = require("login.dfe.express-error-handling");
  const routes = require("./routes");

  try {
    const dbConnection = await createConnection();
    // Run migrations on start up; only boot up if migrations succeed!
    dbConnection.runMigrations({ transaction: true });
  } catch (err) {
    throw new Error(`Could not boot application, failed to connect to database, error: ${err}`);
  }

  const app = express();
  app.use(
    helmet({
      noCache: true,
      frameguard: {
        action: "deny"
      }
    })
  );

  const appViews = path.join(__dirname, "views");

  nunjucks.configure(appViews, {
    autoescape: true,
    express: app,
    noCache: true,
    watch: true
  });

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(sanitization());
  app.set("view engine", "html");

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

  app.use("/", routes);

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
})();
