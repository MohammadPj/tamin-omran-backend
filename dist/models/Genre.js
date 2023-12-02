"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateGenre = exports.Genre = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = __importDefault(require("mongoose"));
const Genre = mongoose_1.default.model("Genre", new mongoose_1.default.Schema({
    name: { type: String, minLength: 3, maxLength: 25 }
}));
exports.Genre = Genre;
const validateGenre = (genre) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string().required().min(3),
    });
    return schema.validate(genre);
};
exports.validateGenre = validateGenre;
//# sourceMappingURL=Genre.js.map