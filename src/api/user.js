import request from '@/utils/request'
// import Axios from 'axios'

// 登录
export function login(data) {
  return request({
    url: '/account/login',
    method: 'post',
    data
  })
}

// 获取图形
export function account() {
  return request({
    url: '/account/pictureCode',
    method: 'get'
  })
}

// 退出登录
export function logout(data) {
  return request({
    url: '/account/logout',
    method: 'post',
    data
  })
}

// 获取所有用户
export function userList() {
  return request({
    url: '/account/userList',
    method: 'get'

  })
}

// 添加用户
export function addUser(data) {
  return request({
    url: '/account/addUser',
    method: 'post',
    data
  })
}
// 获取角色
export function roleList() {
  return request({
    url: '/account/roleList',
    method: 'get'

  })
}
// 管理员重置密码
export function passwordReset(data) {
  return request({
    url: '/account/passwordReset',
    method: 'put',
    data

  })
}

// 账号停用
export function accountDeactivate(data) {
  return request({
    url: '/account/accountDeactivate',
    method: 'put',
    data

  })
}

// 账号启用
export function accountEnable(data) {
  return request({
    url: '/account/accountEnable',
    method: 'put',
    data

  })
}

// 获取个人信息
export function accountInfo(id) {
  return request({
    url: '/account/accountInfo?accountId=' + id,
    method: 'get'

  })
}

// 修改个人信息密码
export function password(data) {
  return request({
    url: '/account/password',
    method: 'put',
    data

  })
}
// 修改名称
export function accountName(data) {
  return request({
    url: '/account/accountName',
    method: 'put',
    data

  })
}

// 获取登录历史
export function loginHistory(query) {
  return request({
    url: '/account/loginHistory',
    method: 'get',
    params: query

  })
}
// 删除个人历史
export function deleteloginHistory(data) {
  return request({
    url: '/account/loginHistory',
    method: 'delete',
    data

  })
}

// 获取数据源列表
export function list(query) {
  return request({
    url: '/dataSource/list',
    method: 'get',
    params: query
  })
}
// 连接测试
export function connectionTest(data) {
  return request({
    url: '/dataSource/connectionTest',
    method: 'post',
    data
  })
}
// 添加数据库数据源
export function database(data) {
  return request({
    url: '/dataSource/database',
    method: 'post',
    data
  })
}
// 查看数据库数据源
export function getDatabase(id) {
  return request({
    url: '/dataSource/database?id=' + id,
    method: 'get'

  })
}
// 修改数据库数据源
export function putDatabase(data) {
  return request({
    url: '/dataSource/database',
    method: 'put',
    data

  })
}
// 删除数据库数据源
export function deleteDatabase(data) {
  return request({
    url: '/dataSource/database',
    method: 'delete',
    data

  })
}

// 获取表
export function tableList(id) {
  return request({
    url: '/dataSource/tableList?id=' + id,
    method: 'get'

  })
}
// 获取表结构及数据
export function tableData(query) {
  return request({
    url: '/dataSource/tableData',
    method: 'get',
    params: query
  })
}

// 时间格式转换
export function formatDate(date) {
  if (date == null || date == '' || date == undefined) {
    return
  } else {
    const datas = new Date(date)
    datas.setTime(datas.getTime() + 3600 * 1000 * 8)
    const dateee = datas.toJSON()
    return new Date(+new Date(dateee)).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
  }
}
