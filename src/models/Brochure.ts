import Joi from "joi";
import mongoose, { Document, Schema } from 'mongoose';
import { ELanguage } from "../types/common";
import {IBrochureType} from "./BrochureType";

export interface IBrochure extends Document{
  title: string;
  lang: ELanguage;
  type: IBrochureType
  createdAt: Date;
  updatedAt: Date;
  file: string
}

const brochureSchema = new Schema<IBrochure>({
  title: { type: String, minLength: 3, maxLength: 25 },
  lang: { type: String, enum: ELanguage, required: true },
  type: {type: mongoose.Schema.Types.ObjectId, ref: 'BrochureType'},
  file: { type: String, required: true },
}, {timestamps: true});

const Brochure = mongoose.model<IBrochure>("Brochure", brochureSchema);

const validateBrochure = (brochure: any) => {
  const schema = Joi.object({
    title: Joi.string().required().min(3),
    lang: Joi.string().required(),
    typeId: Joi.string().required(),
    file: Joi.string().required(),
  });
  return schema.validate(brochure);
};

export { Brochure, validateBrochure };
