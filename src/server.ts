import "reflect-metadata"; // this shim is required
import "dotenv";

import { useExpressServer } from "routing-controllers";
import connection from "./connection";
import express = require("express");
import helmet = require("helmet");
import bodyParser = require("body-parser");
import nunjucks = require("nunjucks");
import https = require("https");
import path = require("path");

(async () => {
  const appInsights = require("applicationinsights");
  appInsights.setup("6564b30c-474d-41d0-ac34-cfe11c611a04");
  appInsights.start();

  const conn = await connection;
  try {
    // Run migrations on start up; only boot up if migrations succeed!
    conn.runMigrations({ transaction: true });
  } catch (e) {
    throw new Error("Could not migrate database");
  }

  var app = express();
  const appViews = path.join(__dirname, "../src/views");

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

  app.use(
    helmet({
      noCache: true,
      frameguard: {
        action: "deny"
      }
    })
  );

  useExpressServer(app, {
    controllers: [__dirname + "/controllers/*.js"]
  });

  if (process.env.BAT_NODE_ENVIRONMENT === "dev") {
    const options = {
      key: process.env.BAT_NODE_SSLKEY,
      cert: process.env.BAT_NODE_SSLCERT,
      requestCert: false,
      rejectUnauthorized: false
    };
    const server = https.createServer(options, app);
    server.listen(process.env.BAT_NODE_PORT);
  } else {
    app.set("trust proxy", 1);
    var port = process.env.PORT || 3000;
    app.listen(port);
  }
})();
