import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Joi from "joi";
import passwordComplexity from "joi-password-complexity";
const result = require("dotenv").config();

const userSchema = new mongoose.Schema({
  name: { type: String, minLength: 3, maxLength: 25 },
  email: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 255,
    unique: true,
  },
  password: { type: String, required: true, minLength: 3, maxLength: 1024 }, // use npm joi-password-complexity,
  isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin }, // payload of jwt
    result.parsed.SECRET_KEY // private key
  );

  return token;
};

const User = mongoose.model("User", userSchema);

const validateUser = (user: any) => {
  const schema = Joi.object({
    name: Joi.string().required().min(3).max(25),
    email: Joi.string().required().min(5).max(255).email(),
    password: passwordComplexity({ min: 6, max: 20, upperCase: 1, numeric: 1 }),
  });

  return schema.validate(user);
};

export { User, validateUser };
