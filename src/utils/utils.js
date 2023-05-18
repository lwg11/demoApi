function orderCode() {
    var orderCode = '';
    for (var i = 0; i < 6; i++) //6位随机数，用以加在时间戳后面。
    {
        orderCode += Math.floor(Math.random() * 10);
    }
    orderCode = new Date().getTime() + orderCode;  //时间戳，用来生成订单号。
    console.log(orderCode)
    return orderCode;
}

const findOptionFormat = (findOptions) => {
    if (isNull(findOptions)) {
        return ''
    } else {
        return " AND " + findOptions.map(o => {
            return `${o.key} ${isNull(o.type) ? '= ? ' : o.type === 'original' ? '' : `${o.type} ? `}  `
        }).join(' AND ')
    }

}

function toMenuTree(data) {
    // 删除 所有 children,以防止多次调用
    data.forEach(function (item) {
        if (!isNull) {
            delete item.children;
        }
    });

    // 将数据存储为 以 id 为 KEY 的 map 索引数据列
    var map = {};
    data.forEach(function (item) {
        map[item.menuId] = item;
    });
    //        console.log(map);
    var val = [];
    data.forEach(function (item) {
        // 以当前遍历项，的pid,去map对象中找到索引的id
        var parent = map[item.parentId];
        // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
        if (parent) {
            (parent.children || (parent.children = [])).push(item);
        } else {
            //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
            val.push(item);
        }
    });
    return val;
}

/** 
* 判断是否null 
* @param data 
*/
function isNull(data) {
    if (data === 0) { return false }
    return (data == "" || data == undefined || data == null);
}

/**
 * @getClientIP
 * @desc 获取用户 ip 地址
 * @param {Object} req - 请求
 */
function getClientIP(req) {
    var ip = req.headers['x-forwarded-for'] ||
        req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
    if (ip.split(',').length > 0) {
        ip = ip.split(',')[0];
    }
    return ip.replace('::ffff:', '');
};

module.exports = { getClientIP, isNull, toMenuTree, findOptionFormat, orderCode }