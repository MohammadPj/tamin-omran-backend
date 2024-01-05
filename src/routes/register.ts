import { User, validateUser } from "../models/User";
import express from "express"
import {validEmailPattern, validPhoneNumberPatter} from "../utils/methods";
const lodash = require("lodash");
const bcrypt = require("bcrypt");

const router = express.Router();

// ----------------------------------  Post  --------------------------------------
router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ username: req.body?.username });

  if (!!user) return res.status(400).send("user already registered");

  user = new User(lodash.pick(req.body, ["username","firstName", "lastName", "password"]));

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt); // hash password to save in database safely

  if(validEmailPattern.test(user?.username)){
    user.email = user.username
  } else if(
    validPhoneNumberPatter.test(user.username)
  ) {
    user.phoneNumber = user.username
  }
  console.log('user', user)

  await user.save();

  // @ts-ignore
  const token = user.generateAuthToken()

  res.send({token, ...lodash.pick(user, ["firstName","lastName", "username"])});
});

module.exports = router;
