import winston from "winston";
import "winston-mongodb"; // to save errors and logs in mongodb
require("express-async-errors"); // work instead of asyncMiddleware
import dotenv from 'dotenv'

module.exports = () => {
  const env = dotenv.config().parsed
  process.on("uncaughtException", (ex) => {
    winston.error(ex.message, ex);
    process.exit(1);
  });

  process.on("unhandledRejection", (ex: any) => {
    winston.error(ex.message, ex);
    process.exit(1);
  });

  // define winston
  winston.add(new winston.transports.File({ filename: "logfile.log" }));
  winston.add(
    new winston.transports.MongoDB({
      db: env?.DATABASE_URL!,
      level: "error",
    })
  );
};
