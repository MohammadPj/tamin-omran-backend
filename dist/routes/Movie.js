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
const mongoose = require("mongoose");
const express = require("express");
const Joi = require("joi");
const router = express.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movies = yield Movie_1.Movie.find()
            .populate("genre", 'name -_id');
        res.send(movies);
    }
    catch (e) {
        console.log("Error", e);
    }
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const movie = yield Movie_1.Movie.findById(req.params.id);
    if (!movie)
        return res.status(404).send("Movie not found");
    res.send(movie);
}));
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, Movie_1.validateMovie)(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    let movie = new Movie_1.Movie(Object.assign(Object.assign({}, req.body), { genre: req.body.genreId }));
    movie = yield movie.save();
    res.send(movie);
}));
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, Movie_1.validateMovie)(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    const movie = yield Movie_1.Movie.findByIdAndUpdate(req.params.id, Object.assign(Object.assign({}, req.body), { genre: req.body.genreId }), { new: true });
    if (!movie)
        return res.status(404).send("Movie not found");
    const result = yield movie.save();
    res.send(result);
}));
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const genre = yield Movie_1.Movie.findByIdAndRemove(req.params.id);
    if (!genre)
        return res.status(404).send("Movie not found");
    res.send(genre);
}));
module.exports = router;
//# sourceMappingURL=Movie.js.map