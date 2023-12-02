import {Request, Response} from "express";

 const checkLang = (req: Request<any>, res: Response<any>, next: any) => {
  if(!req.query.lang) return res.status(400).send('lang is not defined')
  next()
};

module.exports = checkLang;
