const model = require('./model');
const sqlPromise = require('../../utils/sqlPromise');

//根据用户名称查询
const userList = (params, findOptions) => {
    return sqlPromise(model.userList(findOptions), params)
};