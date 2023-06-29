const express = require('express');
const router = express.Router();
const sql = require('../../config/db');
const expressJwt = require('express-jwt');
const jwtMiddleWare = expressJwt({ secret: 'dolphin.2020', algorithms: ['HS256'] });
const Exception = require('../../exception');
const { isNull } = require('../../utils/utils');
const { v4: uuidv4 } = require('uuid');
const sqlError = require('../../utils/sqlError');
const roleService = require('./roleService');

/**
 * @api {get} /system/role/list 2.1.角色列表
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
 * @apiSampleRequest /system/role/list
 * @apiVersion 1.0.0
 */
router.get('/list', jwtMiddleWare, (req, res) => {
	let { roleName } = req.query
	let sqlStr = `select roleId,roleCode,roleName,description,isActive,createTime,creator,updateTime,updator from tb_system_role  where 1=1  `
	let params = []
	if (!isNull(roleName)) {
		params.push(`%${roleName}%`)
		sqlStr += ` and roleName like ? `
	}
	sqlStr += ` order by createTime desc`;
	sql.query(sqlStr, params, (err, results) => {
		if (err) {
			console.error("==>出错了:", err);
			res.json({ resultCode: -1, resultInfo: sqlError[err.errno] });
		}
		res.json({ resultCode: 0, resultInfo: "SUCCESS", data: results });
	})
});


