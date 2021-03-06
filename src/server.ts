import "reflect-metadata"; // this shim is required
import "dotenv";

import connection from "./infrastructure/connection";
import express = require("express");
import helmet = require("helmet");
import bodyParser = require("body-parser");
import nunjucks = require("nunjucks");
import https = require("https");
import path = require("path");
import session = require("express-session");
import csrf = require("csurf");
import passport = require("passport");
import { getPassportStrategy } from "./infrastructure/oidc";
import unauthorisedRequestHandler from "./infrastructure/unauthorisedRequestHandler";
const RedisStore = require("connect-redis")(session);
import homeRoutes from "./routes/homeRoutes";
import siteRoutes from "./routes/sitesRoutes";
import { AuthController } from "./routes/authRoutes";
import { makeRouter } from "./infrastructure/controller";
import bakingQueue from "./infrastructure/bakingQueue";

(async () => {
  const conn = await connection;
  try {
    // Run migrations on start up; only boot up if migrations succeed!
    conn.runMigrations({ transaction: true });
  } catch (e) {
    throw new Error("Could not migrate database");
  }

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

  // Middleware to serve static assets
  app.use("/styles", express.static(path.join(__dirname, "styles")));
  app.use("/public", express.static(path.resolve(__dirname, "../node_modules/govuk-frontend")));

  app.use(
    helmet({
      noCache: true,
      frameguard: {
        action: "deny"
      }
    })
  );

  app.use(
    session(
      Object.assign(
        {
          saveUninitialized: true,
          secret: process.env.BAT_NODE_SESSION_SECRET
        },
        process.env.BAT_NODE_ENVIRONMENT === "dev"
          ? {
              resave: true
            }
          : {
              resave: false,
              store: new RedisStore({
                port: process.env.BAT_NODE_REDIS_PORT,
                host: process.env.BAT_NODE_REDIS_HOST
              })
            }
      )
    )
  );

  app.use(csrf());

  passport.use("oidc", await getPassportStrategy(console));
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
  app.use(passport.initialize());
  app.use(passport.session());

  app.use("/", homeRoutes);
  app.use("/sitedata", siteRoutes);
  app.use(
    "/auth",
    makeRouter(() => new AuthController(passport))
      .get("/login", c => c.login)
      .get("/cb", c => c.cb)
      .get("/logout", c => c.logout)
  );

  app.get("/bake-cookie", (req, res) => {
    bakingQueue.add({ foo: "bar" });
    res.redirect("/");
  });

  app.use(unauthorisedRequestHandler);

  if (process.env.BAT_NODE_ENVIRONMENT === "dev") {
    const options = {
      key: process.env.BAT_NODE_SSLKEY,
      cert: process.env.BAT_NODE_SSLCERT,
      requestCert: false,
      rejectUnauthorized: false
    };
    const server = https.createServer(options, app);
    server.listen(process.env.PORT || 44364);
  } else {
    app.set("trust proxy", 1);
    const port = process.env.PORT || 44364;
    app.listen(port);
  }
})();
