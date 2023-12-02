"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.movieSchema = exports.validateMovie = exports.Movie = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = __importDefault(require("mongoose"));
const movieSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true, minLength: 3 },
    numberInStock: { type: Number },
    dailyRentalRate: Number,
    genre: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Genre",
    },
});
exports.movieSchema = movieSchema;
const Movie = mongoose_1.default.model("Movie", movieSchema);
exports.Movie = Movie;
const validateMovie = (movie) => {
    const schema = joi_1.default.object({
        title: joi_1.default.string().required().min(3),
        numberInStock: joi_1.default.number().required().min(1),
        dailyRentalRate: joi_1.default.number(),
        genreId: joi_1.default.string().required(),
    });
    return schema.validate(movie);
};
exports.validateMovie = validateMovie;
//# sourceMappingURL=Movie.js.map