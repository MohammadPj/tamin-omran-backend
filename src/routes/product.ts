import express, { Request, Response } from "express";
const auth = require("../middleware/authorization");
const admin = require("../middleware/admin");
const checkLang = require("../middleware/language");
import { IProduct, Product, validateProduct } from "../models/Product";
import { ELanguage } from "../types/common";
import { upload } from "../utils/multer";
import dotenv from "dotenv";
import { paginateResults } from "../utils/pagination";
import { convertQueryToRegex } from "../utils/methods";
import qs from "qs";
import { EngineNumber } from "../models/EngineNumber";
import mongoose from "mongoose";

const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
const router = express.Router();
const env = dotenv.config().parsed;

// ----------------------------------  Get  -----------------------------------------
interface IProductParams {
  title?: string;
  page?: number;
  limit?: number;
  sort?: string;
  lang?: ELanguage;
}

router.get("/", async (req: Request<any>, res) => {
  const { page = 1, limit = 100, sort, ...rest }: IProductParams = req.query;

  const query: any = qs.parse(rest);

  convertQueryToRegex({
    query,
    exceptions: ["brand", "category", "isAvailable"],
  });

  const products = await Product.find(query)
    .sort(sort)
    .skip((page - 1) * +limit)
    .limit(+limit)
    .populate("category")
    .populate("engineNumber")
    .populate("brand");

  const productsRes = await paginateResults({
    documents: products,
    limit,
    page,
    query,
    model: Product,
  });

  res.send(productsRes);
});

router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("category")
    .populate("engineNumber")
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

    const productBody: IProduct = {
      category: req?.body?.categoryId,
      brand: req.body.brandId,
      ...req.body,
    };

    const engineNumber = req.body?.engineNumber;
    if (mongoose.Types.ObjectId.isValid(engineNumber)) {
      const engine = await EngineNumber?.findById(engineNumber);
      if(engine) productBody.engineNumber = engine._id
    } else {
      const engine = await new EngineNumber({title: engineNumber})
      await engine.save()
      productBody.engineNumber = engine._id
    }

    let product = new Product(productBody);

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

    const prvsProduct = await Product.findById(req.params.id).populate("engineNumber")
    const prvsEngineNumber = prvsProduct?.engineNumber?._id?.toString()
    const newEngineNumber = req.body?.engineNumber

    console.log('prvsProduct', prvsEngineNumber)
    console.log('newEngineNumber', newEngineNumber)
    console.log('cond', newEngineNumber === prvsEngineNumber)

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        category: req?.body?.categoryId,
        brand: req.body.brandId,
      },
      { new: true }
    ).populate("brand");

    // --------------------- Removing Engine number
    const engineUsedInProductCount = await Product.find({engineNumber: product?.engineNumber}).count()
    if(engineUsedInProductCount < 1) {
      const engine = await EngineNumber.findByIdAndRemove(req?.body?.engineNumber)
    }

    // const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).send("Product not found");

    const result = await product.save();
    res.send(result);
  }
);

// ----------------------------------  Patch  -----------------------------------------------
router.patch(
  "/:id/image",
  [auth, admin, upload.array("images")],
  async (req: Request<any>, res: Response<any>) => {
    // @ts-ignore
    const files = req?.files;

    const image = files?.[0]?.filename
      ? env?.BASE_URL + files?.[0]?.filename
      : null;

    const images =
      files?.length > 1
        ? files
            .slice(1)
            ?.map((i: any) =>
              i?.filename ? env?.BASE_URL + i?.filename : null
            )
        : [];

    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).send("Product not found");

    let productImage = product.image;
    let productImages = product.images;

    product.image = image;
    product.images = images;

    const result = await product.save();

    if (productImage) {
      productImage = productImage?.replace(env?.BASE_URL!, "");
      try {
        await unlinkAsync(`./uploads/${productImage}`);
      } catch (e) {
        console.log("can not edit file, product =>", product);
      }
    }

    if (productImages) {
      productImages = productImages.map((i) => i?.replace(env?.BASE_URL!, ""));

      for (let i = 0; i < productImages.length; i++) {
        try {
          await unlinkAsync(`./uploads/${productImages[i]}`);
        } catch (e) {
          // console.log("can not edit file, product =>", product);
        }
      }
    }

    res.send(result);
  }
);

// ----------------------------------  Delete  --------------------------------------
router.delete("/:id", [auth, admin], async (req: any, res: any) => {
  // const product = await Product.findById(req.params.id)
  const product = await Product.findByIdAndRemove(req.params.id).populate(
    "category brand"
  );

  if (!product) return res.status(404).send("Product not found");

  // --------------------- Removing Engine number
  const engineUsedInProductCount = await Product.find({engineNumber: product.engineNumber}).count()
  if(engineUsedInProductCount < 1) {
    const engine = await EngineNumber.findByIdAndRemove(product.engineNumber)
  }

  // // --------------------- Removing images
  let productImages = product.images;
  let productImage = product.image;

  if (productImage) {
    productImage = productImage?.replace(env?.BASE_URL!, "");
    try {
      await unlinkAsync(`./uploads/${productImage}`);
    } catch (e) {
      console.log("can not edit file, product =>", product);
    }
  }

  if (productImages) {
    productImages = productImages.map((i) => i?.replace(env?.BASE_URL!, ""));

    for (let i = 0; i < productImages.length; i++) {
      try {
        await unlinkAsync(`./uploads/${productImages[i]}`);
      } catch (e) {
        console.log("can not edit file, product =>", product);
      }
    }
  }

  res.send(product);
});

module.exports = router;
export {};
