import express, { Request, Response } from "express";
const auth = require("../middleware/authorization");
const admin = require("../middleware/admin");
const checkLang = require("../middleware/language");
import { BrochureType, validateBrochureType } from "../models/BrochureType";
import {ELanguage} from "../types/common";
import {Brochure} from "../models/Brochure";

const router = express.Router();

// ----------------------------------  Get  --------------------------------------
interface IBrochureTypeParams {
  title?: string;
  page?: number;
  limit?: number;
  sort?: string;
  lang?: ELanguage
}

router.get("/", checkLang, async (req: Request<any>, res) => {
  const { title, page = 1, limit = 100, sort }: IBrochureTypeParams = req.query;

  const query: any = {...req.query};

  if (title) {
    query.title = new RegExp(title, "i");
  }

  const brochureTypes = await BrochureType.find(query)
    .sort(sort) // Default to sorting by title
    .skip((page - 1) * +limit)
    .limit(+limit);
  res.send(brochureTypes);
});

router.get("/:id", async (req, res) => {
  const brochureTyp = await BrochureType.findById(req.params.id);

  if (!brochureTyp) return res.status(404).send("brochureTyp not found");

  res.send(brochureTyp);
});

// ----------------------------------  Post  ----------------------------------------
router.post(
  "/",
  [auth, admin],
  async (req: Request<any>, res: Response<any>) => {
    const { error } = validateBrochureType(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    let brochureTyp = new BrochureType({ ...req.body });
    brochureTyp = await brochureTyp.save();

    res.send(brochureTyp);
  }
);

// ----------------------------------  Put  -----------------------------------------
router.put("/:id", [auth, admin],async (req: Request<any>, res: Response<any>) => {
  const { error } = validateBrochureType(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const brochureTyp = await BrochureType.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true }
  );

  if (!brochureTyp) return res.status(404).send("BrochureType not found");

  const result = await brochureTyp.save();
  res.send(result);
});

// ----------------------------------  Delete  -----------------------------------------
router.delete("/:id", [auth, admin], async (req: any, res: any) => {
  const brochures = await Brochure.find({})
  const brochureTyp = await BrochureType.findByIdAndRemove(req.params.id);

  if (!brochureTyp) return res.status(404).send("BrochureType not found");

  res.send(brochureTyp);
});

module.exports = router;
export {};
