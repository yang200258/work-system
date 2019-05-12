import Vue from 'vue'
import { BreadcrumbItem, Breadcrumb, Scrollbar, Tabs, TabPane, CheckboxGroup, Radio, TimePicker, RadioGroup, DatePicker, Dialog, Main, Loading, Container, Pagination, TableColumn, Table, Input, Form, FormItem, MessageBox, Message, Button, Checkbox, Menu, Submenu, MenuItem, Select, Option, Row, Col, Tree, Popover } from 'element-ui'
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
Vue.use(Table);
Vue.use(Main);
Vue.use(Pagination);
Vue.use(TableColumn);
Vue.use(Container);
Vue.use(Dialog);
Vue.use(DatePicker);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(TimePicker);
Vue.use(CheckboxGroup);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Scrollbar);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Loading.directive);
Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$message = Message


export default Vue