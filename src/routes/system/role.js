const express = require('express');
const router = express.Router();
const sql = require('../../config/db');
const expressJwt = require('express-jwt');
const jwtMiddleWare = expressJwt({ secret: 'dolphin.2020', algorithms: ['HS256'] });
const Exception = require('../../exception');
const {isNull} = require('../../utils/utils');
const { v4: uuidv4 } = require('uuid');
const sqlError=require('../../utils/sqlError');

/**
 * @api {get} /system/role 2.1.角色列表
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription 角色列表
 * @apiName getRoles
 * @apiGroup System
 *  * @apiParam {string} roleName 角色名称
 * @apiSuccessExample {json} Success-Response:
 * {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /system/role
 * @apiVersion 1.0.0
 */
router.get('/', jwtMiddleWare, (req, res) => {
	let {roleName} = req.query
	let sqlStr=`select roleId,roleCode,roleName,createTime,creator,updateTime,updator from ts_system_role  where 1=1  `
	let params = []
	if(!isNull(roleName)){
		params.push(`%${roleName}%`)
		sqlStr += ` and roleName like ? `
	}
	sqlStr += ` order by createTime desc`;

	sql.query(sqlStr,params, (err, results) => {
		if (err) {
			console.error("==>出错了:",err);
			res.json({resultCode: -1, resultInfo:  sqlError[err.errno]});
		}
		res.json({resultCode: 0, resultInfo: "SUCCESS", data: results});
	})
});

/**
 * @api {get} /system/role/active 2.2.已激活角色列表
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription 2.已激活角色列表
 * @apiName getActiveRoles
 * @apiGroup System
 * @apiSuccessExample {json} Success-Response:
 * {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /system/role/active
 * @apiVersion 1.0.0
 */

router.get('/active', jwtMiddleWare, (req, res) => {
	sql.query(`select * from ts_system_role where isActive = 1 order by roleId`, (err, results) => {
		if (err) {
			console.error("==>出错了:",err);
			res.json({resultCode: -1, resultInfo:  sqlError[err.errno]});
		}
		res.json({resultCode: 0, resultInfo: "SUCCESS", data: results});
	})
});

/**
 * @api {get} /system/role/fuzzy 2.3.已冻结角色列表
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription 已冻结角色列表
 * @apiName getFuzzyRoles
 * @apiGroup System
 * @apiParam {string} roleName 角色名称
 * @apiSuccessExample {json} Success-Response:
 * {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /system/role/fuzzy
 * @apiVersion 1.0.0
 */
router.get('/fuzzy', jwtMiddleWare, function(req, res) {
	const {roleName} = req.query;
	let str = `select * from ts_system_role `;
	if(roleName){
		str += `where roleName like '%${roleName}%'`
	}
	str += 'order by createTime desc';
	sql.query(str, (err, results) => {
		if (err) {
			console.error("==>出错了:",err);
			res.json({resultCode: -1, resultInfo:  sqlError[err.errno]});
		}
		res.json({resultCode: 0, resultInfo: "", data: results});
	})
});

/**
 * @apiIgnore
 * @api {post} /system/role/active 2.4.激活角色 
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription 激活角色
 * @apiName activeRole
 * @apiGroup System
 * @apiParam {int} roleId 角色ID
 * @apiParam {int} isActive 是否激活
 * @apiParamExample {json} Request-Example:
 *    {
 *      "roleId": "",
 * 		"isActive":""
 *    }
 * @apiSuccess {json} resp_result
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /system/role/active
 * @apiVersion 1.0.0
 */
router.post('/active', jwtMiddleWare, (req, res) => {
	const {roleId, isActive} = req.body;
	sql.query(`update ts_system_role set isActive=?, updateTime=sysdate(),updator=? where roleId=?`, [isActive, req.user.userName, roleId], (err) => {
		if (err) {
			console.error("==>出错了:",err);
			res.json({resultCode: -1, resultInfo:  sqlError[err.errno]});
		}
		res.json({resultCode: 0, resultInfo: "SUCCESS"});
	})
});

