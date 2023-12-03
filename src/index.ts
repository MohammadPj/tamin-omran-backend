import express from "express";
import winston from "winston";
const app = express();
const cors = require('cors')

require('./startup/logging')()
require('./startup/routes')(app)
require('./startup/db')()
require('./startup/config')()
require('./startup/tools')(app)

app.use(cors())

const port = process.env.PORT || 4000;
app.listen(port, () => {
  winston.info(`listening to port ${port}`);
});

export {};
