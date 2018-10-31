import { Get, JsonController, UseBefore } from "routing-controllers";
import Site from "./../entity/site";
import connection from "./../connection";

import helmet = require("helmet");

@JsonController()
@UseBefore(helmet({ noCache: true, frameguard: { action: "deny" } }))
export default class SitesController {
  @Get("/sitedata")
  showAll() {
    return connection.then(connection => {
      return connection.getRepository(Site).find();
    });
  }
}
