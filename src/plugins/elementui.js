import Vue from 'vue'
//按需引入elementui
import { Input, Form, FormItem, MessageBox, Message } from 'element-ui'
Vue.use(Input)
Vue.use(Form);
Vue.use(FormItem);
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$message = Message;