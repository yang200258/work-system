import Mock from 'mockjs'
import login from './login'
import _ from 'lodash'

let data = _.concat(login)
console.log('data', data);
data.forEach(function(res) {
    Mock.mock(res.path, res.data)
})
export default Mock