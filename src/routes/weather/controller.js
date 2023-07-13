const express = require('express');
const router = express.Router();
const jwtMiddleWare = require('../../utils/middleWare');
const { isNull, _get, orderNo } = require('../../utils/utils');
const Exception = require('../../exception');
const sd = require('silly-datetime');
const service = require('./service');
const sqlError = require('../../utils/sqlError');
const sql = require('../../config/db');

const axios = require('axios');

/**
 * @api {post} /weather/city 1.1.新增城市
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription  新增城市
 * @apiName weather-createOne
 * @apiGroup weather
 * @apiParam {int} Location_ID 城市id	
 * @apiParam {string} Location_Name_EN 地点_名称_EN	
 * @apiParam {string} Location_Name_ZH 地点_名称_ZH	
 * @apiParam {string} ISO_3166_1 国际标准化组织	
 * @apiParam {string} Country_Region_EN 国家/地区_EN	
 * @apiParam {string} Country_Region_ZH 国家/地区_ZH	
 * @apiParam {string} Adm1_Name_EN 省级名称_EN	
 * @apiParam {string} Adm1_Name_ZH 省级名称_ZH	
 * @apiParam {string} Adm2_Name_EN 市级名称_EN	
 * @apiParam {string} Adm2_Name_ZH 市级名称_ZH
 * @apiParam {string} Timezone 时区
 * @apiParam {float} Latitude 纬度
 * @apiParam {float} Longitude 经度
 * @apiParam {string} Adcode 广告代码
 * @apiParamExample {json} Request-Example:
 *  {
 *    "Location_ID": "",
 *    "Location_Name_EN": "",
 *    "Location_Name_ZH": "",
 *    "ISO_3166_1": "",
 *    "Country_Region_EN": "",
 *    "Country_Region_ZH": "",
 *    "Adm1_Name_EN": "",
 *    "Adm1_Name_ZH": "",
 *    "Adm2_Name_EN": "",
 *    "Adm2_Name_ZH": "",
 *    "Timezone": "",
 *    "Latitude": "",
 *    "Longitude": "",
 *    "Adcode": ""
 * }
 * @apiSuccess {json} resp_result
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /weather/city
 * @apiVersion 1.0.0
 */
