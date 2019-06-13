import axios from '@/utils/ajax'
const state = {
    id: 0,
    name: '',
    clockOrder: { clockTimes: 2, clockTime: [], workDay: [], applyFestival: false, clockStartTime: '' },
    initialClockSite: [{ groupOfficeId: 1, officeId: 1, OfficeName: '北京', clockType: [{ type: 0, enable: true }, { type: 1, enable: true }, { type: 4, enable: true }], scope: 10 },
        { groupOfficeId: 1, officeId: 2, OfficeName: '海口', clockType: [{ type: 0, enable: true }, { type: 4, enable: false }], scope: 20 },
        { groupOfficeId: 1, officeId: 2, OfficeName: '海口', clockType: [{ type: 0, enable: true }] }
    ], //初始状态已添加考勤地点（编辑时用到）
    clockSite: [],
    initialClockUser: [], //初始状态已添加考勤成员（编辑时用到）
    clockUserId: [],
    specialDate: [{ date: '', type: '', user: '', workTime: [] }]
}

const mutations = {
    setName: (state, data) => {
        state.name = data
    },
    setId: (state, data) => {
        state.id = data
    },
    setClockOrder: (state, data) => {
        state.clockOrder = data
    },
    setClockCount: (state, data) => {
        state.clockOrder.clockTimes = data
    },
    setClockTime: (state, data) => {
        state.clockOrder.clockTime = data
    },
    setClockStartTime: (state, data) => {
        state.clockOrder.clockStartTime = data
    },
    setWorkDay: (state, data) => {
        state.clockOrder.workDay = data
    },
    setAutoRest: (state, data) => {
        state.clockOrder.applyFestival = data
    },
    setInitialClockSite: (state, data) => {
        state.initialClockSite = data
    },
    setClockSite: (state, data) => {
        state.clockSite = data
    },
    setInitialClockUser: (state, data) => {
        state.initialClockUser = data
    },
    setClockType: (state, data) => {
        state.clockSite[data.i] = data.item
    }
}

const actions = {
    //新建考勤组
    addGroup({ commit }, data) {
        return new Promise((resolve, reject) => {
            axios({
                url: '/es/clockGroups/save',
                method: 'post',
                data: data
            }).then(res => {
                if (res) {
                    commit('setName', data.name)
                    commit('setId', res.id)
                    resolve(res)
                } else {
                    reject(res)
                }
            }).catch(err => {
                reject(err)
            })
        })

    },
    //修改考勤组名称
    editName({ state, commit }, data) {
        let id = state.id
        return new Promise((resolve, reject) => {
            axios({
                url: '/es/clockGroups/edit',
                method: 'post',
                data: { name: data, id }
            }).then(res => {
                if (res) {
                    commit('setName', data)
                    resolve(res)
                } else {
                    reject(res)
                }
            }).catch(err => {
                reject(err)
            })
        })
    },
    //操作考勤组时添加考勤地点数据
    addClockSite({ state, commit }, clockInfo) {
        const list = state.clockSite
        list.push(clockInfo)
        commit('setClockSite', list)
    },
    //编辑考勤组时获取已添加的考勤地点数据
    getAddClockSite({ commit, state }) {
        return new Promise((resolve, reject) => {
            axios({
                url: `/es/groupOffices/get`,
                method: 'post',
                data: { clockGroupId: state.id }
            }).then(res => {
                if (res) {
                    console.log(res);
                    // commit('setClockSite', res.content)
                    commit('setInitialClockSite', res.content)
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