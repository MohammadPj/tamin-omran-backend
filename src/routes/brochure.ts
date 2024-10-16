import express, { Request, Response } from "express";
const auth = require("../middleware/authorization");
const admin = require("../middleware/admin");
const checkLang = require("../middleware/language");
import {
  Brochure,
  validateBrochure,
  validateEditeBrochure,
} from "../models/Brochure";
import { ELanguage } from "../types/common";
import { upload } from "../utils/multer";
import dotenv from "dotenv";
import { paginateResults } from "../utils/pagination";
import { Brand } from "../models/Brand";

const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
const router = express.Router();
const env = dotenv.config().parsed;

// ----------------------------------  Get  --------------------------------------
interface IBrochureParams {
  title?: string;
  page?: number;
  limit?: number;
  sort?: string;
  lang?: ELanguage;
}

router.get("/", checkLang, async (req: Request<any>, res) => {
  const {
    title,
    page = 1,
    limit = 100,
    sort,
    ...rest
  }: IBrochureParams = req.query;

  const query: any = { ...rest };

  if (title) {
    query.title = new RegExp(title, "i");
  }

  const brochures = await Brochure.find(query)
    .sort(sort)
    .skip((page - 1) * +limit)
    .limit(+limit)
    .populate("brochureType");

  const brochuresRes = await paginateResults({
    documents: brochures,
    limit,
    page,
    query,
    model: Brochure,
  });

  res.send(brochuresRes);
});

router.get("/:id", async (req, res) => {
  const brochure = await Brochure.findById(req.params.id).populate(
    "brochureType",
    "title"
  );

  if (!brochure) return res.status(404).send("brochure not found");

  res.send(brochure);
});

// ----------------------------------  Post  ----------------------------------------

router.post(
  "/",
  [auth, admin],
  async (req: Request<any>, res: Response<any>) => {
    const { error } = validateBrochure(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    let brochure = new Brochure({
      ...req.body,
      brochureType: req.body.brochureTypeId,
    });

    brochure = await brochure.save();

    res.send(brochure);
  }
);

// ----------------------------------  Put  -----------------------------------------------
router.put(
  "/:id",
  [auth, admin],
  async (req: Request<any>, res: Response<any>) => {
    const { error } = validateEditeBrochure(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const brochure = await Brochure.findByIdAndUpdate(
      req.params.id,
      { ...req.body, brochureType: req.body.brochureTypeId },
      { new: true }
    );

    if (!brochure) return res.status(404).send("Brochure not found");

    const result = await brochure.save();
    res.send(result);
  }
);

// ----------------------------------  Patch  -----------------------------------------------
router.patch(
  "/:id/file",
  [auth, admin, upload.single("file")],
  async (req: Request<any>, res: Response<any>) => {
    // @ts-ignore
    const file = req.file;

    const brochure = await Brochure.findById(req.params.id);

    if (!brochure) return res.status(404).send("Brochure not found");

    let brochureFile = brochure.file;
    brochure.file = file?.filename ? env?.BASE_URL + file?.filename : null;

    const result = await brochure.save();

    if (brochureFile) {
      brochureFile = brochureFile?.replace(env?.BASE_URL!, "");
      try {
        await unlinkAsync(`./uploads/${brochureFile}`);
      } catch (e) {
        console.log("can not edit file, brochure =>", brochure);
      }
    }

    res.send(result);
  }
);

// ----------------------------------  Delete  -----------------------------------------
router.delete("/:id", [auth, admin], async (req: any, res: any) => {
  const brochure = await Brochure.findByIdAndRemove(req.params.id);

  if (!brochure) return res.status(404).send("Brochure not found");

  const brochureFile = brochure?.file?.replace(env?.BASE_URL!, "");

  if (brochureFile) {
    try {
      await unlinkAsync(`./uploads/${brochureFile}`);
    } catch (e) {
      console.log("can not edit file, brochure =>", brochure);
    }
  }

  res.send(brochure);
});

module.exports = router;
export {};
