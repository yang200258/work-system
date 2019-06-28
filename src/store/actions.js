import axios from '@/utils/ajax.js'
export default {
    //获取机构数据
    // eslint-disable-next-line
    async getOrganization({}, data) {
        console.log(data)
        let res = await axios({ url: `/sys/organizations?id=${data.id}&level=${data.level}`, method: 'get' })
        console.log('查询到的机构数据', res)
        return res
    },
}