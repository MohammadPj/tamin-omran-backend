import mongoose from "mongoose";
import winston from "winston";
const dbDebugger = require("debug")("app:db");
import dotenv from 'dotenv'

module.exports = () => {
  const env = dotenv.config().parsed

  mongoose.set("strictQuery", false);
  mongoose.connect(env?.DATABASE_URL!).then(() => {
    dbDebugger("connected to database...");
    winston.info("Connected to MongoDB...");
  });
};
