import {Request, Response} from "express";

export const asyncMiddleware = (
  handler: (req: Request<any>, res: Response<any>) => Promise<any>
): any => {
  return async (req: Request<any>, res: Response<any>, next: any) => {
    try {
      await handler(req, res);
    } catch (e) {
      next(e);
    }
  };
};