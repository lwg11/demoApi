const express = require('express');
const router = express.Router();

router.use('/dictionaryType', require('./dictionaryType/controller')); // 字典类型
router.use('/dictionary', require('./dictionary/controller')); // 字典

module.exports = router;