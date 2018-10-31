
import { Get, Res, JsonController} from "routing-controllers";
import { createConnection } from "typeorm";
import Site from "./../entity/site";
import connection from "./../connection"

@JsonController()
export default class SitesController {
    @Get("/sitedata")
    showAll() {
        return connection.then(connection => {
            return connection.getRepository(Site).find();
        });
    }
}