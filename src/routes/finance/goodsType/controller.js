const express = require('express');
const router = express.Router();
const jwtMiddleWare = require('../../../utils/middleWare');
const {isNull, _get, orderNo} = require('../../../utils/utils');
const Exception = require('../../../exception');
const sd = require('silly-datetime');
const service =require('./service');
const goodsService =require('../goods/service');
const sqlError = require('../../../utils/sqlError');

/**
 * @api {post} /finance/consumableGoodsType 1.1.新增商品类型
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription  新增商品类型
 * @apiName consumableGoodsType-createOne
 * @apiGroup consumableGoodsType
 * @apiParam {string} name 名称	
 * @apiParam {int} expenditure 收入/支出  支出：0，收入：1	
 * @apiParam {string} remark 备注	

 * @apiParamExample {json} Request-Example:
{
        "name": "",
        "expenditure": "",
        "remark": ""
    }
 * @apiSuccess {json} resp_result
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /finance/consumableGoodsType
 * @apiVersion 1.0.0
 */
 router.post('/', jwtMiddleWare, (req, res) => {
	let currentTime=sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
	let   {name,expenditure,remark} = req.body
	let params = {
		name, expenditure,remark,
		createTime:currentTime,
		creator:req.user.userName,
		updateTime:currentTime, 
		updator:req.user.userName,
		delFlag: 0
	}
	service.findAll([name,expenditure],[{
		key:'name'
	},{
		key:'expenditure'
	}]).then( result => {
		if(result.error){
			res.json({resultCode: -1, resultInfo: sqlError[result.error.errno]})
		}else {
			if(result.result && result.result.length > 0 ){
				res.json({resultCode: -1, resultInfo: '商品类型已存在'})
			}else {
				service.createOne(params).then( result => {
					if(result.error){
						res.json({resultCode: -1, resultInfo: sqlError[result.error.errno]})
					}else {
						res.json({resultCode: 0, resultInfo: '新增成功'})
					}
				})
			}
		}
	})
});

/**
 * @api {put} /finance/consumableGoodsType/detail/:refId 1.2.修改商品类型
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription 修改商品类型
 * @apiName consumableGoodsType-updateById
 * @apiGroup consumableGoodsType
	
 * @apiParam {string} name 名称	
 * @apiParam {int} expenditure 收入/支出  支出：0，收入：1	
 * @apiParam {string} remark 备注	

 * @apiParamExample {json} Request-Example:
{
        "name": "",
        "expenditure": "",
        "remark": ""
    }
 * @apiSuccess {json} resp_result
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /finance/consumableGoodsType/detail/:refId
 * @apiVersion 1.0.0
 */
 router.put('/detail/:refId', jwtMiddleWare, (req, res) => {
	let currentTime=sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
	let   {name,expenditure,remark} = req.body
	let {refId} = req.params
	let params = [
		{
			name,expenditure,remark,
			updateTime:currentTime,
			updator:req.user.userName
		},refId
	]
	service.findAll([name,expenditure],[{
		key:'name'
	},{
		key:'expenditure'
	}]).then( result => {
		if(result.error){
			res.json({resultCode: -1, resultInfo: sqlError[result.error.errno]})
		}else {
			if(result.result && result.result.length > 0 && result.result.some( o => o.refId != refId) ){
				res.json({resultCode: -1, resultInfo: '商品类型已存在'})
			}else {
				service.updateById(params).then( result => {
					if(result.error){
						res.json({resultCode: -1, resultInfo: sqlError[result.error.errno]})
					}else {
						res.json({resultCode: 0, resultInfo: '编辑成功'})
					}
				})
			}
		}
	})
});

