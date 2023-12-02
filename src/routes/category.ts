import express, { Request, Response } from "express";
const auth = require("../middleware/authorization");
const admin = require("../middleware/admin");
const checkLang = require("../middleware/language");
import { Category, validateCategory } from "../models/Category";
import {ELanguage} from "../types/common";

const router = express.Router();

// ----------------------------------  Get  --------------------------------------
interface ICategoryParams {
  name?: string;
  page?: number;
  limit?: number;
  sort?: string;
  lang?: ELanguage
}

router.get("/", checkLang, async (req: Request<any>, res) => {
  const { name, page = 1, limit = 100, sort }: ICategoryParams = req.query;

  const query: any = {...req.query};

  if (name) {
    query.name = new RegExp(name, "i");
  }

  const categories = await Category.find(query)
    .sort(sort) // Default to sorting by name
    .skip((page - 1) * +limit)
    .limit(+limit);
  res.send(categories);
});

router.get("/:id", async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) return res.status(404).send("category not found");

  res.send(category);
});

// ----------------------------------  Post  ----------------------------------------
router.post(
  "/",
  [auth, admin],
  async (req: Request<any>, res: Response<any>) => {
    const { error } = validateCategory(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    let category = new Category({ ...req.body });
    category = await category.save();

    res.send(category);
  }
);

// ----------------------------------  Put  -----------------------------------------
router.put("/:id", [auth, admin],async (req: Request<any>, res: Response<any>) => {
  const { error } = validateCategory(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true }
  );
  // const category = await Category.findById(req.params.id)
  if (!category) return res.status(404).send("Category not found");

  const result = await category.save();
  res.send(result);
});

// ----------------------------------  Delete  -----------------------------------------
router.delete("/:id", [auth, admin], async (req: any, res: any) => {
  const category = await Category.findByIdAndRemove(req.params.id);

  if (!category) return res.status(404).send("Category not found");

  res.send(category);
});

module.exports = router;
export {};
