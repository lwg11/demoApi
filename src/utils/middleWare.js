//第六版语法
// const expressJWT = require("express-jwt");
// const secretKey = "strongest ^0^";
// const jwtMiddleWare = expressJWT({ secret: secretKey, algorithms: ["HS256"] })
//结果:express().use(expressJWT({ secret: secretKey, algorithms: ["HS256"] }));
//TypeError: expressJWT is not a function


const expressJwt = require('express-jwt');
const secretKey = 'dolphin.2020';
const jwtMiddleWare = expressJwt({ secret: secretKey, algorithms: ['HS256'] });



//最新语法
// var { expressjwt: expressJWT } = require("express-jwt");
// const secretKey = "dolphin.2020";
// const jwtMiddleWare = expressJWT({ secret: secretKey, algorithms: ["HS256"] })

module.exports = jwtMiddleWare;
