import axios from '@/utils/ajax'
import Auth from '@/utils/auth'
import Navlist from '@/assets/js/navlist'
// import { proxy } from '@/utils/proxy.js'

let state = {
        token: '',
        identityCode: '',
        navlist: Navlist[0].data,
        organ: []
    }
    // state = proxy(state, 'loginInfo', ['token', 'navlist'])
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
    },
    setOrgan: (state, data) => {
        state.organ = data
    }
}


const actions = {
    //登录账号
    async login({ commit, dispatch }, userInfo) {
        let res = await axios({ url: '/sys/accounts/login', method: 'post', data: {...userInfo } })
        console.log('获取登录数据', res)
        if (res.token) {
            commit('setToken', res.token)
            dispatch('getNavlist')
        }
        return res
    },
    //获取用户详情
    async getAccountDetail({ commit }) {
        let res = await axios({ url: '/sys/accounts/me', method: 'get' })
        console.log('获取用户详情数据', res);
        if (res.userId) {
            commit('user/setUserInfo', res, { root: true })
        }
        return res
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
    //退出登录
    async logout({ commit }) {
        await commit('user/setUserInfo', {}, { root: true })
        await commit('setToken', '')
        return
    }
}



export default {
    namespaced: true,
    state,
    mutations,
    actions
}