const mysql = require('mysql');
// const db = mysql.createPool({
//     host: "127.0.0.1",
//     user: "root",
//     password: "123456",
//     port: 3306,
//     database: "userdb"
// });

const db = mysql.createPool({
    host: "43.142.107.166",
    user: "root",
    password: "root@123456",
    port: 3306,
    database: "demo_db"
});

module.exports = db;