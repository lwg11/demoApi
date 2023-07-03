const express = require('express');
const router = express.Router();
const { execTrans, isNull, _getNewSqlParamEntity, orderCode } = require('../../utils/utils');
const sd = require('silly-datetime');
const sqlError = require('../../utils/sqlError');
const Exception = require('../../exception');
const userService = require('./userService');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const expiresIn = 30 * 24 * 60 * 60;
const secretKey = 'dolphin.2020';
const jwtMiddleWare = require('../../utils/middleWare');
const sql = require('../../config/db');

/**
 * @api {get} /system/user 1.3.用户分页列表
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription 2.用户分页列表
 * @apiParam {Int} [pageNum] 当前页
 * @apiParam {Int} [pageSize] 记录数
 * @apiParam {String} [phone] 手机号码
 * @apiParam {String} [userName] 姓名
 * @apiParam {String} [keyword] 关键字  姓名|手机号
 * @apiName getusers
 * @apiGroup System
 * @apiSuccessExample {json} Success-Response:
 * {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /system/user
 * @apiVersion 1.0.0
 */
router.get('/', jwtMiddleWare, function (req, res) {
    let { phone, userName, keyword } = req.query;
    let sqlStr1 = `select count(1) total 
        from tb_system_user`; // SQL查询语句，用于获取总记录数
    // let sqlstr = `select 
    // userId,
    // userNo,
    // userName,
    // phone,
    // email,
    // headImage,
    // createTime,
    // creator,
    // updateTime,
    // updator,
    // isActive,
    // organizationId,
    // roleId 
	// from tb_system_user a
	// where 1=1 and a.delFlag= 0`;

    let sqlstr = `SELECT
	a.userId,
	a.userNo,
	a.userName,
	a.phone,
	a.email,
	a.headImage,
	a.createTime,
	a.creator,
	a.updateTime,
	a.updator,
	a.isActive,
	a.organizationId,
	a.roleId,
	b.roleCode,
	b.roleName,
	b.description,
	b.roleCode,
    a.remark
FROM
	tb_system_user a
	LEFT JOIN tb_system_role b ON a.roleId = b.roleId 
WHERE
	1 = 1 
	AND a.delFlag = 0`;
    let params = [];
    if (!isNull(phone)) {
        sqlstr = sqlstr + ` and a.phone=? `;
        params.push(phone);
    }
    if (!isNull(userName)) {
        sqlstr = sqlstr + ` and a.userName=? `;
        params.push(userName);
    }
    if (!isNull(keyword)) {
        sqlstr = sqlstr + ` and ( a.userName like ? or a.phone like ? ) `;
        params.push(`%${keyword}%`, `%${keyword}%`);
    }
    sqlstr = sqlstr + ` order by a.createTime desc limit ? `;
    let pageNum = 1;
    let pageSize = 1000000;
    if (!isNull(req.query.pageNum)) pageNum = req.query.pageNum;
    if (!isNull(req.query.pageSize)) pageSize = req.query.pageSize;
    let limit = [(parseInt(pageNum) - 1) * parseInt(pageSize), parseInt(pageSize)];
    params.push(limit);

    sql.query(sqlStr1, params, (err, results) => {
        if (err) {
            console.error("err:", err);
            res.json({ resultCode: -1, resultInfo: sqlError[err.errno] });
        }
        total = results[0].total; // 获取查询结果中的总记录数
        sql.query(sqlstr, params, (err, results) => {
            if (err) {
                console.error("==>出错了:", err);
                res.json({ resultCode: -1, resultInfo: sqlError[err.errno] });
            }
            res.json({ resultCode: 0, resultInfo: "SUCCESS", data: { total, results } });
        });

    });
});

