import Joi from "joi";
import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true, minLength: 3 },
    numberInStock: { type: Number },
    dailyRentalRate: Number,
    genre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Genre",
    },
})

const Movie = mongoose.model(
    "Movie",
    movieSchema
);

const validateMovie = (movie: any) => {
    const schema = Joi.object({
        title: Joi.string().required().min(3),
        numberInStock: Joi.number().required().min(1),
        dailyRentalRate: Joi.number(),
        genreId: Joi.string().required(),
    });
    return schema.validate(movie);
};

export {Movie, validateMovie, movieSchema}