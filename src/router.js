import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [

  // 登录注册
  {
    path: '/login',
    component: () => import('@/views/login/login'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    redirect: '/login',
  },
  // 首页
  {
    path: '/',
    component: Layout,
    children: [{
      path: '/IndustryHome',
      name: '首页',
      component: () => import('@/views/IndustryHome/homePage'),
      // eslint-disable-next-line no-dupe-keys
      meta: {
        requireAuth: true,
        title: '首页',
        icon: 'home'
      }
    }]
  },
  // 系统管理员路由

  // 数据源管理
  {
    path: '/IndustryDataSource',
    component: Layout,
    children: [{
      path: 'dataSource',
      name: '数据源管理',
      component: () => import('@/views/IndustryDataSource/dataSource'),
      meta: {
        requireAuth: true,
        title: '数据源管理',
        icon: 'data'
      }
    }]
  },

  // 企业节点管理
  {
    path: '/IndustryEnterpriseNode',
    component: Layout,
    // redirect: '/IndustryEnterpriseNode',
    children: [{
      path: 'enterpriseNode',
      name: '企业节点管理',
      component: () => import('@/views/IndustryEnterpriseNode/enterpriseNode'),
      meta: {
        requireAuth: true,
        title: '企业节点管理',
        icon: 'enterprise'
      }
    }]
  },
  // 人员管理
  {
    path: '/IndustryPersonnel',
    component: Layout,
    // redirect: '/IndustryPersonnel',
    children: [{
      path: 'Personnel',
      name: '人员管理',
      component: () => import('@/views/IndustryPersonnel/Personnel'),
      meta: {
        requireAuth: true,
        title: '人员管理',
        icon: 'people'
      }
    }]
  },

  // 日志管理
  {
    path: '/IndustryLog',
    component: Layout,
    // redirect: '/IndustryLog',
    children: [{
      path: 'Log',
      name: '日志管理',
      component: () => import('@/views/IndustryLog/Log'),
      meta: {
        requireAuth: true,
        title: '日志管理',
        icon: 'journal'
      }
    }]
  },

  // 授权管理

  {
    path: '/IndustryAuthorization',
    component: Layout,
    // redirect: '/IndustryAuthorization',
    children: [{
      path: 'authorization',
      name: '授权管理',
      component: () => import('@/views/IndustryAuthorization/authorization'),
      meta: {
        requireAuth: true,
        title: '授权管理',
        icon: 'grant'
      }
    }]
  },

  // 系统管理

  {
    path: '/IndustrySystem',
    component: Layout,
    // redirect: '/IndustrySystem',
    children: [{
      path: 'system',
      name: '系统管理',
      component: () => import('@/views/IndustrySystem/system'),
      meta: {
        requireAuth: true,
        title: '系统管理',
        icon: 'system'
      }
    }]
  },
  // 个人中心
  {
    path: '/IndustryPersonal',
    component: Layout,

    hidden: true,

    children: [{
      path: 'personal',
      name: '个人中心',
      component: () => import('@/views/IndustryPersonal/personal'),
      meta: {
        requireAuth: true,
        title: '个人中心'
      }
    }]
  },
  // 数据管理员路由
  // 数据源管理
  {
    path: '/dataIndustryDataSource',
    component: Layout,
    children: [{
      path: 'dataSourceAdministration',
      name: '数据源管理',
      component: () => import('@/views/dataIndustryDataSource/dataSourceAdministration'),
      meta: {
        requireAuth: true,
        title: '数据源管理',
        icon: 'data'
      }
    }]
  },

  // 企业节点管理
  {
    path: '/IndustryNode',
    component: Layout,
    children: [{
      path: 'node',
      name: '企业节点管理',
      component: () => import('@/views/IndustryNode/node'),
      meta: {
        requireAuth: true,
        title: '企业节点管理',
        icon: 'enterprise'
      }
    }]
  },
  // 导入任务管理
  {
    path: '/importTask',
    component: Layout,
    children: [{
      path: 'task',
      name: '导入任务管理',
      component: () => import('@/views/importTask/task'),
      meta: {
        requireAuth: true,
        title: '导入任务管理',
        icon: 'node'
      }
    }]
  },
  // 数据模板管理
  {
    path: '/mould',
    component: Layout,
    children: [{
      path: ' dataTemplate',
      name: '数据模板管理',
      component: () => import('@/views/mould/dataTemplate'),
      meta: {
        requireAuth: true,
        title: '数据模板管理',
        icon: 'template'
      }
    }]
  },
  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]
export const asyncRoutes = [

]
const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

// const router = new Router({
//   routes: [{
//     path: '/',
//     redirect: '/login'
//   },
//   // 登录注册
//   {
//     path: '/login',
//     name: 'login',
//     component: login,
//     meta: {
//       title: '登录'
//     }
//   },
//   {
//     path: '/IndustryHome',
//     name: 'IndustryHome',
//     component: () => import('@/views/IndustryHome/homePage'),
//     meta: { title: '首页', icon: 'form' }
//   }

//     // 授权管理

//   ]
// })
export default router
