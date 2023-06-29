const pool = require('../config/db');
const _ = require('lodash')
const async = require("async");
const moment = require('moment');

function orderCode() {
    var orderCode = '';
    for (var i = 0; i < 6; i++) //6位随机数，用以加在时间戳后面。
    {
        orderCode += Math.floor(Math.random() * 10);
    }
    orderCode = new Date().getTime() + orderCode;  //时间戳，用来生成订单号。
    console.log(orderCode)
    return orderCode;
}

const findOptionFormat = (findOptions) => {
    if (isNull(findOptions)) {
        return ''
    } else {
        return " AND " + findOptions.map(o => {
            return `${o.key} ${isNull(o.type) ? '= ? ' : o.type === 'original' ? '' : `${o.type} ? `}  `
        }).join(' AND ')
    }
}

function _getNewSqlParamEntity(sql, params, callback) {
    if (callback) {
        return callback(null, {
            sql: sql,
            params: params
        });
    }
    return {
        sql: sql,
        params: params
    };
}

function execTrans(sqlparamsEntities, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            return callback(err, null);
        }
        connection.beginTransaction(function (err) {
            if (err) {
                return callback(err, null);
            }
            var funcAry = [];
            sqlparamsEntities.forEach(function (sql_param) {
                var temp = function (cb) {
                    var sql = sql_param.sql;
                    var param = sql_param.params;
                    connection.query(sql, param, function (tErr, rows, fields) {
                        if (tErr) {
                            connection.rollback(function () {
                                console.log("事务失败，" + sql_param + "，ERROR：" + tErr);
                                throw tErr;
                            });
                        } else {
                            return cb(null, 'ok');
                        }
                    })
                };
                funcAry.push(temp);
            });

            async.series(funcAry, function (err, result) {
                if (err) {
                    connection.rollback(function (err) {
                        console.log("transaction error: " + err);
                        connection.release();
                        return callback(err, null);
                    });
                } else {
                    connection.commit(function (err, info) {
                        if (err) {
                            console.log("执行事务失败，" + err);
                            connection.rollback(function (err) {
                                console.log("transaction error: " + err);
                                connection.release();
                                return callback(err, null);
                            });
                        } else {
                            connection.release();
                            return callback(null, info);
                        }
                    })
                }
            })
        });
    });
}

function toMenuTree(data) {
    // 删除 所有 children,以防止多次调用
    data.forEach(function (item) {
        if (!isNull) {
            delete item.children;
        }
    });

    // 将数据存储为 以 id 为 KEY 的 map 索引数据列
    var map = {};
    data.forEach(function (item) {
        map[item.menuId] = item;
    });
    //        console.log(map);
    var val = [];
    data.forEach(function (item) {
        // 以当前遍历项，的pid,去map对象中找到索引的id
        var parent = map[item.parentId];
        // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
        if (parent) {
            (parent.children || (parent.children = [])).push(item);
        } else {
            //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
            val.push(item);
        }
    });
    return val;
}

/** 
* 判断是否null 
* @param data 
*/
function isNull(data) {
    if (data === 0) { return false }
    return (data == "" || data == undefined || data == null);
}

/**
 * @getClientIP
 * @desc 获取用户 ip 地址
 * @param {Object} req - 请求
 */
function getClientIP(req) {
    var ip = req.headers['x-forwarded-for'] ||
        req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
    if (ip.split(',').length > 0) {
        ip = ip.split(',')[0];
    }
    return ip.replace('::ffff:', '');
};


function formatDateFields(req, res, next) {
    res.formatDateField = function (fieldName) {
        if (res.locals.data && res.locals.data[fieldName]) {
            res.locals.data[fieldName] = moment(res.locals.data[fieldName]).format('YYYY-MM-DD HH:mm:ss');
        }
    };
    next();
}

// 添加日期格式化函数
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function formatMoment(time) {
    return moment(time).format('YYYY-MM-DD HH:mm:ss');
}

module.exports = {
    getClientIP, isNull, toMenuTree, findOptionFormat, orderCode, execTrans, _getNewSqlParamEntity, formatDateFields
    , formatDate, formatMoment
}