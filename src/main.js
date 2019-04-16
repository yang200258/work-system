// 生产环境中注释掉以下语句
import '../mock/index.js'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './util/ajax'



//引入lodash语法便于操作数据
import _ from 'lodash'
Vue.prototype._ = _
    //组织vue在启动时生成生产提示
Vue.config.productionTip = false
Vue.prototype.$axios = axios

new Vue({
    router,
    axios,
    store,
    render: h => h(App)
}).$mount('#app')