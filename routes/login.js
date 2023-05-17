var express = require('express');
var router = express.Router();
var db = require('../config/db.js');

router.post('/login', function (req, res, next) {
  //获取到用户输入的内容
  var val = req.body;
  var userName = val.userName;
  var passWord = val.passWord;
  //查询数据
  db.query('select userId,userName,passWord,mobile,email,headImage,createTime,creator,updateTime,updator,delFlag,isActive,organizationId,roleId from tb_system_user where userName = ? and passWord = ?', [userName, passWord], function (err, data) {
    if (err) {
      throw err;
    } else if (data.length > 0) {
      console.log('成功', data);
      res.send(data)
    } else {
      res.end('用户名或密码有误~!++');
    }
  })
});

module.exports = router;