import { Controller, Get, Render } from "routing-controllers";

@Controller()
export default class HomeController {
  @Get("/")
  @Render("index")
  getAll() {
    return;
  }
}
