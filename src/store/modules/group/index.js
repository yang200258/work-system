import axios from '@/utils/ajax'
const state = {
    name: '',
    clockOrder: { clockCount: 0, clockTime: [], workDay: [], autorest: false },
    clockSite: [],
    clockUserId: [],
    specialDate: [{ date: '', type: '', user: '', workTime: [] }]
}

const mutations = {
    setName: (state, data) => {
        state.name = data
    },
    setClockOrder: (state, data) => {
        state.clockOrder = data
    },
    setClockCount: (state, data) => {
        state.clockOrder.clockCount = data
    },
    setClockTime: (state, data) => {
        state.clockOrder.clockTime = data
    },
    setWorkDay: (state, data) => {
        state.clockOrder.workDay = data
    },
    setAutoRest: (state, data) => {
        state.clockOrder.autorest = data
    },
    setClockSite: (state, data) => {
        state.clockSite = data
    },
    setClockType: (state, data) => {
        state.clockSite[data.i] = data.item
    }
}

const actions = {
    //操作考勤组时添加考勤地点数据
    addClockSite({ state, commit }, clockInfo) {
        const list = state.clockSite
        list.push(clockInfo)
        commit('setClockSite', list)
    },
    //编辑考勤组时获取已添加的考勤地点数据
    getAddClockSite({ commit }) {
        return new Promise((resolve, reject) => {
            axios({
                url: '********',
                method: 'get',
                data: {}
            }).then(res => {
                if (res) {
                    commit('setClockSite', res.content)
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