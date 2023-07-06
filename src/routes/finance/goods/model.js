const { findOptionFormat } = require("../../../utils/utils");

const createOne = `INSERT INTO tf_consumable_goods_bill SET ? `;

const updateById = `UPDATE tf_consumable_goods_bill SET ?  WHERE refId=? `;

const deleteById = `DELETE FROM tf_consumable_goods_bill WHERE refId=? `;

const deleteAll = `DELETE FROM tf_consumable_goods_bill `;

//获取商品详情
const findById = `
SELECT 
b.refId,
b.goodsName,
b.goodsPrice,
b.number,
b.goodsType,
b.unit,
b.createTime,
b.creator,
b.updateTime,
b.updator,
b.remark,
t.name goodsTypeName
FROM tf_consumable_goods_bill b
left join tf_consumable_goods_type t  on t.refId = b.goodsType
where 1=1
and b.delFlag= 0

AND b.refId=? `;

//查询所有记录，用来防止插入重复数据
const findAll = (findOptions) => `
SELECT 
b.refId,
b.goodsName,
b.goodsPrice,
b.number,
b.goodsType,
b.unit,
b.createTime,
b.creator,
b.updateTime,
b.updator,
b.remark,
t.name goodsTypeName
FROM tf_consumable_goods_bill b
left join tf_consumable_goods_type t  on t.refId = b.goodsType
WHERE 1=1
and b.delFlag= 0

${findOptionFormat(findOptions)}
ORDER BY b.createTime desc, b.refId DESC`;

// 获取总记录数
const recordCount = (findOptions) => `
SELECT count(1) total
FROM tf_consumable_goods_bill b
left join tf_consumable_goods_type t  on t.refId = b.goodsType
WHERE  1=1  and  b.delFlag= 0 
 ` + findOptionFormat(findOptions);



const findPageList = (findOptions, limit, order) => `
SELECT 
b.refId,
b.goodsName,
b.goodsPrice,
b.number,
b.goodsType,
b.unit,
b.createTime,
b.creator,
b.updateTime,
b.updator,
b.remark,
t.name goodsTypeName
FROM tf_consumable_goods_bill b
left join tf_consumable_goods_type t  on t.refId = b.goodsType
WHERE 1=1 
and b.delFlag= 0
`
    + findOptionFormat(findOptions) +
    ` ORDER BY ${order ? order : ' b.createTime desc, b.refId DESC'}
${limit ? `LIMIT ?` : ''} `;

module.exports = { createOne, updateById, deleteById, findById, findAll, recordCount, findPageList, deleteAll };