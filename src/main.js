// 生产环境中注释掉以下语句
import '../mock/index.js'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './util/ajax'

import { Input, Form, FormItem, MessageBox, Message, Button, Checkbox, Menu, Submenu, MenuItem, Select, Option, Row, Col,Tree,Popover } from 'element-ui'
Vue.use(Input)
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Button);
Vue.use(Checkbox);
Vue.use(Menu);
Vue.use(Select);
Vue.use(Option);
Vue.use(Row);
Vue.use(Col);
Vue.use(Tree);
Vue.use(Popover)
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$message = Message

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