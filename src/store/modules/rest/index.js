const state = {
    restForm: { userType: [], blanceType: 0, limit: 0, validityRule: 0 },
}


const mutations = {
    setRestForm: (state, data) => {
        state.restForm = Object.assign({}, state.restForm, data)
    },
    initialRestForm: (state) => {
        state.restForm = { userType: [], blanceType: 0, limit: 0, validityRule: 0 }
    }
}


export default {
    namespaced: true,
    state,
    mutations
}