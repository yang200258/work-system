const state = {
    username: ''
}

const mutations = {
    setName: (state, data) => {
        if (data) state.username = data
    }
}


export default {
    namespaced: true,
    state,
    mutations
}