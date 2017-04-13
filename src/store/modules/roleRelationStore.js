/*
 * Copyright (C) 2017 QIANKUN HANLIN Corporation Limited
 *
 * 角色权限关系相关store
 */
import RoleRelationService from '../../services/RoleRelationService'

export const GET_ROLE_RELATION = 'GET_ROLE_RELATION' // 获取角色权限关系

export default {
  state: {},
  mutations: {
    /**
     * 角色权限关系 mutation
     * @param state
     */
    [GET_ROLE_RELATION] (state) {
      Object.assign(state)
    }
  },
  actions: {
    /**
     * 角色权限关系 action
     * @param commit
     */
    [GET_ROLE_RELATION] ({commit}) {
      return RoleRelationService.getAllRoleRelation().then((res) => {
        commit(GET_ROLE_RELATION, res.data)
        return res
      })
    }
  }
}
