const { findOptionFormat } = require("../../utils/utils");

const createOne = `INSERT INTO tf_weather_city SET ? `;

const updateById = `UPDATE tf_weather_city SET ?  WHERE Location_ID=? `;

const deleteById = `DELETE FROM tf_weather_city WHERE Location_ID=? `;

const deleteAll = `DELETE FROM tf_weather_city `;

//获取商品详情
const findById = `
SELECT 
w.Location_ID,
w.Location_Name_EN,
w.Location_Name_ZH,
w.ISO_3166_1,
w.Country_Region_EN,
w.Country_Region_ZH,
w.Adm1_Name_EN,
w.Adm1_Name_ZH,
w.Adm2_Name_EN,
w.Adm2_Name_ZH,
w.Timezone,
w.Latitude,
w.Longitude,
w.Adcode
FROM tf_weather_city w
where 1=1
AND w.Location_ID=? `;

//查询所有记录，用来防止插入重复数据
const findAll = (findOptions) => `
SELECT 
w.Location_ID,
w.Location_Name_EN,
w.Location_Name_ZH,
w.ISO_3166_1,
w.Country_Region_EN,
w.Country_Region_ZH,
w.Adm1_Name_EN,
w.Adm1_Name_ZH,
w.Adm2_Name_EN,
w.Adm2_Name_ZH,
w.Timezone,
w.Latitude,
w.Longitude,
w.Adcode
FROM tf_weather_city w
WHERE 1=1

${findOptionFormat(findOptions)}
ORDER BY w.createTime desc, w.refId DESC`;

// 获取总记录数
const recordCount = (findOptions) => `
SELECT count(1) total
FROM tf_weather_city w
WHERE  1=1
 ` + findOptionFormat(findOptions);

const findPageList = (findOptions, limit, order) => `
SELECT 
w.Location_ID,
w.Location_Name_EN,
w.Location_Name_ZH,
w.ISO_3166_1,
w.Country_Region_EN,
w.Country_Region_ZH,
w.Adm1_Name_EN,
w.Adm1_Name_ZH,
w.Adm2_Name_EN,
w.Adm2_Name_ZH,
w.Timezone,
w.Latitude,
w.Longitude,
w.Adcode
FROM tf_weather_city w
WHERE 1=1 
`
    + findOptionFormat(findOptions) +
    ` ORDER BY ${order ? order : 'CONVERT (w.Location_Name_ZH USING gbk) ASC'}
${limit ? `LIMIT ?` : ''} `;

// utf8mb4_general_ci

module.exports = { createOne, updateById, deleteById, findById, findAll, recordCount, findPageList, deleteAll };