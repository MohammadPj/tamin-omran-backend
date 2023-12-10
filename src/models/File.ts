import mongoose, { Document, Schema } from 'mongoose';

export interface IFile extends Document{
  link: string;
  name: string;
  type: string;
  size: number
  destination: string
  createdAt: Date;
  updatedAt: Date;
}

const fileSchema = new Schema<IFile>({
  link: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  size: { type: Number, required: true },
  destination: { type: String, required: true },
}, {timestamps: true});

const File = mongoose.model<IFile>("File", fileSchema);

export { File };
