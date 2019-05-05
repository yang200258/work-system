import ls from './localStorage'

// 参考：http://www.cnblogs.com/cloud-/p/7103054.html



/**
 * 创建代理二级属性的handler函数
 * @param {String} ssKey sessionStorage的key
 * @param {String} key 一级属性的key
 */
// function createHandler(ssKey, fk) {
//     return {
//         set: function(target, key, value, receiver) {
//             let item = ls.getItem(ssKey)
//             if (item && item[fk]) {
//                 item[fk][key] = value
//                 ls.setItem(ssKey, item)
//             }
//             return Reflect.set(target, key, value, receiver)
//         }
//     }
// }

/**
 * 仅仅存需要存放的数据
 * @param {*} source 
 * @param {*} keys 
 */
function copy(obj, keys = []) {
    if (!obj) {
        return obj
    }
    let d = Object.create(null)
    keys.forEach(k => { d[k] = obj[k] })
    return d
}



/**
 * 代理state
 * @param {*} initstate 初始化的state
 * @param {String} ssKey  存储至sessionStorage的key
 * @param {Array} keys   需要存储的keys列表
 */
const proxy = function(initstate, ssKey, keys) {
    console.log(initstate, ssKey, keys);
    let obj = Object.assign({}, initstate, ls.getItem(ssKey))
    let k = keys
        //代理二级属性
        // keys.forEach(item => {
        //     obj[item] = new Proxy(obj[item], createHandler(ssKey, item))
        // })

    //合并对象的值
    ls.setItem(ssKey, copy(obj, keys))
    return new Proxy(obj, {
        set: function(target, key, value, receiver) {
            k.indexOf(key) >= 0 && ls.setItem(ssKey, copy(target, keys))
            return Reflect.set(target, key, value, receiver)
        }
    })
}

export { proxy }