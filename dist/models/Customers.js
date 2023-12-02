"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerSchema = exports.Customers = exports.validateCustomers = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = __importDefault(require("mongoose"));
const customerSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, minLength: 3 },
    isGold: { type: Boolean, default: false },
    phone: { type: String, required: true },
    savedMovies: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Movie', default: [] }]
});
exports.customerSchema = customerSchema;
const Customers = mongoose_1.default.model('Customers', customerSchema);
exports.Customers = Customers;
const validateCustomers = (customer) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string().required().min(3),
        isGold: joi_1.default.boolean(),
        phone: joi_1.default.string().required(),
        savedMovies: joi_1.default.array(),
    });
    return schema.validate(customer);
};
exports.validateCustomers = validateCustomers;
//# sourceMappingURL=Customers.js.map