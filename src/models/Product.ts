import Joi from "joi";
import mongoose, { Document, Schema } from "mongoose";
import { ICategory } from "./Category";
import { IBrand } from "./Brand";

export interface IProduct extends Document {
  title: { fa: string; en: string };
  category: { fa: ICategory; en: ICategory };
  description: {en: string, fa: string};
  review: {en: string, fa: string};
  brand: IBrand;
  image: string;
  images: string[];
  isAvailable: boolean;
  engineNumber: string;
  technicalNumber: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const productSchema = new Schema<IProduct>(
  {
    // multi-lang props
    title: { en: { type: String }, fa: { type: String } },
    category: {
      fa: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
      en: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    },
    description: { en: { type: String }, fa: { type: String } },
    review: { en: { type: String }, fa: { type: String } },

    // independent
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
    image: { type: String },
    images: { type: [String] },
    isAvailable: { type: Boolean, required: true },
    engineNumber: { type: String, required: true },
    technicalNumber: { type: String, required: true },
  },
  { timestamps: true }
);

const Product = mongoose.model<IProduct>("Product", productSchema);

const validateProduct = (product: any) => {
  const schema = Joi.object({
    title: Joi.object({
      fa: Joi.string().min(3),
      en: Joi.string().min(3),
    }) ,
    categoryId: Joi.object({
      fa: Joi.string(),
      en: Joi.string(),
    }) ,
    description: Joi.object({
      fa: Joi.string(),
      en: Joi.string(),
    }) ,
    review: Joi.object({
      fa: Joi.string(),
      en: Joi.string(),
    }) ,
    brandId: Joi.string(),
    technicalNumber: Joi.string(),
    engineNumber: Joi.string(),
    isAvailable: Joi.boolean(),
  });
  return schema.validate(product);
};

export { Product, validateProduct };