/**
 * @api {post} /api/system/user 1.4.新增用户 
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription 新增用户
 * @apiName createuser
 * @apiGroup System
 * @apiParam {string} userName 姓名
 * @apiParam {string} phone 手机号
 * @apiParam {string} email 邮箱
 * @apiParam {Int} organizationId 部门ID
 * @apiParam {Int} roleId 角色ID
 * @apiParam {Int} isActive 状态 0 未激活 1 已激活
 * @apiParam {string} remark 备注
 * @apiParamExample {json} Request-Example:
 *    {
 * 		"userName":"",
 * 		"phone":"",	
 * 		"email":"",
 *      "organizationId":"",
 *      "isActive":"",
 *      "remark":"",
 * 		"roleId":""
 *    }
 * @apiSuccess {json} resp_result
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /api/system/user
 * @apiVersion 1.0.0
 */
router.post('/', jwtMiddleWare, (req, res) => {
    let crypto = require('crypto');
    let md5 = crypto.createHash('md5');
    let userId = uuidv4();
    let { userName, phone, email, organizationId, roleId, isActive, remark } = req.body;
    let userNo = orderCode("S");
    let passWord = md5.update("123456");
    let delFlag = 0; //0 未删除
    passWord = md5.digest('hex').toUpperCase();
    isActive = isActive ?? 0;
    //todo 校验字段合法性
    sql.query(`select 1 from tb_system_user where (userName= ? or phone= ?) and delFlag= 0 `, [userName, phone], (err, result) => {
        if (err) {
            console.error("==>出错了:", err);
            res.json({ resultCode: -1, resultInfo: sqlError[err.errno] });
        } else {
            if (result && result.length > 0) {
                res.json({ resultCode: -1, resultInfo: "用户已存在" });
            } else {
                let sqlstr = `insert into tb_system_user (userId, userNo, userName, passWord, phone, 
					email, organizationId, roleId, isActive,delFlag,
					remark, createTime,creator,updateTime,updator) 
				values (?, ?, ?, ?, ?, 
					 ?, ?, ?, ?, ?,
					 ?, sysdate(),?,sysdate(),?)`;
                let params = [userId, userNo, userName, passWord, phone,
                    email, organizationId, roleId, isActive, delFlag,
                    remark, req.user.userName, req.user.userName];
                sql.query(sqlstr, params, (err) => {
                    if (err) {
                        console.error("==>出错了:", err);
                        res.json({ resultCode: -1, resultInfo: sqlError[err.errno] });
                    }
                    else {
                        res.json({ resultCode: 0, resultInfo: "SUCCESS" });
                    }
                });
            }
        }
    })
});

/**
 * @api {post} /system/user/delete 1.5.删除用户 
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription 删除用户
 * @apiName deleteuser
 * @apiGroup System
 * @apiParam {string} userId 用户id
 * @apiParamExample {json} Request-Example:
 *    {
 *      "userId": 1
 *    }
 * @apiSuccess {json} resp_result
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /system/user/delete
 * @apiVersion 1.0.0
 */
router.post('/delete', jwtMiddleWare, (req, res) => {
    const { userId } = req.body;
    let sqlStr = `update  tb_system_user set delFlag= 1  where userId=?`;
    sql.query(sqlStr, [userId], (err) => {
        if (err) {
            console.error("==>出错了:", err);
            res.json({ resultCode: -1, resultInfo: sqlError[err.errno] });
        }
        res.json({ resultCode: 0, resultInfo: "删除成功" });
    });
});

/**
 * @api {post} /system/user/update 1.6.编辑用户 
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription 6.编辑用户
 * @apiName updateuser
 * @apiGroup System
 * @apiParam {String} userId 用户编号
 * @apiParam {String} userName 姓名
 * @apiParam {String} email 邮箱
 * @apiParam {Int} organizationId 部门Id
 * @apiParam {Int} roleId 角色Id
 * @apiParam {Int} isActive 状态  0 不启用 1 启用
 * @apiParam {String} remark 备注
 * @apiParamExample {json} Request-Example:
 *     {
 *       "userId":"",
 *       "userName":"",
 *       "email":"",
 *       "organizationId":"",
 *       "remark":"",
 *       "isActive":"",
 *       "roleId":"",
 *     }
 * @apiSuccess {json} resp_result
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /system/user/update
 * @apiVersion 1.0.0
 */
