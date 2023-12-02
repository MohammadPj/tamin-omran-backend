"use strict";
const express = require('express');
const router = express.Router();
router.get('/', (req, res) => {
    res.render('index', { title: "My auto app", message: "hello" });
});
module.exports = router;
//# sourceMappingURL=home.js.map