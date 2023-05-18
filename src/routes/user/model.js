const { findOptionFormat } = require("../../utils/utils");

// const  updateByPhone = `update ts_o_system_user set ? where phone= ? and delFlag = 0 `
// const  updateByUserNo = `update ts_o_system_user set ? where userNo= ? and delFlag = 0 `
// const  createOne = `insert into  ts_o_system_user set ?  `

// const userByPhone = ` select 
// refId,
// userNo,
// userName,
// phone,
// realName,
// email,
// headImage,
// departId,
// isActive,
// roleId,
// createTime,
// creator,
// updateTime,
// updator,
// orgCode,
// remark
// from ts_o_system_user
// where phone = ? 
// and delFlag= 0
// `

// module.exports = {updateByPhone,userByPhone,updateByUserNo,createOne };


const userList = `select userId,userName,passWord,phone,email,headImage,createTime,creator,updateTime,updator,delFlag,isActive,organizationId,roleId 
from tb_system_user where userName = ? and delFlag= 0`

const createOne = `insert into  tb_system_user set ?  `

const userByPhone = ` select userId,userNo,name,passWord,phone,email,headImage,createTime,creator,updateTime,updator,delFlag,
isActive,organizationId,roleId
from tb_system_user where phone = ? and delFlag= 0`


module.exports = { userList, createOne, userByPhone };