/*
 * Copyright (C) 2017
 *
 * 提现审核相关store
 */
import CashService from '../../services/CashService'

export const WITHDRAW_APPLICATION_HANDLE = 'WITHDRAW_APPLICATION_HANDLE' // 处理提现
export const WITHDRAW_APPLICATION_GET_LIST = 'WITHDRAW_APPLICATION_GET_LIST' // 提现审核获取列表

export default {
  state: {},
  mutations: {
    /**
     * 提现审核获取列表 mutation
     * @param commit
     * @param payload
     */
    [WITHDRAW_APPLICATION_GET_LIST] (state, payload) {
      Object.assign(state, payload)
    }
  },
  actions: {
    /**
     * 处理提现 action
     * @param commit
     * @param adv
     */
    [WITHDRAW_APPLICATION_HANDLE] ({commit}, adv) {
      return CashService.withdrawApplicationHandle(adv).then((res) => {
        return res
      })
    },

    /**
     * 提现审核获取列表 action
     * @param commit
     */
    [WITHDRAW_APPLICATION_GET_LIST] ({commit}, payload) {
      return CashService.withdrawApplicationGetList(payload).then((res) => {
        commit(WITHDRAW_APPLICATION_GET_LIST, res)
        return res
      })
    }
  }
}
