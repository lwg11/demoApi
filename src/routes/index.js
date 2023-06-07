const express = require('express');
const router = express.Router();

router.use('/system', require('./system/index'));

module.exports = router;