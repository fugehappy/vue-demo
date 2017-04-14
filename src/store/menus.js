/*
 * Copyright (C) 2017 QIANKUN HANLIN Corporation Limited
 *
 * 所有菜单信息
 */
const IDENTIFICATION = 'menu_identification' // 用户认证
const CONTENT_MANAGE = 'menu_content_manage' // 内容审核（文件审核）、精品推荐
const PUSH_STRATEGY = 'menu_push_strategy' // 推送信息
const WITHDRAW = 'menu_withdraw' // 提现申请
const PLATFORM_MANAGE = 'menu_platform_manage' // 平台管理

export default {
  menuList: [
    {
      isActive: false,
      value: '用户认证',
      path: '/authList',
      isShow: true,
      navclass: 'menu-icon-auth',
      pMenu: IDENTIFICATION
    },
    {
      isActive: false,
      value: '文件审核',
      path: '/fileAudit',
      isShow: true,
      navclass: 'menu-icon-file',
      pMenu: CONTENT_MANAGE
    },
    {
      isActive: false,
      value: '精品推荐',
      path: '/recommend',
      isShow: true,
      navclass: 'menu-icon-recommend',
      pMenu: CONTENT_MANAGE
    },
    {
      isActive: false,
      value: '推送条件',
      path: '/pushCondition',
      isShow: true,
      navclass: 'menu-icon-condition',
      pMenu: PUSH_STRATEGY
    },
    {
      isActive: false,
      value: '任务调度',
      path: '/pushTask',
      isShow: true,
      navclass: 'menu-icon-task',
      pMenu: PUSH_STRATEGY
    },
    {
      isActive: false,
      value: '提现审核',
      path: '/cashAudit',
      isShow: true,
      navclass: 'menu-icon-cash',
      pMenu: WITHDRAW
    },
    {
      isActive: false,
      value: '账户管理',
      path: '/accountManage',
      isShow: true,
      navclass: 'menu-icon-account',
      pMenu: WITHDRAW
    },
    {
      isActive: false,
      value: '广告管理',
      path: '/advManage',
      isShow: true,
      navclass: 'menu-icon-adv',
      pMenu: PLATFORM_MANAGE
    },
    {
      isActive: false,
      value: '数据统计',
      path: '/dataStatistics',
      isShow: true,
      navclass: 'menu-icon-statistics',
      pMenu: PLATFORM_MANAGE
    },
    {
      isActive: false,
      value: '用户权限分配',
      path: '/roleAssign',
      isShow: true,
      navclass: 'menu-icon-roleassign',
      pMenu: PLATFORM_MANAGE
    },
    {
      isActive: false,
      value: '角色权限关系',
      path: '/roleRelation',
      isShow: true,
      navclass: 'menu-icon-rolerelation',
      pMenu: PLATFORM_MANAGE
    },
    {
      isActive: false,
      value: '基础学科配置',
      path: '/subjectCategory',
      isShow: true,
      navclass: 'menu-icon-subject',
      pMenu: PLATFORM_MANAGE
    }
  ],
  // 所有能管理的菜单
  menuKeys: [
    IDENTIFICATION, CONTENT_MANAGE, PUSH_STRATEGY, WITHDRAW, PLATFORM_MANAGE
  ]
}