router.post('/update', jwtMiddleWare, (req, res) => {
    const { userId, userName, email, organizationId, roleId, remark, isActive } = req.body;
    let sqlStr = `update tb_system_user set  userName=?, email=?, organizationId=?, roleId=?,isActive=?,remark=?, updateTime=sysdate() where userId=?`;
    let params = [userName, email, organizationId, roleId, isActive, remark, userId];
    sql.query(sqlStr, params, (err) => {
        if (err) {
            console.error("==>出错了:", err);
            res.json({ resultCode: -1, resultInfo: sqlError[err.errno] });
        } else {
            res.json({ resultCode: 0, resultInfo: "SUCCESS" });
        }
    });
});

/**
 * @api {post} /system/user/activeOnly 1.7.后台激活用户 
 * @apiHeader {string} [Authorization] 登录成功后返回token 
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription 后台激活用户 
 * @apiName activeOnly
 * @apiGroup System
 * @apiParam {string} userId 用户编号
 * @apiParam {int} isActive 是否激活
 * @apiParamExample {json} Request-Example:
 *    {
 *      "userId": "",
 *      "isActive":""
 *    }
 * @apiSuccess {json} resp_result
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /system/user/activeOnly
 * @apiVersion 1.0.0
 */
router.post('/activeOnly', jwtMiddleWare, (req, res) => {
    const { userId, isActive } = req.body;
    console.log("req.body:", req.body);
    let sqlStr = `update tb_system_user set isActive=?, updateTime=sysdate(), updator=? where userId=? `;
    let params = [parseInt(isActive), req.user.userName, userId];
    sql.query(sqlStr, params, (err) => {
        if (err) {
            console.error("err:", err.sqlMessage);
            res.json({ resultCode: -1, resultInfo: sqlError[err.errno] });
        }
        res.json({ resultCode: 0, resultInfo: "SUCCESS" });
    })
})

/**
 * @api {post} /system/user/headImage 1.8.上传头像 
 * @apiHeader {string} [Authorization] 登录成功后返回token 
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription 上传头像 
 * @apiName headImage
 * @apiGroup System
 * @apiParam {string} headImage 头像地址
 * @apiParamExample {json} Request-Example:
 *    {
 * 		"headImage":""
 *    }
 * @apiSuccess {json} resp_result
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /system/user/headImage
 * @apiVersion 1.0.0
 */
router.post('/headImage', jwtMiddleWare, (req, res) => {
    const { headImage } = req.body;
    sql.query(`update tb_system_user set headImage=?, updateTime=sysdate(), updator=? where userId=?`, [headImage, req.user.userName, req.user.userId], (err) => {
        if (err) {
            console.error("err:", err.sqlMessage);
            res.json({ resultCode: -1, resultInfo: sqlError[err.errno] });
        }
        res.json({ resultCode: 0, resultInfo: "SUCCESS" });
    })
})


/**
 * @api {post} /system/user/profile 1.9.修改个人信息
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription 修改个人信息
 * @apiName userProfile
 * @apiGroup System
 * @apiParam {string} [userName] 真实姓名
 * @apiParam {string} [email] 邮箱
 * @apiParam {string} [headImage] 头像
 * @apiSuccess {json} resp_result
 * @apiParamExample {json} Request-Example:
 *    {
 * 		"userName":"",
 * 		"email":"",
 * 		"headImage":""
 *    }
 * @apiSuccessExample {json} Success-Response:
 * {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /system/user/profile
 * @apiVersion 1.0.0
 */
