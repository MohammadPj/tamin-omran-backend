import express from "express";
import winston from "winston";
const cors = require('cors');
// const startupDebugger = require("debug")("app:startup");
import * as path from 'path';
console.log('##########');

const here = __dirname
console.log(path.join(__dirname, 'uploads'));

console.log('##########');
const app = express();

require('./startup/logging')()
require('./startup/routes')(app)
require('./startup/db')()
require('./startup/config')()
require('./startup/tools')(app)

app.use(cors());

app.use((req, res, next) => {
  res.setHeader('Referrer-Policy', 'no-referrer');
  next();
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`listening to port ${port}`)
  winston.info(`listening to port ${port}`);
});

export {};
