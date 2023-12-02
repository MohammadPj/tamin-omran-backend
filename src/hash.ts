const bcrypt = require("bcrypt");

const run = async () => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('123', salt)
  console.log("hashedPassword", hashedPassword);
  console.log("salt", salt);
};

run();
