const express = require('express');
const router = express.Router();
const jwtMiddleWare = require('../../utils/middleWare');
const { isNull, _get, orderNo } = require('../../utils/utils');
const Exception = require('../../exception');
const sd = require('silly-datetime');
const service = require('./service');
const sqlError = require('../../utils/sqlError');
const sql = require('../../config/db');


/**
 * @api {put} /finance/goodsBill/detail/:Location_ID 1.2.修改商品
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription 修改商品
 * @apiName consumableGoods-updateById
 * @apiGroup consumableGoods
 * @apiParam {string} Location_ID 城市id	
 * @apiParam {string} goodsName 商品名称	
 * @apiParam {string} goodsType 商品类型	
 * @apiParam {string} goodsPrice 商品单价	
 * @apiParam {string} number 商品数量	
 * @apiParam {string} unit 单位	
 * @apiParam {string} isIncluded 是否计入账户	
 * @apiParam {string} totalPrice 商品总价	
 * @apiParam {string} buyDate 购买时间	
 * @apiParam {string} remark 备注

 * @apiParamExample {json} Request-Example:
 *  {
 *    "goodsName": "",
 *    "goodsType": "",
 *    "goodsPrice": "",
 *    "number": "",
 *    "unit": "",
 *    "isIncluded": "",
 *    "totalPrice": "",
 *    "buyDate": "",
 *    "remark": ""
 * }
 * @apiSuccess {json} resp_result
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /finance/goodsBill/detail/:Location_ID
 * @apiVersion 1.0.0
 */

// Location_ID
// Location_Name_EN
// Location_Name_ZH
// ISO_3166_1
// Country_Region_EN
// Country_Region_ZH
// Adm1_Name_EN
// Adm1_Name_ZH
// Adm2_Name_EN
// Adm2_Name_ZH
// Timezone
// Latitude
// Longitude
// Adcode



router.put('/detail/:Location_ID', jwtMiddleWare, (req, res) => {
	let currentTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
	let { goodsName, goodsType, unit, goodsPrice, number, isIncluded, totalPrice, buyDate, remark } = req.body
	let { Location_ID } = req.params
	let params = [
		{
			goodsName, goodsType, unit, goodsPrice, number, isIncluded, totalPrice, buyDate, remark,
			updateTime: currentTime,
			updator: req.user.userName
		}, Location_ID
	]

	service.findAll([goodsName], [{
		key: 'b.goodsName'
	}]).then(result => {
		if (result.error) {
			res.json({ resultCode: -1, resultInfo: sqlError[result.error.errno] })
		} else {
			if (result.result && result.result.length > 0 && result.result.some(o => o.refId != refId)) {
				res.json({ resultCode: -1, resultInfo: '城市已存在' })
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
 * @api {delete} /weather/city/detail/:Location_ID 1.3.删除城市
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription  删除城市
 * @apiName weather-list
 * @apiGroup weather
 * @apiParam {int} Location_ID 城市id
 * @apiSuccessExample {json} Success-Response:
 * {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /weather/city/detail/:Location_ID
 * @apiVersion 1.0.0
 */
router.delete('/detail/:Location_ID', jwtMiddleWare, (req, res) => {
	let { Location_ID } = req.params;
	service.deleteById(Location_ID).then(result => {
		if (result.error) {
			res.json({ resultCode: -1, resultInfo: sqlError[result.error.errno] })
		} else {
			res.json({ resultCode: 0, resultInfo: "删除成功" })
		}
	})
})

/**
 * @api {get} /weather/city/detail/:Location_ID 1.4.获取城市
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription  获取城市
 * @apiName weather-list
 * @apiGroup weather
 * @apiParam {int} Location_ID 城市id
 * @apiSuccessExample {json} Success-Response:
 * {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /weather/city/detail/:Location_ID
 * @apiVersion 1.0.0
 */
router.get('/detail/:Location_ID', jwtMiddleWare, (req, res) => {
	let { Location_ID } = req.params;
	let params = [Location_ID];
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
 * @api {get} /weather/city 1.7.城市分页列表
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription  城市分页列表
 * @apiName weather-list
 * @apiGroup weather
 * @apiParam {Int} [pageNum] 当前页
 * @apiParam {Int} [pageSize] 记录数
 * @apiParam {Int} [Location_ID] 城市id
 * @apiParam {String} [Location_Name_ZH] 城市名称
 * @apiParam {String} [Adm1_Name_ZH] 省名称
 * @apiParam {String} [Country_Region_ZH] 国家名称
 * 
 * @apiSuccessExample {json} Success-Response:
 * {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /weather/city
 * @apiVersion 1.0.0
 */


router.get('/city', jwtMiddleWare, (req, res) => {
	let { Location_ID, Location_Name_ZH, Adm1_Name_ZH, Country_Region_ZH } = req.query

	let params = []
	let findOptions = []
	if (!isNull(Location_ID)) {
		params.push(`%${Location_ID}%`)
		findOptions.push({
			key: 'w.Location_ID',
			type: 'like'
		})
	}
	if (!isNull(Location_Name_ZH)) {
		params.push(Location_Name_ZH)
		findOptions.push({
			key: 'w.Location_Name_ZH'
		})
	}
	if (!isNull(Country_Region_ZH)) {
		params.push(Country_Region_ZH)
		findOptions.push({
			key: 'w.Country_Region_ZH'
		})
	}
	if (!isNull(Adm1_Name_ZH)) {
		params.push(Adm1_Name_ZH)
		findOptions.push({
			key: 'w.Adm1_Name_ZH'
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