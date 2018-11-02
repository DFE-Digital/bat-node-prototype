import express = require("express");
import { NextFunction } from "express-serve-static-core";

export abstract class Controller {
  protected req: express.Request;
  protected res: express.Response;
  protected next: express.NextFunction;

  public setContext(req: express.Request, res: express.Response, next: NextFunction) {
    this.req = req;
    this.res = res;
    this.next = next;
  }
}

export interface Router<T extends Controller> extends express.RequestHandler {
  get(path: string, action: (controller: T) => () => void): Router<T>;
  post(path: string, action: (controller: T) => () => void): Router<T>;
}

export function makeRouter<T extends Controller>(makeController: () => T): Router<T> {
  const expressRouter: any = express.Router();

  const innerGet = expressRouter.get;
  const innerPost = expressRouter.post;

  expressRouter.get = function(path: string, action: (controller: T) => () => void) {
    innerGet.bind(expressRouter)(path, (req, res, next) => {
      const c = makeController();
      c.setContext(req, res, next);
      return action(c).bind(c)();
    });
    return this;
  };

  expressRouter.post = function(path: string, action: (controller: T) => () => void) {
    innerPost.bind(expressRouter)(path, (req, res, next) => {
      const c = makeController();
      c.setContext(req, res, next);
      return action(c).bind(c)();
    });
    return this;
  };

  return expressRouter;
}
