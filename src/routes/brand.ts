import express, { Request, Response } from "express";
const auth = require("../middleware/authorization");
const admin = require("../middleware/admin");
const checkLang = require("../middleware/language");
import { Brand, validateBrand } from "../models/Brand";
import {ELanguage} from "../types/common";
import {Brochure} from "../models/Brochure";
import {Product} from "../models/Product";

const router = express.Router();

// ----------------------------------  Get  --------------------------------------
interface IBrandParams {
  title?: string;
  page?: number;
  limit?: number;
  sort?: string;
  lang?: ELanguage
}

router.get("/", checkLang,async (req: Request<any>, res) => {
  const { title, page = 1, limit = 100, sort, lang }: IBrandParams = req.query;

  const query: any = {...req.query};

  if (title) {
    query.title = new RegExp(title, "i");
  }

  const brands = await Brand.find(query)
    .sort(sort) // Default to sorting by title
    .skip((page - 1) * +limit)
    .limit(+limit);
  res.send(brands);
});

router.get("/:id", async (req, res) => {
  const brand = await Brand.findById(req.params.id);

  if (!brand) return res.status(404).send("brand not found");

  res.send(brand);
});

// ----------------------------------  Post  ----------------------------------------
router.post(
  "/",
  [auth, admin],
  async (req: Request<any>, res: Response<any>) => {
    const { error } = validateBrand(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    let brand = new Brand({ ...req.body });
    brand = await brand.save();

    res.send(brand);
  }
);

// ----------------------------------  Put  -----------------------------------------
router.put("/:id", [auth, admin],async (req: Request<any>, res: Response<any>) => {
  const { error } = validateBrand(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const brand = await Brand.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true }
  );
  // const brand = await Brand.findById(req.params.id)
  if (!brand) return res.status(404).send("Brand not found");

  const result = await brand.save();
  res.send(result);
});

// ----------------------------------  Delete  -----------------------------------------
router.delete("/:id", [auth, admin], async (req: any, res: any) => {

  const product = await Product.findOne({brand: req.params.id})

  if (product) return res.status(500).send("از این برند استفاده شده است");

  const brand = await Brand.findByIdAndRemove(req.params.id);

  if (!brand) return res.status(404).send("Brand not found");

  res.send(brand);
});

module.exports = router;
export {};
