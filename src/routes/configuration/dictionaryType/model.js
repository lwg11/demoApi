const { findOptionFormat } = require("../../../utils/utils");

const createOne = `INSERT INTO tf_dictionary_page_type SET ? `;

const updateById = `UPDATE tf_dictionary_page_type SET ?  WHERE refId=? `;

const deleteById = `DELETE FROM tf_dictionary_page_type WHERE refId=? `;

const deleteAll = `DELETE FROM tf_dictionary_page_type `;

//获取商品详情
const findById = `
SELECT 
d.refId,
d.moduleName,
d.pageName,
d.name,
d.createTime,
d.creator,
d.updateTime,
d.updator,
d.remark
FROM tf_dictionary_page_type d
where 1=1
and d.delFlag= 0

AND d.refId=? `;

//查询所有记录，用来防止插入重复数据
const findAll = (findOptions) => `
SELECT 
d.refId,
d.moduleName,
d.pageName,
d.name,
d.createTime,
d.creator,
d.updateTime,
d.updator,
d.remark
FROM tf_dictionary_page_type d
WHERE 1=1
and d.delFlag= 0

${findOptionFormat(findOptions)}
ORDER BY d.createTime desc, d.refId DESC`;

// 获取总记录数
const recordCount = (findOptions) => `
SELECT count(1) total
FROM tf_dictionary_page_type d
WHERE  1=1  and  d.delFlag= 0 
 ` + findOptionFormat(findOptions);

const findPageList = (findOptions, limit, order) => `
SELECT 
d.refId,
d.moduleName,
d.pageName,
d.name,
d.createTime,
d.creator,
d.updateTime,
d.updator,
d.remark
FROM tf_dictionary_page_type d
WHERE 1=1 
and d.delFlag= 0
`
    + findOptionFormat(findOptions) +
    ` ORDER BY ${order ? order : ' d.createTime desc, d.refId DESC'}
${limit ? `LIMIT ?` : ''} `;

module.exports = { createOne, updateById, deleteById, findById, findAll, recordCount, findPageList, deleteAll };