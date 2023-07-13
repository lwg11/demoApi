var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser')
const cors = require('cors');
var app = express();
app.use(cors());
app.use(bodyParser.json());
var usersRoutes = require('./routes/index');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/', usersRoutes);

const { getClientIP } = require('./utils/utils');
const { isEmpty } = require('lodash');
const jwt = require('jsonwebtoken');
const Exception = require('./exception');
const secretKey='dolphin.2020';

const sd = require('silly-datetime');
let currentTime=sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');

//忽略token校验列表
const tokenIgnoreApi = [
	"/api/system/user/login",
	"/api/upload/single"
]
//拦截器
app.use(function (req, res, next) {
	console.log("req.url:", req.url);
	let ipAddress = getClientIP(req);
	let params = {
		"tableName": "",
		"ipAddress": ipAddress,
		"reqUrl": req.url,
		"remark": "",
		"createTime": currentTime,
		"creator": ""
	};
	let urlStart = req.url.substr(0, req.url.indexOf("?") < 0 ? req.url.length : req.url.indexOf("?"))

	if (tokenIgnoreApi.indexOf(urlStart) < 0 && !tokenIgnoreApi.some(o => urlStart.startsWith(o))) {
		//token可能存在post请求和get请求
		console.log("req.headers:", req.headers);
		let token = req.headers.authorization;
		if (!isEmpty(token)) {
			token = token.replace("Bearer ", "");
		}
		console.log("拦截token:", token);
		jwt.verify(token, secretKey, function (err, decode) {
			if (err) {
				res.status(403);
				throw new Exception(res.status, '登录已过期，请重新登录！');
			} else {
				next();
			}
		})
	} else {
		next();
	}
	// next();
})

/* 全局错误抛出 */
app.use((error, req, res, next) => {
	if (error) {
		console.error("==>全局错误抛出error:", error);
		// console.error("==>全局错误抛出next:",next);
		if (error.status == 401) {
			res.json({ resultCode: 401, resultInfo: 'token无效，请重新登录' });
		}
		else if (error.status == 403) {
			res.json({ resultCode: 403, resultInfo: '登录已过期，请重新登录！' });
		} else {
			res.json({ resultCode: error.code, resultInfo: error.message });
		}
	}
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
