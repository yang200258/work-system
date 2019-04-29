import Mock from 'mockjs'
import login from './login'
import accountDetail from './accountDetail'
import organ from './organ'
import user from './user'
import queryUser from './queryUser'
import holiday from './holiday'
import editHoliday from './editHoliday'
import deleteholiday from './deleteholiday'
import addHoliday from './addHoliday'
import _ from 'lodash'

let data = _.concat(login, accountDetail, organ, user, queryUser, holiday, editHoliday, deleteholiday, addHoliday)
data.forEach(function(res) {
    if (res.method == 'post') {
        Mock.mock(res.path, res.method, res.data)
    }
    if (res.method == 'get') {
        Mock.mock(RegExp(res.path + ".*"), res.method, () => {
            return Mock.mock(res.data)
        })
    }
})
export default Mock