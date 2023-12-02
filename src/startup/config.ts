const config = require("config");
const result = require('dotenv').config()

module.exports = () => {

  if (result.error) {
    throw result.error
  }

  console.log('result.parsed', result.parsed)

  // if (!config.get("jwtPrivateKey")) {
  //   throw new Error("FATAL ERROR: jwtPrivateKey is not defined");
  // }
};
