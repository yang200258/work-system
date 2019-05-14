// import { proxy } from '@/utils/proxy.js'
let state = {
    userInfo: {}
}

// state = proxy(state, 'userInfo', ['userInfo'])

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