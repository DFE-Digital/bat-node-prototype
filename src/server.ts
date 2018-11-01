import "reflect-metadata"; // this shim is required
import { useExpressServer } from "routing-controllers";
import connection from "./connection";
import * as webpackMiddleware from "webpack-dev-middleware";
import * as webpack from "webpack";
const appInsights = require("applicationinsights");
appInsights.setup("6564b30c-474d-41d0-ac34-cfe11c611a04");
appInsights.start();

(async () => {
  const express = require("express");
  const helmet = require("helmet");

  const bodyParser = require("body-parser");
  const nunjucks = require("nunjucks");
  const logger = require("./infrastructure/logger");
  const https = require("https");
  const path = require("path");
  const config = require("./infrastructure/config");
  const healthCheck = require("login.dfe.healthcheck");
  const { getErrorHandler } = require("login.dfe.express-error-handling");
  const webpackConfig = require("../config/webpack.config.js");

  var dbMigrationPromise = connection.then(c =>
    // Run migrations on start up; only boot up if migrations succeed!
    c.runMigrations({ transaction: true })
  );

  dbMigrationPromise.catch(err => {
    throw new Error("Could not migrate database");
  });

  dbMigrationPromise.then(() => {
    var app = express();

    const appViews = [
      path.join(__dirname, "../node_modules/govuk-frontend/"),
      path.join(__dirname, "../node_modules/govuk-frontend/components"),
      path.join(__dirname, "../src/views")
    ];

    nunjucks.configure(appViews, {
      autoescape: true,
      express: app,
      noCache: true,
      watch: true
    });

    app.use(
      bodyParser.urlencoded({
        extended: true
      })
    );

    app.set("view engine", "html");

    app.use(webpackMiddleware(webpack(webpackConfig)));

    // Middleware to serve static assets
    app.use("/public", express.static(path.join(__dirname, "/public")));
    app.use("/assets", express.static(path.join(__dirname, "node_modules", "govuk-frontend", "assets")));

    // Serve govuk-frontend in /public
    app.use("../node_modules/govuk-frontend", express.static(path.join(__dirname, "../node_modules/govuk-frontend")));

    app.use(
      helmet({
        noCache: true,
        frameguard: {
          action: "deny"
        }
      })
    );

    app.use("/healthcheck", healthCheck({ config }));

    // Error handing
    app.use(getErrorHandler({ logger }));

    useExpressServer(app, {
      controllers: [__dirname + "/controllers/*.js"]
    });

    if (config.hostingEnvironment.env === "dev") {
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
      var port = process.env.PORT || 3000;
      app.listen(port, () => {
        logger.info(`Server listening on http://${config.hostingEnvironment.host}:${port}`);
      });
    }
  });
})();
