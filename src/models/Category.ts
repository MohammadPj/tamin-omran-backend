import Joi from "joi";
import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document{
  title: {
    fa: string;
    en: string
  };
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>({
  title: {
    fa: {type: String, minLength: 3, maxLength: 50},
    en: {type: String, minLength: 3, maxLength: 50}
  },
}, {timestamps: true});

const Category = mongoose.model<ICategory>("Category", categorySchema);

const validateCategory = (category: any) => {
  const schema = Joi.object({
    title: Joi.object({
      fa: Joi.string().required().min(3),
      en: Joi.string().required().min(3),
    }),
  });
  return schema.validate(category);
};

export { Category, validateCategory };
