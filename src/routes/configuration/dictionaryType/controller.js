const express = require('express');
const router = express.Router();
const jwtMiddleWare = require('../../../utils/middleWare');
const { isNull, _get, orderNo } = require('../../../utils/utils');
const Exception = require('../../../exception');
const sd = require('silly-datetime');
const service = require('./service');
const sqlError = require('../../../utils/sqlError');

/**
 * @api {post} /configuration/dictionaryType 1.1.新增字典类型
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription  新增字典类型
 * @apiName dictionaryType-createOne
 * @apiGroup dictionaryType	
 * @apiParam {string} moduleName 模块名称	
 * @apiParam {string} pageName 页面名称	
 * @apiParam {string} name 函数名称	
 * @apiParam {string} remark 备注	
 * @apiParamExample {json} Request-Example:
 *  {
 *    "moduleName": "",
 *    "pageName": "",
 *    "name": "",
 *    "remark": ""
 * }
 * @apiSuccess {json} resp_result
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /configuration/dictionaryType
 * @apiVersion 1.0.0
 */
router.post('/', jwtMiddleWare, (req, res) => {
	let currentTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
	let { moduleName, pageName, name, remark } = req.body
	let params =
	{
		moduleName, pageName, name, remark,
		createTime: currentTime,
		creator: req.user.userName,
		updateTime: currentTime,
		updator: req.user.userName,
		delFlag: 0
	}
	service.findAll([name], [{
		key: 'd.name'
	}]).then(result => {
		if (result.error) {
			console.log("出错了===>", result.error);
			res.json({ resultCode: -1, resultInfo: sqlError[result.error.errno] })
		} else {
			if (result.result && result.result.length > 0) {
				res.json({ resultCode: -1, resultInfo: '函数已存在' })
			} else {
				service.createOne(params).then(result => {
					if (result.error) {
						console.log("出错了===>", result.error);
						res.json({ resultCode: -1, resultInfo: sqlError[result.error.errno] })
					} else {
						res.json({ resultCode: 0, resultInfo: '新增成功' })
					}
				})
			}
		}
	})
});

/**
 * @api {put} /configuration/dictionaryType/detail/:refId 1.2.修改字典类型
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription 修改字典类型
 * @apiName dictionaryType-updateById
 * @apiGroup dictionaryType
 * @apiParam {string} refId id	
 * @apiParam {string} moduleName 模块名称	
 * @apiParam {string} pageName 页面名称	
 * @apiParam {string} name 函数名称	
 * @apiParam {string} remark 备注	

 * @apiParamExample {json} Request-Example:
 *  {
 *    "moduleName": "",
 *    "pageName": "",
 *    "name": "",
 *    "remark": ""
 *  }
 * @apiSuccess {json} resp_result
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /configuration/dictionaryType/detail/:refId
 * @apiVersion 1.0.0
 */
router.put('/detail/:refId', jwtMiddleWare, (req, res) => {
	let currentTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
	let { moduleName, pageName, name, remark } = req.body
	let { refId } = req.params
	let params = [
		{
			moduleName, pageName, name, remark,
			updateTime: currentTime,
			updator: req.user.userName
		}, refId
	]

	service.findAll([name], [{
		key: 'd.name'
	}]).then(result => {
		if (result.error) {
			res.json({ resultCode: -1, resultInfo: sqlError[result.error.errno] })
		} else {
			if (result.result && result.result.length > 0 && result.result.some(o => o.refId != refId)) {
				res.json({ resultCode: -1, resultInfo: '字典已存在' })
			} else {
				service.updateById(params).then(result => {
					if (result.error) {
						res.json({ resultCode: -1, resultInfo: sqlError[result.error.errno] })
					} else {
						res.json({ resultCode: 0, resultInfo: "编辑成功" })
					}
				})
			}
		}
	})
});

/**
 * @api {delete} /configuration/dictionaryType/detail/:refId 1.3.删除字典类型
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription  删除字典类型
 * @apiName dictionaryType-deleteById
 * @apiGroup dictionaryType
 * @apiParam {string} refId 字典id
 * @apiSuccessExample {json} Success-Response:
 * {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /configuration/dictionaryType/detail/:refId
 * @apiVersion 1.0.0
 */
router.delete('/detail/:refId', jwtMiddleWare, (req, res) => {
	let { refId } = req.params;
	let params = [{
		delFlag: 1
	}, refId];
	service.updateById(params).then(result => {
		if (result.error) {
			res.json({ resultCode: -1, resultInfo: sqlError[result.error.errno] })
		} else {
			res.json({ resultCode: 0, resultInfo: "删除成功" })
		}
	})
})

/**
 * @api {get} /configuration/dictionaryType/detail/:refId 1.4.获取字典类型
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription  获取字典类型
 * @apiName dictionaryType-findById
 * @apiGroup dictionaryType
 * @apiParam {int} refId 字典id
 * @apiSuccessExample {json} Success-Response:
 * {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /configuration/dictionaryType/detail/:refId
 * @apiVersion 1.0.0
 */
router.get('/detail/:refId', jwtMiddleWare, (req, res) => {
	let { refId } = req.params;
	let params = [refId];
	service.findById(params).then(result => {
		if (result.error) {
			res.json({ resultCode: -1, resultInfo: sqlError[result.error.errno] })
		} else {
			if (result.result && result.result.length > 0) {
				res.json({ resultCode: 0, resultInfo: "SUCCESS", data: result.result[0] })
			} else {
				res.json({ resultCode: -1, resultInfo: "未查询到该字典" })
			}
		}
	})
})

/**
 * @api {get} /configuration/dictionaryType 1.7.字典类型分页列表
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription  字典类型分页列表
 * @apiName dictionaryType-list
 * @apiGroup dictionaryType
 * @apiParam {Int} [pageNum] 当前页
 * @apiParam {Int} [pageSize] 记录数
 * @apiParam {String} [moduleName] 模块名称
 * @apiParam {String} [pageName] 页面名称
 * @apiParam {String} [name] 函数名称
 * 
 * @apiSuccessExample {json} Success-Response:
 * {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /configuration/dictionaryType
 * @apiVersion 1.0.0
 */
router.get('/', jwtMiddleWare, (req, res) => {
	let { moduleName, pageName, name } = req.query
	let params = []
	let findOptions = []
	if (!isNull(moduleName)) {
		params.push(moduleName)
		findOptions.push({
			key: 'd.moduleName',
		})
	}
	if (!isNull(pageName)) {
		params.push(pageName)
		findOptions.push({
			key: 'd.pageName'
		})
	}
	if (!isNull(name)) {
		params.push(name)
		findOptions.push({
			key: 'd.name'
		})
	}
	

	let limit = null
	if (!isNull(req.query.pageNum) && !isNull(req.query.pageSize)) {
		let pageNum = req.query.pageNum;
		let pageSize = req.query.pageSize;
		limit = [(parseInt(pageNum) - 1) * parseInt(pageSize), parseInt(pageSize)];
	}
	let order = null
	service.findPageList(params, findOptions, limit, order).then(results => {
		let countResult = results[0]
		let dataResult = results[1]
		if (countResult.error) {
			throw new Exception(-1, sqlError[countResult.error.errno])
		}
		if (dataResult.error) {
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

module.exports = router;