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
const express = require("express");
const Customers_1 = require("../models/Customers");
const router = express.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customers = yield Customers_1.Customers.find()
            .populate({
            path: "savedMovies",
            select: "-_id -__v",
            populate: { path: "genre", model: "Genre", select: "-_id -__v" },
        })
            .select("-__v");
        res.send(customers);
    }
    catch (e) {
        console.log("Error", e);
    }
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = yield Customers_1.Customers.findById(req.params.id);
    if (!customer)
        return res.status(404).send("Customers not found");
    res.send(customer);
}));
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, Customers_1.validateCustomers)(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    let customer = new Customers_1.Customers(Object.assign({}, req.body));
    customer = yield customer.save();
    res.send(customer);
}));
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, Customers_1.validateCustomers)(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    const customer = yield Customers_1.Customers.findByIdAndUpdate(req.params.id, Object.assign(Object.assign({}, req.body), { genre: req.body.genreId }), { new: true });
    if (!customer)
        return res.status(404).send("Customer not found");
    const result = yield customer.save();
    res.send(result);
}));
router.put("/add-movie/:customerId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const customerId = req.params.customerId;
    const customer = yield Customers_1.Customers.findById(customerId);
    (_a = customer === null || customer === void 0 ? void 0 : customer.savedMovies) === null || _a === void 0 ? void 0 : _a.push(req.body.movieId);
    const result = yield (customer === null || customer === void 0 ? void 0 : customer.save());
    res.send(result);
}));
router.put("/remove-movie/:customerId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = yield Customers_1.Customers.findById(req.params.customerId);
    if (customer === null || customer === void 0 ? void 0 : customer.savedMovies) {
        customer.savedMovies = customer.savedMovies.filter(item => item.toString() !== req.body.movieId);
    }
    const result = yield (customer === null || customer === void 0 ? void 0 : customer.save());
    if (!customer)
        return res.status(404).send("Customer not found");
    res.send(result);
}));
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = yield Customers_1.Customers.findByIdAndRemove(req.params.id);
    if (!customer)
        return res.status(404).send("Customer not found");
    res.send(customer);
}));
module.exports = router;
//# sourceMappingURL=Customers.js.map