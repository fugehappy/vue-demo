/*
 * Copyright (C) 2017 QIANKUN HANLIN Corporation Limited
 *
 * 角色权限关系相关store
 */
import RoleAssignService from '../../services/RoleAssignService'

export const GET_ALL_MANAGER_LIST = 'GET_ALL_MANAGER_LIST' // 获取所有的管理员列表
export const GET_ALL_ROLE = 'GET_ALL_ROLE' // 获取所有角色
export const GET_USER_INFO = 'GET_USER_INFO' // 获取用户信息
export const GET_USER_ROLE = 'GET_USER_ROLE' // 获取用户角色
export const UPGRADE_ONE_ROLE = 'UPGRADE_ONE_ROLE' // 升级用户角色
export const CHANGE_ROLE_ONE = 'CHANGE_ROLE_ONE' // 更改用户角色

export default {
  state: {},
  mutations: {
    /**
     * 获取所有的管理员列表 mutation
     * @param state
     * @param payload
     */
    [GET_ALL_MANAGER_LIST] (state, payload) {
      Object.assign(state, payload)
    },

    /**
     * 获取所有角色 mutation
     * @param state
     */
    [GET_ALL_ROLE] (state) {
      Object.assign(state)
    },

    /**
     * 获取用户信息 mutation
     * @param state
     * @param payload
     */
    [GET_USER_INFO] (state, payload) {
      Object.assign(state, payload)
    },

    /**
     * 获取用户角色 mutation
     * @param state
     * @param payload
     */
    [GET_USER_ROLE] (state, payload) {
      Object.assign(state, payload)
    },

    /**
     * 升级用户角色 mutation
     * @param state
     * @param payload
     */
    [UPGRADE_ONE_ROLE] (state, payload) {
      Object.assign(state, payload)
    },

    /**
     * 更改用户角色 mutation
     * @param state
     * @param payload
     */
    [CHANGE_ROLE_ONE] (state, payload) {
      Object.assign(state, payload)
    }
  },
  actions: {
    /**
     * 获取所有的管理员列表 action
     * @param commit 参数
     * @param payload 参数
     */
    [GET_ALL_MANAGER_LIST] ({commit}, payload) {
      return RoleAssignService.getAllManagerList(payload).then((res) => {
        commit(GET_ALL_MANAGER_LIST, res.data)
        return res
      })
    },

    /**
     * 获取所有角色 action
     * @param commit 参数
     */
    [GET_ALL_ROLE] ({commit}) {
      return RoleAssignService.getAllRole().then((res) => {
        commit(GET_ALL_ROLE, res.data)
        return res
      })
    },

    /**
     * 获取用户信息 action
     * @param commit 参数
     * @param payload 参数
     */
    [GET_USER_INFO] ({commit}, payload) {
      return RoleAssignService.getUserInfo(payload).then((res) => {
        commit(GET_USER_INFO, res.data)
        return res
      })
    },

    /**
     * 获取用户角色 action
     * @param commit 参数
     * @param payload 参数
     */
    [GET_USER_ROLE] ({commit}, payload) {
      return RoleAssignService.getUserRole(payload).then((res) => {
        commit(GET_USER_ROLE, res.data)
        return res
      })
    },

    /**
     * 升级用户角色 action
     * @param commit 参数
     * @param payload 参数
     */
    [UPGRADE_ONE_ROLE] ({commit}, payload) {
      return RoleAssignService.upgradeOneRole(payload).then((res) => {
        commit(UPGRADE_ONE_ROLE, res.data)
        return res
      })
    },

    /**
     * 更改用户角色 action
     * @param commit 参数
     * @param payload 参数
     */
    [CHANGE_ROLE_ONE] ({commit}, payload) {
      return RoleAssignService.changeOneRole(payload).then((res) => {
        commit(CHANGE_ROLE_ONE, res.data)
        return res
      })
    }
  }
}
