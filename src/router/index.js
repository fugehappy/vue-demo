/*
 * Copyright (C) 2017
 *
 * 路由的入口文件，包含所有的路由，其中部分路由是通过require加载进来
 */
import App from '../App'
import authRouter from './auth'
import pushRouter from './push'
/**
 * auth true登录才能访问，false不需要登录，默认true
 */
export default [
  {
    path: '/',
    component: App,
    children: [
      {
        path: '/login', // 登录
        meta: { auth: false },
        component: resolve => require(['../pages/login'], resolve)
      },
      {
        path: '/',
        name: 'main',
        component: resolve => require(['../pages/main'], resolve),
        children: [
          {
            path: '/index',
            name: 'index',
            component: resolve => require(['../pages/home'], resolve)
          },
          {
            path: '/fileAudit', // 文件审核
            name: 'fileAudit',
            component: resolve => require(['../pages/fileAudit'], resolve)
          },
          {
            path: '/recommend', // 精品推荐
            name: 'recommend',
            component: resolve => require(['../pages/recommend'], resolve)
          },
          {
            path: '/cashAudit', // 提现审核
            name: 'cashAudit',
            component: resolve => require(['../pages/cashAudit'], resolve)
          },
          {
            path: '/accountManage', // 账户管理
            name: 'accountManage',
            component: resolve => require(['../pages/account'], resolve)
          },
          {
            path: '/advManage', // 广告管理
            name: 'advManage',
            component: resolve => require(['../pages/advManage'], resolve)
          },
          {
            path: '/dataStatistics', // 数据统计
            name: 'dataStatistics',
            component: resolve => require(['../pages/dataStatistics/index'], resolve)
          },
          {
            path: '/roleAssign', // 用户权限分配
            name: 'roleAssign',
            component: resolve => require(['../pages/roleAssign'], resolve)
          },
          {
            path: '/roleRelation', // 角色权限关系
            name: 'roleRelation',
            component: resolve => require(['../pages/roleRelation'], resolve)
          },
          {
            path: '/subjectCategory', // 基础学科分类
            name: 'subjectCategory',
            component: resolve => require(['../pages/subjectCategory'], resolve)
          },
          ...authRouter, // 用户认证相关路由
          ...pushRouter, // 推送相关路由
          {
            path: '*', // 其他页面，强制跳转到登录页面
            redirect: '/login'
          }
        ]
      }
    ]
  }
]
