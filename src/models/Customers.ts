import Joi from 'joi';
import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true, minLength: 3 },
  isGold: { type: Boolean, default: false },
  phone: { type: String, required: true },
  savedMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie', default: [] }]
})

const Customers = mongoose.model('Customers', customerSchema)

export const validateCustomers = (customer: any) => {
  const schema = Joi.object({
    name: Joi.string().required().min(3),
    isGold: Joi.boolean(),
    phone: Joi.string().required(),
    savedMovies: Joi.array(),
  });
  return schema.validate(customer);
}

export { Customers, customerSchema }