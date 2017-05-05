/*
 * Copyright (C) 2017
 *
 * 内容相关信息service
 */
import Ajax from '../utils/ajax'
import {apiUrlConfig} from '../config/ApiConfig'

class ContentService {
  /**
   * 获取内容列表
   * @param param
   * @returns {Promise.<TResult>|*}
   *
   */
  contentGetList (param) {
    let url = apiUrlConfig().contentGetList
    return Ajax({url: url, data: param}).then(response => response)
  }

  /**
   * 精品推荐
   * @param parm
   * @returns {*|Promise.<TResult>}
   */
  contentRecommend (param) {
    let url = apiUrlConfig().contentRecommend
    return Ajax({url: url, data: param}).then(response => response)
  }

  /**
   * 内容审核
   * @param parm
   * @returns {*|Promise.<TResult>}
   */
  contentReview (param) {
    let url = apiUrlConfig().contentReview
    return Ajax({url: url, data: param}).then(response => response)
  }

  /**
   * 获取审核内容列表
   * @param parm
   * @returns {*|Promise.<TResult>}
   */
  contentGetReviewList (param) {
    let url = apiUrlConfig().contentGetReviewList
    return Ajax({url: url, data: param}).then(response => response)
  }

  /**
   * 获取内容文件下载地址
   * @param parm
   * @returns {*|Promise.<TResult>}
   */
  contentFileGetUrl (param) {
    let url = apiUrlConfig().contentFileGetUrl
    return Ajax({url: url, data: param}).then(response => response)
  }
}

// 实例化后再导出
export default new ContentService()
