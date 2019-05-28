const state = {
    name: '',
    clockOrder: { clockCount: 0, clockTime: [], workDay: [], autorest: false },
    clockSite: [{ id: '', clockType: [], gpsDistrict: '' }],
    clockUserId: [],
    specialDate: [{ date: '', type: '', user: '', workTime: [] }]
}

const mutations = {
    setName: (state, data) => {
        state.name = data
    },
    setClockOrder: (state, data) => {
        state.clockOrder = data
    }
}

const actions = {

}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}