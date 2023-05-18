const express = require('express');
const router = express.Router();
const sql = require('../../config/db');
const { getClientIP, isNull, toMenuTree, orderCode } = require('../../utils/utils');
const sd = require('silly-datetime');
const sqlError = require('../../utils/sqlError');
const Exception = require('../../exception');
const userService = require('./service');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const expiresIn = 3 * 60;
const secretKey = 'dolphin.2020';

/**
 * 账户登录
 */

router.post('/login', (req, res) => {
    // console.log('req--body--->', req.body);
    const { userNo, passWord } = req.body;
    let remark = "";
    let ip = getClientIP(req);
    console.log("ip:", ip);
    let logSqlStr = `insert into tb_system_logs (ip,remark,createTime,creator) values (?,?,sysdate(),?)`;
    let sqlStr = 'select userId,userNo,name,passWord,phone,email,headImage,createTime,creator,updateTime,updator,delFlag,isActive,organizationId,roleId from tb_system_user where userNo = ? and passWord = ?'
    sql.query(sqlStr, [userNo, passWord], function (err, results) {
        if (err) {
            console.log("登录--err:", err);
            res.json({ resultCode: -1, resultInfo: sqlError[err.errno] })
        } else if (results && results.length == 0) {
            console.log("[userNo,  passWord]:", [userNo, passWord]);
            remark = "账户或密码错误";
            res.json({ resultCode: -1, resultInfo: "账户或密码错误，忘记密码请与管理人员联系。" })
            sql.query(logSqlStr, [ip, remark, userNo], function (err) {
                if (err) {
                    console.error("==>出错了:", err);
                    res.json({ resultCode: -1, resultInfo: sqlError[err.errno] });
                }
                res.json({ resultCode: -1, resultInfo: "账户或密码错误，忘记密码请与管理人员联系。" })
            })
        }
        else {
            let currentUser = results[0]
            if (currentUser.isActive != 1) {
                res.json({ resultCode: -1, resultInfo: "该用户未启用,请联系管理员" })
            }
            else {
                remark = "登录成功";
                sql.query(logSqlStr, [ip, remark, userNo], function (err) {
                    if (err) {
                        console.error("==>出错了:", err);
                        res.json({ resultCode: -1, resultInfo: sqlError[err.errno] });
                    }
                })
                // loginuserId = results[0].userId;
                // console.log('results[0]--->', results[0]);
                const user = {
                    userId: results[0].userId,
                    userNo: results[0].userNo,
                    name: results[0].name
                }
                const token = jwt.sign(user, secretKey, { expiresIn: expiresIn });

                user.phone = results[0].phone;
                user.email = results[0].email;
                user.headImage = results[0].headImage;
                user.createTime = results[0].createTime;
                user.updateTime = results[0].updateTime;
                user.isActive = results[0].isActive;

                user.menuList = [];
                if (!isNull(results[0].roleId)) {
                    let sqlStr = `select m.menuId,m.menuName,m.menuCode,m.menuIcon,m.parentId,m.menuState,m.menuType,m.rightCode, m.menuSort 
				from tb_system_role_menu r
				left join tb_system_menu m on r.menuId=m.menuId
				where 1=1
				and m.menuState=1 
				and r.roleId= ?
				order by  m.menuSort asc`;
                    sql.query(sqlStr, [results[0].roleId], function (err, data) {
                        if (err) {
                            console.error("==>出错了:", err);
                            res.json({ resultCode: -1, resultInfo: sqlError[err.errno] });
                        } else {
                            // console.log("data:", data);
                            if (isNull(data)) {
                                res.json({ resultCode: -1, resultInfo: "用户未授权" });
                            }
                            else {
                                user.menuList = toMenuTree(data);
                                res.json({ resultCode: 0, resultInfo: "SUCCESS", data: { token, ...user } });
                            }
                        }
                    });
                } else {
                    res.json({ resultCode: -1, resultInfo: "用户暂未绑定角色" });
                }
            }
        }
    })
})

/**
 * 用户注册
 * @userId {string} 用户id
 * @userNo {string} 用户账户
 * @name {string} 姓名
 * @passWord {string} 密码
 * @phone {string} 手机
 * @email {string} 邮箱
 * @headImage {string} 用户头像
 * @createTime {datetime} 创建时间
 * @creator {string} 创建者
 * @updateTime {datetime} 更新时间
 * @updator {string} 更新者
 * @delFlag {int} 逻辑删除（0：未删除，1：已删除）
 * @isActive {int} 是否激活（0：未激活，1：激活）
 * @organizationId {int} 组织ID
 * @roleId {int} 角色编号 (1:管理员， 2：用户)
 */

router.post('/register', (req, res) => {
    let createTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
    // if (isNull(req.body.userNo)) throw new Exception(400, "账户为必填参数");
    if (isNull(req.body.phone)) throw new Exception(400, "手机号码为必填参数");
    if (isNull(req.body.name)) throw new Exception(400, "姓名为必填参数");
    if (isNull(req.body.passWord)) throw new Exception(400, "密码为必填参数");
    let userId = uuidv4();

    let { userNo, name, passWord, phone, email, headImage, } = req.body
    // coords = isNull(coords) ? null : JSON.stringify(req.body.coords);
    let params = {
        userId, userNo, name, passWord, phone, email, headImage,
        createTime: createTime,
        creator: req?.user?.userNo,
        updateTime: createTime,
        updator: req?.user?.userNo,
        delFlag: 0,
        isActive: 1,
        roleId: 2,
    }

    Promise.all([userService.userByPhone([phone])]).then(results => {
        let userResult = results[0]
        console.log('userResult--->', userResult);

        if (userResult.error) {
            console.log("userResult.error:", userResult.error);
            throw new Exception(-1, sqlError[userResult.error.errno])
        }
        if (userResult.result && userResult.result.length > 0) {
            throw new Exception(-1, '该用户已注册')
        }
        else {

            res.json({ resultCode: 0, resultInfo: '注册成功' })
            
            // let userParams = {
            //     userId: orderCode('S'),
            //     // userNo: orderCode('S'),
            //     name: name,
            //     password: password,
            //     phone: phone,
            //     email: email,
            //     headImage: headImage,
            //     createTime: currentTime,
            //     creator: req?.user?.userNo,
            //     updateTime: currentTime,
            //     roleId: 59,
            //     isActive: 1,
            //     orgCode: customerId,
            // }
            // customer.customerRegister(params, userParams).then(err => {
            //     if (err) {
            //         console.log("err:", err);
            //         res.json({ resultCode: -1, resultInfo: sqlError[err.errno] })

            //     } else {
            //         res.json({ resultCode: 0, resultInfo: '注册成功' })
            //     }
            // })
        }
    }).catch(e => {
        res.json({ resultCode: -1, resultInfo: e.message || e })
    });




})

module.exports = router;