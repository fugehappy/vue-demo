/*
 * Copyright (C) 2017 QIANKUN HANLIN Corporation Limited
 *
 * 推送相关路由
 */
import { pushCondition, pushTask } from '../pages/push/'

export default [
  {
    path: '/pushCondition', // 推送条件管理
    name: 'pushCondition',
    component: pushCondition
  },
  {
    path: '/pushTask', // 推送任务调度
    name: 'pushTask',
    component: pushTask
  }
]
