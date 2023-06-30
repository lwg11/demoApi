const express = require('express');
const router = express.Router();
const sql = require('../../config/db');
const { getClientIP, isNull, toMenuTree, orderCode } = require('../../utils/utils');
const sd = require('silly-datetime');
const sqlError = require('../../utils/sqlError');
const Exception = require('../../exception');
const userService = require('./userService');
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


/**
 * @api {post} /system/menu 4.2.新增菜单 
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription 新增菜单
 * @apiName createMenu
 * @apiGroup System
 * @apiParam {String} menuName 菜单名称
 * @apiParam {Int} menuType 菜单类型
 * @apiParam {Int} parentId 父菜单ID
 * @apiParam {String} menuCode 菜单代码
 * @apiParam {String} rightCode 权限代码
 * @apiParam {String} menuSort 排序
 * @apiParam {String} menuIcon 图标
 * @apiParam {String} menuUrl 路径
 * @apiParamExample {json} Request-Example:
 *    {
 *      "menuName": "",
 *      "menuType": "",
 * 		"parentId":"",
 * 		"menuCode":"",
 * 		"rightCode":"",
 * 		"menuSort":"",
 * 		"menuIcon":"",
 * 		"menuUrl":""
 *    }
 * @apiSuccess {json} resp_result
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /system/menu
 * @apiVersion 1.0.0
 */
router.post('/', jwtMiddleWare, (req, res) => {
	const {menuName,menuType,parentId,menuCode,rightCode,menuSort,menuUrl,menuIcon} = req.body;
	let sqlStr1=`select 1 from tb_system_menu where parentId=? and menuName=?`;
	sql.query(sqlStr1, [parentId, menuName], (err, results) => {
		if(err){
			console.error("==>出错了:",err);
			res.json({resultCode: -1, resultInfo:  sqlError[err.errno]});
		}
		if (results.length > 0)
		{
			res.json({resultCode: -1, resultInfo: "子菜单重名"})
		}
		else {
			let sqlStr2=`insert into tb_system_menu (menuName,menuType,parentId,menuCode,rightCode,menuSort,menuUrl,menuIcon,menuState,createTime,creator,updateTime,updator) values ( ?, ?, ?, ?, ?, ?, ?, ?, ?,sysdate(),?,sysdate(),?)`;
			sql.query(sqlStr2, [menuName,menuType,parentId,menuCode,rightCode,menuSort,menuUrl,menuIcon,1,req.user.userName,req.user.userName], (err) => {
				if (err) {
					console.error("==>出错了:",err);
					res.json({resultCode: -1, resultInfo:  sqlError[err.errno]});
				}
				res.json({resultCode: 0, resultInfo: "SUCCESS"})
			})
		}
	})
})

/**
 * @api {post} /system/menu/update 4.3.修改菜单 
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription 修改菜单 
 * @apiName updateMenu
 * @apiGroup System
 * @apiParam {Int} menuId 菜单Id
 * @apiParam {String} menuName 菜单名称
 * @apiParam {String} menuType 菜单类型
 * @apiParam {Int} parentId 父ID
 * @apiParam {String} menuCode 菜单代码
 * @apiParam {String} rightCode 权限代码
 * @apiParam {String} menuSort 排序
 * @apiParam {String} menuIcon 图标
 * @apiParam {String} menuUrl 路径
 * @apiParam {String} menuState 状态
 * @apiParamExample {json} Request-Example:
 *    {
 *      "menuId": "",
 *      "menuName": "",
 *      "menuType": "",
 * 		"parentId":"",
 * 		"menuCode":"",
 * 		"rightCode":"",
 * 		"menuSort":"",
 * 		"menuIcon":"",
 * 		"menuUrl":"",
 * 		"menuState":""
 *    }
 * @apiSuccess {json} resp_result
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /system/menu/update
 * @apiVersion 1.0.0
 */
router.post('/update', jwtMiddleWare, (req, res) => {
	const {menuName,menuType,parentId,menuCode,rightCode,menuSort,menuUrl,menuIcon,menuState,menuId} = req.body;
	let sqlStr1=`select 1 from tb_system_menu where parentId=(select parentId from tb_system_menu where menuId=?) and menuName=?`;
	sql.query(sqlStr1, [menuId, menuName], (err, results) => {
		if(err) {
			console.error("==>出错了:",err);
			res.json({resultCode: -1, resultInfo:  sqlError[err.errno]});
		}
		else {
			let sqlStr2=`update tb_system_menu set menuName=?, menuType=?, parentId=?, menuCode=?, rightCode=?, menuSort=?, menuUrl=?, menuIcon=?, menuState=?,updateTime=sysdate(),updator=? where menuId=?`;
			sql.query(sqlStr2, [menuName,menuType,parentId,menuCode,rightCode,menuSort,menuUrl,menuIcon,menuState,req.user.userName,menuId], (err) => {
				if(err) {
					console.error("==>出错了:",err);
					res.json({resultCode: -1, resultInfo:  sqlError[err.errno]});
				}
				res.json({resultCode: 0, resultInfo: "SUCCESS"});
			})
		}
	})
});

/**
 * @api {post} /system/menu/delete 4.4.删除菜单 
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription 删除菜单
 * @apiName deleteMenu
 * @apiGroup System
 * @apiParam {String} menuId  菜单Id
 * @apiParamExample {json} Request-Example:
 *    {
 * 		"menuId":""
 *    }
 * @apiSuccess {json} resp_result
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /system/menu/delete
 * @apiVersion 1.0.0
 */
router.post('/delete', jwtMiddleWare, (req, res) => {
	const {menuId} = req.body;
	sql.query(`select 1 from tb_system_menu where parentId=?`, [menuId], (err, results) => {
		if (err) {
			console.error("==>出错了:",err);
			res.json({resultCode: -1, resultInfo:  sqlError[err.errno]});
		}
		if (results.length > 0)
		{
			res.json({resultCode: -1, resultInfo: "存在子菜单，不能删除"});
			return;
		}
		sql.query(`select 1 from ts_o_system_role_menu where menuId=?`, [menuId], (err, checkRole) => {
			if (err) {
				console.error("==>出错了:",err);
				res.json({resultCode: -1, resultInfo:  sqlError[err.errno]});
			}
			if (checkRole.length > 0) {
				res.json({resultCode: -1, resultInfo: "菜单已被授权角色，不能删除"});
				return;
			}
			else {
				sql.query(`delete from tb_system_menu where menuId=?`, [menuId], (err) => {
					if (err) {
						console.error("==>出错了:",err);
						res.json({resultCode: -1, resultInfo:  sqlError[err.errno]});
					}
					res.json({resultCode: 0, resultInfo: "菜单删除成功"});
				})
			}
		})
	})
});



module.exports = router;
