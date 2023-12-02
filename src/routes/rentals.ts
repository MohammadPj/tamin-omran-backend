import { Movie, validateMovie } from "../models/Movie";
import { Rental, validateRental } from "../models/Rentals";
import { Customers } from "../models/Customers";
const Fawn = require("fawn");
const mongoose = require("mongoose");
const express = require("express");
const Joi = require("joi");

const router = express.Router();

Fawn.init("mongodb://127.0.0.1:27017/rental-project");
// ----------------------------------  Get  --------------------------------------
router.get("/", async (req: any, res: any) => {
  try {
    const rentals = await Rental.find().sort("-dateOut");

    res.send(rentals);
  } catch (e) {
    console.log("Error", e);
  }
});

router.get("/:id", async (req: any, res: any) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental) return res.status(404).send("Movie not found");

  res.send(rental);
});

// ----------------------------------  Post  --------------------------------------
router.post("/", async (req: any, res: any) => {
  const { error } = validateRental(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const customer = await Customers.findById(req.body.customerId);
    if (!customer) return res.status(400).send("invalid customer");
    const movie: any = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send("invalid movie");

    if (movie.numberInStock === 0)
      return res.status(400).send("movie not in stock");

    let rental = new Rental({ ...req.body, movie, customer });

    // rent a movie and decrease numberInStock should run or fail together
    // for that we should use transaction but mongo have two-phase commit instead
    // we use Fawn library for simulating transaction in here , use 2 phase inside
    // rental = await rental.save();
    // movie.numberInStock--;
    // await movie.save();

    const task = Fawn.Task();
    try {
      //
      console.log('before')
      task
        .save("rentals", rental) // save rental directly to rentals collection in mongo
        .update( // decrease numberInStock movie
          "movies",
          { _id: movie._id },
          {
            $inc: { numberInStock: -1 },
          }
        )
        .run(); // run actions together

      console.log('after')
      res.send(rental);
    } catch (e) {
      res.status(500).send("somthing faild");
    }
  } catch (e: any) {
    res.status(400).send(e.message)
    console.log("e", e.message);
  }
});

// ----------------------------------  Put  -----------------------------------------
router.put("/:id", async (req: any, res: any) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const rental = await Rental.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true }
  );
  // const genre = await Genre.findById(req.params.id)
  if (!rental) return res.status(404).send("Movie not found");

  const result = await rental.save();
  res.send(result);
});

// ----------------------------------  Delete  -----------------------------------------
router.delete("/:id", async (req: any, res: any) => {
  const rental = await Rental.findByIdAndRemove(req.params.id);

  if (!rental) return res.status(404).send("Movie not found");

  res.send(rental);
});

module.exports = router;
export {};
