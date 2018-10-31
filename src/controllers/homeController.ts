import {Controller, Get, Render, UseBefore } from "routing-controllers";
import expressLayouts = require("express-ejs-layouts");
  

@Controller()
@UseBefore(expressLayouts)
export default class HomeController {

    @Get("/")
    @Render("index")
    getAll() {
        return;
    }
}
