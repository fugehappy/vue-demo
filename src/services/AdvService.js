/*
 * Copyright (C) 2017 QIANKUN HANLIN Corporation Limited
 *
 * 广告相关信息service
 */
import Ajax from '../utils/ajax'
import {apiUrlConfig} from '../config/ApiConfig'

class AdvService {
  /**
   * 广告管理添加和更新
   * @param adv
   * @returns {Promise.<TResult>|*}
   *
   */
  advAddUpdate (adv) {
    let url = adv.id ? apiUrlConfig().advUpdate : apiUrlConfig().advAdd
    return Ajax({url: url, data: adv}).then(response => response)
  }

  /**
   * 广告管理删除
   * @param adv
   * @returns {Promise.<TResult>|*}
   *
   */
  advDelete (adv) {
    let url = apiUrlConfig().advDelete
    return Ajax({url: url, data: adv}).then(response => response)
  }

  /**
   * 广告管理获取列表
   * @returns {Promise.<TResult>|*}
   *
   */
  advGetList (param) {
    let url = apiUrlConfig().advGetList
    return Ajax({url: url, data: param}).then(response => response)
  }
}

// 实例化后再导出
export default new AdvService()
