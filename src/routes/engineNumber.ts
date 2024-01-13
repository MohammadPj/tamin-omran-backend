import express, { Request, Response } from "express";
const auth = require("../middleware/authorization");
const admin = require("../middleware/admin");
import { EngineNumber, validateEngineNumber } from "../models/EngineNumber";
import {ELanguage} from "../types/common";
import {paginateResults} from "../utils/pagination";

const router = express.Router();

// ----------------------------------  Get  --------------------------------------
interface IEngineNumberParams {
  title?: string;
  page?: number;
  limit?: number;
  sort?: string;
  lang?: ELanguage
}

router.get("/", async (req: Request<any>, res) => {
  const { title, page = 1, limit = 100, sort, ...rest }: IEngineNumberParams = req.query;

  const query: any = {...rest};

  if (title) {
    query.title = new RegExp(title, "i");
  }

  const engineNumbers = await EngineNumber.find(query)
    .sort(sort) // Default to sorting by title
    .skip((page - 1) * +limit)
    .limit(+limit);

  const engineNumbersRes = await paginateResults({model: EngineNumber, limit, page, query, documents: engineNumbers})
  res.send(engineNumbersRes);
});

router.get("/:id", async (req, res) => {
  const engineNumber = await EngineNumber.findById(req.params.id);

  if (!engineNumber) return res.status(404).send("engineNumber not found");

  res.send(engineNumber);
});

// ----------------------------------  Post  ----------------------------------------
router.post(
  "/",
  [auth, admin],
  async (req: Request<any>, res: Response<any>) => {
    const { error } = validateEngineNumber(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    let engineNumber = new EngineNumber({ ...req.body });
    engineNumber = await engineNumber.save();

    res.send(engineNumber);
  }
);

// ----------------------------------  Put  -----------------------------------------
router.put("/:id", [auth, admin],async (req: Request<any>, res: Response<any>) => {
  const { error } = validateEngineNumber(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const engineNumber = await EngineNumber.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true }
  );
  // const engineNumber = await EngineNumber.findById(req.params.id)
  if (!engineNumber) return res.status(404).send("EngineNumber not found");

  const result = await engineNumber.save();
  res.send(result);
});

// ----------------------------------  Delete  -----------------------------------------
router.delete("/:id", [auth, admin], async (req: any, res: any) => {
  const engineNumber = await EngineNumber.findByIdAndRemove(req.params.id);

  if (!engineNumber) return res.status(404).send("EngineNumber not found");

  res.send(engineNumber);
});

module.exports = router;
export {};
