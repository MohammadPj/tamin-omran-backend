import express, {Express} from "express";
import helmet from "helmet";
const morgan = require("morgan");
const startupDebugger = require("debug")("app:startup");
const dbDebugger = require("debug")("app:db");

module.exports = (app: Express) => {
  app.use(express.urlencoded({ extended: true })); //key=value&key=value
  app.use(express.static("public"));
  app.use(helmet());

  if (app.get("env") === "development") {
    app.use(morgan("short"));
    startupDebugger("morgan enabled");
  }

// Db work ...
  dbDebugger("connected to database...");
}