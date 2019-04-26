const data = {
    'username': '@cname',
    'employeeId': '@id',
    'name': '@cname',
    'userId': '@id',
    'organizationId': '@id',
    'code': 200
}

export default [{
    path: '/accounts/me',
    data: data,
    method: 'get'
}]