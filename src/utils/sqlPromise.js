const sql = require('../config/db');
const async = require("async");

/**
 *  sql promise 
 * @param {*} query 
 * @param {*} params 
 * @returns 
 */
function sqlPromise(query, params) {
  return new Promise((resolve, reject) => {
    sql.query(query, params, (err, result) => {
      resolve({ error: err, result: result })
    })
  })
}

function execTrans(sqlparamsEntities, callback) {
  sql.getConnection(function (err, connection) {
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
                console.log("事务失败，" + JSON.stringify(sql_param) + "，ERROR：" + tErr);
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
            console.log("transaction --- error: " + err);
            connection.release();
            return callback(err, null);
          });
        } else {
          connection.commit(function (err, info) {
            if (err) {
              console.log("执行事务失败，" + err);
              connection.rollback(function (err) {
                console.log("transaction--- error: " + err);
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
/**
 * 事务promise
 * @param {*} sqlparamsEntities 
 * @returns 
 */
function sqlExecTransPromise(sqlparamsEntities) {
  console.log("sqlparamsEntities:", JSON.stringify(sqlparamsEntities));
  return new Promise((resolve, reject) => {
    execTrans(sqlparamsEntities, (err) => {
      resolve(err)
    })
  })
}

module.exports = { sqlPromise, execTrans, sqlExecTransPromise }