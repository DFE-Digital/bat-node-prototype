import { Get, JsonController, QueryParam } from "routing-controllers";
import Site from "./../entity/site";
import connection from "./../connection";

@JsonController()
export default class SitesController {
  private siteRepository: Repository<Site>;

  constructor() {
    this.siteRepository = getConnectionManager()
      .get()
      .getRepository(Site);
  }

  @Get("/sitedata")
  async showAll(): Promise<Site[]> {
    const repository = (await connection).getRepository(Site);
    return await repository.find();
  }

  @HttpPost("/sitedata")
  // save(@EntityFromBody() site: Site) {
  //   return this.siteRepository.save(site);
  // }
  @Get("/sitedata/search")
  async search(@QueryParam("q") query: string): Promise<Site[]> {
    const repository = (await connection).getRepository(Site);

    let matches = await repository
      .createQueryBuilder("site")
      .where(
        `(to_tsvector('english', site.location_name) @@ to_tsquery('english', quote_literal(:query) || ':*')) IS TRUE`
      )
      .setParameters({ query: query })
      .limit(5)
      .getMany();

    return matches;
  }
}
