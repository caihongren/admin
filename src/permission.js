import router from './router'
// import store from './store'
// import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  const title = document.title

  // start progress bar
  NProgress.start()
  if (to.meta.title == undefined || to.meta.title == null || to.meta.title == '') {
    document.title = title
  } else {
    document.title = to.meta.title
  }

  if (to.matched.some(record => record.meta.requireAuth) && !localStorage.token) { // 判断该路由是否需要登录权限
    console.log('需要登录')
    next({
      path: '/login',
      query: { redirect: to.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
    })
    NProgress.done()
  } else {
    console.log('无需登录')
    next()
  }

  // set page title
  // document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
