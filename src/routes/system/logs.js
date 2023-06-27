const express = require('express');
const router = express.Router();
const userService = require('../tools/service');
const jwtMiddleWare = require('../../utils/middleWare');
const {isNull} = require('../../utils/utils');
const sql = require('../../config/db');

/**
 * @api {get} http://localhost:9002/api/system/logs 0.1.日志列表
 * @apiHeader {string} Authorization
 * @apiParam {String} pageNum 当前页 
 * @apiParam {String} [pageSize] 记录数 
 * @apiHeaderExample {json} Request-Example:
 *     {
 *       "Authorization": ""
 *     } 
 * @apiDescription  日志列表
 * @apiName getLoginLogs
 * @apiGroup System
 * @apiSuccessExample {json} Success-Response:
 * {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest http://localhost:9002/api/system/logs
 * @apiVersion 1.0.0
 */
router.get('/', (req, res) => {
	console.log("req.query:",req.query);
	let pageNum =1;
	let pageSize =1000000;
	if(!isNull(req.query.pageNum))  pageNum=req.query.pageNum //当前的num
	if(!isNull(req.query.pageSize)) pageSize=req.query.pageSize //当前页的数量
	let params=[] 
	let limit = [(parseInt(pageNum) - 1) * parseInt(pageSize), parseInt(pageSize)];
	// console.log("params:",params);
	params.push(limit);
	let sqlStr1=`select count(1) total 
	from tb_system_logs a `;
	let sqlStr2=`select a.refID,a.ip,a.remark,a.createTime,a.creator 
	from tb_system_logs a
	order by a.createTime desc 
	limit ? `;
	let total=0;
	sql.query(sqlStr1,params, (err, results) => {
		if(err) {
			console.error("err:",err);
			res.json({resultCode: -1, resultInfo:  sqlError[err.errno]});
		}
		total=results[0].total;
		sql.query(sqlStr2,params, (err, results) => {
			if(err) {
				console.error("err:",err);
				res.json({resultCode: -1, resultInfo:  sqlError[err.errno]});
			}
			res.json({resultCode: 0, resultInfo: "SUCCESS", data: {total,results}})
		})
	})
})

module.exports = router;