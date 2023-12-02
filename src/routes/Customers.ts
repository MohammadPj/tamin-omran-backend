import * as mongoose from "mongoose";

const express = require("express");
import { Customers, validateCustomers } from "../models/Customers";

const router = express.Router();

// ----------------------------------  Get  --------------------------------------
router.get("/", async (req: any, res: any) => {
  try {
    const customers = await Customers.find()
      .populate({
        path: "savedMovies",
        select: "-_id -__v", // don't show _id and __v
        populate: { path: "genre", model: "Genre", select: "-_id -__v" }, // populate inner object
      })
      .select("-__v");

    res.send(customers);
  } catch (e) {
    console.log("Error", e);
  }
});

router.get("/:id", async (req: any, res: any) => {
  const customer = await Customers.findById(req.params.id);

  if (!customer) return res.status(404).send("Customers not found");

  res.send(customer);
});

// ----------------------------------  Post  --------------------------------------
router.post("/", async (req: any, res: any) => {
  const { error } = validateCustomers(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let customer = new Customers({ ...req.body });

  customer = await customer.save();

  res.send(customer);
});

// ----------------------------------  Put  -----------------------------------------
// change customer
router.put("/:id", async (req: any, res: any) => {
  const { error } = validateCustomers(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customers.findByIdAndUpdate(
    req.params.id,
    { ...req.body, genre: req.body.genreId },
    { new: true }
  );
  // const genre = await Genre.findById(req.params.id)
  if (!customer) return res.status(404).send("Customer not found");

  const result = await customer.save();
  res.send(result);
});

// add movie
router.put("/add-movie/:customerId", async (req: any, res: any) => {
  const customerId = req.params.customerId;
  const customer = await Customers.findById(customerId);
  
  customer?.savedMovies?.push(req.body.movieId);
  const result = await customer?.save();

  res.send(result);
});


router.put("/remove-movie/:customerId", async (req: any, res: any) => {
  const customer = await Customers.findById(req.params.customerId);

  if (customer?.savedMovies) {
    customer.savedMovies = customer.savedMovies.filter(item => item.toString() !== req.body.movieId)
  }

  const result = await customer?.save();

  if (!customer) return res.status(404).send("Customer not found");

  res.send(result);
});

// ----------------------------------  Delete  -----------------------------------------
router.delete("/:id", async (req: any, res: any) => {
  const customer = await Customers.findByIdAndRemove(req.params.id);

  if (!customer) return res.status(404).send("Customer not found");

  res.send(customer);
});

module.exports = router;
export {};
