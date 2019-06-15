import _ from 'lodash'
const util = {
    /**
     * 判断数组初始状态及终止状态对应新增及删除元素及更改后的遗留初始元素
     * @param {Array} initial 
     * @param {Array} final 
     * @param {String} id  识别根据何字段区分
     * @description 应用于考勤设备、考勤组、考勤地点等接口提交
     */
    addDelArr: function(initial, final, id) {
        let addArr = _.differenceBy(final, initial, id)
        let delArr = _.differenceBy(initial, final, id)
        let editArr = _.intersectionBy(final, initial, id)
        return { addArr, delArr, editArr }
    },
    //判断字符串是否为空
    isStringEmpty: function(s) {
        if (s == '') return true
        const reg = /^[ ]+$/
        return reg.test(s)
    },
    //处理时间格式
    filterDate: function(date) {
        if (!date) return ''
        const year = date.getFullYear()
        const month = ((date.getMonth() + 1) >= 10) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))
        const day = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate()
        return year + '/' + month + '/' + day
    },
    //根据给出数组判断打卡方式
    filterClockType: function(arr) {
        if (arr) {
            const list = []
            const value = ['蓝牙', 'WIFI', '', '', 'GPS']
            arr.forEach(item => {
                list.push(value[item])
            })
            return list.join(';')
        } else {
            return '无'
        }
    },
    //根据给出数组返回工作日
    filterWorkDay: function(obj) {
        const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        const list = []
        if (obj) {
            days.forEach((item, i) => {
                if (obj[`w${i+1}`]) list.push(item)
            })
            return list
        } else {
            return '无'
        }
    },
    //转换工作日
    transformWorkday: function(arr) {
        const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        const obj = { w1: false, w2: false, w3: false, w4: false, w5: false, w6: false, w7: false }
        if (arr.length) {
            arr.forEach((item) => {
                obj[`w${days.indexOf(item)+1}`] = true
            })
        }
        return obj
    },
}


export default util