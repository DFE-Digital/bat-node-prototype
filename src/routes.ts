import { Router } from "express";
import Site from "./entity/site";
import { createConnection } from "typeorm";

const routes = Router();
console.log("Site: " + JSON.stringify(Site));


routes.get("/", (req, res) => {
  res.render("index");
});

routes.get("/sitedata", (req,res) => {
  createConnection().then(connection => {
    var sites = connection.getRepository(Site).find();
    
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(sites, null, 3));
  })
});

export default routes;
