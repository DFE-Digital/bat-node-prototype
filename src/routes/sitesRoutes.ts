import Site from "./../entity/site";
import connection from "../infrastructure/connection";
import { makeRouter, Controller } from "../infrastructure/controller";

export default makeRouter(() => new SitesController())
  .get("/", c => c.showAll)
  .get("/search", c => c.search);

export class SitesController extends Controller {
  async showAll(): Promise<Site[]> {
    const repository = (await connection).getRepository(Site);
    return await repository.find();
  }

  async search(query?: string): Promise<Site[]> {
    query = query || this.req.query.q;
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
