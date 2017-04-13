/*
 * Copyright (C) 2017 QIANKUN HANLIN Corporation Limited
 *
 * 广告相关store
 */
import AdvService from '../../services/AdvService'

export const ADV_ADD_UPDATE = 'ADV_ADD_UPDATE' // 广告管理添加、广告管理更新
export const ADV_DELETE = 'ADV_DELETE' // 广告管理删除
export const ADV_GET_LIST = 'ADV_GET_LIST' // 广告管理获取列表

export default {
  state: {},
  mutations: {
    /**
     * 广告管理获取列表 mutation
     * @param commit
     * @param payload
     */
    [ADV_GET_LIST] (state, payload) {
      Object.assign(state, payload)
    }
  },
  actions: {
    /**
     * 广告管理 新增 更新 action
     * @param commit
     * @param adv
     */
    [ADV_ADD_UPDATE] ({commit}, adv) {
      return AdvService.advAddUpdate(adv).then((res) => {
        return res
      })
    },

    /**
     * 广告管理 删除 action
     * @param commit
     * @param adv
     */
    [ADV_DELETE] ({commit}, adv) {
      return AdvService.advDelete(adv).then((res) => {
        return res
      })
    },

    /**
     * 广告管理获取列表 action
     * @param commit
     */
    [ADV_GET_LIST] ({commit}, payload) {
      return AdvService.advGetList(payload).then((res) => {
        commit(ADV_GET_LIST, res)
        return res
      })
    }
  }
}
