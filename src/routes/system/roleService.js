
const roleModel =require('./roleModel');
const { sqlPromise, sqlExecTransPromise } = require('../../utils/sqlPromise');
const { _get, isNull } = require('../../utils/utils');
const sd = require('silly-datetime');

//新增
const createOne = (params)=>{
  return sqlPromise(roleModel.createOne,params)
};

//编辑
const updateById = (params)=>{
  return sqlPromise(roleModel.updateById,params)
};

//编辑
const update = (params)=>{
  return sqlPromise(roleModel.updateById,params)
};

//删除
const deleteById = (params)=>{
  return sqlPromise(roleModel.deleteById,params)
};

//根据ID查看详情
const findById = (params)=>{
  return sqlPromise(roleModel.findById,params)
};

//所有记录
const findAll = (params,findOptions)=>{
  return sqlPromise(roleModel.findAll(findOptions),params)
};

//分页列表
const findPageList = (params,findOptions,limit,order)=>{
  return Promise.all([sqlPromise(roleModel.recordCount(findOptions),params),sqlPromise(roleModel.findPageList(findOptions,limit,order),[...params,limit])])
};

//删除全部
const deleteAll = (params)=>{
  return sqlPromise(roleModel.deleteAll,params)

};


module.exports = {createOne,updateById,findById,deleteById,findAll,findPageList,deleteAll};