const express = require('express');
const router = express.Router();
const userService = require('../tools/service');
const jwtMiddleWare = require('../../utils/middleWare');
const { isNull,formatMoment } = require('../../utils/utils');
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
    // console.log("req.query:",req.query);
    let pageNum = 1; // 当前页码，默认为1
    let pageSize = 1000000; // 每页显示的数量，默认为1000000
    if (!isNull(req.query.pageNum)) pageNum = req.query.pageNum; // 如果请求中包含pageNum参数，则更新pageNum的值为请求中的pageNum
    if (!isNull(req.query.pageSize)) pageSize = req.query.pageSize; // 如果请求中包含pageSize参数，则更新pageSize的值为请求中的pageSize
    let params = []; // 存储参数的数组
    let limit = [(parseInt(pageNum) - 1) * parseInt(pageSize), parseInt(pageSize)]; // 分页查询的限制条件，计算起始位置和数量
    // console.log("params:",params);
    params.push(limit); // 将limit参数添加到params数组中
    let sqlStr1 = `select count(1) total 
        from tb_system_logs a `; // SQL查询语句，用于获取总记录数
    let sqlStr2 = `select a.refID,a.phone,a.ip,a.remark,a.createTime,a.creator 
        from tb_system_logs a
        order by a.createTime desc 
        limit ? `; // SQL查询语句，用于获取指定页码和数量的记录
    let total = 0; // 总记录数
    sql.query(sqlStr1, params, (err, results) => {
        if (err) {
            console.error("err:", err);
            res.json({ resultCode: -1, resultInfo: sqlError[err.errno] });
        }
        total = results[0].total; // 获取查询结果中的总记录数
        sql.query(sqlStr2, params, (err, results) => {
            if (err) {
                console.error("err:", err);
                res.json({ resultCode: -1, resultInfo: sqlError[err.errno] });
            }
            // 对createTime字段进行格式化处理
            // results.forEach(result => {
			// 	// result.createTime = formatDate(result.createTime);
            //     // result.createTime = moment(result.createTime).format('YYYY-MM-DD HH:mm:ss');
            //     result.createTime = formatMoment(result.createTime);
            // });
            res.json({ resultCode: 0, resultInfo: "SUCCESS", data: { total, results } }); // 返回查询结果和状态信息
        });
    });
});

// 该代码是一个路由处理程序，当收到GET请求时执行。下面是代码的逻辑：
// 从请求中获取pageNum和pageSize参数，用于确定要返回的数据的页码和每页显示的数量。如果请求中没有提供这些参数，则使用默认值。
// 创建一个空数组params，用于存储参数。
// 根据pageNum和pageSize计算查询的限制条件limit，它表示查询的起始位置和数量。
// 将limit添加到params数组中。
// 构建两个SQL查询语句，sqlStr1用于获取总记录数，sqlStr2用于获取指定页码和数量的记录。
// 初始化total为0，用于存储总记录数。
// 执行第一个查询语句sqlStr1，通过回调函数获取查询结果。
// 如果查询出错，返回错误信息给客户端。
// 从查询结果中获取总记录数，并将其赋值
module.exports = router;