import axios from '@/utils/ajax.js'
const state = {
    siteInfo: {},
    equips: [],
    addEquips: [],
    inialDeviceId: []
}

const mutations = {
    setSiteInfo: (state, data) => {
        state.siteInfo = data
    },
    setInfoName: (state, data) => {
        state.siteInfo.name = data
    },
    setEquips: (state, data) => {
        state.equips = data
    },
    setAddEquips: (state, data) => {
        state.addEquips = data
    },
    setInialDeviceId: (state, data) => {
        state.inialDeviceId = data
    },
    clearSiteInfo: (state) => {
        state.addEquips = state.equips = state.inialDeviceId = []
        state.siteInfo = {}
    }
}

const actions = {
    async getInialDevice({ commit }, data) {
        let res = await axios({ url: `/es/offices/getDevices?page=${data.page}&size=${data.size}&officeId=${data.officeId}`, method: 'post' })
        console.log('获取考勤地点对应已添加设备', res);
        if (res) {
            commit('setAddEquips', res.content)
            const deviceid = res.content.map(item => item.id)
            commit('setInialDeviceId', deviceid)
        }
        return res
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}