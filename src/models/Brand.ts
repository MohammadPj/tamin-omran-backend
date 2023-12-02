import Joi from "joi";
import mongoose, { Document, Schema } from 'mongoose';
import { ELanguage } from "../types/common";

export interface IBrand extends Document{
  name: string;
  lang: ELanguage;
  createdAt: Date;
  updatedAt: Date;
}

const brandSchema = new Schema<IBrand>({
  name: { type: String, minLength: 3, maxLength: 25 },
  lang: { type: String, enum: ELanguage, required: true },
}, {timestamps: true});

const Brand = mongoose.model<IBrand>("Brand", brandSchema);

const validateBrand = (brand: any) => {
  const schema = Joi.object({
    name: Joi.string().required().min(3),
    lang: Joi.string().required()
  });
  return schema.validate(brand);
};

export { Brand, validateBrand };
