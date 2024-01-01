import express, { Request, Response } from "express";
import dotenv from 'dotenv'

const auth = require("../middleware/authorization");
const admin = require("../middleware/admin");
import { File } from "../models/File";
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, "uploads/");
  },
  filename: (req: any, file: any, cb: any) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

// ----------------------------------  Get  --------------------------------------

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
  [auth, admin, upload.single("file")],
  async (req: Request<any>, res: Response<any>) => {
    // @ts-ignore
    const reqFile = req.file;

    const env = dotenv.config().parsed

    let file = new File({
      link: reqFile?.filename,
      name: reqFile?.originalname,
      type: reqFile?.mimetype,
      size: reqFile?.size,
      destination: reqFile?.destination,
    });

    file = await file.save();

    res.send({link: file.link});
  }
);

// ----------------------------------  Put  -----------------------------------------
router.put(
  "/:id",
  [auth, admin],
  async (req: Request<any>, res: Response<any>) => {
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
