import Joi from "joi";
import mongoose, { Document, Schema } from 'mongoose';
import { ELanguage } from "../types/common";
import {IBrochureType} from "./BrochureType";

export interface IBrochure extends Document{
  title: string;
  lang: ELanguage;
  brochureType: IBrochureType
  file: string
  createdAt: Date;
  updatedAt: Date;
}

const brochureSchema = new Schema<IBrochure>({
  title: { type: String, minLength: 3, maxLength: 25 },
  lang: { type: String, enum: ELanguage, required: true },
  brochureType: {type: mongoose.Schema.Types.ObjectId, ref: 'BrochureType'},
  file: { type: String, required: true },
}, {timestamps: true});

const Brochure = mongoose.model<IBrochure>("Brochure", brochureSchema);

const validateBrochure = (brochure: any) => {
  const schema = Joi.object({
    title: Joi.string().required().min(3),
    lang: Joi.string().required(),
    brochureTypeId: Joi.string().required(),
    file: Joi.string(),
  });
  return schema.validate(brochure);
};

const validateEditeBrochure = (brochure: any) => {
  const schema = Joi.object({
    title: Joi.string().min(3),
    lang: Joi.string(),
    brochureTypeId: Joi.string(),
    file: Joi.string(),
  });
  return schema.validate(brochure);
};

export { Brochure, validateBrochure, validateEditeBrochure };
