/*
 * Copyright (C) 2017
 *
 * 角色权限关系配置信息service
 */
import Ajax from '../utils/ajax'
import {apiUrlConfig} from '../config/ApiConfig'

class RoleRelationService {
  /**
   * 获取所有角色权限
   * @returns {Promise.<TResult>|*}
   */
  getAllRoleRelation () {
    let url = apiUrlConfig().rolePermissionsGetlist
    return Ajax({url: url}).then(response => response)
  }

}

// 实例化后再导出
export default new RoleRelationService()
