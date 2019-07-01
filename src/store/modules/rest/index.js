import axios from "@/utils/ajax.js";

const state = {
    restForm: { userType: [], blanceType: 0, limit: 0, validityRule: 0 },
    restType: [],
}


const mutations = {
    setRestForm: (state, data) => {
        state.restForm = Object.assign({}, state.restForm, data)
    },
    initialRestForm: (state) => {
        state.restForm = { userType: [], blanceType: 0, limit: 0, validityRule: 0 }
    },
    setRestType: (state, data) => {
        state.restType = data
    }
}

const actions = {
    async getRestType({ commit }) {
        let res = await axios({ url: '/es/holidayBal/getHoliday', method: 'post' })
        commit('setRestType', res)
        return res
    },
}


export default {
    namespaced: true,
    state,
    mutations,
    actions
}