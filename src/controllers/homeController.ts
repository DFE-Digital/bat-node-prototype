import {Controller, Get, Render, UseBefore } from "routing-controllers";

import expressLayouts = require("express-ejs-layouts");
import helmet = require("helmet");
  

@Controller()
@UseBefore(expressLayouts)
@UseBefore(helmet({noCache: true,frameguard: {action: "deny"}}))
export default class HomeController {

    @Get("/")
    @Render("index")
    getAll() {
        return;
    }
}
