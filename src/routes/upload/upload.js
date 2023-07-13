// 导入所需的模块和中间件
const express = require('express'); // 导入express模块
const router = express.Router(); // 创建一个express路由实例
const exception = require('../../exception'); // 导入自定义的异常处理模块
const jwtMiddleWare = require('../../utils/middleWare'); // 导入自定义的jwt中间件

const multer = require('multer'); // 导入multer模块，用于处理文件上传

// const dest = "/home/dev/guangyuan/files/"; // 指定上传文件的目标目录
// const dest = "F:/work/模型管理/model-management/"; // 设置为你本地文件系统的目标目录
const dest = "F:/上传测试/"; // 设置为你本地文件系统的目标目录
const upload = multer({ dest: dest }); // 创建multer实例并指定文件上传的目标目录

const fs = require('fs'); // 导入文件系统模块，用于文件操作

const path = require('path'); // 导入路径模块，用于处理文件路径
const Exception = require('../../exception'); // 导入自定义的异常处理类
const { isNull } = require('../../utils/utils'); // 导入自定义的工具函数

// const uploadFileDomin = "http://gy.democn.cn/"; // 文件上传的域名
const uploadFileDomin = "http://localhost:9002/"; // 文件上传的域名

const MaxSize = 1024 * 1024 * 500; // 文件大小上限为500MB

/**
 * @api {post} /upload/single 1.1.单文件上传 
 * @apiHeader {string} Authorization 
 * @apiHeader {string} Content-Type 
 * @apiHeaderExample {json} Request-Example:
 *     {
 *       "Content-Type": "multipart/form-data",
 *       "Authorization": ""
 *     } 
 * @apiDescription 单文件上传 
 * @apiName single
 * @apiGroup upload
 * @apiParam {File} file 单文件上传,不超过200M
 * @apiParamExample {form-data} Request-Example:
 *    {
 *       "file": {
 *          "originalname":"",
 *          "mimetype":"",
 *          "destination":"",
 *          "filename":""
 *          }
 *    }
 *    
 * @apiSuccess {json} resp_result
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /upload/single
 * @apiVersion 1.0.0
 */

router.post('/single', upload.single('file'), function (req, res, next) {
    console.log("req.file:", req.file);
    // 从上传的文件中获取文件信息
    const { originalname, mimetype, destination, filename, size } = req.file;

    console.log('originalname--->',originalname);
    console.log('size--->',size);

    if (size > MaxSize) {
        // 如果文件大小超过了上限，则抛出异常
        throw new Exception(-1, "上传文件:" + size + "，已超上限:" + MaxSize);
    }
    // 获取文件名
    var fileName = req.file.filename;
    console.log("fileName:" + fileName);
    // 获取文件扩展名
    var extend = "." + originalname.split('.').pop();
    // 获取目标路径，默认为指定的目标目录
    var destDir = req.body.dir == undefined ? dest : req.body.dir;
    console.log("destDir:" + destDir);
    // 源文件路径
    var sourceFile = req.file.path;
    console.log("sourceFile:" + sourceFile);
    // 目标文件路径
    var destPath = path.join(destDir, fileName);
    destPath = destPath + extend;
    console.log("destPath:" + destPath);
    // 目标目录
    var dest_Dir = path.join(destDir);
    console.log("dest_Dir:" + dest_Dir);
    // 文件的URL地址
    var fileurl = uploadFileDomin + destPath.substr(destPath.indexOf("files"));
    console.log("fileurl:" + fileurl);
    // 将反斜杠转换为正斜杠
    fileurl = fileurl.replace(/\\/g, "/");
    console.log("fileurl:" + fileurl);
    // 检查目标目录是否存在
    fs.exists(dest_Dir, function (exists) {
        if (exists) {
            // 如果目标目录存在，则将文件移动到目标路径
            fs.rename(sourceFile, destPath, function (err) {
                res.json({ resultCode: 0, message: "上传成功,文件大小：" + size, data: { "fileurl": fileurl } });
                console.log("destPath:" + destPath);
            });
        } else {
            // 如果目标目录不存在，则创建父目录和目标目录，并将文件移动到目标路径
            // fs.mkdir(dest_Dir, 0777, function (err) {
            fs.mkdir(path.dirname(dest_Dir), { recursive: true }, function (err) {
                if (err) {
                    throw new Exception(-1, err);
                } else {
                    fs.rename(sourceFile, destPath, function (err) {
                        res.json({ resultCode: 0, message: "上传成功,文件大小:" + size, data: { "fileurl": fileurl } });
                        console.log("destPath:" + destPath);
                    });
                }
            });
        }
    });
});


