import Joi from "joi";
import mongoose, { Document, Schema } from 'mongoose';
import { ELanguage } from "../types/common";

export interface IBrochureType extends Document{
  title: string;
  lang: ELanguage;
  createdAt: Date;
  updatedAt: Date;
}

const brochureTypeSchema = new Schema<IBrochureType>({
  title: { type: String, minLength: 3, maxLength: 25 },
  lang: { type: String, enum: ELanguage, required: true },
}, {timestamps: true});

const BrochureType = mongoose.model<IBrochureType>("BrochureType", brochureTypeSchema);

const validateBrochureType = (brochureType: any) => {
  const schema = Joi.object({
    title: Joi.string().required().min(3),
    lang: Joi.string()
  });
  return schema.validate(brochureType);
};

export { BrochureType, validateBrochureType };
