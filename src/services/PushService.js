/*
 * Copyright (C) 2017
 *
 * 定向条件以及推送任务相关信息service
 */
import Ajax from '../utils/ajax'
import {apiUrlConfig} from '../config/ApiConfig'

class PushService {
  /**
   * 更新定向条件 新增和修改
   * @param params
   * @returns {Promise.<TResult>|*}
   *
   */
  pushConditionAddUpdate (params) {
    let url = params.id ? apiUrlConfig().pushConditionUpdate : apiUrlConfig().pushConditionAdd
    return Ajax({url: url, data: params}).then(response => response)
  }

  /**
   * 更新定向条件删除
   * @param params
   * @returns {Promise.<TResult>|*}
   *
   */
  pushConditionDelete (params) {
    let url = apiUrlConfig().pushConditionDelete
    return Ajax({url: url, data: params}).then(response => response)
  }

  /**
   * 策略管理 获取定向条件列表
   * @param param
   * @returns {*|Promise.<TResult>}
   */
  pushConditionGetList (param) {
    let url = apiUrlConfig().pushConditionGetList
    return Ajax({url: url, data: param}).then(response => response)
  }

  /**
   * 推送任务 新增和修改
   * @param params
   * @returns {Promise.<TResult>|*}
   *
   */
  pushTaskAddUpdate (params) {
    let url = params.id ? apiUrlConfig().pushTaskUpdate : apiUrlConfig().pushTaskAdd
    return Ajax({url: url, data: params}).then(response => response)
  }

  /**
   * 推送任务删除
   * @param params
   * @returns {Promise.<TResult>|*}
   *
   */
  pushTaskDelete (params) {
    let url = apiUrlConfig().pushTaskDelete
    return Ajax({url: url, data: params}).then(response => response)
  }

  /**
   * 策略管理 获取推送任务列表
   * @param param
   * @returns {*|Promise.<TResult>}
   */
  pushTaskGetList (param) {
    let url = apiUrlConfig().pushTaskGetList
    return Ajax({url: url, data: param}).then(response => response)
  }
}

// 实例化后再导出
export default new PushService()
