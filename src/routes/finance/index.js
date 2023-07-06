const express = require('express');
const router = express.Router();

router.use('/goodsBill', require('./goods/controller'));

module.exports = router;