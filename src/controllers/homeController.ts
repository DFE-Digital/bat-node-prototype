import { Controller, Get, Render, Req } from "routing-controllers";

@Controller()
export default class HomeController {
  @Get("/")
  @Render("index")
  getAll(@Req() req) {
    const user = req.user;
    return {
      displayName: user ? `${user["given_name"]} ${user["family_name"]}` : "",
      user
    };
  }
}
