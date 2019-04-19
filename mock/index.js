import Mock from 'mockjs'
import login from './login'
import accountDetail from './accountDetail'
import _ from 'lodash'

let data = _.concat(login, accountDetail)
data.forEach(function(res) {
    Mock.mock(res.path, res.method, res.data)
})
export default Mock