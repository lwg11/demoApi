const model = require('./model');
const { sqlPromise } = require('../../utils/sqlPromise');
const sd = require('silly-datetime');

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
    console.log('params--->',params);
    let currentTime=sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
    const MergeTime = [...params,...[currentTime]]
    console.log('MergeTime--->',MergeTime);

    return sqlPromise(model.logAddOne, MergeTime)
};

//查询日志
const logs = () => {
    return sqlPromise(model.logs)
};

//查询菜单列表
const menu = () => {
    return sqlPromise(model.menu)
};

//查询菜单列表
const role = () => {
    return sqlPromise(model.role)
};

//分页列表
const findPageList = (params, findOptions, limit, order) => {
    return Promise.all([sqlPromise(model.recordCount(findOptions), params), sqlPromise(model.findPageList(findOptions, limit, order), [...params, limit])])
};

module.exports = { userList, userByPhone, registerOne, logAddOne, logs, roleMenuList, menu, role, findPageList }


