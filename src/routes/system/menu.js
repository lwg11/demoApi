const express = require('express');
const router = express.Router();
const sql = require('../../config/db');
const { getClientIP, isNull, toMenuTree, orderCode } = require('../../utils/utils');
const sd = require('silly-datetime');
const sqlError = require('../../utils/sqlError');
const Exception = require('../../exception');
const userService = require('../tools/service');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// const expiresIn = 3 * 60;
const expiresIn = 30 * 24 * 60 * 60;

const secretKey = 'dolphin.2020';
const jwtMiddleWare = require('../../utils/middleWare');


/**
 * @api {get} /system/menu 4.1.菜单列表
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription 菜单列表
 * @apiName getMenus
 * @apiGroup System
 * @apiSuccessExample {json} Success-Response:
 * {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /system/menu
 * @apiVersion 1.0.0
 */

router.get('/', jwtMiddleWare, (req, res) => {
    userService.menu().then(results => {
        // let menu = toMenuTree(results);
        // console.log('results--->',results);
        res.json({ resultCode: 0, resultInfo: "SUCCESS", data: results });
    })
})

module.exports = router;
