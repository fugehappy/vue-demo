/*
 * Copyright (C) 2017 QIANKUN HANLIN Corporation Limited
 *
 * 整个应用的入口文件
 */
import 'babel-polyfill' // 解决IE浏览器不支持promise以及object.assign等
import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router/'
import store from './store'
import * as jst from 'js-common-tools'
import { USER_LOCALSTORAGE_KEY } from './config/'
import components from './components/' // 加载公共组件
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
Vue.use(ElementUI)
/* eslint-disable no-new */
Vue.config.silent = false // true取消 Vue 所有的日志与警告。

// 将组件挂载到vue
Object.keys(components).forEach((key) => {
  var name = key.replace(/(\w)/, (v) => v.toUpperCase()) // 首字母大写
  Vue.component(`v${name}`, components[key])
})

Vue.use(VueRouter)
const router = new VueRouter({
  routes
})
router.beforeEach(({meta, path, name}, from, next) => {
  var { auth = true } = meta
  let {user} = store.state
  let localStoreUser = JSON.parse(localStorage.getItem(USER_LOCALSTORAGE_KEY))
  var isLogin = user && (localStoreUser && localStoreUser.loginName) // true用户已登录， false用户未登录
  // 没有登录并且访问链接不在控制的权限内则跳转到登录页面（即非法路径访问）
  if (auth && !isLogin && (path !== '/login' || user.hasPath && !name || user.hasPath && !jst.inArray(`/${name}`, user.hasPath))) {
    return next({ path: '/login' })
  }
  if (path === '/') {
    return next({path: '/index'})
  }
  next()
})
import App from './App'
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})

