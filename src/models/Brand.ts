import Joi from "joi";
import mongoose, { Document, Schema } from 'mongoose';
import { ELanguage } from "../types/common";

export interface IBrand extends Document{
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

const brandSchema = new Schema<IBrand>({
  title: { type: String, minLength: 3, maxLength: 25 },
}, {timestamps: true});

const Brand = mongoose.model<IBrand>("Brand", brandSchema);

const validateBrand = (brand: any) => {
  const schema = Joi.object({
    title: Joi.string().required().min(3),
  });
  return schema.validate(brand);
};

export { Brand, validateBrand };
