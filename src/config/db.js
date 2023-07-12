const mysql = require('mysql');
const db = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "123456", // 公司
    // password: "root@123456", //自己
    port: 3306,
    database: "userdb",
    timezone: '08:00'
});
// 一、问题
// 数据库的时间是2022-11-04 17:15:52，但是sql查询出来的数据是2022-11-04T09:15:52.000Z
// 二、原因
// 查资料得知这是 Mysql时区 与 Node时区 不一致导致的
// 三、解决
// 只需在数据库配置文件里添加timezone: '08:00'，重启就可以了。不需要手动转换时间格式

// const db = mysql.createPool({
//     host: "43.142.107.166",
//     user: "root",
//     password: "root@123456",
//     port: 3306,
//     database: "demo_db"
// });

module.exports = db;