import Joi from "joi";
import mongoose from "mongoose";

const Genre = mongoose.model("Genre", new mongoose.Schema({
    name: { type: String, minLength: 3, maxLength: 25 }
}))

const validateGenre = (genre: any) => {
    const schema = Joi.object({
        name: Joi.string().required().min(3),
    });
    return schema.validate(genre);
};

export {Genre, validateGenre}