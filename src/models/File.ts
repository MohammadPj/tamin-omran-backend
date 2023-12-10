import Joi from "joi";
import mongoose, { Document, Schema } from 'mongoose';

export interface IFile extends Document{
  link: string;
  createdAt: Date;
  updatedAt: Date;
}

const fileSchema = new Schema<IFile>({
  link: { type: String, required: true },
}, {timestamps: true});

const File = mongoose.model<IFile>("File", fileSchema);

const validateFile = (file: IFile) => {
  const schema = Joi.object({
    link: Joi.string().required().min(3),
  });
  return schema.validate(file);
};

export { File, validateFile };
