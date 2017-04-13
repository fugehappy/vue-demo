/*
 * Copyright (C) 2017 QIANKUN HANLIN Corporation Limited
 *
 * 全局store
 */
import GlobalService from '../services/GlobalService'
export const CHANGE_PENDING = 'CHANGE_PENDING' // 全局改变pending的状态
export const GET_CONTENT_CATEGORYS = 'GET_CONTENT_CATEGORYS' // 获取所有内容分类
export const PLATFORM_UPLOAD_TOKEN_CREATE = 'PLATFORM_UPLOAD_TOKEN_CREATE' // 获取文件上传Token
export const STORAGE_UPLOAD = 'STORAGE_UPLOAD' // 文件上传
export const BASIC_DATA_REGION_GET_LIST = 'BASIC_DATA_REGION_GET_LIST' // 获取区域列表（省市区）
export const BASIC_DATA_SCHOOL_GET_LIST = 'BASIC_DATA_SCHOOL_GET_LIST' // 获取学校列表
export const BASIC_DATA_PHASE_GRADE_GET_LIST = 'BASIC_DATA_PHASE_GRADE_GET_LIST' // 获取学段年级数据
export const BASIC_DATA_SUBJECT_GET_LIST = 'BASIC_DATA_SUBJECT_GET_LIST' // 获取学科数据

export default {
  state: {
    pending: false,
    loadingText: '',
    uploadtoken: null
  },
  mutations: {
    /**
     * 改变pending状态的mutation
     * @param commit
     * @param value ture：loading， false：close
     */
    [CHANGE_PENDING] (state, value) {
      Object.assign(state, {pending: value})
    },

    /**
     * 获取所有内容分类 mutation
     * @param commit
     * @param cate
     */
    [GET_CONTENT_CATEGORYS] (state, cate) {
      Object.assign(state, {categorys: cate.data})
    },

    /**
     * 获取上传文件token的 mutation
     * @param state
     * @param payload
     */
    [PLATFORM_UPLOAD_TOKEN_CREATE] (state, payload) {
      Object.assign(state, {uploadtoken: payload})
    }
  },
  actions: {
    /**
     * 改变pending状态的action
     * @param commit
     * @param value ture：loading， false：close
     */
    [CHANGE_PENDING] ({commit}, value) {
      commit(CHANGE_PENDING, value)
    },

    /**
     * 获取所有内容分类 action
     * @param commit
     * @param {Promise.<TResult>}
     */
    [GET_CONTENT_CATEGORYS] ({commit}) {
      return GlobalService.getContentCategorys().then((res) => {
        commit(GET_CONTENT_CATEGORYS, res)
        return res
      })
    },

    /**
     * 获取上传文件token的 action
     * @param commit
     * @param param {bucket:'上传空间名称'}
     * @returns {Promise.<TResult>}
     */
    [PLATFORM_UPLOAD_TOKEN_CREATE] ({commit}, param) {
      return GlobalService.platformUploadTokenCreate(param).then((res) => {
        commit(PLATFORM_UPLOAD_TOKEN_CREATE, res.data)
        return res
      })
    },

    /**
     * 上传文件
     * @param commit
     * @param param {bucket:'上传空间名称'}
     * @returns {Promise.<TResult>}
     */
    [STORAGE_UPLOAD] ({commit}, param) {
      return GlobalService.storageUpload(param.formData, param.onprogress).then((res) => {
        return res
      })
    },

    /**
     * 获取区域列表（省市区）
     * @param commit
     * @param payload
     * @returns {Promise.<TResult>}
     */
    [BASIC_DATA_REGION_GET_LIST] ({commit}, payload) {
      return GlobalService.basicDataRegionGetList(payload).then((res) => {
        return res
      })
    },

    /**
     * 获取学校列表
     * @param commit
     * @param payload {zip,phase}
     * @returns {Promise.<TResult>}
     */
    [BASIC_DATA_SCHOOL_GET_LIST] ({commit}, payload) {
      return GlobalService.basicDataSchoolGetList(payload).then((res) => {
        return res
      })
    },

    /**
     * 获取学段年级数据
     * @param commit
     * @returns {Promise.<TResult>}
     */
    [BASIC_DATA_PHASE_GRADE_GET_LIST] ({commit}) {
      return GlobalService.basicDataPhaseGradeGetList().then((res) => {
        return res
      })
    },

    /**
     * 获取学科数据
     * @param commit
     * @returns {Promise.<TResult>}
     */
    [BASIC_DATA_SUBJECT_GET_LIST] ({commit}) {
      return GlobalService.basicDataSubjectGetList().then((res) => {
        return res
      })
    }
  }
}
