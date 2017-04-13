/*
 * Copyright (C) 2017 QIANKUN HANLIN Corporation Limited
 *
 * 统计相关store
 */
import StatisticsService from '../../services/StatisticsService'
export const CONTENT_GET_STATISTICS = 'CONTENT_GET_STATISTICS' // 内容数据统计
export const USER_INFORMATION_STATISTICS = 'USER_INFORMATION_STATISTICS' // 用户信息数据统计
export const PAYMENT_GET_STATISTICS = 'PAYMENT_GET_STATISTICS' // 用户交易数据统计

export default {
  state: {},
  mutations: {
    /**
     * 内容数据统计 mutation
     * @param commit
     * @param payload
     */
    [CONTENT_GET_STATISTICS] (state, payload) {
      Object.assign(state, payload)
    },

    /**
     * 用户信息数据统计 mutation
     * @param commit
     * @param payload
     */
    [USER_INFORMATION_STATISTICS] (state, payload) {
      Object.assign(state, payload)
    },

    /**
     * 用户交易数据统计 mutation
     * @param commit
     * @param payload
     */
    [PAYMENT_GET_STATISTICS] (state, payload) {
      Object.assign(state, payload)
    }
  },
  actions: {
    /**
     * 内容数据统计 action
     * @param commit
     * @param payload
     */
    [CONTENT_GET_STATISTICS] ({commit}, payload) {
      return StatisticsService.contentGetStatistics(payload).then((res) => {
        commit(CONTENT_GET_STATISTICS, res)
        return res
      })
    },

    /**
     * 用户信息数据统计 action
     * @param commit
     * @param payload
     */
    [USER_INFORMATION_STATISTICS] ({commit}, payload) {
      return StatisticsService.getUserInfoStatistics(payload).then((res) => {
        commit(USER_INFORMATION_STATISTICS, res)
        return res
      })
    },

    /**
     * 用户交易数据统计 action
     * @param commit
     * @param payload
     */
    [PAYMENT_GET_STATISTICS] ({commit}, payload) {
      return StatisticsService.paymentGetStatistics(payload).then((res) => {
        commit(PAYMENT_GET_STATISTICS, res)
        return res
      })
    }
  }
}
