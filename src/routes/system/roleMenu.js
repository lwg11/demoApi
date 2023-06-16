const express = require('express');
const router = express.Router();
const sql = require('../../config/db');
const { execTrans, _getNewSqlParamEntity, toMenuTree } = require('../../utils/utils');
const sqlError = require('../../utils/sqlError');
const jwtMiddleWare = require('../../utils/middleWare');

/**
 * @api {get} /system/rolemenu 3.1.所有角色菜单列表
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription 所有角色菜单列表
 * @apiName getAllRoleMenus
 * @apiGroup System
 * @apiSuccessExample {json} Success-Response:
 * {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /system/rolemenu
 * @apiVersion 1.0.0
 */
router.get('/', jwtMiddleWare, (req, res) => {
	let sqlStr = `SELECT a.roleId,a.level,b.roleCode,b.roleName,a.menuId,c.menuCode,c.menuName,c.parentId,c.menuSort,c.createTime,c.creator,c.updateTime,c.updator 
	FROM tb_system_role_menu a
	left join tb_system_role b on a.roleId=b.roleId
	left join tb_system_menu c on a.menuId=c.menuId
	where 1=1 
	order by c.parentId,a.menuId,c.menuSort`;
	console.log("sqlStr:", sqlStr);
	sql.query(sqlStr, (err, results) => {
		if (err) {
			console.error("err:", err.sqlMessage);
			res.json({ resultCode: -1, resultInfo: sqlError[err.errno] });
		}
		else {
			let menu = toMenuTree(results);
			res.json({ resultCode: 0, resultInfo: "SUCCESS", data: menu });
		}
	})
})

/**
 * @api {post} /system/roleMenu/bind 3.2.角色绑定菜单  
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription 角色绑定菜单  
 * @apiName bindRoleMenu
 * @apiGroup System
 * @apiParam {Int} roleId 角色Id
 * @apiParam {Array} menus 菜单列表
 * @apiParamExample {json} Request-Example:
 *    {
 *      "roleId": "",
 *  	"menus":[
 * 	         {
 * 				"menuId":"",
 * 				"level":""
 * 				}
 * 		]
 *    }
 * @apiSuccess {json} resp_result
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /system/roleMenu/bind
 * @apiVersion 1.0.0
 */

//在给定的代码中，通过执行delete语句删除特定 roleId 的记录的目的是为了在重新绑定角色与菜单之前清除现有的绑定关系。
// 在这种情况下，可能存在以下情景：
// 角色与菜单之间的绑定关系需要更新，例如，角色的权限发生了变化，需要重新分配菜单。
// 在重新绑定之前，需要先删除旧的绑定关系，以确保不会出现重复或冗余的记录。
// 通过执行delete语句删除特定 roleId 的记录，可以清除旧的绑定关系，为后续的插入操作提供一个干净的状态。
// 因此，这段代码中的 delete 语句的作用是清除指定 roleId 的记录，为接下来的重新绑定操作做准备。

router.post('/bind', jwtMiddleWare, (req, res) => {
	const { roleId, menus } = req.body;
	console.log("menus:", menus);
	let sqlParamsEntity = [];
	let sqlStr1 = `delete from tb_system_role_menu where roleId=?`;
	sqlParamsEntity.push(_getNewSqlParamEntity(sqlStr1, [roleId]));
	if (menus != null && menus.length > 0) {
		sqlParamsEntity.push(_getNewSqlParamEntity(`insert into tb_system_role_menu 
		(roleId,menuId,createTime,creator,updateTime,updator,level) 
		values ${menus.map(o => `(?,?,sysdate(),?,sysdate(),?,?)`).join(" , ")}`
			, menus.map(o =>
				[roleId, o.menuId, req.user.name, req.user.name, o.level]
			).flat())
		)
	}
	execTrans(sqlParamsEntity, err => {
		if (err) {
			console.error("err:", err.sqlMessage);
			res.json({ resultCode: -1, resultInfo: sqlError[err.errno] });
		} else {
			res.json({ resultCode: 0, resultInfo: "绑定成功" });
		}
	})

})

/**
 * @api {get} /system/rolemenu/:roleId 3.3.角色已绑菜单列表
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription 角色已绑菜单列表
 * @apiName getRoleMenus
 * @apiGroup System
 * @apiParam {Int} roleId 角色Id

 * @apiSuccessExample {json} Success-Response:
 * {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /system/rolemenu/:roleId
 * @apiVersion 1.0.0
 */
router.get('/:roleId', jwtMiddleWare, (req, res) => {
	const { roleId } = req.params;
	console.log("req.params:", req.params);
	let sqlStr = `SELECT a.roleId,a.level,b.roleCode,b.roleName,a.menuId,c.menuCode,c.menuName,c.parentId,c.menuSort,c.createTime,c.creator,c.updateTime,c.updator 
	FROM tb_system_role_menu a
	left join tb_system_role b on a.roleId=b.roleId
	left join tb_system_menu c on a.menuId=c.menuId
	where 1=1 
	and a.roleId= ? 
	order by c.parentId,a.menuId,c.menuSort`;
	console.log("sqlStr:", sqlStr);
	sql.query(sqlStr, roleId, (err, results) => {
		if (err) {
			console.error("err:", err.sqlMessage);
			res.json({ resultCode: -1, resultInfo: sqlError[err.errno] });
		}
		else {
			let menuIds = []
			results.map(element => {
				menuIds.push(element.menuId);
			});
			res.json({ resultCode: 0, resultInfo: "SUCCESS", data: results });
		}
	})
})

module.exports = router;
