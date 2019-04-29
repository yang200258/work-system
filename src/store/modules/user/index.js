const state = {
    userInfo: {}
}

const mutations = {
    setUserInfo: (state, data) => {
        state.userInfo = data
    }
}


export default {
    namespaced: true,
    state,
    mutations
}