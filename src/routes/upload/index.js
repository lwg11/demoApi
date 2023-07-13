const express = require('express');
const router = express.Router();

router.use('/', require('./upload'));

module.exports = router;