/*
 * Copyright (C) 2017
 *
 * 统计相关信息service
 */
import Ajax from '../utils/ajax'
import {apiUrlConfig} from '../config/ApiConfig'

class StatisticsService {
  /**
   * 内容数据统计
   * @param param
   * @returns {*|Promise.<TResult>}
   */
  contentGetStatistics (param) {
    let url = apiUrlConfig().contentGetStatistics
    return Ajax({url: url, data: param}).then(response => response)
  }

  /**
   * 获取用户信息统计
   * @param param
   * @returns {*|Promise.<TResult>}
   */
  getUserInfoStatistics (param) {
    let url = apiUrlConfig().identificationStatistics
    return Ajax({url: url, data: param}).then(response => response)
  }

  /**
   * 获取交易信息统计
   * @param param
   * @returns {*|Promise.<TResult>}
   */
  paymentGetStatistics (param) {
    let url = apiUrlConfig().paymentGetStatistics
    return Ajax({url: url, data: param}).then(response => response)
  }
}

// 实例化后再导出
export default new StatisticsService()
