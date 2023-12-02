"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = exports.User = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = __importDefault(require("mongoose"));
const User = mongoose_1.default.model("User", new mongoose_1.default.Schema({
    name: { type: String, required: true, minLength: 5, maxLength: 25 },
    email: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 255,
        unique: true,
    },
    password: { type: String, required: true, minLength: 3, maxLength: 1024 },
}));
exports.User = User;
const validateUser = (user) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string().required().min(5).max(25),
        email: joi_1.default.string().required().min(5).max(255).email(),
        password: joi_1.default.string().required().min(5).max(1024),
    });
    return schema.validate(user);
};
exports.validateUser = validateUser;
//# sourceMappingURL=User.js.map