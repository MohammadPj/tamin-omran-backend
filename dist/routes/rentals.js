"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Movie_1 = require("../models/Movie");
const Rentals_1 = require("../models/Rentals");
const Customers_1 = require("../models/Customers");
const Fawn = require("fawn");
const mongoose = require("mongoose");
const express = require("express");
const Joi = require("joi");
const router = express.Router();
Fawn.init("mongodb://127.0.0.1:27017/rental-project");
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rentals = yield Rentals_1.Rental.find().sort("-dateOut");
        res.send(rentals);
    }
    catch (e) {
        console.log("Error", e);
    }
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rental = yield Rentals_1.Rental.findById(req.params.id);
    if (!rental)
        return res.status(404).send("Movie not found");
    res.send(rental);
}));
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, Rentals_1.validateRental)(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    try {
        const customer = yield Customers_1.Customers.findById(req.body.customerId);
        if (!customer)
            return res.status(400).send("invalid customer");
        const movie = yield Movie_1.Movie.findById(req.body.movieId);
        if (!movie)
            return res.status(400).send("invalid movie");
        if (movie.numberInStock === 0)
            return res.status(400).send("movie not in stock");
        let rental = new Rentals_1.Rental(Object.assign(Object.assign({}, req.body), { movie, customer }));
        const task = Fawn.Task();
        try {
            console.log('before');
            task
                .save("rentals", rental)
                .update("movies", { _id: movie._id }, {
                $inc: { numberInStock: -1 },
            })
                .run();
            console.log('after');
            res.send(rental);
        }
        catch (e) {
            res.status(500).send("somthing faild");
        }
    }
    catch (e) {
        res.status(400).send(e.message);
        console.log("e", e.message);
    }
}));
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, Movie_1.validateMovie)(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    const rental = yield Rentals_1.Rental.findByIdAndUpdate(req.params.id, Object.assign({}, req.body), { new: true });
    if (!rental)
        return res.status(404).send("Movie not found");
    const result = yield rental.save();
    res.send(result);
}));
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rental = yield Rentals_1.Rental.findByIdAndRemove(req.params.id);
    if (!rental)
        return res.status(404).send("Movie not found");
    res.send(rental);
}));
module.exports = router;
//# sourceMappingURL=rentals.js.map