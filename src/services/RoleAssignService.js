/*
 * Copyright (C) 2017
 *
 * 用户相关信息service
 */
import Ajax from '../utils/ajax'
import {apiUrlConfig} from '../config/ApiConfig'

class RoleAssignService {
  /**
   * 获取所有管理员
   * @param 参数
   * @returns {Promise.<TResult>|*}
   */
  getAllManagerList (param) {
    let url = apiUrlConfig().permisionUserGetList
    return Ajax({url: url, data: param}).then(response => response)
  }

  /**
   * 获取所有角色
   * @returns {Promise.<TResult>|*}
   */
  getAllRole () {
    let url = apiUrlConfig().roleGetlist
    return Ajax({url: url}).then(response => response)
  }

  /**
   * 获取一个用户信息
   * @param 参数
   * @returns {Promise.<TResult>|*}
   */
  getUserInfo (param) {
    let url = apiUrlConfig().userGetprofile
    return Ajax({url: url, data: param}).then(response => response)
  }

  /**
   * 获取用户角色
   * @param 参数
   * @returns {Promise.<TResult>|*}
   */
  getUserRole (param) {
    let url = apiUrlConfig().getRoles
    return Ajax({url: url, data: param}).then(response => response)
  }

  /**
   * 升级用户角色
   * @param 参数
   * @returns {Promise.<TResult>|*}
   */
  upgradeOneRole (param) {
    let url = apiUrlConfig().updateRoles
    return Ajax({url: url, data: param}).then(response => response)
  }

  /**
   * 变更用户角色
   * @returns {Promise.<TResult>|*}
   */
  changeOneRole (param) {
    let url = apiUrlConfig().updateRoles
    return Ajax({url: url, data: param}).then(response => response)
  }

}

// 实例化后再导出
export default new RoleAssignService()
