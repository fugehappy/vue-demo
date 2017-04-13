/*
 * Copyright (C) 2017 QIANKUN HANLIN Corporation Limited
 *
 * 用户认证相关路由
 */
import { authList, auth } from '../pages/userAuditManage/'

export default [
  {
    path: '/authList', // 认证列表
    name: 'authList',
    component: authList
  },
  {
    path: '/auth', // 用户认证
    name: 'authList',
    component: auth
  }
]