/**
 * @api {get} /system/role 2.2.角色分页列表
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription  角色分页列表
 * @apiName role
 * @apiGroup System
 * @apiParam {Int} [pageNum] 当前页
 * @apiParam {Int} [pageSize] 记录数
 * @apiParam {roleCode} [roleCode] 角色编号
 * @apiParam {String} [keyword] 关键字
 * 
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
	let { roleCode, keyword,  } = req.query
	let params = []
	let findOptions = []
	if (!isNull(roleCode)) {
		params.push(roleCode)
		findOptions.push({
			key: 'roleCode'
		})
	}
	if (!isNull(keyword)) {
		params.push(`%${keyword}%`)
		findOptions.push({
			key: '(roleName like ? )',
			type: 'original'
		})
	}

	let limit = null
	if (!isNull(req.query.pageNum) && !isNull(req.query.pageSize)) {
		let pageNum = req.query.pageNum;
		let pageSize = req.query.pageSize;
		limit = [(parseInt(pageNum) - 1) * parseInt(pageSize), parseInt(pageSize)];
	}
	let order = null
	roleService.findPageList(params, findOptions, limit, order).then(results => {
		let countResult = results[0]
		let dataResult = results[1]
		if (countResult.error) {
			console.log("countResult.error:", countResult.error);
			throw new Exception(-1, sqlError[countResult.error.errno])
		}
		if (dataResult.error) {
			console.log("dataResult.error:", dataResult.error);
			throw new Exception(-1, sqlError[dataResult.error.errno])
		}
		let total = 0
		if (countResult.result && countResult.result.length > 0) {
			total = countResult.result[0].total
			res.json({
				resultCode: 0, resultInfo: 'SUCCESS', data: {
					total,
					results: dataResult.result
				}
			})
		} else {
			res.json({
				resultCode: 0, resultInfo: 'SUCCESS', data: {
					total,
					results: []
				}
			})

		}
	}).catch(e => {
		res.json({ resultCode: -1, resultInfo: e.message || e })
	});
})








/**
 * @api {get} /system/role/active 2.3.已激活角色列表
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
	sql.query(`select * from tb_system_role where isActive = 1 order by roleId`, (err, results) => {
		if (err) {
			console.error("==>出错了:", err);
			res.json({ resultCode: -1, resultInfo: sqlError[err.errno] });
		}
		res.json({ resultCode: 0, resultInfo: "SUCCESS", data: results });
	})
});

/**
 * @api {get} /system/role/fuzzy 2.4.已冻结角色列表
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
router.get('/fuzzy', jwtMiddleWare, function (req, res) {
	const { roleName } = req.query;
	let str = `select * from tb_system_role `;
	if (roleName) {
		str += `where roleName like '%${roleName}%'`
	}
	str += 'order by createTime desc';
	sql.query(str, (err, results) => {
		if (err) {
			console.error("==>出错了:", err);
			res.json({ resultCode: -1, resultInfo: sqlError[err.errno] });
		}
		res.json({ resultCode: 0, resultInfo: "", data: results });
	})
});

/**
 * @apiIgnore
 * @api {post} /system/role/active 2.5.激活角色 
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
	const { roleId, isActive } = req.body;
	sql.query(`update tb_system_role set isActive=?, updateTime=sysdate(),updator=? where roleId=?`, [isActive, req.user.name, roleId], (err) => {
		if (err) {
			console.error("==>出错了:", err);
			res.json({ resultCode: -1, resultInfo: sqlError[err.errno] });
		}
		res.json({ resultCode: 0, resultInfo: "SUCCESS" });
	})
});

/**
 * @api {post} /system/role/delete 2.6.删除角色 
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
	const { roleId } = req.body;
	sql.query(`select 1 from ts_o_system_user where delFlag= 0 and  roleId=?`, [roleId], (err, results) => {
		if (err) {
			console.error("==>出错了:", err);
			res.json({ resultCode: -1, resultInfo: sqlError[err.errno] });
		}
		if (results.length > 0) {
			res.json({ resultCode: -1, resultInfo: "该角色已被用户绑定，不允许直接删除" });
			return;
		}
		else {
			sql.query(`delete from tb_system_role where roleId=?`, [roleId], (err) => {
				if (err) res.json({ resultCode: -1, resultInfo: err.sqlMessage })
				res.json({ resultCode: 0, resultInfo: "角色删除成功" })
			})
		}
	})
});

/**
 * @api {post} /system/role 2.7.新增角色 
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
	console.log('req.user---->', req.user);
	const { roleName, description } = req.body;
	if (isNull(roleName)) throw new Exception(-1, "请求参数不可为空");
	sql.query(`select 1 from tb_system_role where roleName=?`, [roleName], (err, results) => {
		if (err) {
			console.error("==>出错了:", err);
			res.json({ resultCode: -1, resultInfo: sqlError[err.errno] });
		}
		if (results.length > 0) {
			res.json({ resultCode: -1, resultInfo: "角色名称重复" })
		}
		else {
			let roleCode = uuidv4();
			let sqlStr = `insert into tb_system_role (roleCode, roleName, description,isActive,createTime, creator,updateTime,updator) 
			values (?, ?, ?,0,sysdate(), ?, sysdate(), ?)`;
			let params = [roleCode, roleName, description, req.user.name, req.user.name];
			console.log("sqlStr:", sqlStr);
			console.log("params:", params);
			sql.query(sqlStr, params, (err) => {
				if (err) {
					console.error("==>出错了:", err);
					res.json({ resultCode: -1, resultInfo: sqlError[err.errno] });
				}
				res.json({ resultCode: 0, resultInfo: "新建成功" })
			})
		}
	})
});

/**
 * @api {post} /system/role/name 2.8.编辑角色 
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
 * @apiParam {string} description 角色描述
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
	const { roleName, roleId, description } = req.body;
	sql.query(`select 1 from tb_system_role where roleName=?`, [roleName], (err, results) => {
		if (err) {
			console.error("==>出错了:", err);
			res.json({ resultCode: -1, resultInfo: sqlError[err.errno] });
		}
		else {
			sql.query(`update tb_system_role set roleName=?,description=?,updateTime=sysdate(),updator=? where roleId=?`,
				[roleName, description, req.user.name, roleId], (err) => {
					if (err) res.json({ resultCode: -1, resultInfo: sqlError[err.errno] })
					res.json({ resultCode: 0, resultInfo: "SUCCESS" })
				})
		}
	})
});

/**
 * @api {post} /system/role/isActive 2.9.激活角色 
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription 7.激活角色
 * @apiName updateRoleName
 * @apiGroup System
 * @apiParam {string} roleName 名称
 * @apiParam {string} roleID id
 * @apiParam {string} description 角色描述
 * @apiParamExample {json} Request-Example:
 *    {
 *      "roleId": "",
 *    }
 * @apiSuccess {json} resp_result
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /system/role/isActive
 * @apiVersion 1.0.0
 */
router.post('/isActive', jwtMiddleWare, (req, res) => {
	const { roleId, isActive } = req.body;
	sql.query(`update tb_system_role set isActive=?,updateTime=sysdate(),updator=? where roleId=?`, [isActive, req.user.name, roleId], (err) => {
		if (err) res.json({ resultCode: -1, resultInfo: sqlError[err.errno] })
		res.json({ resultCode: 0, resultInfo: "SUCCESS" })
	})
});

module.exports = router;