import axios from '@/utils/ajax'
import utils from '@/utils/utils'
const state = {
    id: 0,
    name: '',
    clockOrder: { clockTimes: 2, workDaySet: [], applyFestival: false, clockStartTime: '' },
    initialClockSite: [], //初始状态已添加考勤地点（编辑时用到）
    clockSite: [],
    initialClockUser: [], //初始状态已添加考勤成员（编辑时用到）
    clockUser: [],
    initialDate: [],
    specialDate: [],
    countData: [{ type: 2, text: '两次', clockNum: [{ text: '工作时段 ', time: '' }, { text: '休息时段', time: '' }] }, { type: 4, text: '四次', clockNum: [{ text: '工作时段1', time: '' }, { text: '工作时段2', time: '' }] },
        { type: 6, text: '六次', clockNum: [{ text: '工作时段1', time: '' }, { text: '工作时段2', time: '' }, { text: '工作时段3', time: '' }] }
    ],
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
    // setClockTime: (state, data) => {
    //     state.clockOrder.scheduleItem = data
    // },
    setClockStartTime: (state, data) => {
        state.clockOrder.clockStartTime = data
    },
    setWorkDay: (state, data) => {
        state.clockOrder.workDaySet = data
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
    setClockUser: (state, data) => {
        state.clockUser = data
    },
    setClockType: (state, data) => {
        state.clockSite[data.t].clockType[data.i].enable = data.val
    },
    setScope: (state, data) => {
        state.clockSite[data.t].scope = data.val
    },
    setInitialDate: (state, data) => {
        state.initialDate = data
    },
    setSpecialDates: (state, data) => {
        state.specialDate = data
    },
    setCountData: (state, data) => {
        if (typeof(data.t) === 'number') {
            state.countData[data.i].clockNum[data.t].time = data.data
        } else {
            state.countData[data.i].clockNum = data.data
        }

    },
    clearCountData: (state) => {
        state.countData.forEach(item => {
            item.clockNum.forEach(t => {
                t.time = ''
            })
        })
    },
    initialData: (state) => {
        state.clockOrder = { clockTimes: 2, workDaySet: [], applyFestival: false, clockStartTime: '' }
        state.initialClockSite = state.clockSite = state.initialClockUser = state.initialDate = state.clockUser = state.specialDate = []
    },
    clearDate: (state) => {
        state.initialDate = state.specialDate = []
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
    //获取考勤组班次信息
    /* eslint-disable */
    getClockSchedual({ commit, state }) {
        return new Promise((resolve, reject) => {
            axios({
                url: `/es/regularSchedules/get?clockGroupId=${state.id}`,
                method: 'post'
            }).then(res => {
                console.log('获取考勤组班次信息成功', res)
                if (res) {
                    let { clockGroupId, ...data } = res
                    commit('setClockOrder', data)
                    resolve(res)
                }
            }).catch(err => {
                reject(err)
            })
        })
    },
    //编辑考勤组时获取已添加的考勤地点数据
    getAddClockSite({ commit, state }) {
        return new Promise((resolve, reject) => {
            axios({
                url: `/es/groupOffices/get?clockGroupId=${state.id}`,
                method: 'post',
            }).then(res => {
                console.log('成功获取考勤地点信息', res);
                if (res) {
                    commit('setClockSite', res)
                    commit('setInitialClockSite', [...res])
                    resolve(res)
                }
            }).catch(err => {
                reject(err)
            })
        })
    },
    //编辑时获取已添加考勤组成员
    async getAddClockUser({ commit }, data) {
        return axios({
            url: `/es/groupUsers/_search?clockGroupId=${data}`,
            method: 'post',
        }).then(res => {
            if (res) {
                commit('setInitialClockUser', [...res])
                commit('setClockUser', res)
                return res
            }
        }).catch(err => {
            return err
        })
    },
    //编辑特殊日期时获取初始状态特殊日期
    getInitialDate({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            axios({
                url: `/es/specialDate/get?clockGroupId=${data}`,
                method: 'post',
            }).then(res => {
                if (res) {
                    console.log('获取考勤组特殊日期成功', res)
                    commit('setInitialDate', [...res])
                    commit('setSpecialDates', res)
                    resolve(res)
                }
            }).catch(err => {
                reject(err)
            })
        })
    },
    //提交特殊日期设置
    submitSpecialDate({ state }, clockGroupId) {
        return new Promise((resolve, reject) => {
            console.log(state.initialDate, state.specialDate)
            let obj = utils.addDelArr(state.initialDate, state.specialDate, 'date')
            let addSpecialDate = obj.editArr.concat(obj.addArr)
            let delSpecialDate = obj.delArr.map(item => item.specialDateId)
            console.log(obj);
            axios({
                url: '/es/specialDate/set',
                method: 'post',
                data: { clockGroupId, addSpecialDate, delSpecialDate }
            }).then(res => {
                if (res) {
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