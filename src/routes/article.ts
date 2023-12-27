import express, { Request, Response } from "express";
const auth = require("../middleware/authorization");
const admin = require("../middleware/admin");
const checkLang = require("../middleware/language");
import { Article, validateArticle } from "../models/Article";
import { ELanguage } from "../types/common";
import dotenv from "dotenv";
import { Brochure } from "../models/Brochure";
import { paginateResults } from "../utils/pagination";

const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);

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
const env = dotenv.config().parsed;

// ----------------------------------  Get  --------------------------------------
interface IArticleParams {
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
  }: IArticleParams = req.query;

  const query: any = { ...rest };

  if (title) {
    query.title = new RegExp(title, "i");
  }

  const articles = await Article.find(query)
    .sort(sort) // Default to sorting by title
    .skip((page - 1) * +limit)
    .limit(+limit);

  const articlesRes = await paginateResults({
    model: Article,
    limit,
    page,
    query,
    documents: articles,
  });

  res.send(articlesRes);
});

router.get("/:id", async (req, res) => {
  const article = await Article.findById(req.params.id);

  if (!article) return res.status(404).send("article not found");

  res.send(article);
});

// ----------------------------------  Post  ----------------------------------------
router.post(
  "/",
  [auth, admin],
  async (req: Request<any>, res: Response<any>) => {
    const { error } = validateArticle(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    let article = new Article({
      ...req.body,
    });
    article = await article.save();

    res.send(article);
  }
);

// ----------------------------------  Put  -----------------------------------------
router.put(
  "/:id",
  [auth, admin],
  async (req: Request<any>, res: Response<any>) => {
    const { error } = validateArticle(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const article = await Article.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
      },
      { new: true }
    );
    // const article = await Article.findById(req.params.id)
    if (!article) return res.status(404).send("Article not found");

    const result = await article.save();
    res.send(result);
  }
);

// ----------------------------------  Patch  -----------------------------------------------
router.patch(
  "/:id/image",
  [auth, admin, upload.single("image")],
  async (req: Request<any>, res: Response<any>) => {
    // @ts-ignore
    const image = req.file;

    const article = await Article.findById(req.params.id);

    if (!article) return res.status(404).send("Article not found");

    let articleImage = article.image;
    article.image = image?.filename ? env?.BASE_URL + image?.filename : null;

    const result = await article.save();

    if (articleImage) {
      articleImage = articleImage?.replace(env?.BASE_URL!, "");
      try {
        await unlinkAsync(`./uploads/${articleImage}`);
      } catch (e) {
        console.log("can not delete image, article =>", article);
      }
    }

    res.send(result);
  }
);

// ----------------------------------  Delete  -----------------------------------------
router.delete("/:id", [auth, admin], async (req: any, res: any) => {
  const article = await Article.findByIdAndRemove(req.params.id);

  if (!article) return res.status(404).send("Article not found");

  const articleImage = article?.image?.replace(env?.BASE_URL!, "");

  if (articleImage) {
    try {
      await unlinkAsync(`./uploads/${articleImage}`);
    } catch (e) {
      console.log("can not edit file, article =>", article);
    }
  }

  res.send(article);
});

module.exports = router;
export {};
