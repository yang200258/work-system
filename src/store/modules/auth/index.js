import axios from '@/util/ajax'
import Auth from '@/util/auth'
import Navlist from '@/assets/js/navlist'
const state = {
    token: '',
    identityCode: '',
    navlist: Navlist[0].data,
    organ: []
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
    },
    setOrgan: (state, data) => {
        state.organ = data
    }
}


const actions = {
    //登录账号
    login({ commit, dispatch }, userInfo) {
        return new Promise((resolve, reject) => {
            axios({
                url: '/accounts/login',
                method: 'post',
                data: {
                    ...userInfo
                }
            }).then(res => {
                console.log('获取登录数据', res.token);
                if (res) {
                    if (res.token) {
                        commit('setToken', res.token)
                        dispatch('getNavlist')
                    }
                    resolve(res)
                } else {
                    reject(res)
                }
            })
        })
    },
    //获取用户详情
    getAccountDetail({ commit }) {
        return new Promise((resolve, reject) => {
            axios({
                url: '/accounts/me',
                method: 'get'
            }).then(res => {
                console.log('获取用户详情数据', res);
                if (res.userId) {
                    commit('user/setUserInfo', res, { root: true })
                    resolve(res)
                } else {
                    reject(res)
                }
            })
        })
    },
    //获取机构列表
    getOrgan({ commit }, data) {
        return new Promise((resolve, reject) => {
            axios({
                url: '/organizations',
                method: 'get',
                data: {
                    id: data.id || 0,
                    level: data.level || 0
                }
            }).then(res => {
                if (res && res.code == 200) {
                    commit('setOrgan')
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
    //退出登录
    logout: function({ commit }) {
        return new Promise((resolve) => {
            commit('user/setUserInfo', {}, { root: true })
            commit('setToken', '')
            resolve()
        })
    }
}



export default {
    namespaced: true,
    state,
    mutations,
    actions
}