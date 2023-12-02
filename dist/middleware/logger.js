"use strict";
const log = (req, res, next) => {
    console.log("logging");
    next();
};
module.exports = log;
//# sourceMappingURL=logger.js.map