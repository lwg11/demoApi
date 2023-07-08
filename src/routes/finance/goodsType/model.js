const { findOptionFormat } = require("../../../utils/utils");

const createOne=`INSERT INTO tf_consumable_goods_type SET ? `;

const updateById=`UPDATE tf_consumable_goods_type SET ?  WHERE refId=? `;

const deleteById=`DELETE FROM tf_consumable_goods_type WHERE refId=? `;

const deleteAll=`DELETE FROM tf_consumable_goods_type `;

const findById=`
SELECT 
refId,
name,
remark,
createTime,
creator,
updateTime,
updator
FROM tf_consumable_goods_type 
WHERE delFlag=0

AND refId=? `;

const findAll=(findOptions)=>`
SELECT 
refId,
name,
expenditure,
remark,
createTime,
creator,
updateTime,
updator
FROM tf_consumable_goods_type
WHERE delFlag=0

${findOptionFormat(findOptions)}
ORDER BY updateTime desc, refId DESC`;

const recordCount=(findOptions) => `
SELECT count(1) total
FROM tf_consumable_goods_type
WHERE delFlag=0  

` + findOptionFormat(findOptions);

const findPageList=(findOptions,limit) => `
SELECT 
refId,
name,
expenditure,
remark,
createTime,
creator,
updateTime,
updator
FROM tf_consumable_goods_type
WHERE delFlag=0 
`
+findOptionFormat(findOptions)+
` ORDER BY updateTime desc, refId DESC
${limit ? `LIMIT ?` : ''} `;

module.exports = {createOne,updateById,deleteById,findById,findAll,recordCount,findPageList,deleteAll};