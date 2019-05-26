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

// const actions = {
//     pushAddEquips({ commit }, data) {
//         return new Promise(resolve => {

//         })
//     }
// }

export default {
    namespaced: true,
    state,
    mutations,
    // actions
}