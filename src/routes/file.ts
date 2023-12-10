import express, { Request, Response } from "express";

const auth = require("../middleware/authorization");
const admin = require("../middleware/admin");
import { File, validateFile } from "../models/File";
import { Product } from "../models/Product";

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
interface IFileParams {

}

router.get("/", async (req: Request<any>, res) => {
  const files = await File.find();

  res.send(files);
});

router.get("/:id", async (req, res) => {
  const file = await File.findById(req.params.id);

  if (!file) return res.status(404).send("file not found");

  res.send(file);
});

// ----------------------------------  Post  ----------------------------------------
router.post(
  "/",
  [auth, admin, upload.single('file')],
  async (req: Request<any>, res: Response<any>) => {
    // const { error } = validateFile(req.body);
    //
    // if (error) return res.status(400).send(error.details[0].message);

    let file = new File({ ...req.body });
    file = await file.save();

    res.send(file);
  }
);

// ----------------------------------  Put  -----------------------------------------
router.put(
  "/:id",
  [auth, admin],
  async (req: Request<any>, res: Response<any>) => {
    const { error } = validateFile(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const file = await File.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    // const file = await File.findById(req.params.id)
    if (!file) return res.status(404).send("File not found");

    const result = await file.save();
    res.send(result);
  }
);

// ----------------------------------  Delete  -----------------------------------------
router.delete("/:id", [auth, admin], async (req: any, res: any) => {
  const file = await File.findByIdAndRemove(req.params.id);

  if (!file) return res.status(404).send("File not found");

  res.send(file);
});

module.exports = router;
export {};
