import Joi from "joi";
import mongoose, { Document, Schema } from 'mongoose';
import { ELanguage } from "../types/common";

export interface IArticle extends Document{
  title: string;
  lang: ELanguage;
  image: string
  content: string
  createdAt: Date;
  updatedAt: Date;
}

const articleSchema = new Schema<IArticle>({
  title: { type: String, minLength: 3, maxLength: 25 },
  lang: { type: String, enum: ELanguage, required: true },
  content: { type: String, minlength: 24, required: true },
  image: { type: String },
}, {timestamps: true});

const Article = mongoose.model<IArticle>("Article", articleSchema);

const validateArticle = (article: any) => {
  const schema = Joi.object({
    title: Joi.string().min(3),
    lang: Joi.string(),
    content: Joi.string().min(24),
    image: Joi.any()
  });
  return schema.validate(article);
};

export { Article, validateArticle };
