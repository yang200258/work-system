const state = {
    user: {}
}

const mutations = {
    setUserInfo: (state, data) => {
        state.user = data
    }
}


export default {
    namespaced: true,
    state,
    mutations
}