const express = require('express');
const router = express.Router();

router.use('/system', require('./user/controller'));

module.exports = router;