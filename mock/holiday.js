const obj = {
    'year': '@date("yyyy")',
    'name': '@cname',
    'resttime': '@date("yyyy/MM/dd")' + '-' + '@date("yyyy/MM/dd ")',
    'worktime': '@date("yyyy/MM/dd")' + '-' + '@date("yyyy/MM/dd")',
    'id|+1': 20000
}
let data = { content: [] }
for (let i = 0; i < 20; i++) {
    data.content.push(obj)
}
data.totalNumber = 200

export default [{
    data,
    path: '/holiday',
    method: 'get'
}]