/*
 * Copyright (C) 2017 QIANKUN HANLIN Corporation Limited
 *
 * 用户相关store
 */
import Vue from 'vue'
import UserService from '../../services/UserService'
import menus from '../menus'
import * as jst from 'js-common-tools'
import { USER_LOCALSTORAGE_KEY } from '../../config/'

export const USER_SIGNIN = 'USER_SIGNIN' // 登录
export const USER_SIGNOUT = 'USER_SIGNOUT' // 退出
export const GET_LOGUSER_INFO = 'GET_LOGUSER_INFO' // 获取登录用户信息
export const USER_GET_PROFILE = 'USER_GET_PROFILE' // 获取三方用户信息
export const MENU_GET_USER_MENU_KEYS = 'MENU_GET_USER_MENU_KEYS' // 获取用户菜单权限
export const IDENTIFICATION_GET_LIST = 'IDENTIFICATION_GET_LIST' // 获取资料认证列表
export const IDENTIFICATION_UPDATE = 'IDENTIFICATION_UPDATE' // 资料认证处理

export const WITHDRAW_PAYMENT_ACCOUNT_INFO = 'WITHDRAW_PAYMENT_ACCOUNT_INFO' // 提现管理-平台账户

export default {
  state: JSON.parse(localStorage.getItem(USER_LOCALSTORAGE_KEY)) || {},
  mutations: {
    /**
     * 登录的 mutation
     * @param state
     * @param payload
     */
    [USER_SIGNIN] (state, payload) {
      localStorage.setItem(USER_LOCALSTORAGE_KEY, JSON.stringify(payload))
      Object.assign(state, payload)
    },

    /**
     * 登录的 mutation
     * @param state
     * @param payload
     */
    [GET_LOGUSER_INFO] (state, payload) {
      sessionStorage.setItem('loguserinfo', JSON.stringify(payload))
      Object.assign(state, {userinfo: payload})
    },

    /**
     * 退出的 mutation
     * @param state
     * @returns {Promise.<TResult>|*}
     */
    [USER_SIGNOUT] (state) {
      localStorage.removeItem(USER_LOCALSTORAGE_KEY)
      Object.keys(state).forEach(k => Vue.delete(state, k))
    },

    /**
     * 退出的 mutation
     * @param state
     * @param payload
     */
    [MENU_GET_USER_MENU_KEYS] (state, payload) {
      let {menuList} = menus
      let hasMenus = []
      // 路由过滤
      let hasPath = ['/index', '/login']
      menuList.map((item) => {
        if (jst.inArray(item.pMenu, payload)) {
          hasMenus.push(item)
          hasPath.push(item.path)
        }
      })
      Object.assign(state, {owneMenu: payload, hasMenus: hasMenus, hasPath: hasPath})
    },

    /**
     * 获取资料认证列表 mutation
     * @param state
     * @param payload
     */
    [IDENTIFICATION_GET_LIST] (state, payload) {
      Object.assign(state, payload)
    },

    /**
     * 提现管理-平台账户 mutation
     * @param commit
     * @param payload
     */
    [WITHDRAW_PAYMENT_ACCOUNT_INFO] (state, payload) {
      Object.assign(state, {platformAccount: payload})
    }
  },
  actions: {
    /**
     * 登录的 action
     * @param commit
     * @param payload
     */
    [USER_SIGNIN] ({commit}, payload) {
      return UserService.login(payload).then((res) => {
        commit(USER_SIGNIN, payload)
        return res
      })
    },

    /**
     * 退出的 action
     * @param commit
     * @returns {Promise.<TResult>|*}
     */
    [USER_SIGNOUT] ({commit}) {
      return UserService.logout().then(() => {
        commit(USER_SIGNOUT)
      })
    },

    /**
     * 获取登录用户信息 action
     * @param commit
     * @returns {Promise.<TResult>|*}
     */
    [GET_LOGUSER_INFO] ({commit}) {
      return UserService.getLoguserInfo().then((res) => {
        commit(GET_LOGUSER_INFO, res.data)
        return res
      })
    },

    /**
     * 获取三方用户信息 action
     * @param commit
     * @param params
     * @returns {Promise.<TResult>}
     */
    [USER_GET_PROFILE] ({commit}, params) {
      return UserService.userGetProfile(params).then((res) => {
        return res
      })
    },

    /**
     * 获取用户菜单权限 action
     * @param commit
     */
    [MENU_GET_USER_MENU_KEYS] ({commit}) {
      return UserService.menuGetusermenukeys().then((res) => {
        commit(MENU_GET_USER_MENU_KEYS, res.data)
        return res
      })
    },

    /**
     * 获取用户资料认证列表 action
     * @param commit
     * @param params
     */
    [IDENTIFICATION_GET_LIST] ({commit}, params) {
      return UserService.identificationGetlist(params).then((res) => {
        commit(IDENTIFICATION_GET_LIST, res.data)
        return res
      })
    },

    /**
     * 资料认证处理 action
     * @param commit
     * @param params
     */
    [IDENTIFICATION_UPDATE] ({commit}, params) {
      return UserService.identificationUpadte(params).then((res) => {
        return res
      })
    },

    /**
     * 提现管理平台账户 action
     * @param commit
     */
    [WITHDRAW_PAYMENT_ACCOUNT_INFO] ({commit}) {
      return UserService.withdrawPaymentAccountGetInfo().then((res) => {
        commit(WITHDRAW_PAYMENT_ACCOUNT_INFO, res.data)
        return res
      })
    }
  }
}