router.post('/profile', jwtMiddleWare, function (req, res) {
	const { userName, email, headImage } = req.body;
	let params = [];
	let sqlStr = `update tb_system_user set updateTime=sysdate()`;
	if (userName != null || userName != "") {
		params.push(userName);
		sqlStr = sqlStr + `, userName=? `;
	}
	if (email != null || email != "") {
		params.push(email);
		sqlStr = sqlStr + `, email=? `;
	}
	if (headImage != null || headImage != "") {
		params.push(headImage);
		sqlStr = sqlStr + `, headImage=? `;
	}
	sqlStr = sqlStr + `  where userId=? `;
	params.push(req.user.userId);
	sql.query(sqlStr, params, (err, results) => {
		if (err) {
			console.error("err:", err.sqlMessage);
			res.json({ resultCode: -1, resultInfo: sqlError[err.errno] });
		}
		res.json({ resultCode: 0, resultInfo: "SUCCESS" });
	});
});

/**
 * @api {post} /system/user/password 1.10.修改个人密码
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription 修改个人密码
 * @apiName password
 * @apiGroup System
 * @apiParam {string} oldPassword 旧密码
 * @apiParam {string} newPassword 新密码
 * @apiParam {string} rePassword 确认密码
 * @apiSuccess {json} resp_result
 * @apiParamExample {json} Request-Example:
 *    {
 * 		"oldPassword":"",
 * 		"newPassword":"",
 * 		"rePassword":""
 *    }
 * @apiSuccessExample {json} Success-Response:
 * {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /system/user/password
 * @apiVersion 1.0.0
 */
router.post('/password', jwtMiddleWare, function (req, res) {
	const { oldPassword, newPassword, rePassword } = req.body;
	if (newPassword != rePassword) {
		throw new Exception(-1, "两次输入密码不一致");
	}
	let sqlStr1 = `select passWord from tb_system_user where userId=? and passWord=?`;
	sql.query(sqlStr1, [req.user.userId, oldPassword], (err, result) => {
		if (err) {
			console.error("err:", err.sqlMessage);
			res.json({ resultCode: -1, resultInfo: sqlError[err.errno] });
		}
		else {
			if (result.length == 0) {
				res.json({ resultCode: -1, resultInfo: "原密码不正确" });
			} else {
				let sqlStr2 = `update tb_system_user set passWord=?, updateTime=sysdate(), updator=? where userId=?`;
				sql.query(sqlStr2, [rePassword, req.user.userName, req.user.userId], (err, results) => {
					if (err) {
						console.error("err:", err.sqlMessage);
						res.json({ resultCode: -1, resultInfo: sqlError[err.errno] });
					}
					res.json({ resultCode: 0, resultInfo: "SUCCESS" });
				});
			}
		}
	});
});

/**
 * @api {post} /system/user/grantRole 1.11.用户授权角色
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription 用户授权角色
 * @apiName grantRole
 * @apiGroup System
 * @apiParam {String} userId 用户编号
 * @apiParam {Int} roleId 角色ID
 * @apiParamExample {json} Request-Example:
 *    {
 *      "userId": "",
 *      "roleId": ""
 *    }
 * @apiSuccess {json} resp_result
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /system/user/grantRole
 * @apiVersion 1.0.0
 */
router.post('/grantRole', jwtMiddleWare, (req, res) => {
	const { userId, roleId } = req.body;
	console.log("req.body:" + JSON.stringify(req.body));
	let sqlParamsEntity = [];
	let sqlStr2 = `update tb_system_user set roleId=? ,updateTime=sysdate(), updator=? where userId=? `;
	sqlParamsEntity.push(_getNewSqlParamEntity(sqlStr2, [roleId, req.user.userName, userId]));
	execTrans(sqlParamsEntity, function (err, info) {
		if (err) {
			console.error("事务执行失败");
			res.json({ resultCode: -1, message: err.sqlMessage });
		} else {
			res.json({ resultCode: 0, resultInfo: "SUCCESS" });
		}
	});
})


module.exports = router;