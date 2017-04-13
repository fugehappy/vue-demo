/*
 * Copyright (C) 2017 QIANKUN HANLIN Corporation Limited
 *
 * 基础学科分类相关store
 */
import SubjectService from '../../services/SubjectService'

export const GET_CATEGORY_LIST = 'GET_CATEGORY_LIST' // 获取分类列表
export const UPDATE_CATEGORY = 'UPDATE_CATEGORY' // 更新分类
export const ADD_CATEGORY = 'ADD_CATEGORY' // 添加分类
export const DEL_CATEGORY = 'DEL_CATEGORY' // 删除分类
export const DEL_CATEGORY_TAG = 'DEL_CATEGORY_TAG' // 删除分类
export const ADD_TAGS = 'ADD_TAGS' // 添加标签

export default {
  state: {},
  mutations: {
    /**
     * 获取分类列表 mutation
     * @param state 参数
     */
    [GET_CATEGORY_LIST] (state) {
      Object.assign(state)
    },

    /**
     * 更新分类 mutation
     * @param state 参数
     * @param payload 参数
     */
    [UPDATE_CATEGORY] (state, payload) {
      Object.assign(state, payload)
    },

    /**
     * 添加分类 mutation
     * @param state 参数
     * @param payload 参数
     */
    [ADD_CATEGORY] (state, payload) {
      Object.assign(state, payload)
    },

    /**
     * 删除分类 mutation
     * @param state 参数
     * @param payload 参数
     */
    [DEL_CATEGORY] (state, payload) {
      Object.assign(state, payload)
    },

    /**
     * 删除标签 mutation
     * @param state 参数
     * @param payload 参数
     */
    [DEL_CATEGORY_TAG] (state, payload) {
      Object.assign(state, payload)
    },

    /**
     * 添加标签 mutation
     * @param state 参数
     * @param payload 参数
     */
    [ADD_TAGS] (state, payload) {
      Object.assign(state, payload)
    }
  },
  actions: {
    /**
     * 获取分类列表 action
     * @param commit 参数
     */
    [GET_CATEGORY_LIST] ({commit}) {
      return SubjectService.getSubjectCate().then((res) => {
        commit(GET_CATEGORY_LIST, res.data)
        return res
      })
    },

    /**
     * 更新分类 action
     * @param commit 参数
     * @param payload 参数
     */
    [UPDATE_CATEGORY] ({commit}, payload) {
      return SubjectService.updateSubjectCate(payload).then((res) => {
        commit(UPDATE_CATEGORY, res)
        return res
      })
    },

    /**
     * 添加分类 action
     * @param commit 参数
     * @param payload 参数
     */
    [ADD_CATEGORY] ({commit}, payload) {
      return SubjectService.addSubjectCate(payload).then((res) => {
        commit(ADD_CATEGORY, res)
        return res
      })
    },

    /**
     * 删除分类 action
     * @param commit 参数
     * @param payload 参数
     */
    [DEL_CATEGORY] ({commit}, payload) {
      return SubjectService.delSubjectCate(payload).then((res) => {
        commit(DEL_CATEGORY, res)
        return res
      })
    },

    /**
     * 删除标签 action
     * @param commit 参数
     * @param payload 参数
     */
    [DEL_CATEGORY_TAG] ({commit}, payload) {
      return SubjectService.delCategoryTag(payload).then((res) => {
        commit(DEL_CATEGORY, res)
        return res
      })
    },

    /**
     * 添加标签 action
     * @param commit 参数
     * @param payload 参数
     */
    [ADD_TAGS] ({commit}, payload) {
      return SubjectService.addTags(payload).then((res) => {
        commit(ADD_TAGS, res)
        return res
      })
    }
  }
}
