import ManageApiService from "../services/manageApiService";
import Site from "../entity/site";
import { validate, ValidationError } from "class-validator";
import connection from "../infrastructure/connection";
import { makeRouter, Controller } from "../infrastructure/controller";

export default makeRouter(() => new HomeController())
  .get("/", c => c.show)
  .post("/", c => c.submit);

export class HomeController extends Controller {
  async show(site: Site = new Site(), errors?: ValidationError[]) {
    const user = this.req.user;
    const providers = user ? await new ManageApiService(user.access_token).getProviders() : null;
    this.res.render("index", {
      displayName: user ? `${user["given_name"]} ${user["family_name"]}` : "",
      user,
      providers
    });
  }

  async submit(site?: Site) {
    site = site || (this.req.body as Site);
    const errors = await validate(site);
    if (errors) {
      this.show(site, errors);
    } else {
      const repository = (await connection).getRepository(Site);
      const result = await repository.save(site);
      this.res.redirect(`/success/${result.id}`);
    }
  }
}
