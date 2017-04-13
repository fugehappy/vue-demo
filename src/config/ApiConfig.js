/*
 * Copyright (C) 2017 QIANKUN HANLIN Corporation Limited
 *
 * 所有外部接口配置路径
 */
const apiUrlConfig = () => {
  let __DEV__ = process.env.NODE_ENV === 'production'
  if (!__DEV__) {
    // 开发
    let apiHost = ''
    let apiRoot = `${apiHost}/manage/v1`
    let apiPlatformRoot = `${apiHost}/platform/v1`
    let apiStorageRoot = `${apiHost}/storage/v1`
    return {
      login: `${apiRoot}/user/login`, // 登录
      logout: `${apiRoot}/user/logout`, // 退出
      getloguserinfo: `${apiRoot}/user/getloguserinfo`, // 获取user信息
      identificationGetlist: `${apiRoot}/user/identification/getlist`, // 获取资料认证列表
      identificationUpadte: `${apiRoot}/user/identification/status/update`, // 资料认证处理
      identificationStatistics: `${apiRoot}/user/identification/statistics`, // 资料认证数据统计
      userGetprofile: `${apiRoot}/user/getprofile`, // 查询用户信息
      menuGetusermenukeys: `${apiRoot}/menu/getusermenukeys`, // 获取用户菜单权限
      roleGetlist: `${apiRoot}/permission/role/getlist`, // 获取角色列表
      rolePermissionsGetlist: `${apiRoot}/permission/rolepermissions/getlist`, // 获取角色+权限列表
      updateRoles: `${apiRoot}/permission/user/updateroles`, // 更新用户角色
      getRoles: `${apiRoot}/permission/user/getroles`, // 获取用户角色列表
      permisionUserGetList: `${apiRoot}/permission/user/getlist`, // 获取管理员列表
      categoryGetlist: `${apiRoot}/resource/category/getlist`, // 获取内容分类列表
      categoryAdd: `${apiRoot}/resource/category/add`, // 添加内容分类
      categoryDelete: `${apiRoot}/resource/category/delete`, // 删除内容分类
      categoryUpdate: `${apiRoot}/resource/category/update`, // 修改内容分类
      categoryTagAdd: `${apiRoot}/resource/category/tag/add`, // 添加分类标签
      categoryTagUpdate: `${apiRoot}/resource/category/tag/update`, // 修改分类标签
      categoryTagDelete: `${apiRoot}/resource/category/tag/delete`, // 删除分类标签
      contentGetReviewList: `${apiRoot}/resource/content/getreviewlist`, // 获取审核内容列表
      contentFileGetUrl: `${apiRoot}/resource/content/file/geturl`, // 获取内容文件下载地址
      contentReview: `${apiRoot}/resource/content/review`, // 内容审核
      contentGetList: `${apiRoot}/resource/content/getlist`, // 获取内容列表
      contentRecommend: `${apiRoot}/resource/content/recommend`, // 精品推荐
      contentGetStatistics: `${apiRoot}/resource/content/getstatistics`, // 内容数据统计
      advAdd: `${apiRoot}/ad/add`, // 广告管理添加
      advUpdate: `${apiRoot}/ad/update`, // 广告管理更新
      advDelete: `${apiRoot}/ad/delete`, // 广告管理删除
      advGetList: `${apiRoot}/ad/getlist`, // 广告管理获取列表
      pushConditionAdd: `${apiRoot}/push/strategy/add`, // 策略管理 添加定向条件
      pushConditionUpdate: `${apiRoot}/push/strategy/update`, // 策略管理 更新定向条件
      pushConditionDelete: `${apiRoot}/push/strategy/delete`, // 策略管理 删除定向条件
      pushConditionGetList: `${apiRoot}/push/strategy/getlist`, // 策略管理 获取定向条件列表
      pushTaskAdd: `${apiRoot}/push/task/add`, // 策略管理 添加推送任务
      pushTaskUpdate: `${apiRoot}/push/task/update`, // 策略管理 添加推送任务
      pushTaskDelete: `${apiRoot}/push/task/delete`, // 策略管理 删除推送任务
      pushTaskGetList: `${apiRoot}/push/task/getlist`, // 策略管理 获取推送任务列表
      storageUpload: `${apiStorageRoot}/upload`, // 文件上传
      platformUploadTokenCreate: `${apiPlatformRoot}/uploadtoken/create`, // 获取文件上传Token
      basicDataPhaseGradeGetList: `${apiRoot}/basicdata/phasegrade/getlist`, // 获取学段年级数据
      basicDataSubjectGetList: `${apiRoot}/basicdata/subject/getlist`, // 获取学科数据
      basicDataRegionGetList: `${apiRoot}/basicdata/region/getlist`, // 获取区域列表（省市区）
      basicDataSchoolGetList: `${apiRoot}/basicdata/school/getlist`, // 获取学校列表
      withdrawPaymentAccountGetInfo: `${apiRoot}/withdraw/payment/account/getinfo`, // 提现管理-平台账户
      withdrawApplicationGetList: `${apiRoot}/withdraw/application/getlist`, // 提现管理-获取提现申请列表
      withdrawApplicationHandle: `${apiRoot}/withdraw/application/handle`, // 提现管理-处理提现
      paymentGetStatistics: `${apiRoot}/payment/getstatistics` // 交易统计
    }
  } else {
    // 产品
    let apiHost = ''
    let apiRoot = `${apiHost}/manage/v1`
    let apiPlatformRoot = `${apiHost}/platform/v1`
    let apiStorageRoot = `${apiHost}/storage/v1`
    return {
      login: `${apiRoot}/user/login`, // 登录
      logout: `${apiRoot}/user/logout`, // 退出
      getloguserinfo: `${apiRoot}/user/getloguserinfo`, // 获取user信息
      identificationGetlist: `${apiRoot}/user/identification/getlist`, // 获取资料认证列表
      identificationUpadte: `${apiRoot}/user/identification/status/update`, // 资料认证处理
      identificationStatistics: `${apiRoot}/user/identification/statistics`, // 资料认证数据统计
      userGetprofile: `${apiRoot}/user/getprofile`, // 查询用户信息
      menuGetusermenukeys: `${apiRoot}/menu/getusermenukeys`, // 获取用户菜单权限
      roleGetlist: `${apiRoot}/permission/role/getlist`, // 获取角色列表
      rolePermissionsGetlist: `${apiRoot}/permission/rolepermissions/getlist`, // 获取角色+权限列表
      updateRoles: `${apiRoot}/permission/user/updateroles`, // 更新用户角色
      getRoles: `${apiRoot}/permission/user/getroles`, // 获取用户角色列表
      permisionUserGetList: `${apiRoot}/permission/user/getlist`, // 获取管理员列表
      categoryGetlist: `${apiRoot}/resource/category/getlist`, // 获取内容分类列表
      categoryAdd: `${apiRoot}/resource/category/add`, // 添加内容分类
      categoryDelete: `${apiRoot}/resource/category/delete`, // 删除内容分类
      categoryUpdate: `${apiRoot}/resource/category/update`, // 修改内容分类
      categoryTagAdd: `${apiRoot}/resource/category/tag/add`, // 添加分类标签
      categoryTagUpdate: `${apiRoot}/resource/category/tag/update`, // 修改分类标签
      categoryTagDelete: `${apiRoot}/resource/category/tag/delete`, // 删除分类标签
      contentGetReviewList: `${apiRoot}/resource/content/getreviewlist`, // 获取审核内容列表
      contentFileGetUrl: `${apiRoot}/resource/content/file/geturl`, // 获取内容文件下载地址
      contentReview: `${apiRoot}/resource/content/review`, // 内容审核
      contentGetList: `${apiRoot}/resource/content/getlist`, // 获取内容列表
      contentRecommend: `${apiRoot}/resource/content/recommend`, // 精品推荐
      contentGetStatistics: `${apiRoot}/resource/content/getstatistics`, // 内容数据统计
      advAdd: `${apiRoot}/ad/add`, // 广告管理添加
      advUpdate: `${apiRoot}/ad/update`, // 广告管理更新
      advDelete: `${apiRoot}/ad/delete`, // 广告管理删除
      advGetList: `${apiRoot}/ad/getlist`, // 广告管理获取列表
      pushConditionAdd: `${apiRoot}/push/strategy/add`, // 策略管理 添加定向条件
      pushConditionUpdate: `${apiRoot}/push/strategy/update`, // 策略管理 更新定向条件
      pushConditionDelete: `${apiRoot}/push/strategy/delete`, // 策略管理 删除定向条件
      pushConditionGetList: `${apiRoot}/push/strategy/getlist`, // 策略管理 获取定向条件列表
      pushTaskAdd: `${apiRoot}/push/task/add`, // 策略管理 添加推送任务
      pushTaskUpdate: `${apiRoot}/push/task/update`, // 策略管理 添加推送任务
      pushTaskDelete: `${apiRoot}/push/task/delete`, // 策略管理 删除推送任务
      pushTaskGetList: `${apiRoot}/push/task/getlist`, // 策略管理 获取推送任务列表
      storageUpload: `${apiStorageRoot}/upload`, // 文件上传
      platformUploadTokenCreate: `${apiPlatformRoot}/uploadtoken/create`, // 获取文件上传Token
      basicDataPhaseGradeGetList: `${apiRoot}/basicdata/phasegrade/getlist`, // 获取学段年级数据
      basicDataSubjectGetList: `${apiRoot}/basicdata/subject/getlist`, // 获取学科数据
      basicDataRegionGetList: `${apiRoot}/basicdata/region/getlist`, // 获取区域列表（省市区）
      basicDataSchoolGetList: `${apiRoot}/basicdata/school/getlist`, // 获取学校列表
      withdrawPaymentAccountGetInfo: `${apiRoot}/withdraw/payment/account/getinfo`, // 提现管理-平台账户
      withdrawApplicationGetList: `${apiRoot}/withdraw/application/getlist`, // 提现管理-获取提现申请列表
      withdrawApplicationHandle: `${apiRoot}/withdraw/application/handle`, // 提现管理-处理提现
      paymentGetStatistics: `${apiRoot}/payment/getstatistics` // 交易统计
    }
  }
}

export {
  apiUrlConfig
}
