var fs = require('fs');
var path = require('path');
var net = require("net");
var crypto = require("crypto");
var sd = require('silly-datetime');

function getCurrentDate(){
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var seconds = date.getSeconds();
		month = (month >= 0 && month <= 9) ? ("0" + month) : month;
		strDate = (strDate >= 0 && strDate <= 9) ? ("0" + strDate) : strDate;
		hours = (hours >= 0 && hours <= 9) ? ("0" + hours) : hours;
		minutes = (minutes >= 0 && minutes <= 9) ? ("0" + minutes) : minutes;
		seconds = (seconds >= 0 && seconds <= 9) ? ("0" + seconds) : seconds;

    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + hours + seperator2 + minutes
            + seperator2 + seconds;
    return currentdate;
}

function getDateWithMilliseconds() {
		var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var seconds = date.getSeconds();
		var milliseconds = date.getMilliseconds();
		month = (month >= 0 && month <= 9) ? ("0" + month) : month;
		strDate = (strDate >= 0 && strDate <= 9) ? ("0" + strDate) : strDate;
		hours = (hours >= 0 && hours <= 9) ? ("0" + hours) : hours;
		minutes = (minutes >= 0 && minutes <= 9) ? ("0" + minutes) : minutes;
		seconds = (seconds >= 0 && seconds <= 9) ? ("0" + seconds) : seconds;

    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + hours + seperator2 + minutes
            + seperator2 + seconds + " " + milliseconds;
    return currentdate;
}

