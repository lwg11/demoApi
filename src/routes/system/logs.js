const express = require('express');
const router = express.Router();
const userService = require('../tools/service');
const jwtMiddleWare = require('../../utils/middleWare');

/**
 * @api {get} http://localhost:9002/api/system/user/logs 0.1.日志列表
 * @apiHeader {string} [Authorization] 登录成功后返回token
 * @apiHeaderExample {json} Header-Example:
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
 * @apiSampleRequest /api/system/user/logs
 * @apiVersion 1.0.0
 */

router.get('/', jwtMiddleWare, (req, res) => {
    let sqlStr = `select refID,ip,remark,createTime,creator 
	from tb_system_logs
	order by createTime desc`;
    userService.logs().then(results => {
        res.json({ resultCode: 0, resultInfo: "SUCCESS", data: results });
    })
    // sql.query(sqlStr, (err, results) => {
    //     console.log('err--->',err);
    // 	if(err) {
    // 		console.error("==>出错了:",err);
    // 		res.json({resultCode: -1, resultInfo:  sqlError[err.errno]});
    // 	}
    // 	res.json({resultCode: 0, resultInfo: "SUCCESS", data: results})
    // })
})

module.exports = router;