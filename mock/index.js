import Mock from 'mockjs'
import login from './login'
import navlist from './navlist'
import _ from 'lodash'

let data = _.concat(login, navlist)
data.forEach(function(res) {
    Mock.mock(res.path, res.data)
})
export default Mock