/*
 * Copyright (C) 2017 QIANKUN HANLIN Corporation Limited
 *
 * 内容相关store
 */
import ContentService from '../../services/ContentService'

export const CONTENT_GET_LIST = 'CONTENT_GET_LIST' // 获取内容列表
export const COMTENT_RECOMMEND = 'COMTENT_RECOMMEND' // 精品推荐
export const CONTENT_REVIEW = 'CONTENT_REVIEW' // 内容审核
export const CONTENT_FILE_GET_URL = 'CONTENT_FILE_GET_URL' // 获取内容文件下载地址
export const CONTENT_GET_REVIEW_LIST = 'CONTENT_GET_REVIEW_LIST' // 获取审核内容列表

export default {
  state: {},
  mutations: {
    /**
     * 获取内容列表 mutation
     * @param commit
     * @param payload
     */
    [CONTENT_GET_LIST] (state, payload) {
      Object.assign(state, payload)
    },

    /**
     * 获取审核内容列表 mutation
     * @param commit
     * @param payload
     */
    [CONTENT_GET_REVIEW_LIST] (state, payload) {
      Object.assign(state, {reviewList: payload})
    }
  },
  actions: {
    /**
     * 获取内容列表 action
     * @param commit
     */
    [CONTENT_GET_LIST] ({commit}, payload) {
      return ContentService.contentGetList(payload).then((res) => {
        commit(CONTENT_GET_LIST, res)
        return res
      })
    },

    /**
     * 精品推荐 action
     * @param commit
     */
    [COMTENT_RECOMMEND] ({commit}, payload) {
      return ContentService.contentRecommend(payload).then((res) => {
        return res
      })
    },

    /**
     * 获取审核内容列表 action
     * @param commit
     */
    [CONTENT_GET_REVIEW_LIST] ({commit}, payload) {
      return ContentService.contentGetReviewList(payload).then((res) => {
        commit(CONTENT_GET_REVIEW_LIST, res.data)
        return res
      })
    },

    /**
     * 内容审核 action
     * @param commit
     */
    [CONTENT_REVIEW] ({commit}, payload) {
      return ContentService.contentReview(payload).then((res) => {
        return res
      })
    },

    /**
     * 获取内容文件下载地址 action
     * @param commit
     */
    [CONTENT_FILE_GET_URL] ({commit}, payload) {
      return ContentService.contentFileGetUrl(payload).then((res) => {
        return res
      })
    }
  }
}
