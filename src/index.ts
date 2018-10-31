import { createConnection } from "typeorm";

(function() {
  const express = require("express");
  const bodyParser = require("body-parser");
  const expressLayouts = require("express-ejs-layouts");
  const logger = require("./infrastructure/logger");
  const https = require("https");
  const path = require("path");
  const config = require("./infrastructure/config");
  const helmet = require("helmet");
  const sanitization = require("login.dfe.sanitization");
  const healthCheck = require("login.dfe.healthcheck");
  const { getErrorHandler } = require("login.dfe.express-error-handling");
  const routes = require("./routes");

  createConnection().then(c => 
    // run migrations on start up; only boot up if migrations succeed!
    c.runMigrations({transaction: true})
  ).then(() => {
    const app = express();
    app.use(
      helmet({
        noCache: true,
        frameguard: {
          action: "deny"
        }
      })
    );

    if (config.hostingEnvironment.env !== "dev") {
      app.set("trust proxy", 1);
    }

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(sanitization());
    app.set("view engine", "ejs");
    app.set("views", path.resolve(__dirname, "app"));
    app.use(expressLayouts);
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
        logger.info(`Dev server listening on https://${config.hostingEnvironment.host}:${config.hostingEnvironment.port}`);
      });
    } else {
      app.listen(process.env.PORT, () => {
        logger.info(`Server listening on http://${config.hostingEnvironment.host}:${config.hostingEnvironment.port}`);
      });
    }
  });
})();
