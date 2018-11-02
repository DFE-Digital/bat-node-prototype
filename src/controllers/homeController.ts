import { Controller, Get, Render, Req, Redirect, Authorized } from "routing-controllers";
import ManageApiService from "../services/manageApiService";

@Controller()
export default class HomeController {
  @Get("/")
  @Render("index")
  @Authorized()
  async getAll(@Req() req) {
    const user = req.user;
    let providers = [];
    try {
      providers = user ? await new ManageApiService(req.user.access_token).getProviders() : null;
    } catch (err) {
      console.log("Error fetching providers:", err);
    }
    return {
      displayName: user ? `${user["given_name"]} ${user["family_name"]}` : "",
      user,
      providers
    };
  }
}
