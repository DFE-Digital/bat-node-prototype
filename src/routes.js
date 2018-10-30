"use strict";
exports.__esModule = true;
var express_1 = require("express");
var site_1 = require("./entity/site");
var typeorm_1 = require("typeorm");
var routes = express_1.Router();
console.log("Site: " + JSON.stringify(site_1["default"]));
routes.get("/", function (req, res) {
    res.render("index");
});
routes.get("/sitedata", function (req, res) {
    typeorm_1.createConnection().then(function (connection) {
        var sites = connection.getRepository(site_1["default"]).find();
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(sites, null, 3));
    });
});
module.exports = routes;
