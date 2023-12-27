import winston from "winston"

const error = (error: any, req: any, res: any, next: any) => {
  console.log('error', error)
  winston.error(error?.message, error)
  res.status(500).send(error)
  next()
};

module.exports = error;
