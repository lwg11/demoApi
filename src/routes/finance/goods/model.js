const { findOptionFormat } = require("../../../utils/utils");

const createOne=`INSERT INTO tf_o_consumable_goods SET ? `;

const updateById=`UPDATE tf_o_consumable_goods SET ?  WHERE refId=? `;

const deleteById=`DELETE FROM tf_o_consumable_goods WHERE refId=? `;

const deleteAll=`DELETE FROM tf_o_consumable_goods `;

const findById=`
SELECT 
g.refId,
g.goodsType,
g.name,
g.unit,
g.factoryId,
g.brand,
g.remark,
g.createTime,
g.creator,
g.updateTime,
g.updator,
f.name factoryName,
t.name goodsTypeName
FROM tf_o_consumable_goods g
left join tf_o_consumable_goods_type t  on t.refId = g.goodsType
left join tf_o_goods_factory f on f.refId = g.factoryId
where 1=1
and g.delFlag= 0

AND g.refId=? `;

const findAll=(findOptions)=>`
SELECT 
g.refId,
g.goodsType,
g.name,
g.unit,
g.factoryId,
g.brand,
g.remark,
g.createTime,
g.creator,
g.updateTime,
g.updator,
f.name factoryName,
t.name goodsTypeName
FROM tf_o_consumable_goods g
left join tf_o_consumable_goods_type t  on t.refId = g.goodsType
left join tf_o_goods_factory f on f.refId = g.factoryId
WHERE 1=1
and g.delFlag= 0

${findOptionFormat(findOptions)}
ORDER BY g.createTime desc, g.refId DESC`;

const recordCount=(findOptions) => `
SELECT count(1) total
FROM tf_o_consumable_goods g
left join tf_o_consumable_goods_type t  on t.refId = g.goodsType
left join tf_o_goods_factory f on f.refId = g.factoryId
WHERE  1=1  and  g.delFlag= 0 
 ` + findOptionFormat(findOptions);

const findPageList=(findOptions,limit,order) => `
SELECT 
g.refId,
g.goodsType,
g.name,
g.unit,
g.factoryId,
g.brand,
g.remark,
g.createTime,
g.creator,
g.updateTime,
g.updator,
f.name factoryName,
t.name goodsTypeName
FROM tf_o_consumable_goods g
left join tf_o_consumable_goods_type t  on t.refId = g.goodsType
left join tf_o_goods_factory f on f.refId = g.factoryId
WHERE 1=1 
and g.delFlag= 0
`
+findOptionFormat(findOptions)+
` ORDER BY ${order ? order : ' g.createTime desc, g.refId DESC' }
${limit ? `LIMIT ?` : ''} `;

module.exports = {createOne,updateById,deleteById,findById,findAll,recordCount,findPageList,deleteAll};