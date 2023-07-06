const express = require('express');
const router = express.Router();

router.use('/system', require('./system/index'));
router.use('/finance', require('./finance/index'));

module.exports = router;