const { findOptionFormat } = require("../../utils/utils");

const createOne = `INSERT INTO tf_o_crop_abnormal SET ? `;

const updateById = `UPDATE tf_o_crop_abnormal SET ?  WHERE refId=? `;

const deleteById = `DELETE FROM tf_o_crop_abnormal WHERE refId=? `;

const deleteAll = `DELETE FROM tf_o_crop_abnormal `;

const findById = `
SELECT 
refId,
name,
type,
remark,
createTime,
creator,
updateTime,
updator
FROM tf_o_crop_abnormal
where 1=1
AND refId=? `;

const findAll = (findOptions) => `
SELECT 
refId,
name,
type,
remark,
createTime,
creator,
updateTime,
updator
FROM tf_o_crop_abnormal
WHERE 1=1
${findOptionFormat(findOptions)}
ORDER BY createTime desc, refId DESC`;


//total
const recordCount = (findOptions) => `
SELECT count(1) total
FROM tb_system_role
WHERE  1=1  ` + findOptionFormat(findOptions);

const findPageList = (findOptions, limit, order) => `
SELECT 
roleId,
roleCode,
roleName,
description,
isActive,
createTime,
creator,
updateTime,
updator,
orgCode
FROM tb_system_role
WHERE 1=1 `
    + findOptionFormat(findOptions) +
    ` ORDER BY ${order ? order : 'createTime desc, roleId DESC'}
${limit ? `LIMIT ?` : ''} `;





module.exports = { createOne, updateById, deleteById, findById, findAll, recordCount, findPageList, deleteAll };