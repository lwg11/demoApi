const express = require('express');
const router = express.Router();
const jwtMiddleWare = require('../../../utils/middleWare');
const { isNull, _get, orderNo } = require('../../../utils/utils');
const Exception = require('../../../exception');
const sd = require('silly-datetime');
const service = require('./service');
const sqlError = require('../../../utils/sqlError');

/**
 * @api {post} /configuration/dictionary 1.1.新增字典
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription  新增字典
 * @apiName dictionary-createOne
 * @apiGroup dictionary	
 * @apiParam {string} pageType 字典类型id	
 * @apiParam {string} labelValue 键值	
 * @apiParam {string} remark 备注	
 * @apiParamExample {json} Request-Example:
 *  {
 *    "pageType": "",
 *    "labelValue": "",
 *    "remark": ""
 * }
 * @apiSuccess {json} resp_result
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /configuration/dictionary
 * @apiVersion 1.0.0
 */
router.post('/', jwtMiddleWare, (req, res) => {
	let currentTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
	let { pageType, labelValue, remark } = req.body
	let params =
	{
		pageType, labelValue, remark,
		createTime: currentTime,
		creator: req.user.userName,
		updateTime: currentTime,
		updator: req.user.userName,
		delFlag: 0
	}
	service.createOne(params).then(result => {
		if (result.error) {
			console.log("出错了===>", result.error);
			res.json({ resultCode: -1, resultInfo: sqlError[result.error.errno] })
		} else {
			res.json({ resultCode: 0, resultInfo: '新增成功' })
		}
	})

});

/**
 * @api {put} /configuration/dictionary/detail/:refId 1.2.修改字典
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription 修改字典
 * @apiName dictionary-updateById
 * @apiGroup dictionary
 * @apiParam {string} pageType 字典类型id	
 * @apiParam {string} labelValue 键值
 * @apiParam {string} remark 备注	

 * @apiParamExample {json} Request-Example:
 *  {
 *    "pageType": "",
 *    "labelValue": "",
 *    "remark": ""
 * }
 * @apiSuccess {json} resp_result
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /configuration/dictionary/detail/:refId
 * @apiVersion 1.0.0
 */
router.put('/detail/:refId', jwtMiddleWare, (req, res) => {
	let currentTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
	let { pageType, labelValue, remark } = req.body
	let { refId } = req.params
	let params = [
		{
			pageType, labelValue, remark,
			updateTime: currentTime,
			updator: req.user.userName
		}, refId
	]
	service.updateById(params).then(result => {
		if (result.error) {
			res.json({ resultCode: -1, resultInfo: sqlError[result.error.errno] })
		} else {
			res.json({ resultCode: 0, resultInfo: "编辑成功" })
		}
	})

});

/**
 * @api {delete}  /configuration/dictionary/detail/:refId 1.3.删除字典
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription  删除商品
 * @apiName dictionary-deleteById
 * @apiGroup dictionary
 * @apiParam {string} refId 字典id
 * @apiSuccessExample {json} Success-Response:
 * {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest  /configuration/dictionary/detail/:refId
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
 * @api {get} /configuration/dictionary/detail/:refId 1.4.获取字典
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription  获取字典
 * @apiName dictionary-findById
 * @apiGroup dictionary
 * @apiParam {int} refId 字典id
 * @apiSuccessExample {json} Success-Response:
 * {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /configuration/dictionary/detail/:refId
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
 * @api {get} /configuration/dictionary 1.7.字典分页列表
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription  字典分页列表
 * @apiName dictionary-list
 * @apiGroup dictionary
 * @apiParam {Int} [pageNum] 当前页
 * @apiParam {Int} [pageSize] 记录数
 * @apiParam {int} [refId] 字典id
 * @apiParam {String} [pageType] 字典类型
 * 
 * @apiSuccessExample {json} Success-Response:
 * {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /configuration/dictionary
 * @apiVersion 1.0.0
 */
router.get('/', jwtMiddleWare, (req, res) => {
	let { refId, pageType } = req.query
	let params = []
	let findOptions = []
	if (!isNull(refId)) {
		params.push(refId)
		findOptions.push({
			key: 'b.refId',
		})
	}
	if (!isNull(pageType)) {
		params.push(pageType)
		findOptions.push({
			key: 'b.pageType'
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