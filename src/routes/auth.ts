import Joi from "joi";
import { User } from "../models/User";
let express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();

const validate = (user: any) => {
  const schema = Joi.object({
    email: Joi.string().required().min(5).max(255).email(),
    password: Joi.string().required().min(5).max(1024),
  });

  return schema.validate(user);
};

// ----------------------------------  Get  --------------------------------------
router.post("/", async (req: any, res: any) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(400).send("invalid email or password");

  const isValidPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!isValidPassword)
    return res.status(400).send("invalid email or password");

  // @ts-ignore
  const token = user.generateAuthToken()

  res.send(token)
});

module.exports = router;
