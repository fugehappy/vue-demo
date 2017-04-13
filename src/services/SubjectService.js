/*
 * Copyright (C) 2017 QIANKUN HANLIN Corporation Limited
 *
 * 基础学科分类相关信息service
 */
import Ajax from '../utils/ajax'
import {apiUrlConfig} from '../config/ApiConfig'

class SubjectService {
  /**
   * 获取分类
   * @returns {Promise.<TResult>|*}
   */
  getSubjectCate () {
    let url = apiUrlConfig().categoryGetlist
    return Ajax({url: url}).then(response => response)
  }

  /**
   * 更新分类和标签
   * @param 参数
   * @returns {Promise.<TResult>|*}
   */
  updateSubjectCate (param) {
    let url = ''
    if (param.state === 'cate') {
      url = apiUrlConfig().categoryUpdate
    } else if (param.state === 'tag') {
      url = apiUrlConfig().categoryTagUpdate
    } else {
      return false
    }
    return Ajax({url: url, data: param}).then(response => response)
  }

  /**
   * 添加分类
   * @param 参数
   * @returns {Promise.<TResult>|*}
   */
  addSubjectCate (param) {
    let url = apiUrlConfig().categoryAdd
    return Ajax({url: url, data: param}).then(response => response)
  }

  /**
   * 删除分类
   * @param 参数
   * @returns {Promise.<TResult>|*}
   */
  delSubjectCate (param) {
    let url = ''
    if (param.state === 'cate') {
      url = apiUrlConfig().categoryDelete
    } else if (param.state === 'tag') {
      url = apiUrlConfig().categoryTagDelete
    } else {
      return false
    }
    return Ajax({url: url, data: param}).then(response => response)
  }

  /**
   * 删除标签
   * @param 参数
   * @returns {Promise.<TResult>|*}
   */
  delCategoryTag (param) {
    let url = apiUrlConfig().categoryTagDelete
    return Ajax({url: url, data: param}).then(response => response)
  }

  /**
   * 添加标签
   * @param 参数
   * @returns {Promise.<TResult>|*}
   */
  addTags (param) {
    let url = apiUrlConfig().categoryTagAdd
    return Ajax({url: url, data: param}).then(response => response)
  }
}

// 实例化后再导出
export default new SubjectService()