/**
 * @api {post} /upload/multi 1.2.多文件上传 
 * @apiHeader {string} Authorization 
 * @apiHeader {String} Content-Type
 * @apiHeaderExample {json} Request-Example:
 *     {
 *       "Content-Type": "multipart/form-data",
 *       "Authorization": ""
 *     } 
 * @apiDescription 多文件上传  
 * @apiName multi
 * @apiGroup upload
 * @apiParam {File} files 多文件上传,单个文件不超过200M 
 * @apiParamExample {form-data} Request-Example:
 *    {
 *       "files":[
 *        {
 *          "originalname":"",
 *          "mimetype":"",
 *          "destination":"",
 *          "filename":""
 *         },
 *        {
 *          "originalname":"",
 *          "mimetype":"",
 *          "destination":"",
 *          "filename":""
 *         }
 *       ]
 *    }
 *    
 * @apiSuccess {json} resp_result
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    "resultCode": 0,
 *    "resultInfo": "SUCCESS",
 *    "data": ""
 * }
 * @apiSampleRequest /upload/multi
 * @apiVersion 1.0.0
 */
router.post('/multi', jwtMiddleWare, upload.array('file', 8), function (req, res, next) {
    console.log("req.files:", JSON.stringify(req.files));
    const [] = req.files;
    var paths = [];

    // for (var i = 0; i < req.files.length; i++) {
    Promise.all(req.files.map((element, index) => {
        const { originalname, mimetype, destination, filename, size } = element;
        if (size > MaxSize) { throw new Exception(-1, "上传文件:" + size + "，已超上限:" + MaxSize); }
        // var fileName = req.files[i].filename;
        // var sourceFile = req.files[i].path.replace(/\\/g, "/");
        var extend = "." + originalname.split('.').pop();
        console.log("extend:", extend);
        //目标路径
        var destDir = req.body.dir == undefined ? dest : req.body.dir;
        console.log("destDir:" + destDir);
        //源文件
        var sourceFile = element.path;
        console.log("sourceFile:" + sourceFile);
        //目标文件
        var destPath = path.join(destDir, filename);
        destPath = destPath + extend;
        console.log("destPath:" + destPath);
        //目标路径
        var dest_Dir = path.join(destDir);
        console.log("dest_Dir:" + dest_Dir);
        //文件URL
        var fileurl = uploadFileDomin + destPath.substr(destPath.indexOf("files"));
        console.log("fileurl:" + fileurl);
        fileurl = fileurl.replace(/\\/g, "/");
        // var fileurl = uploadFileDomin + path.substr(path.indexOf("files")).replace('\\', '/');
        paths.push(fileurl);

        return new Promise((resolve, reject) => {
            fs.exists(dest_Dir, function (exists) {
                if (exists) {
                    fs.rename(sourceFile, destPath, function (err) {
                        resolve({
                            error: err,
                            data: paths
                        })

                    });
                }
                else {
                    fs.mkdir(dest_Dir, '0777', function (err) {
                        if (err) {
                            resolve({
                                error: err,
                                data: null
                            })
                        } else {
                            fs.rename(sourceFile, destPath, function (err) {
                                resolve({
                                    error: err,
                                    data: paths
                                })
                            });

                        }
                    })
                }
            });
        })

    })).then(result => {
        let errors = result.filter(o => {
            return o.error != null || o.error != undefined
        })
        if (!isNull(errors)) {
            res.json({ resultCode: -1, resultInfo: "上传失败" });
        } else {
            let data = result.map(o => {
                return o.data
            }).flat()
            res.json({ resultCode: 0, resultInfo: "SUCCESS", data: Array.from(new Set(data)) });
        }
    }).catch(e => {
        res.json({ resultCode: -1, resultInfo: e.message });
    })

});

module.exports = router;
