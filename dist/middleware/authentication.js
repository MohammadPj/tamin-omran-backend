"use strict";
const authentication = (req, res, next) => {
    console.log("Authenticating ...");
    next();
};
module.exports = authentication;
//# sourceMappingURL=authentication.js.map