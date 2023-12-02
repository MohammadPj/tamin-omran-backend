import winston from "winston"

const error = (error: any, req: any, res: any, next: any) => {
  winston.error(error?.message, error)
  res.status(500).send('something failed.')
  next()
};

module.exports = error;
