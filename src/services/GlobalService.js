/*
 * Copyright (C) 2017
 *
 * 应用全局 service
 */
import Ajax from '../utils/ajax'
import {apiUrlConfig} from '../config/ApiConfig'

class GlobalService {
  /**
   * @returns {Promise.<TResult>|*}
   */
  getContentCategorys () {
    let url = apiUrlConfig().categoryGetlist
    return Ajax({url: url}).then(response => response)
  }

  /**
   * 根据不同条件获得相关分类
   * @type param 类型
   * @selected param 选择的当前级别信息
   * @selectsObj param 选择了后的各层级的对象
   * @cateRootObj param 分类的整个对象
   */
  selectRelation (type, selectedData, selectsObj, cateRootObj) {
    if (!selectsObj) {
      selectsObj = {
        categoryData: [],
        categoryValue: '',
        sectionData: [],
        sectionValue: '',
        courseData: [],
        courseValue: '',
        versionData: [],
        versionValue: '',
        gradeData: [],
        gradeValue: ''
      }
    }
    let data = selectedData.subCategory && selectedData.subCategory.categories ? selectedData.subCategory.categories : null
    // 根据不同条件筛选数据
    switch (type) {
      case 'cate': // 选择了分类
        selectsObj.sectionValue = ''
        selectsObj.sectionData = data
        break
      case 'section': // 选择了学段
        selectsObj.courseValue = ''
        selectsObj.courseData = data
        break
      case 'course': // 选择了学科
        selectsObj.versionValue = ''
        selectsObj.versionData = data
        break
      case 'version': // 选择了版本
        selectsObj.gradeValue = ''
        selectsObj.gradeData = data
        break
      case 'grade': // 选择了年级
        break
      default: // 默认只显示分类
        selectsObj.categoryData = cateRootObj
    }
    return selectsObj
  }

  /**
   * 获取最下层分类 ID
   * @param selectsObj 选择了后的各层级的对象
   * @returns {string}
   */
  getEndCateId (selectsObj) {
    let {gradeValue, versionValue, courseValue, sectionValue, categoryValue} = selectsObj
    let endCateId = ''
    if (gradeValue) {
      endCateId = gradeValue.cateId
    } else if (versionValue) {
      endCateId = versionValue.cateId
    } else if (courseValue) {
      endCateId = courseValue.cateId
    } else if (sectionValue) {
      endCateId = sectionValue.cateId
    } else if (categoryValue) {
      endCateId = categoryValue.cateId
    }
    return endCateId
  }

  /**
   * 获取文件上传Token
   * @param param {bucket:'上传空间名称'}
   * @returns {Promise.<TResult>|*}
   */
  platformUploadTokenCreate (param) {
    let url = apiUrlConfig().platformUploadTokenCreate
    return Ajax({url: url, data: param}).then(response => response)
  }

  /**
   * 文件上传
   * @param param {bucket:'上传空间名称'}
   * @param onprogress 上传进度回调
   * @returns {Promise.<TResult>|*}
   */
  storageUpload (param, onprogress) {
    let url = apiUrlConfig().storageUpload
    return Ajax({url: url, data: param, isFile: true, onprogress: onprogress}).then(response => response)
  }

  /**
   * 获取区域列表（省市区）
   * @param param {zip: '区域编码'}
   * @returns {Promise.<TResult>|*}
   *
   */
  basicDataRegionGetList (param) {
    let url = apiUrlConfig().basicDataRegionGetList
    return Ajax({url: url, data: param}).then(response => response)
  }

  /**
   * 获取学校列表
   * @param param {zip: '区域编码', phase:'学段，0 小学；1 初中；2 高中'}
   * @returns {Promise.<TResult>|*}
   *
   */
  basicDataSchoolGetList (param) {
    let url = apiUrlConfig().basicDataSchoolGetList
    return Ajax({url: url, data: param}).then(response => response)
  }

  /**
   * 获取学段年级数据
   * @returns {Promise.<TResult>|*}
   *
   */
  basicDataPhaseGradeGetList () {
    let url = apiUrlConfig().basicDataPhaseGradeGetList
    return Ajax({url: url}).then(response => response)
  }

  /**
   * 获取学科数据
   * @returns {Promise.<TResult>|*}
   *
   */
  basicDataSubjectGetList () {
    let url = apiUrlConfig().basicDataSubjectGetList
    return Ajax({url: url}).then(response => response)
  }
}

// 实例化后再导出
export default new GlobalService()