/**
 * @api {post} /system/role/delete 2.5.删除角色 
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription 2.5.删除角色
 * @apiName deleteRole
 * @apiGroup System
 * @apiParam {int} roleId 角色ID
 * @apiParamExample {json} Request-Example:
 *    {
 *      "roleId": ""
 *    }
 * @apiSuccess {json} resp_result
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /system/role/delete
 * @apiVersion 1.0.0
 */
router.post('/delete', jwtMiddleWare, (req, res) => {
	const {roleId} = req.body;
	sql.query(`select 1 from ts_o_system_user where delFlag= 0 and  roleId=?`, [roleId], (err, results) => {
		if (err) {
			console.error("==>出错了:",err);
			res.json({resultCode: -1, resultInfo:  sqlError[err.errno]});
		}
		if (results.length > 0)
		{
			res.json({resultCode: -1, resultInfo: "该角色已被用户绑定，不允许直接删除"});
			return;
		}
    else{
      sql.query(`delete from ts_system_role where roleId=?`, [roleId], (err) => {
        if (err) res.json({resultCode: -1, resultInfo: err.sqlMessage})
        res.json({resultCode: 0, resultInfo: "角色删除成功"})
      })
    }
	})
});

/**
 * @api {post} /system/role 2.6.新增角色 
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription 新增角色
 * @apiName createRole
 * @apiGroup System
 * @apiParam {string} roleName 角色名称
 * @apiParam {string} description 描述
 * @apiParamExample {json} Request-Example:
 *    {
 *      "roleName": "",
 *      "description": ""
 *    }
 * @apiSuccess {json} resp_result
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /system/role
 * @apiVersion 1.0.0
 */
router.post('/', jwtMiddleWare, (req, res) => {
	const {roleName,description} = req.body;
	if(isNull(roleName)) throw new Exception(-1,"请求参数不可为空");
	sql.query(`select 1 from ts_system_role where roleName=?`, [roleName], (err, results) => {
		if(err) {
			console.error("==>出错了:",err);
			res.json({resultCode: -1, resultInfo:  sqlError[err.errno]});
		}
		if (results.length > 0)
		{
			res.json({resultCode: -1, resultInfo: "角色名称重复"})
		}
		else {
			let roleCode=uuidv4();
			let sqlStr=`insert into ts_system_role (roleCode, roleName, description,createTime, creator,updateTime,updator) values (?, ?, ?,sysdate(), ?, sysdate(), ?)`;
			let params=[roleCode,roleName,description,req.user.userName,req.user.userName];
			console.log("sqlStr:",sqlStr);
			console.log("params:",params);
			sql.query(sqlStr, params, (err) => {
				if(err) {
					console.error("==>出错了:",err);
					res.json({resultCode: -1, resultInfo:  sqlError[err.errno]});
				}
				res.json({resultCode: 0, resultInfo: "新建成功"})
			})
		}
	})
});

/**
 * @api {post} /system/role/name 2.7.编辑角色 
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription 7.编辑角色
 * @apiName updateRoleName
 * @apiGroup System
 * @apiParam {string} roleName 名称
 * @apiParam {string} roleID id
 * @apiParam {string} description 请求类型
 * @apiParamExample {json} Request-Example:
 *    {
 *      "roleName": "",
 *      "roleID": "",
 *      "description": ""
 *    }
 * @apiSuccess {json} resp_result
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /system/role/name
 * @apiVersion 1.0.0
 */
router.post('/name', jwtMiddleWare, (req, res) => {
	const {roleName, roleId,description} = req.body;
	sql.query(`select 1 from ts_system_role where roleName=?`, [roleName], (err, results) => {
		if(err) {
			console.error("==>出错了:",err);
			res.json({resultCode: -1, resultInfo:  sqlError[err.errno]});
		}
		else {
			sql.query(`update ts_system_role set roleName=?,description=?,updateTime=sysdate(),updator=? where roleId=?`, [roleName, description,req.user.userName, roleId], (err) => {
				if (err) res.json({resultCode: -1, resultInfo: sqlError[err.errno]})
				res.json({resultCode: 0, resultInfo: "SUCCESS"})
			})
		}
	})
});

module.exports = router;