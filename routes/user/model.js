// const { findOptionFormat } = require("../../utils/utils");

// const  updateByMobile = `update ts_o_system_user set ? where mobile= ? and delFlag = 0 `
// const  updateByUserNo = `update ts_o_system_user set ? where userNo= ? and delFlag = 0 `
// const  createOne = `insert into  ts_o_system_user set ?  `

// const userByPhone = ` select 
// refId,
// userNo,
// userName,
// mobile,
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
// where mobile = ? 
// and delFlag= 0
// `

// module.exports = {updateByMobile,userByPhone,updateByUserNo,createOne };


const userList = `select userId,userName,passWord,mobile,email,headImage,createTime,creator,updateTime,updator,delFlag,isActive,organizationId,roleId from tb_system_user where userName = ? and delFlag= 0`


module.exports = { userList };