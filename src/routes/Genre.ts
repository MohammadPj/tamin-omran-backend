import express from "express";
const auth = require("../middleware/authorization");
const admin = require("../middleware/admin");
import { Genre, validateGenre } from "../models/Genre";

const router = express.Router();

// ----------------------------------  Get  --------------------------------------
router.get("/", async (req, res) => {
  throw new Error('Could not get genre')
  const genres = await Genre.find({});
  res.send(genres);
});

router.get("/:id", async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre) return res.status(404).send("genre not found");

  res.send(genre);
});

// ----------------------------------  Post  --------------------------------------
router.post("/", [auth, admin], async (req: any, res: any) => {
  const { value, error } = validateGenre(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();

  res.send(genre);
});

// ----------------------------------  Put  -----------------------------------------
router.put("/:id", async (req: any, res: any) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  // const genre = await Genre.findById(req.params.id)
  if (!genre) return res.status(404).send("Genre not found");

  const result = await genre.save();
  res.send(result);
});

// ----------------------------------  Delete  -----------------------------------------
router.delete("/:id", async (req: any, res: any) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre) return res.status(404).send("Genre not found");

  res.send(genre);
});

module.exports = router;
export {};
