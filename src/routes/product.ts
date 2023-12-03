import express, { Request, Response } from "express";
const auth = require("../middleware/authorization");
const admin = require("../middleware/admin");
const checkLang = require("../middleware/language");
import { IProduct, Product, validateProduct } from "../models/Product";
import { ELanguage } from "../types/common";

const router = express.Router();

// ----------------------------------  Get  -----------------------------------------
interface IProductParams {
  title?: string;
  page?: number;
  limit?: number;
  sort?: string;
  lang?: ELanguage;
}

router.get("/", checkLang, async (req: Request<any>, res) => {
  const { title, page = 1, limit = 100, sort }: IProductParams = req.query;

  const query: any = { ...req.query };

  if (title) {
    query.title = new RegExp(title, "i");
  }

  const products = await Product.find(query)
    .sort(sort)
    .skip((page - 1) * +limit)
    .limit(+limit)
    .populate("category")
    .populate("brand");
  res.send(products);
});

router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("category")
    .populate("brand");

  if (!product) return res.status(404).send("product not found");

  res.send(product);
});

// ----------------------------------  Post  ----------------------------------------
router.post(
  "/",
  [auth, admin],
  async (req: Request<any>, res: Response<any>) => {
    const { error } = validateProduct(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    let product = new Product({
      ...req.body,
      category: req.body.categoryId,
      brand: req.body.brandId,
    });

    product = await product.populate("category brand");

    product = await product.save();

    res.send(product);
  }
);

// ----------------------------------  Put  -----------------------------------------
router.put(
  "/:id",
  [auth, admin],
  async (req: Request<any>, res: Response<any>) => {
    const { error } = validateProduct(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, category: req.body.categoryId, brand: req.body.brandId },
      { new: true }
    ).populate("category brand");

    // const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).send("Product not found");

    const result = await product.save();
    res.send(result);
  }
);

// ----------------------------------  Delete  --------------------------------------
router.delete("/:id", [auth, admin], async (req: any, res: any) => {
  const product = await Product.findByIdAndRemove(req.params.id).populate("category brand");

  if (!product) return res.status(404).send("Product not found");

  res.send(product);
});

module.exports = router;
export {};
