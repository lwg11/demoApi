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

//服务测试
//app.get('/test', (req, res) => res.send('Hello World'));
//开发文档服务
//TODO 增加环境变量，发布时去除该服务
// app.use('/api/doc/', express.static('doc'));

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
