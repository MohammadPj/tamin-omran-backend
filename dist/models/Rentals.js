"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRental = exports.Rental = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Customers_1 = require("./Customers");
const Movie_1 = require("./Movie");
const joi_1 = __importDefault(require("joi"));
const Rental = mongoose_1.default.model('Rental', new mongoose_1.default.Schema({
    customer: { type: Customers_1.customerSchema, required: true },
    movie: { type: Movie_1.movieSchema, required: true },
    dateOut: { type: Date, default: Date.now, required: true },
    dateReturned: { type: Date },
    rentalFee: { type: Number, min: 0 }
}));
exports.Rental = Rental;
const validateRental = (rental) => {
    const schema = joi_1.default.object({
        customerId: joi_1.default.string().required(),
        movieId: joi_1.default.string().required()
    });
    return schema.validate(rental);
};
exports.validateRental = validateRental;
//# sourceMappingURL=Rentals.js.map