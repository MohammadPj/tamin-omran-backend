import Joi from "joi";
import mongoose, { Document, Schema } from 'mongoose';
import { ELanguage } from "../types/common";

export interface ICategory extends Document{
  name: string;
  lang: ELanguage;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>({
  name: { type: String, minLength: 3, maxLength: 25 },
  lang: { type: String, enum: ELanguage, required: true },
}, {timestamps: true});

const Category = mongoose.model<ICategory>("Category", categorySchema);

const validateCategory = (category: any) => {
  const schema = Joi.object({
    name: Joi.string().required().min(3),
    lang: Joi.string().required()
  });
  return schema.validate(category);
};

export { Category, validateCategory };
