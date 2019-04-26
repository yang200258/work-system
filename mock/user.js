const obj = {
    'name': '@cname',
    'username': '@cname',
    'organizationName|1': ['部门1', '部门2', '部门3'],
    'employeeId|+1': 88888,
    'role': '@cname',
    'type|1': ['正式员工', '劳派员工', '外包员工'],
    'group|1': ['考勤组1', '考勤组2', '考勤组3'],
    'status|1': ['正常', '停用', '离职'],
}
let data = { content: [] }
for (let i = 0; i < 20; i++) {
    data.content.push(obj)
}
data.totalPages = 2

export default [{
    path: '/users',
    data: data,
    method: 'get'
}]