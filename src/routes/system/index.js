const express = require('express');
const router = express.Router();

router.use('/login', require('./login'));
router.use('/user', require('./user'));
router.use('/logs', require('./logs'));
router.use('/menu', require('./menu'));
router.use('/role', require('./role'));
router.use('/rolemenu', require('./roleMenu'));

module.exports = router;