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
class Creator {
    constructor(app, items) {
        this.run = (listName, validator) => {
            this.app.get(`/`, (req, res) => {
                res.send(this.items);
            });
            this.app.get(`/:id`, (req, res) => {
                const item = this.items.find((itm) => itm.id === +req.params.id);
                if (!item)
                    return res
                        .status(404)
                        .send(`The ${listName} with the given ID was not found!!! `);
                res.send(item);
            });
            this.app.post(`/`, (req, res) => __awaiter(this, void 0, void 0, function* () {
                if (validator) {
                    const { error } = validator(req.body);
                    if (error)
                        return res.status(400).send(error.details[0].message);
                }
                const item = Object.assign(Object.assign(Object.assign({}, this.items[0]), req.body), { id: this.items.length + 1 });
                this.items.push(item);
                res.send(item);
            }));
            this.app.put(`/:id`, (req, res) => {
                let item = this.items.find((itm) => itm.id === +req.params.id);
                if (!item)
                    return res
                        .status(404)
                        .send(`The ${listName} with the given ID was not found!!! `);
                const { error } = validator(req.body);
                if (error)
                    return res.status(400).send(error.details[0].message);
                const index = this.items.findIndex((itm) => itm.id === +req.params.id);
                const newItem = Object.assign(Object.assign({}, this.items[index]), req.body);
                this.items.splice(index, 1, newItem);
                res.send(newItem);
            });
            this.app.delete(`/:id`, (req, res) => {
                const item = this.items.find((itm) => itm.id === +req.params.id);
                if (!item)
                    return res.status(404).send(`The ${listName} with the given ID was not found!!!`);
                const index = this.items.findIndex((itm) => itm.id === +req.params.id);
                this.items.splice(index, 1);
                res.send(item);
            });
        };
        this.app = app;
        this.items = items;
    }
}
module.exports = Creator;
//# sourceMappingURL=creator.js.map