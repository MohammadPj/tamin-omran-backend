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

const multer  = require('multer')

const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, 'uploads/');
  },
  filename: (req: any, file: any, cb: any) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage })

const router = express.Router();

// ----------------------------------  Get  --------------------------------------
interface IBrochureParams {
  title?: string;
  page?: number;
  limit?: number;
  sort?: string;
  lang?: ELanguage;
}

router.get("/", checkLang, async (req: Request<any>, res) => {
  const { title, page = 1, limit = 100, sort, ...rest }: IBrochureParams = req.query;

  const query: any = { ...rest };

  if (title) {
    query.title = new RegExp(title, "i");
  }

  const brochures = await Brochure.find(query)
    .sort(sort)
    .skip((page - 1) * +limit)
    .limit(+limit)
    .populate("brochureType");

  res.send(brochures);
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

router.post("/", upload.single("file"), (req, res, next) => {

  console.log('body', req.body)
  // @ts-ignore
  console.log('file', req.file)

  res.send("success")
})

// router.post(
//   "/",
//   [auth, admin],
//   async (req: Request<any>, res: Response<any>) => {
//     const { error } = validateBrochure(req.body);
//
//     if (error) return res.status(400).send(error.details[0].message);
//
//     let brochure = new Brochure({ ...req.body, brochureType: req.body.brochureTypeId });
//     brochure = await brochure.save();
//
//     res.send(brochure);
//   }
// );

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

// ----------------------------------  Delete  -----------------------------------------
router.delete("/:id", [auth, admin], async (req: any, res: any) => {
  const brochure = await Brochure.findByIdAndRemove(req.params.id);

  if (!brochure) return res.status(404).send("Brochure not found");

  res.send(brochure);
});

module.exports = router;
export {};
