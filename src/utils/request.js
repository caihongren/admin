import axios from 'axios'
import router from '../router'
import {
  MessageBox,
  Message
} from 'element-ui'
import store from '@/store'
// import { getToken } from '@/utils/auth'
// console.log('service',process.env.NODE_ENV,config.httpUrl)
// create an axios instance
const service = axios.create({
  baseURL: process.env.NODE_ENV == 'production' ? config.httpUrl : process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})

// request interceptor
service.interceptors.request.use(

  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // config.headers['Token'] = getToken()

    }
    if (localStorage.getItem('token')) {
      const token = localStorage.getItem('token')

      config.headers['token'] = token
      config.headers['Cube-Token'] = token
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // console.log(res)
    // if the custom code is not 20000, it is judged as an error.
    if (res.code != 0) {
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        if (sessionStorage.getItem('islogin')) {
          return response
        }
        sessionStorage.clear()
        sessionStorage.setItem('islogin', true)
        setTimeout(() => {
          sessionStorage.removeItem('islogin')
        }, 5000)
        Message({
          message: '登录已过期，请重新登录'

        })
        router.push('/login')
        // MessageBox.confirm('您的身份已经过期，请重新登录', '确认登出', {
        //   confirmButtonText: '重新登录',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        //   console.log(res, '666')

        //   router.push('/login')
        // })
      } else if (res.code === 50016) {
        // Message.error('该用户未授权，请退出登录或前往授权');
        Message({
          message: res.msg,
          type: 'error',
          duration: 1000
        })

        if (sessionStorage.getItem('user')) {
          const user = JSON.parse(sessionStorage.getItem('user'))
          // 前往授权
          if (user.accountNumber == 'admin') {
            router.push('/IndustryAuthorization/authorization')
            return
          } else {
            // 退出登录
            router.push('/login')
            return
          }
        } else {
          // 退出登录
          router.push('/login')

          return
        }
      } else {
        return res
      }
      // return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('error')
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    // return Promise.reject(error)
  }
)

export default service
