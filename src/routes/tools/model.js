const { findOptionFormat } = require("../../utils/utils");

/**
 * 查询用户信息
 * @userNo 用户账号
 * @passWord 用户密码
 */
// const userList = `select userId,userNo,name,passWord,phone,email,headImage,createTime,creator,updateTime,updator,delFlag,isActive,organizationId,roleId 
// from tb_system_user where userNo = ? and passWord = ?`
const userList = `select userId,userNo,name,passWord,phone,email,headImage,createTime,creator,updateTime,updator,delFlag,isActive,organizationId,roleId 
from tb_system_user where (userNo = ? or phone = ?) and passWord = ?`

/**
 * 查询用户信息 用于登录账号时查询该手机号是否已经注册
 * @phone 用户手机
 * @passWord 用户密码
 */
const userByPhone = `select userId,userNo,name,passWord,phone,email,headImage,createTime,creator,updateTime,updator,delFlag,
isActive,organizationId,roleId
from tb_system_user where phone = ? and delFlag= 0`

//查询角色表信息和菜单表信息
const roleMenuList = `select m.menuId,m.menuName,m.menuCode,m.menuIcon,m.parentId,m.menuState,m.menuType,m.rightCode, m.menuSort 
from tb_system_role_menu r
left join tb_system_menu m on r.menuId=m.menuId
where 1=1
and m.menuState=1 
and r.roleId= ?
order by  m.menuSort asc`;

/**
 * 注册用户信息
 */
const registerOne = `insert into  tb_system_user set ?  `
// const registerOne = `insert into tb_system_logs (ip,remark,createTime,creator) 
// values (?,?,sysdate(),?)`

/**
 * 新增日志信息 登录日志
 */
const logAddOne = `insert into tb_system_logs (ip,remark,createTime,creator,phone) values (?,?,sysdate(),?,?)`;

// 查询日志
const logs = `select refID,ip,remark,createTime,creator 
	from tb_system_logs
	order by createTime desc`

// 查询菜单列表
const menu = `Select menuId,menuName,menuType,parentId,menuCode,rightCode,menuSort,menuUrl,menuIcon,menuState,createTime,creator,updateTime,updateTime 
	from tb_system_menu 
	where 1=1 
	order by menuSort`

// 查询角色列表
const role = `select roleId,roleCode,roleName,createTime,creator,updateTime,updator from tb_system_role  where 1=1  `

const recordCount = (findOptions) => `
SELECT count(1) total
FROM tf_o_tea_land b
left join ts_o_system_user u on u.userNo = b.contact
left join tf_o_field fi on fi.refId =b.fieldId
left join tf_o_farms f on f.refId = fi.farmsCode
left join tf_o_customer c on c.customerId = f.orgCode
left join tf_o_collect_type t on b.cropId = t.refId
left join tf_o_nurture_criterion_type nct on t.currentCriterionType = nct.refId
WHERE  1=1  
AND b.delFlag=0
` + findOptionFormat(findOptions);

module.exports = { userList, userByPhone, registerOne, logAddOne, logs, roleMenuList, role, menu, recordCount };