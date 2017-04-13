/*
 * Copyright (C) 2017 QIANKUN HANLIN Corporation Limited
 *
 * 提现审核相关信息service
 */
import Ajax from '../utils/ajax'
import {apiUrlConfig} from '../config/ApiConfig'

class CashService {
  /**
   * 处理提现
   * @param cash
   * @returns {Promise.<TResult>|*}
   *
   */
  withdrawApplicationHandle (cash) {
    let url = apiUrlConfig().withdrawApplicationHandle
    return Ajax({url: url, data: cash}).then(response => response)
  }

  /**
   * 提现审核获取列表
   * @returns {Promise.<TResult>|*}
   *
   */
  withdrawApplicationGetList (param) {
    let url = apiUrlConfig().withdrawApplicationGetList
    return Ajax({url: url, data: param}).then(response => response)
  }
}

// 实例化后再导出
export default new CashService()
