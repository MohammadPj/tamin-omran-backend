const result = require("dotenv").config();

module.exports = () => {
  if (result.error) {
    throw result.error;
  }
};
