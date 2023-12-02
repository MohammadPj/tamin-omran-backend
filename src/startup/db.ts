import mongoose from "mongoose";
import winston from "winston";

module.exports = () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/tamin-omran")
    .then(() => {
      winston.info('Connected to MongoDB...')
    })

}