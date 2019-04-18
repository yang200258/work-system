import axios from '@/util/ajax'
import Auth from '@/util/auth'
import Navlist from '@/assets/js/navlist'
const state = {
    token: '',
    identityCode: '',
    navlist: []
}

const mutations = {
    //设置token
    setToken: (state, data) => {
        if (data) {
            Auth.setToken(data)
            Auth.setLoginStatus()
        } else {
            Auth.removeToken()
            Auth.removeLoginStatus()
        }
        state.token = data
    },
    //设置权限列表
    setNavlist: (state, data) => {
        if (data) state.navlist = data
    }
}


const actions = {
    //登录账号
    login({ commit, dispatch }, userInfo) {
        return new Promise((resolve, reject) => {
            axios({
                url: '/login',
                method: 'post',
                data: {
                    ...userInfo
                }
            }).then(res => {
                if (res && res.error) {
                    commit('setToken', res.token)
                    commit('user/setName', res.username, { root: true })
                    dispatch('getNavlist')
                    resolve(res)
                } else {
                    reject(res)
                }
            })
        })
    },
    //生成权限列表
    getNavlist: function({ commit }) {
        // let list = []
        // let authData = JSON.parse(window.localStorage.getItem('authData'))
        // Navlist[0].data.forEach(item => {
        //     if (authData[item.auth] == '1') {
        //         list.push(item)
        //     }
        //     if (item.auth == 'option') {
        //         list.push(item)
        //     }
        // })
        commit('setNavlist', Navlist[0].data)
    },
}



export default {
    namespaced: true,
    state,
    mutations,
    actions
}