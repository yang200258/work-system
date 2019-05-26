/**
 * axios全局配置
 * TODO: 拦截器全局配置，根据实际情况修改
 */
import axios from 'axios'
import router from '../router'
import Auth from '@/utils/auth'
import { Message } from 'element-ui'
var requestList = []

/**
 * 阻止短时间内的重复请求
 * @param {string} url - 当前请求地址
 * @param {function} c - 中断请求函数
 * @description 每个请求发起前先判断当前请求是否存在于RequestList中，
 *              如果存在则取消该次请求，如果不存在则加入RequestList中，
 *              当请求完成后500ms时，清除RequestList中对应的该请求。
 */
// function stopRepeatRequest(url, c) {
//     for (let i = 0; i < requestList.length; i++) {
//         if (requestList[i] == url) {
//             c()
//             return
//         }
//     }
//     requestList.push(url)
// }

// 超时设置
const service = axios.create({
    // 请求超时时间
    timeout: 5000,
});

// baseURL
// axios.defaults.baseURL = 'http://10.28.128.123:8080/'

// http request 拦截器
// 每次请求都为http头增加Authorization字段，其内容为token
service.interceptors.request.use(
    config => {
        if (Auth.hasToken()) {
            config.headers['x-token'] = Auth.hasToken()
        } else {
            router.push('/')
        }
        config.headers['Cache-Control'] = 'no-cache'
        config.headers['Pragma'] = 'no-cache'
            // stopRepeatRequest(config.url, cancel)
        console.log('config', config);
        return config
    },
    err => {
        return Promise.reject(err);
    }
);

// http response 拦截器
// 针对响应代码确认跳转到对应页面
service.interceptors.response.use(
    response => {
        console.log('responsedata', response);
        console.log('requestList', requestList);
        // for (let i = 0; i < requestList.length; i++) {
        //     if (requestList[i] == response.config.url) {
        //         // 注意，不能保证500ms必定执行
        //         setTimeout(function() {
        //             requestList.splice(i, 1)
        //         }, 500)
        //         break
        //     }
        // }
        return Promise.resolve(response.data)
    },
    error => {
        console.log('登录异常', error);
        if (axios.isCancel(error)) {
            console.log(error)
            return Promise.reject("Ajax Abort: 该请求在axios拦截器中被中断")
        } else if (error.response) {
            console.log('请求时错误拦截error', error)
            switch (error.response.status) {
                case 401:
                    Message({
                        message: error.response.data.msg || `服务器错误！错误代码：${error.response.data.code}`,
                        type: 'error'
                    })
                    break
                case 403:
                    router.push('error/403')
                    break
                case 404:
                    router.push('error/404')
                    break
                case 406:
                    Message({
                        message: error.response.data.msg || `服务器错误！错误代码：${error.response.data.code}`,
                        type: 'error'
                    })
                    break
                default:
                    Message({
                        message: `服务器错误！错误代码：${error.response.status}`,
                        type: 'error'
                    })
            }
            return Promise.reject(error.response.data)
        }
    }
)

export default service;