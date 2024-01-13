import Joi from "joi";
import mongoose, { Document, Schema } from 'mongoose';

export interface IEngineNumber extends Document{
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

const engineNumberSchema = new Schema<IEngineNumber>({
  title: { type: String, minLength: 3, maxLength: 25 },
}, {timestamps: true});

const EngineNumber = mongoose.model<IEngineNumber>("EngineNumber", engineNumberSchema);

const validateEngineNumber = (engineNumber: any) => {
  const schema = Joi.object({
    title: Joi.string().required().min(3),
  });
  return schema.validate(engineNumber);
};

export { EngineNumber, validateEngineNumber };
