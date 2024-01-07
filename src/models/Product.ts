import Joi from "joi";
import mongoose, { Document, Schema } from "mongoose";
import { ELanguage } from "../types/common";
import { ICategory } from "./Category";
import { IBrand } from "./Brand";

export interface IProduct extends Document {
  title: string;
  lang: ELanguage;
  category: ICategory;
  brand: IBrand;
  createdAt: Date;
  updatedAt: Date;
  image: string;
  images: string[];
  isAvailable: boolean;
  engineNumber: string;
  technicalNumber: string;
  description: string;
  review: string;
}

const productSchema = new Schema<IProduct>(
  {
    title: { type: String, minLength: 3, maxLength: 25, required: true },
    lang: { type: String, enum: ELanguage, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
    image: { type: String },
    images: { type: [String] },
    isAvailable: { type: Boolean, required: true },
    engineNumber: { type: String, required: true },
    technicalNumber: { type: String, required: true },
    description: { type: String, required: true },
    review: { type: String, required: true },
  },
  { timestamps: true }
);

const Product = mongoose.model<IProduct>("Product", productSchema);

const validateProduct = (product: any) => {
  const schema = Joi.object({
    title: Joi.string().min(3),
    lang: Joi.string(),
    brandId: Joi.string(),
    categoryId: Joi.string(),
    description: Joi.string(),
    technicalNumber: Joi.string(),
    engineNumber: Joi.string(),
    review: Joi.string(),
    isAvailable: Joi.boolean(),
  });
  return schema.validate(product);
};

export { Product, validateProduct };