function getDateNoTime() {
		var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var seconds = date.getSeconds();
		month = (month >= 0 && month <= 9) ? ("0" + month) : month;
		strDate = (strDate >= 0 && strDate <= 9) ? ("0" + strDate) : strDate;
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

//function to encode file data to base64 encoded string
function base64_encode(file){
    //read binary data
    var fileBuffer = fs.readFileSync(file);
    //convert binary data to base64 encoded string
    return new Buffer(fileBuffer).toString("base64");
}
//function to create file from base64 encoded string
function base64_decode(base64Str, file){
    /*
		create buffer object from base64 encoded string,
    it is important to tell the constructor that the string is base64 encoded
    */
    var fileBuffer = new Buffer(base64Str, "base64");
    //write buffer to file
    fs.writeFileSync(file, fileBuffer);
    console.log("****************** File created from base64 encoded string ******************");
}

String.prototype.format = function(args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if(args[key]!=undefined){
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg= new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}


function mkdir(dirpath,dirname){
    if(typeof dirname === "undefined"){
        if(fs.existsSync(dirpath)){
            return;
        }else{
            mkdir(dirpath,path.dirname(dirpath));
        }
    }else{
        if(dirname !== path.dirname(dirpath)){
            mkdir(dirpath);
            return;
        }
        if(fs.existsSync(dirname)){
            fs.mkdirSync(dirpath)
        }else{
            mkdir(dirname,path.dirname(dirname));
            fs.mkdirSync(dirpath);
        }
    }
}
function mkdirsSync(dirpath, mode) {
    if (!fs.existsSync(dirpath)) {
        var pathtmp;
        dirpath.split(path.sep).forEach(function(dirname) {
            if (pathtmp) {
                pathtmp = path.join(pathtmp, dirname);
            }else {
                pathtmp = dirname;
            }
            if (!fs.existsSync(pathtmp)) {
                if (!fs.mkdirSync(pathtmp, mode)) {
                    return false;
                }
            }
        });
    }
    return true;
}

function mkdirs(dirpath, mode, callback) {
    callback = callback ||
    function() {};
    fs.exists(dirpath,
    function(exitsmain) {
        if (!exitsmain) {
            var pathtmp;
            var pathlist = dirpath.split(path.sep);
            var pathlistlength = pathlist.length;
            var pathlistlengthseed = 0;
            mkdir_auto_next(mode, pathlist, pathlist.length,function(callresult) {
                if (callresult) {
                    callback(true);
                }else {
                    callback(false);
                }
            });
        }else {
            callback(true);
        }
    });
}

function mkdir_auto_next(mode, pathlist, pathlistlength, callback, pathlistlengthseed, pathtmp) {
    callback = callback ||
    function() {};
    if (pathlistlength > 0) {
        if (!pathlistlengthseed) {
            pathlistlengthseed = 0;
        }
        if (pathlistlengthseed >= pathlistlength) {
            callback(true);
        }else {
            if (pathtmp) {
                pathtmp = path.join(pathtmp, pathlist[pathlistlengthseed]);
            }else {
                pathtmp = pathlist[pathlistlengthseed];
            }
            fs.exists(pathtmp,function(exists) {
                if (!exists) {
                    fs.mkdir(pathtmp, mode,function(isok) {
                        if (!isok) {
                            mkdir_auto_next(mode, pathlist, pathlistlength,
                            function(callresult) {
                                callback(callresult);
                            },
                            pathlistlengthseed + 1, pathtmp);
                        }else {
                            callback(false);
                        }
                    });
                }else {
                    mkdir_auto_next(mode, pathlist, pathlistlength,
                    function(callresult) {
                        callback(callresult);
                    },
                    pathlistlengthseed + 1, pathtmp);
                }
            });
        }
    }else {
        callback(true);
    }
}

function fsExistsSync(path) {
    try{
        fs.accessSync(path,fs.F_OK);
    }catch(e){
        return false;
    }
    return true;
}


var blank_str = "                      ";
function tcp_send(ipAddr, port, msg, callback) {
    var HOST = ipAddr;
    var PORT = port;
		var flag = 0;
		var timeout_ms = 5000;
		var success_flag = 0;
    var client = new net.Socket();
		var timeout = setTimeout(function(){
				if (success_flag == 0) {
						if (callback) {
							console.log("%s connect timeout.", blank_str);
							success_flag = 2;
							callback("{\"error_msg\":\"connect timeout.\"}");
						}
						client.destroy();
				}
				clearTimeout(timeout);
		}, timeout_ms);
    client.connect(PORT, HOST, function(){
        client.write(msg);
        console.log("%s -> data to tcp srv(%s:%d)", getCurrentDate(), ipAddr, port);
    });
    client.on("data", function(data){
				success_flag = 1;
		    console.log("%s -> from tcp srv(%s): \n%s\n\nresult length: %d\n", getCurrentDate(), ipAddr, data, data.length);
				if (callback) {
						flag = 1;
						callback(data);
				}
        client.destroy();
    });
    client.on("close", function(){
        console.log("%s -> connection closed.", getCurrentDate());
				if (flag == 0) {
						if (callback) {
								console.log("%s client force close connection.", blank_str);
								if (success_flag != 2) {
									callback("{\"error_msg\":\"client force close connection.\"}");
								}
						}
						success_flag = 3;
				}
    });
    client.on("error", function(e){
        console.log(e);
        client.destroy();
    });
}

function tcp_postsend(ipAddr,  callback) {
    var HOST = ipAddr;
    //var PORT = port;
		var flag = 0;
		var timeout_ms = 5000;
		var success_flag = 0;
    var client = new net.Socket();
		var timeout = setTimeout(function(){
				if (success_flag == 0) {
						if (callback) {
							console.log("%s connect timeout.", blank_str);
							success_flag = 2;
							callback("{\"error_msg\":\"connect timeout.\"}");
						}
						client.destroy();
				}
				clearTimeout(timeout);
		}, timeout_ms);
    client.connect(HOST, function(){
        console.log("%s -> data to tcp srv(%s:%d)", getCurrentDate(), ipAddr);
    });
		console.log(data);
    client.on("data", function(data){
				success_flag = 1;
		    console.log("%s -> from tcp srv(%s): \n%s\n\nresult length: %d\n", getCurrentDate(), ipAddr, data, data.length);
				if (callback) {
						flag = 1;
						callback(data);
				}
        client.destroy();
    });
    client.on("close", function(){
        console.log("%s -> connection closed.", getCurrentDate());
				if (flag == 0) {
						if (callback) {
								console.log("%s client force close connection.", blank_str);
								if (success_flag != 2) {
									callback("{\"error_msg\":\"client force close connection.\"}");
								}
						}
						success_flag = 3;
				}
    });
    client.on("error", function(e){
        console.log(e);
        client.destroy();
    });
}

function get_fileMd5(filename, callback) {
		var md5sum = crypto.createHash("md5");
		var stream = fs.createReadStream(filename);
		stream.on("data", function(chunk){
			md5sum.update(chunk);
		});
		stream.on("end", function(){
			callback(md5sum.digest("hex").toUpperCase());
		});
}

function get_strMd5(str) {
		var md5sum = crypto.createHash("md5");
		md5sum.update(str);
		var ret = md5sum.digest("hex");
		var s = ret.toUpperCase();
		return s;
}

function delFile(filename) {
	fs.unlinkSync(filename);
}


function getFilesList(rootDir, files_list) {
		var files = fs.readdirSync(rootDir);
		files.forEach(function(filename){
				var filepath = path.join(rootDir, filename);
				var stats = fs.statSync(filepath);
				var isFile = stats.isFile();
				var isDir = stats.isDirectory();
				if (isFile) {
					files_list.push(filepath);
				}
				if (isDir) {
					getFilesList(filepath, files_list);
				}
		});
}

//格式化时间
function getFormatDate(str){
		if (str == "second") return sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
		if (str == "minute") return sd.format(new Date(), 'YYYY-MM-DD HH:mm');
		if (str == "hour") return sd.format(new Date(), 'YYYY-MM-DD HH');
		if (str == "day") return sd.format(new Date(), 'YYYY-MM-DD');
}

//获得当前时间戳
function getNowTime(){
		var time = new Date().getTime();
		console.log(time);
		return time;
}

//取时间差值 5分钟相当于 1000*60*5
function getDifference(time1){
	var t2 = new Date().getTime();
	var interval = (t2 - t1);
	console.log(interval);
	return interval;
	// var t1 = new Date().getTime();
	// var t2 = t1;
	// var i = 0, count = 10000000, interval = 0;
	// for(i = 0; i < count; i++){
	//   t2 = new Date().getTime();
	//   interval = (t2 - t1);
	// }
	// interval = (t2 - t1);
	// console.log(interval);
	// return interval;
}

//取得验证码
function getCode(){
		var code = Math.floor((Math.random()*999999)+111111);
		console.log(code);
		return code;
}


//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// exports.getCurrentDate 					= getCurrentDate;
// exports.getDateNoTime 					= getDateNoTime;
// exports.getDateWithMilliseconds = getDateWithMilliseconds;
// exports.base64_encode 					= base64_encode;
// exports.base64_decode 					= base64_decode;
// exports.mkdir										= mkdir;
// exports.mkdirsSync							= mkdirsSync;
// exports.mkdirs									= mkdirs;
// exports.mkdir_auto_next					= mkdir_auto_next;
// exports.fsExistsSync						= fsExistsSync;
// exports.tcp_send								= tcp_send;
// exports.get_fileMd5							= get_fileMd5;
// exports.get_strMd5							= get_strMd5;
// exports.delFile									= delFile;
// exports.getFilesList 						= getFilesList;
// exports.getFormatDate 			 		= getFormatDate;
// exports.tcp_postsend 						= tcp_postsend;
// exports.getCode 								= getCode;

module.exports={getFormatDate};