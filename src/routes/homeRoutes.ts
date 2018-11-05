import Site from "../entity/site";
import { validate, ValidationError } from "class-validator";
import connection from "../infrastructure/connection";
import { makeRouter, Controller } from "../infrastructure/controller";
import { plainToClass } from "class-transformer";

export default makeRouter(() => new HomeController())
  .get("/", c => c.show)
  .post("/", c => c.submit)
  .get("/success/:id", c => c.success);

export class HomeController extends Controller {
  async show(site: Site = new Site(), errors?: ValidationError[]) {
    site = site || new Site();
    const user = this.req.user;
    const csrf = this.req.csrfToken();

    const providers = [];
    //user ? await new ManageApiService(user.access_token).getProviders() : null;
    this.res.render("index", {
      displayName: user ? `${user["given_name"]} ${user["family_name"]}` : "",
      user,
      providers,
      csrf,
      site
    });
  }

  async submit(site?: Site) {
    site = site || (this.req.body as Site);
    const errors = await validate(plainToClass(Site, site));
    if (errors && errors.length) {
      this.show(site, errors);
    } else {
      const repository = (await connection).getRepository(Site);
      const result = await repository.save(site);
      this.res.redirect(`/success/${result.id}`);
    }
  }

  async success() {
    const repository = (await connection).getRepository(Site);
    const site = await repository.findOne(this.req.params.id);
    this.res.render("siteSuccess", site);
  }
}
