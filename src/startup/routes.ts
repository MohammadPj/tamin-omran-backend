import express, {Express} from "express";
//  routes
const genres = require("../routes/Genre");
const movies = require("../routes/Movie");
const customers = require("../routes/Customers");
const rentals = require("../routes/rentals");
const users = require("../routes/users");
const auth = require("../routes/auth");

// middleware
const error = require("../middleware/error");

module.exports = (app: Express) => {
  // --------------------------- APIs
  app.use(express.json());
  app.use("/api/genres", genres);
  app.use("/api/movies", movies);
  app.use("/api/customers", customers);
  app.use("/api/rentals", rentals);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use(error);
}