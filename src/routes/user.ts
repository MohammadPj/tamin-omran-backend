import express, {Request} from "express";
import {convertQueryToRegex} from "../utils/methods";
import {paginateResults} from "../utils/pagination";
import {User} from "../models/User";
import {Product} from "../models/Product";
import {Brand} from "../models/Brand";

const auth = require("../middleware/authorization")
const admin = require("../middleware/admin")

const router = express.Router();

router.get("/",  async (req: Request<any>, res: any) => {
  const {
    page = 1,
    limit = 100,
    sort,
    ...rest
  }: any = req.query;

  const query: any = { ...rest };

  convertQueryToRegex({query, exceptions: []})

  const users = await User.find()

  const productsRes = await paginateResults({
    documents: users,
    limit,
    page,
    query,
    model: User,
  });

  res.send(productsRes);
});

router.delete("/:id", [auth, admin], async (req: any, res: any) => {

  const user = await User.findById(req.params.id);

  if (!user) return res.status(404).send("Brand not found");

  if(user.isAdmin) {
    return res.status(404).send("this user is Admin and can not delete");
  }

  user.delete()

  res.send(user);
});

module.exports = router;
export {};