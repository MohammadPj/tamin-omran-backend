import express, {Express} from "express";
//  routes
const category = require("../routes/category");
const brand = require("../routes/brand");
const brochureType = require("../routes/brochureType");
const brochure = require("../routes/brochure");
const product = require("../routes/product");
const article = require("../routes/article");
const register = require("../routes/register");
const engineNumber = require("../routes/engineNumber");
const user = require("../routes/user");
const auth = require("../routes/auth");
const file = require("../routes/file");

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
  app.use("/api/register", register);
  app.use("/api/engineNumber", engineNumber);
  app.use("/api/user", user);
  app.use("/api/auth", auth);
  app.use("/api/file", file);
  app.use(error);
}