/*
 * Copyright (C) 2017 QIANKUN HANLIN Corporation Limited
 *
 * 用户相关信息service
 */
import Ajax from '../utils/ajax'
import {apiUrlConfig} from '../config/ApiConfig'

class UserService {
  /**
   * 登录
   * @param user
   * @returns {Promise.<TResult>|*}
   */
  login (user) {
    let url = apiUrlConfig().login
    return Ajax({url: url, data: user}).then(response => response)
  }

  /**
   * 退出
   * @returns {*|Promise.<TResult>}
   */
  logout () {
    let url = apiUrlConfig().logout
    return Ajax({url: url}).then(response => response)
  }

  /**
   * 获取登录用户信息
   * @returns {*|Promise.<TResult>}
   */
  getLoguserInfo () {
    let url = apiUrlConfig().getloguserinfo
    return Ajax({url: url}).then(response => response)
  }

  /**
   * 获取三方用户信息
   * @returns {*|Promise.<TResult>}
   */
  userGetProfile (params) {
    let url = apiUrlConfig().userGetprofile
    return Ajax({url: url, data: params}).then(response => response)
  }

  /**
   * 获取用户菜单权限
   * @returns {*|Promise.<TResult>}
   */
  menuGetusermenukeys () {
    let url = apiUrlConfig().menuGetusermenukeys
    return Ajax({url: url}).then(response => response)
  }

  /**
   * 获取资料认证列表
   * @param params 查询条件的参数
   * @returns {*|Promise.<TResult>}
   */
  identificationGetlist (params) {
    let url = apiUrlConfig().identificationGetlist
    return Ajax({url: url, data: params}).then(response => response)
  }

  /**
   * 资料认证处理
   * @param params 提交审核的参数
   * @returns {*|Promise.<TResult>}
   */
  identificationUpadte (params) {
    let url = apiUrlConfig().identificationUpadte
    return Ajax({url: url, data: params}).then(response => response)
  }

  /**
   * 提现管理-平台账户
   * @returns {*|Promise.<TResult>}
   */
  withdrawPaymentAccountGetInfo () {
    let url = apiUrlConfig().withdrawPaymentAccountGetInfo
    return Ajax({url: url}).then(response => response)
  }

}

// 实例化后再导出
export default new UserService()