router.post('/city', jwtMiddleWare, (req, res) => {
	let currentTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
	let { Location_ID, Location_Name_ZH, Location_Name_EN, ISO_3166_1, Country_Region_EN, Country_Region_ZH, Adm1_Name_EN, Adm1_Name_ZH,
		Adm2_Name_EN, Adm2_Name_ZH, Timezone, Latitude, Longitude, Adcode
	} = req.body

	let params =
	{
		Location_ID, Location_Name_ZH, Location_Name_EN, ISO_3166_1, Country_Region_EN, Country_Region_ZH, Adm1_Name_EN, Adm1_Name_ZH,
		Adm2_Name_EN, Adm2_Name_ZH, Timezone, Latitude, Longitude, Adcode,
		createTime: currentTime,
		creator: req.user.userName,
		updateTime: currentTime,
		updator: req.user.userName
	}
	service.findAll([Location_Name_ZH], [{
		key: 'w.Location_Name_ZH'
	}]).then(result => {
		if (result.error) {
			console.log("出错了===>", result.error);
			res.json({ resultCode: -1, resultInfo: sqlError[result.error.errno] })
		} else {
			if (result.result && result.result.length > 0) {
				res.json({ resultCode: -1, resultInfo: '城市已存在' })
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
 * @api {put} /weather/city/detail/:Location_ID 1.2.修改地区
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription 修改商品
 * @apiName weather-updateById
 * @apiGroup weather
 * @apiParam {int} Location_ID 城市id	
 * @apiParam {string} Location_Name_EN 地点_名称_EN	
 * @apiParam {string} Location_Name_ZH 地点_名称_ZH	
 * @apiParam {string} ISO_3166_1 国际标准化组织	
 * @apiParam {string} Country_Region_EN 国家/地区_EN	
 * @apiParam {string} Country_Region_ZH 国家/地区_ZH	
 * @apiParam {string} Adm1_Name_EN 省级名称_EN	
 * @apiParam {string} Adm1_Name_ZH 省级名称_ZH	
 * @apiParam {string} Adm2_Name_EN 市级名称_EN	
 * @apiParam {string} Adm2_Name_ZH 市级名称_ZH
 * @apiParam {string} Timezone 时区
 * @apiParam {float} Latitude 纬度
 * @apiParam {float} Longitude 经度
 * @apiParam {string} Adcode 广告代码

 * @apiParamExample {json} Request-Example:
 *  {
 *    "Location_Name_EN": "",
 *    "Location_Name_ZH": "",
 *    "ISO_3166_1": "",
 *    "Country_Region_EN": "",
 *    "Country_Region_ZH": "",
 *    "Adm1_Name_EN": "",
 *    "Adm1_Name_ZH": "",
 *    "Adm2_Name_EN": "",
 *    "Adm2_Name_ZH": "",
 *    "Timezone": "",
 *    "Latitude": "",
 *    "Longitude": "",
 *    "Adcode": ""
 * }
 * @apiSuccess {json} resp_result
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /weather/city/detail/:Location_ID
 * @apiVersion 1.0.0
 */

router.put('/city/detail/:Location_ID', jwtMiddleWare, (req, res) => {
	let currentTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
	let { Location_Name_ZH, Location_Name_EN, ISO_3166_1, Country_Region_EN, Country_Region_ZH, Adm1_Name_EN, Adm1_Name_ZH,
		Adm2_Name_EN, Adm2_Name_ZH, Timezone, Latitude, Longitude, Adcode
	} = req.body
	let { Location_ID } = req.params
	let params = [
		{
			Location_Name_ZH, Location_Name_EN, ISO_3166_1, Country_Region_EN, Country_Region_ZH, Adm1_Name_EN, Adm1_Name_ZH,
			Adm2_Name_EN, Adm2_Name_ZH, Timezone, Latitude, Longitude, Adcode,
			updateTime: currentTime,
			updator: req.user.userName
		}, Location_ID
	]

	service.findAll([Location_Name_ZH], [{
		key: 'w.Location_Name_ZH'
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
 * @apiName weather-deleteById
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
router.delete('/city/detail/:Location_ID', jwtMiddleWare, (req, res) => {
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
 * @apiName weather-findById
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
router.get('/city/detail/:Location_ID', jwtMiddleWare, (req, res) => {
	let { Location_ID } = req.params;
	let params = [Location_ID];
	service.findById(params).then(result => {
		if (result.error) {
			res.json({ resultCode: -1, resultInfo: sqlError[result.error.errno] })
		} else {
			if (result.result && result.result.length > 0) {
				res.json({ resultCode: 0, resultInfo: "SUCCESS", data: result.result[0] })
			} else {
				res.json({ resultCode: -1, resultInfo: "未查询到该城市" })
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
 * @apiParam {String} [Adm1_Name_ZH] 省级名称
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
		params.push(Location_ID)
		findOptions.push({
			key: 'w.Location_ID'
		})
	}
	if (!isNull(Location_Name_ZH)) {
		params.push(`%${Location_Name_ZH}%`)
		findOptions.push({
			key: 'w.Location_Name_ZH',
			type: 'like'
		})
	}
	if (!isNull(Country_Region_ZH)) {
		params.push(Country_Region_ZH)
		findOptions.push({
			key: 'w.Country_Region_ZH'
		})
	}
	if (!isNull(Adm1_Name_ZH)) {
		params.push(`%${Adm1_Name_ZH}%`)
		findOptions.push({
			key: 'w.Adm1_Name_ZH',
			type: 'like'
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



/**
 * @api {get} /weather/weatherWarning 1.7.天气列表
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription  天气列表
 * @apiName weatherWarning-list
 * @apiGroup weatherWarning
 * @apiParam {Int} [Location_ID] 城市id
 * 
 * @apiSuccessExample {json} Success-Response:
 * {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /weather/weatherWarning
 * @apiVersion 1.0.0
 */
router.get('/weatherWarning', jwtMiddleWare, (req, res) => {
	let { Location_ID } = req.query;
	const Key = 'f07ff4636ce24ae3be53f0c89ac3a3a6';
  
	const fetchWeather = (id) => {
	  axios.get(`https://devapi.qweather.com/v7/weather/now`, {
		params: {
		  location: id,
		  key: Key,
		  lang: 'zh'
		}
	  })
		.then(response => {
		  const data = response.data;
		  res.json({
			resultCode: 0,
			resultInfo: 'SUCCESS',
			data: {
			  results: {
				...data,
				updateTime: sd.format(data.updateTime, 'YYYY-MM-DD HH:mm:ss'),
				obsTime: sd.format(data.now.obsTime, 'YYYY-MM-DD HH:mm:ss')
			  }
			}
		  });
		})
		.catch(e => {
		  res.json({ resultCode: -1, resultInfo: e.message || e.toString() });
		});
	};
  
	if (!isNull(Location_ID)) {
	  fetchWeather(Location_ID);
	} else {
	  res.json({ resultCode: -1, resultInfo: '未输入城市id' });
	}
  });

module.exports = router;