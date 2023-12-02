import mongoose, {Schema} from "mongoose";
import {customerSchema} from "./Customers";
import {movieSchema} from "./Movie";
import Joi from "joi";

const Rental = mongoose.model('Rental', new mongoose.Schema({
  customer: {type: customerSchema, required: true},
  movie: {type: movieSchema, required: true},
  dateOut: {type: Date, default: Date.now, required: true},
  dateReturned: {type: Date},
  rentalFee: {type: Number, min: 0}
  }))

const validateRental = (rental: any) => {
  const schema = Joi.object({
    customerId: Joi.string().required(),
    movieId: Joi.string().required()
  })

  return schema.validate(rental)
}

export {Rental, validateRental}