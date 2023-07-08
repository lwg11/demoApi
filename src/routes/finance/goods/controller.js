const express = require('express');
const router = express.Router();
const jwtMiddleWare = require('../../../utils/middleWare');
const { isNull, _get, orderNo } = require('../../../utils/utils');
const Exception = require('../../../exception');
const sd = require('silly-datetime');
const service = require('./service');
const sqlError = require('../../../utils/sqlError');

/**
 * @api {post} /finance/goodsBill 1.1.新增商品
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription  新增商品
 * @apiName consumableGoods-createOne
 * @apiGroup consumableGoods	
 * @apiParam {string} goodsName 商品名称	
 * @apiParam {string} goodsType 商品类型	
 * @apiParam {string} goodsPrice 商品单价	
 * @apiParam {string} number 商品数量	
 * @apiParam {string} unit 单位	
 * @apiParam {string} isIncluded, 是否计入账户	
 * @apiParam {string} remark 备注	
 * @apiParamExample {json} Request-Example:
 *  {
 *    "goodsName": "",
 *    "goodsType": "",
 *    "goodsPrice": "",
 *    "number": "",
 *    "unit": "",
 *    "isIncluded": "",
 *    "remark": ""
 * }
 * @apiSuccess {json} resp_result
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /finance/goodsBill
 * @apiVersion 1.0.0
 */
router.post('/', jwtMiddleWare, (req, res) => {
	let currentTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
	let { goodsName, goodsType, goodsPrice, number, unit, isIncluded, remark } = req.body
	let params =
	{
		goodsName, goodsType, unit, goodsPrice, number, remark,
		isIncluded: isIncluded || 0,
		createTime: currentTime,
		creator: req.user.userName,
		updateTime: currentTime,
		updator: req.user.userName,
		delFlag: 0
	}
	service.findAll([goodsName], [{
		key: 'b.goodsName'
	}]).then(result => {
		if (result.error) {
			console.log("出错了===>", result.error);
			res.json({ resultCode: -1, resultInfo: sqlError[result.error.errno] })
		} else {
			if (result.result && result.result.length > 0) {
				res.json({ resultCode: -1, resultInfo: '商品已存在' })
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
 * @api {put} /finance/goodsBill/detail/:refId 1.2.修改商品
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription 修改商品
 * @apiName consumableGoods-updateById
 * @apiGroup consumableGoods
 * @apiParam {string} refId id	
 * @apiParam {string} goodsName 商品名称	
 * @apiParam {string} goodsType 商品类型	
 * @apiParam {string} goodsPrice 商品单价	
 * @apiParam {string} number 商品数量	
 * @apiParam {string} unit 单位	
 * @apiParam {string} isIncluded 是否计入账户	
 * @apiParam {string} remark 备注

 * @apiParamExample {json} Request-Example:
 *  {
 *    "goodsName": "",
 *    "goodsType": "",
 *    "goodsPrice": "",
 *    "number": "",
 *    "unit": "",
 *    "isIncluded": "",
 *    "remark": ""
 * }
 * @apiSuccess {json} resp_result
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /finance/goodsBill/detail/:refId
 * @apiVersion 1.0.0
 */
router.put('/detail/:refId', jwtMiddleWare, (req, res) => {
	let currentTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
	let { goodsName, goodsType, unit, goodsPrice, number,isIncluded, remark } = req.body
	let { refId } = req.params
	let params = [
		{
			goodsName, goodsType, unit, goodsPrice, number,isIncluded, remark,
			updateTime: currentTime,
			updator: req.user.userName
		}, refId
	]

	service.findAll([goodsName], [{
		key: 'b.goodsName'
	}]).then(result => {
		if (result.error) {
			res.json({ resultCode: -1, resultInfo: sqlError[result.error.errno] })
		} else {
			if (result.result && result.result.length > 0 && result.result.some(o => o.refId != refId)) {
				res.json({ resultCode: -1, resultInfo: '商品已存在' })
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
 * @api {delete} /finance/goodsBill/detail/:refId 1.3.删除商品
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription  删除商品
 * @apiName consumableGoods-deleteById
 * @apiGroup consumableGoods
 * @apiParam {string} refId 商品id
 * @apiSuccessExample {json} Success-Response:
 * {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /finance/goodsBill/detail/:refId
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
 * @api {get} /finance/goodsBill/detail/:refId 1.4.获取商品
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription  获取商品
 * @apiName consumableGoods-findById
 * @apiGroup consumableGoods
 * @apiParam {int} refId 商品id
 * @apiSuccessExample {json} Success-Response:
 * {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /finance/goodsBill/detail/:refId
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
				res.json({ resultCode: -1, resultInfo: "未查询到该商品" })
			}
		}
	})
})

/**
 * @api {get} /finance/goodsBill 1.7.商品分页列表
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription  商品分页列表
 * @apiName consumableGoods-list
 * @apiGroup consumableGoods
 * @apiParam {Int} [pageNum] 当前页
 * @apiParam {Int} [pageSize] 记录数
 * @apiParam {Int} [goodsType] 商品类型
 * @apiParam {String} [name] 商品名称
 * 
 * @apiSuccessExample {json} Success-Response:
 * {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /finance/goodsBill
 * @apiVersion 1.0.0
 */
router.get('/', jwtMiddleWare, (req, res) => {
	let { goodsType, goodsName } = req.query
	let params = []
	let findOptions = []
	if (!isNull(goodsName)) {
		params.push(`%${goodsName}%`)
		findOptions.push({
			key: 'b.goodsName',
			type: 'like'
		})
	}
	if (!isNull(goodsType)) {
		params.push(goodsType)
		findOptions.push({
			key: 'b.goodsType'
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