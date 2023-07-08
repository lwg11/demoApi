const express = require('express');
const router = express.Router();

router.use('/goodsBill', require('./goods/controller'));
router.use('/consumableGoodsType', require('./goodsType/controller'));

module.exports = router;