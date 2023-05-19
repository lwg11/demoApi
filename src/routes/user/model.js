/**
 * 查询用户信息
 * @userNo 用户账号
 * @passWord 用户密码
 */
const userList = 'select userId,userNo,name,passWord,phone,email,headImage,createTime,creator,updateTime,updator,delFlag,isActive,organizationId,roleId from tb_system_user where userNo = ? and passWord = ?'

/**
 * 查询用户信息 用于登录账号时查询该手机号是否已经注册
 * @phone 用户手机
 * @passWord 用户密码
 */
const userByPhone = `select userId,userNo,name,passWord,phone,email,headImage,createTime,creator,updateTime,updator,delFlag,
isActive,organizationId,roleId
from tb_system_user where phone = ? and delFlag= 0`


/**
 * 注册用户信息
 */
const registerOne = `insert into  tb_system_user set ?  `

/**
 * 新增日志信息 登录日志
 */
const logAddOne = `insert into tb_system_logs (ip,remark,createTime,creator) values (?,?,sysdate(),?)`;



module.exports = { userList, userByPhone, registerOne,logAddOne };