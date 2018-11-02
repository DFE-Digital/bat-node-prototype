import { makeRouter, Controller } from "../infrastructure/controller";
import passport = require("passport");

export default makeRouter(() => new AuthController(passport))
  .get("/login", c => c.login)
  .get("/cb", c => c.login)
  .get("/logout", c => c.logout);

export class AuthController extends Controller {
  private passport: passport.PassportStatic;
  constructor(passport: passport.PassportStatic) {
    super();
    this.passport = passport;
  }
  async login() {
    await this.passport.authenticate("oidc", { successRedirect: "/", failureRedirect: "/auth/login" });
  }

  async logout() {
    this.req.logout();
    this.req.session.destroy(() => {
      this.res.redirect("/");
    });
  }
}
