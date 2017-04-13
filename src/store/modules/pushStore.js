/*
 * Copyright (C) 2017 QIANKUN HANLIN Corporation Limited
 *
 * 定向条件以及推送任务相关信息store
 */
import PushService from '../../services/PushService'

export const PUSH_CONDITION_ADD_UPDATE = 'PUSH_CONDITION_ADD_UPDATE' // 定向条件添加、定向条件更新
export const PUSH_CONDITION_DELETE = 'PUSH_CONDITION_DELETE' // 定向条件删除
export const PUSH_CONDITION_GET_LIST = 'PUSH_CONDITION_GET_LIST' // 获取定向条件列表

export const PUSH_TASK_ADD_UPDATE = 'PUSH_TASK_ADD_UPDATE' // 推送任务新增，更新
export const PUSH_TASK_DELETE = 'PUSH_TASK_DELETE' // 推送任务删除
export const PUSH_TASK_GET_LIST = 'PUSH_TASK_GET_LIST' // 获取推送任务列表

export default {
  state: {},
  mutations: {
    /**
     * 获取定向条件列表 mutation
     * @param commit
     * @param payload
     */
    [PUSH_CONDITION_GET_LIST] (state, payload) {
      Object.assign(state, {condition: payload})
    },

    /**
     * 获取推送任务列表 mutation
     * @param commit
     * @param payload
     */
    [PUSH_TASK_GET_LIST] (state, payload) {
      Object.assign(state, {taskList: payload})
    }
  },
  actions: {
    /**
     * 更新定向条件 新增和修改 action
     * @param commit
     * @param params
     */
    [PUSH_CONDITION_ADD_UPDATE] ({commit}, params) {
      return PushService.pushConditionAddUpdate(params).then((res) => {
        return res
      })
    },

    /**
     * 更新定向条件 删除 action
     * @param commit
     * @param params
     */
    [PUSH_CONDITION_DELETE] ({commit}, params) {
      return PushService.pushConditionDelete(params).then((res) => {
        return res
      })
    },

    /**
     * 获取定向条件列表 action
     * @param commit
     * @param payload
     */
    [PUSH_CONDITION_GET_LIST] ({commit}, payload) {
      return PushService.pushConditionGetList(payload).then((res) => {
        commit(PUSH_CONDITION_GET_LIST, res)
        return res
      })
    },

    /**
     * 推送任务 新增和修改 action
     * @param commit
     * @param params
     */
    [PUSH_TASK_ADD_UPDATE] ({commit}, params) {
      return PushService.pushTaskAddUpdate(params).then((res) => {
        return res
      })
    },

    /**
     * 更新定向条件 删除 action
     * @param commit
     * @param params
     */
    [PUSH_TASK_DELETE] ({commit}, params) {
      return PushService.pushTaskDelete(params).then((res) => {
        return res
      })
    },

    /**
     * 获取推送任务列表 action
     * @param commit
     * @param payload
     */
    [PUSH_TASK_GET_LIST] ({commit}, payload) {
      return PushService.pushTaskGetList(payload).then((res) => {
        commit(PUSH_TASK_GET_LIST, res)
        return res
      })
    }
  }
}
