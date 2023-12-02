import winston from "winston";
import "winston-mongodb"; // to save errors and logs in mongodb
require("express-async-errors"); // work instead of asyncMiddleware

module.exports = () => {
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
      db: "mongodb://127.0.0.1:27017/rental-project",
      level: "error",
    })
  );
};
