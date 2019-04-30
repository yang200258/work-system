import ss from './sessionStorage'

// http://www.cnblogs.com/cloud-/p/7103054.html



/**
 * 创建代理二级属性的handler函数
 * @param {String} ssKey sessionStorage的key
 * @param {String} key 一级属性的key
 */
function createHandler(ssKey, fk) {
    return {
        set: function(target, key, value) {
            let item = ss.getItem(ssKey)
            if (item && item[fk]) {
                item[fk][key] = value

            }
        }
    }

}

/**
 * 代理state
 * @param {*} initstate 初始化的state
 * @param {String} ssKey  sessionStorage的key
 * @param {Array} keys   需要存储的key
 */
const proxy = function(initstate, ssKey, keys) {
    let obj = Object.assign({}, initstate, ss.getItem(ssKey))
        //代理二级属性
    keys.forEach(item => {
        obj[item] = new Proxy(obj[item], createHandler(ssKey, item))
    })
}





export default { proxy }