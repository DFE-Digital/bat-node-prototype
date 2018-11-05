import { makeRouter, Controller } from "../infrastructure/controller";
import pp = require("passport");

// export default makeRouter(() => new AuthController(passport))
//   .get("/login", c => c.login)
//   .get("/cb", c => c.cb)
//   .get("/logout", c => c.logout);

export class AuthController extends Controller {
  private passport: pp.PassportStatic;
  constructor(passport: pp.PassportStatic) {
    super();
    this.passport = passport;
  }

  async login() {
    await this.passport.authenticate("oidc")(this.req, this.res, this.next);
  }

  async cb() {
    console.log("before cb");
    await this.passport.authenticate("oidc", { successRedirect: "/", failureRedirect: "/auth/login" })(
      this.req,
      this.res,
      this.next
    );
    console.log("after cb");
  }

  async logout() {
    this.req.logout();
    this.req.session.destroy(() => {
      this.res.redirect("/");
    });
  }
}
