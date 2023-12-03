import express, {Express} from "express";
//  routes
const category = require("../routes/category");
const brand = require("../routes/brand");
const brochureType = require("../routes/brochureType");
const brochure = require("../routes/brochure");
const product = require("../routes/product");
const article = require("../routes/article");
const movies = require("../routes/Movie");
const customers = require("../routes/Customers");
const rentals = require("../routes/rentals");
const register = require("../routes/register");
const auth = require("../routes/auth");

// middleware
const error = require("../middleware/error");

module.exports = (app: Express) => {
  // --------------------------- APIs
  app.use(express.json());
  app.use("/api/category", category);
  app.use("/api/brand", brand);
  app.use("/api/brochure-type", brochureType);
  app.use("/api/brochure", brochure);
  app.use("/api/product", product);
  app.use("/api/article", article);
  app.use("/api/movies", movies);
  app.use("/api/customers", customers);
  app.use("/api/rentals", rentals);
  app.use("/api/register", register);
  app.use("/api/auth", auth);
  app.use(error);
}