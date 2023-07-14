const express = require('express');
const router = express.Router();

router.use('/configuration', require('./configuration/index')); // 字典
router.use('/system', require('./system/index')); // 系统
router.use('/finance', require('./finance/index')); // 金融
router.use('/weather', require('./weather/index')); // 天气
router.use('/upload', require('./upload/index')); // 天气

module.exports = router;