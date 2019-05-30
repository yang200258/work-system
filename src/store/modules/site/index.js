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
    getInialDevice({ commit }, data) {
        return new Promise((resolve, reject) => {
            axios({
                url: `/es/offices/getDevice?page=${data.page}&size=${data.size}&officeId=${data.officeId}`,
                method: 'post',
            }).then(res => {
                console.log('获取考勤地点对应已添加设备', res);
                if (res) {
                    commit('setAddEquips', res.content)
                    const deviceid = res.content.map(item => item.id)
                    commit('setInialDeviceId', deviceid)
                    resolve(res)
                }
            }).catch(err => {
                reject(err)
            })
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}