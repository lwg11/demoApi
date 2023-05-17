const express = require('express');
const router = express.Router();
const sql = require('../../config/db');
const { getClientIP, isNull, toMenuTree } = require('../../utils/utils');
const sd = require('silly-datetime');
const sqlError = require('../../utils/sqlError');
const jwt = require('jsonwebtoken');

let currentTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
const expiresIn = 3 * 60;
const secretKey = 'dolphin.2020';

router.post('/logins', (req, res) => {
    console.log('req--body--->', req.body);

    const { userName, passWord } = req.body;
    let remark = "";
    let ip = getClientIP(req);
    console.log("ip:", ip);
    let logSqlStr = `insert into tb_system_logs (ip,remark,createTime,creator) values (?,?,sysdate(),?)`;
    let sqlStr = 'select userId,userName,passWord,mobile,email,headImage,createTime,creator,updateTime,updator,delFlag,isActive,organizationId,roleId from tb_system_user where userName = ? and passWord = ?'
    sql.query(sqlStr, [userName, passWord], function (err, results) {
        console.log('results+++--->', results);
        if (err) {
            console.log("登录--err:", err);
            res.json({ resultCode: -1, resultInfo: sqlError[err.errno] })
        } else if (results && results.length == 0) {
            console.log("[userName,  passWord]:", [userName, passWord]);
            remark = "账户或密码错误";
            res.json({ resultCode: -1, resultInfo: "账户或密码错误，忘记密码请与管理人员联系。" })
            sql.query(logSqlStr, [ip, remark, userName], function (err) {
                if (err) {
                    console.error("==>出错了:", err);
                    res.json({ resultCode: -1, resultInfo: sqlError[err.errno] });
                }
                res.json({ resultCode: -1, resultInfo: "账户或密码错误，忘记密码请与管理人员联系。" })
            })
        }
        else {
            let currentUser = results[0]
            if (currentUser.isActive != 1) {
                res.json({ resultCode: -1, resultInfo: "该用户未启用,请联系管理员" })
            }
            else {
                remark = "登录成功";
                sql.query(logSqlStr, [ip, remark, userName], function (err) {
                    if (err) {
                        console.error("==>出错了:", err);
                        res.json({ resultCode: -1, resultInfo: sqlError[err.errno] });
                    }
                })
                loginuserId = results[0].userId;
                const user = {
                    userId: results[0].userId,
                    userName: results[0].realName,
                }
                const token = jwt.sign(user, secretKey, { expiresIn: expiresIn });

                user.mobile = results[0].mobile;
                user.email = results[0].email;
                user.headImage = results[0].headImage;
                user.createTime = results[0].createTime;
                user.updateTime = results[0].updateTime;
                user.isActive = results[0].isActive;

                user.menuList = [];
                if (!isNull(results[0].roleId)) {
                    let sqlStr = `select m.menuId,m.menuName,m.menuCode,m.menuIcon,m.parentId,m.menuState,m.menuType,m.rightCode, m.menuSort 
				from tb_system_role_menu r
				left join tb_system_menu m on r.menuId=m.menuId
				where 1=1
				and m.menuState=1 
				and r.roleId= ?
				order by  m.menuSort asc`;
                    sql.query(sqlStr, [results[0].roleId], function (err, data) {
                        if (err) {
                            console.error("==>出错了:", err);
                            res.json({ resultCode: -1, resultInfo: sqlError[err.errno] });
                        } else {
                            console.log("data:", data);
                            if (isNull(data)) {
                                res.json({ resultCode: -1, resultInfo: "用户未授权" });
                            }
                            else {
                                user.menuList = toMenuTree(data);
                                res.json({ resultCode: 0, resultInfo: "SUCCESS", data: { token, ...user } });
                            }
                        }

                    });
                } else{
                    res.json({ resultCode: -1, resultInfo: "用户暂未绑定角色" });
                }

            }

        }
    })

})

module.exports = router;