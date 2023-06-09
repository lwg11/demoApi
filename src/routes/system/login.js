const express = require('express');
const router = express.Router();
const { getClientIP, isNull, toMenuTree, orderCode } = require('../../utils/utils');
const sd = require('silly-datetime');
const sqlError = require('../../utils/sqlError');
const Exception = require('../../exception');
const userService = require('./userService');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const expiresIn = 30 * 24 * 60 * 60;
const secretKey = 'dolphin.2020';


/**
 * @api {post} /system/login 1.1.用户名/手机号码登录 
 * @apiSampleRequest /system/login
 * @apiDescription 用户名/手机号码登录  
 * @apiName login
 * @apiGroup System
 * @apiParam {string} phone 用户名/手机号码
 * @apiParam {string} passWord 密码
 * @apiParamExample {json} Request-Example:
 *    {
 *      "phone": "",
 * 		"passWord":""
 *    }
 * @apiSuccess {json} resp_result
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiVersion 1.0.0
 */

router.post('/', (req, res) => {
    const { userNo, phone, passWord } = req.body;
    let remark = "";
    let ip = getClientIP(req);
    let params = [userNo, phone, passWord];
    userService.userList(params).then(results => {
        if (results.error) {
            res.json({ resultCode: -1, resultInfo: sqlError[results.error.errno] })
        } else if (results && results.result.length == 0) {
            remark = "账户或密码错误";
            let params = [ip, remark, userNo, phone]
            userService.logAddOne(params).then(result => {
                if (result.error) {
                    res.json({ resultCode: -1, resultInfo: sqlError[results.error.errno] })
                }
                res.json({ resultCode: -1, resultInfo: "账户或密码错误，忘记密码请与管理人员联系。" })
            })
        } else {
            let currentUser = results.result[0]
            // console.log('results--->', results);
            if (currentUser.isActive != 1) {
                res.json({ resultCode: -1, resultInfo: "该用户未启用,请联系管理员" })
            } else {
                remark = "登录成功";
                let params = [ip, remark, userNo, phone]
                userService.logAddOne(params).then(result => {
                    if (result.error) {
                        res.json({ resultCode: -1, resultInfo: sqlError[result.error.errno] })
                    }
                })
                const user = {
                    userId: currentUser.userId,
                    userNo: currentUser.userNo,
                    userName: currentUser.userName
                }
                const token = jwt.sign(user, secretKey, { expiresIn: expiresIn });

                user.phone = currentUser.phone;
                user.email = currentUser.email;
                user.headImage = currentUser.headImage;
                user.createTime = currentUser.createTime;
                user.updateTime = currentUser.updateTime;
                user.isActive = currentUser.isActive;
                user.roleId = currentUser.roleId;
                user.roleName= currentUser.roleName;

                user.menuList = [];
                if (!isNull(currentUser.roleId)) {
                    userService.roleMenuList(currentUser.roleId).then(result => {
                        if (result.error) {
                            res.json({ resultCode: -1, resultInfo: sqlError[result.error.errno] });
                        } else {
                            if (isNull(result.result)) {
                                res.json({ resultCode: -1, resultInfo: "用户未授权" });
                            }
                            else {
                                user.menuList = toMenuTree(result.result);
                                res.json({ resultCode: 0, resultInfo: "SUCCESS", data: { token, ...user } });
                            }
                        }
                    })
                } else {
                    res.json({ resultCode: -1, resultInfo: "用户暂未绑定角色" });
                }
            }
        }
    })
})

/**
 * @api {post} /system/login/register 1.2.用户名/手机号码注册
 * @apiSampleRequest /system/login/register
 * @apiDescription 用户名/手机号码注册 
 * @apiName register
 * @apiGroup System
 * @apiParam {string} phone 手机号码
 * @apiParam {string} userName 用户姓名
 * @apiParam {string} passWord 密码
 * @apiParamExample {json} Request-Example:
 *    {
 *      "phone": "",
 *      "userName": "",
 * 		"passWord":""
 *    }
 * @apiSuccess {json} resp_result
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiVersion 1.0.0
 */

router.post('/register', (req, res) => {
    let createTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
    if (isNull(req.body.phone)) throw new Exception(400, "手机号码为必填参数");
    if (isNull(req.body.userName)) throw new Exception(400, "姓名为必填参数");
    // if (isNull(req.body.passWord)) throw new Exception(400, "密码为必填参数");
    let userId = uuidv4();
    let ip = getClientIP(req);
    let userNo = orderCode("S");
    let { userName, passWord, phone, email, headImage, } = req.body
    let params = {
        userId, userNo, userName, phone, email, headImage,
        passWord: passWord || '123456',
        createTime: createTime,
        creator: userName,
        updateTime: createTime,
        updator: userName,
        delFlag: 0,
        isActive: 1,
        roleId: 2,
    }
    Promise.all([userService.userByPhone([phone])]).then(results => {
        let userResult = results[0]
        if (userResult.error) {
            console.log("userResult.error:", userResult.error);
            throw new Exception(-1, sqlError[userResult.error.errno])
        }
        if (userResult.result && userResult.result.length > 0) {
            throw new Exception(-1, '该用户已注册')
        }
        else {
            userService.registerOne(params).then(result => {
                if (result.error) {
                    console.log("注册出错了===>", result.error);
                    res.json({ resultCode: -1, resultInfo: sqlError[result.error.errno] })
                } else {
                    remark = "注册成功";
                    let params = [ip, remark, userNo, phone]
                    userService.logAddOne(params).then(result => {
                        if (result.error) {
                            res.json({ resultCode: -1, resultInfo: sqlError[result.error.errno] })
                        }
                    })
                    res.json({ resultCode: 0, resultInfo: '注册成功' })
                }
            })
        }
    }).catch(e => {
        res.json({ resultCode: -1, resultInfo: e.message || e })
    });
})

module.exports = router;