const model = require('./model');
const { sqlPromise } = require('../../utils/sqlPromise');

//根据用户名称查询
const userList = (params) => {
    return sqlPromise(model.userList, params)
};

// 查询用户信息 用于登录账号时查询该手机号是否已经注册
const userByPhone = (params) => {
    return sqlPromise(model.userByPhone, params)
};

//查询角色表信息和菜单表信息
const roleMenuList = (params) => {
    return sqlPromise(model.roleMenuList, params)
};

//新增 注册用户信息
const registerOne = (params) => {
    return sqlPromise(model.registerOne, params)
};

//新增登录日志
const logAddOne = (params) => {
    return sqlPromise(model.logAddOne, params)
};

module.exports = { userList, userByPhone, registerOne, logAddOne, roleMenuList }


