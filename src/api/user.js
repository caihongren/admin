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
export function userList(query) {
  return request({
    url: '/account/userList',
    method: 'get',
    params: query

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
// 获取企业节点列表
export function nodeList(query) {
  return request({
    url: '/node/list',
    method: 'get',
    params: query
  })
}
// 获取数据源下拉列表
export function selectList(query) {
  return request({
    url: '/dataSource/taskSelectList',
    method: 'get',
    params: query

  })
}
// 获取企业节点下拉列表
export function nodeSelectList(id) {
  return request({
    url: '/node/taskSelectList?creatorId=' + id,
    method: 'get'

  })
}
// 删除企业节点
export function enterpriseNode(data) {
  return request({
    url: '/node/enterpriseNode',
    method: 'delete',
    data
  })
}
// 修改企业节点
export function putEnterpriseNode(data) {
  return request({
    url: '/node/enterpriseNode',
    method: 'put',
    data

  })
}

// 添加企业节点
export function postEnterpriseNode(data) {
  return request({
    url: '/node/enterpriseNode',
    method: 'post',
    data
  })
}
// 添加企业节点
export function dataSourceFile(data) {
  return request({
    url: '/dataSource/dataSourceFile',
    method: 'post',
    data
  })
}
// 查看企业节点
export function getEnterpriseNode(id) {
  return request({
    url: '/node/enterpriseNode?id=' + id,
    method: 'get'
  })
}

// 连接测试
export function nodeConnectionTest(data) {
  return request({
    url: '/node/connectionTest',
    method: 'post',
    data
  })
}
// 删除数据模板
export function deleteDataTemplate(data) {
  return request({
    url: '/dataTemplate/delete',
    method: 'delete',
    data
  })
}

// 删除未开始任务
export function deleteTask(data) {
  return request({
    url: '/job/task',
    method: 'delete',
    data
  })
}
// 获取数据模板详情
export function info(id) {
  return request({
    url: '/dataTemplate/info?id=' + id,
    method: 'get'
  })
}

// 添加数据模板
export function insert(data) {
  return request({
    url: '/dataTemplate/insert ',
    method: 'post',
    data
  })
}
// 获取数据模板列表
export function getList(query) {
  return request({
    url: '/dataTemplate/list',
    method: 'get',
    params: query
  })
}
// 修改企业节点
export function update(data) {
  return request({
    url: '/dataTemplate/update',
    method: 'put',
    data

  })
}
// 添加任务
export function task(data) {
  return request({
    url: '/job/task ',
    method: 'post',
    data
  })
}

// 从SNMS查询
export function snms(query) {
  return request({
    url: '/dataTemplate/snms',
    method: 'get',
    params: query
  })
}
// 获取任务列表
export function taskList(query) {
  return request({
    url: '/job/taskList',
    method: 'get',
    params: query
  })
}
// 任务恢复
export function resume(data) {
  return request({
    url: '/job/resume',
    method: 'put',
    data

  })
}

// 任务暂停
export function pause(data) {
  return request({
    url: '/job/pause',
    method: 'put',
    data

  })
}

// 查看任务
export function taskInfo(id) {
  return request({
    url: '/job/taskInfo?taskId=' + id,
    method: 'get'
  })
}
// 查看任务配置
export function taskConfig(id) {
  return request({
    url: '/job/taskConfig?taskId=' + id,
    method: 'get'
  })
}
// 开始执行任务
export function start(data) {
  return request({
    url: '/job/start',
    method: 'put',
    data
  })
}
// 手动终止
export function manual(data) {
  return request({
    url: '/job/manual',
    method: 'put',
    data
  })
}
// 查看任务数据
export function handleData(query) {
  return request({
    url: '/job/handleData',
    method: 'get',
    params: query
  })
}
// 查看已完成任务
export function taskEndList(id) {
  return request({
    url: '/job/taskEndList?creatorId=' + id,
    method: 'get'
  })
}
// 任务归档
export function archive(data) {
  return request({
    url: '/job/archive',
    method: 'put',
    data
  })
}

// 重新导入
export function handle(data) {
  return request({
    url: '/job/handle ',
    method: 'post',
    data
  })
}
// 删除标识
export function deleteHandle(data) {
  return request({
    url: '/job/handle ',
    method: 'delete',
    data
  })
}
// 查看标识数据
export function handleInfo(id) {
  return request({
    url: '/job/handleInfo?handleId=' + id,
    method: 'get'
  })
}
// 首页上部分数据
export function homeTask(id) {
  return request({
    url: '/general/homeTask?creatorId=' + id,
    method: 'get'
  })
}
// 获取首页ECharts
export function handleDataECharts(id) {
  return request({
    url: '/general/handleDataECharts?creatorId=' + id,
    method: 'get'
  })
}
// 获取logo
export function logo() {
  return request({
    url: '/general/logo',
    method: 'get'
  })
}

// 上传logo
export function postLogo(data) {
  return request({
    url: '/general/logo ',
    method: 'post',
    data
  })
}
// 获取主题风格
export function themeStyle() {
  return request({
    url: '/general/themeStyle',
    method: 'get'
  })
}
// 切换主题风格
export function putThemeStyle(data) {
  return request({
    url: '/general/themeStyle',
    method: 'put',
    data
  })
}
// 获取任务状态
export function taskState(id) {
  return request({
    url: '/job/taskState?ids=' + id,
    method: 'get'
  })
}

// 获取实时任务
export function timeTask(id) {
  return request({
    url: '/job/timeTask?creatorId=' + id,
    method: 'get'
  })
}

// 清空数据
export function timeHandle(data) {
  return request({
    url: '/job/timeHandle',
    method: 'delete',
    data
  })
}
// 获取请求码
export function requestCode() {
  return request({
    url: '/request/requestCode',
    method: 'get'

  })
}
// 激活授权码
export function putRequestCode(data) {
  return request({
    url: '/request/requestCode',
    method: 'put',
    data
  })
}
// 获取授权日期
export function activationInfo() {
  return request({
    url: '/request/activationInfo',
    method: 'get'

  })
}
// 查询数据管理员列表
export function dataList() {
  return request({
    url: '/account/dataList',
    method: 'get'

  })
}
// 获取配置列表
export function configList() {
  return request({
    url: '/general/configList',
    method: 'get'

  })
}
// 修改配置
export function putConfig(data) {
  return request({
    url: '/general/config',
    method: 'put',
    data
  })
}
// 下载数据
export function download(query) {
  return request({
    url: '/job/download',
    method: 'get',
    params: query,
    timeout:120000
  })
}
// 计算文件大小,根据字节计算大小
export function Size(num) {
  //
  if (typeof (num) != 'number' || num <= 0) return false
  if (num <= 1024) {
    return num + 'B'
  } else
  if (num > 1024 && num <= 1024 * 1024) {
    return (num / 1024).toFixed(2) + 'KB'
  } else if (1024 ** 2 < num && num <= 1024 ** 3) {
    return (num / (1024 ** 2)).toFixed(2) + 'MB'
  } else if (1024 ** 3 < num && num <= 1024 ** 4) {
    return (num / (1024 ** 3)).toFixed(2) + 'GB'
  } else if (1024 ** 4 < num && num <= 1024 ** 5) {
    return (num / (1024 ** 4)).toFixed(2) + 'TB'
  } else if (1024 ** 5 < num && num <= 1024 ** 6) {
    return (num / (1024 ** 5)).toFixed(2) + 'PB'
  } else if (num >= 1024 ** 6) {
    return '>1PB'
  }
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
// 获取日其
export function formatDateDay(dates) {
  if (dates == null || dates == '' || dates == undefined) {
    return
  } else {
    // let datas = new Date(date)
    const date = new Date(dates) // 这样直接获取的是当前时间，如果传参就是想要修改的日期格式的参数
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const day = date.getDate()
    const hours = date.getHours()
    const mints = date.getMinutes()
    const seconds = date.getSeconds()
    const millise = date.getMilliseconds()
    return year + '-' + month + '-' + day
    // datas.setTime(datas.getTime() + 3600 * 1000 * 8)
    // let dateee = datas.toJSON();
    // return new Date(+new Date(dateee)).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
  }
}
// 获取小时
export function formatDateHours(dates) {
  if (dates == null || dates == '' || dates == undefined) {
    return
  } else {
    // let datas = new Date(date)
    const date = new Date(dates) // 这样直接获取的是当前时间，如果传参就是想要修改的日期格式的参数
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const day = date.getDate()
    const hours = date.getHours()
    const mints = date.getMinutes()
    const seconds = date.getSeconds()
    const millise = date.getMilliseconds()
    return hours + ':' + mints + ':' + seconds
    // datas.setTime(datas.getTime() + 3600 * 1000 * 8)
    // let dateee = datas.toJSON();
    // return new Date(+new Date(dateee)).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
  }
}

// 获取输入月份天数
export function mGetDate(year, month) {
  var d = new Date(year, month, 0)
  return d.getDate()
}

// 获取当前时间上月或者下月月份天数
export function mGetDateThis(num) {
  var date = new Date()
  var year = date.getFullYear()
  var month = date.getMonth() + 1 + num
  var d = new Date(year, month, 0)
  return d.getDate()
}
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}