/**
 * @api {delete} /finance/consumableGoodsType/detail/:refId 1.3.删除商品类型
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription  删除商品类型
 * @apiName consumableGoodsType-deleteById
 * @apiGroup consumableGoodsType
 * @apiParam {string} id 企业ID
 * @apiSuccessExample {json} Success-Response:
 * {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /finance/consumableGoodsType/detail/:refId
 * @apiVersion 1.0.0
 */
 router.delete('/detail/:refId', jwtMiddleWare, (req, res) => {
	let {refId}=req.params;
	let params=[{
		delFlag:1
	},refId];
	goodsService.findAll([refId],[{
		key:'b.goodsType'
	},{
		key:'b.delFlag= 0',
		type:'original'

	}]).then(result => {
		if(result.error){
			res.json({resultCode: -1, resultInfo: sqlError[result.error.errno]})
		}else {
			if(result.result && result.result.length > 0){
				res.json({resultCode: -1, resultInfo: "该类型下已有商品,不可删除"})
			}else {
				service.updateById(params).then( result => {

					if(result.error){
						res.json({resultCode: -1, resultInfo: sqlError[result.error.errno]})
					}else {
						res.json({resultCode: 0, resultInfo: "删除成功"})
			
					}
				})

			}



		}



	})
	
})

/**
 * @api {get} /finance/consumableGoodsType/detail/:refId 1.4.获取商品类型
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription  获取商品类型
 * @apiName consumableGoodsType-findById
 * @apiGroup consumableGoodsType
 * @apiParam {int} id 企业id
 * @apiSuccessExample {json} Success-Response:
 * {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /finance/consumableGoodsType/detail/:refId
 * @apiVersion 1.0.0
 */
router.get('/detail/:refId', jwtMiddleWare, (req, res) => {
	let {refId}=req.params;
	let params=[refId];
	service.findById(params).then( result => {

		if(result.error){
			res.json({resultCode: -1, resultInfo: sqlError[result.error.errno]})
		}else {
			if(result.result && result.result.length > 0){
				
				res.json({resultCode: 0, resultInfo: "SUCCESS",data:result.result[0]})
			}else {
				res.json({resultCode: -1, resultInfo: "未查询到该类型"})
			}
		}
	})
	//return consumableGoodsType.findById(params,req,res);
})

/**
 * @api {get} /finance/consumableGoodsType 1.7.商品类型分页列表
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription  商品类型分页列表
 * @apiName consumableGoodsType-list
 * @apiGroup consumableGoodsType
 * @apiParam {Int} [pageNum] 当前页
 * @apiParam {Int} [pageSize] 记录数
 * @apiSuccessExample {json} Success-Response:
 * {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /finance/consumableGoodsType
 * @apiVersion 1.0.0
 */
 router.get('/', jwtMiddleWare, (req, res) => {
	 let {  } =req.query
	let params=[] 
	let findOptions = []

	let limit =null
	if(!isNull(req.query.pageNum) && !isNull(req.query.pageSize)){
		let pageNum =req.query.pageNum;
		let pageSize =req.query.pageSize;
		limit = 	[(parseInt(pageNum) - 1) * parseInt(pageSize), parseInt(pageSize)];
	}
	
 service.findPageList(params,findOptions,limit).then( results => {
	let countResult = results[0]
	let dataResult = results[1]
	if(countResult.error){
		console.log("countResult.error:",countResult.error);
		throw new Exception(-1,sqlError[countResult.error.errno])
	}
	if(dataResult.error){
		console.log("dataResult.error:",dataResult.error);
		throw new Exception(-1,sqlError[dataResult.error.errno])
	}
	let total = 0
	if(countResult.result && countResult.result.length > 0){
		total = countResult.result[0].total
		res.json({resultCode: 0, resultInfo:'SUCCESS',data: {
			total, 
			results:dataResult.result
		}})

	}else {
		res.json({resultCode: 0, resultInfo:'SUCCESS',data: {
			total,
			results:[]
		}})

	}
 }).catch(e => {
	res.json({resultCode: -1, resultInfo:e.message||e})
 });
})


module.exports = router;
