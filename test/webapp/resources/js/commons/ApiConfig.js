/*
 * Copyright (C) 2017 QIANKUN HANLIN Corporation Limited
 *
 * 所有外部接口配置路径
 */

var apiUrlConfig = function() {
  var __DEV__ = true;
  if (__DEV__) {
    // 开发
    var apiHost = '';
    var apiRoot = apiHost + '/manage/v1';
    var apiPlatformRoot = apiHost + '/platform/v1';
    var apiStorageRoot = apiHost + '/storage/v1';
    var apiResourceRoot = apiHost + '/resource/v1';
    var apiWebappRoot = apiHost + '/webapp/v1';
    return {
      login: apiPlatformRoot + '/account/login', // 登录
      logout: apiPlatformRoot + '/account/logout', // 退出
      register: apiPlatformRoot + '/account/register', // 注册
      checkregstatus: apiPlatformRoot + '/account/checkregstatus', // 查询用户是否已注册
      getdetail: apiPlatformRoot + '/account/getdetail', // 获取用户详情
      publish: apiResourceRoot + '/content/publish', // 发布内容
      send: apiPlatformRoot + '/verifycode/send', // 发送验证码
      updateInfo: apiPlatformRoot + '/account/profile/update', // 更新用户信息
      updatePass: apiPlatformRoot + '/account/password/update', // 更新密码
      identification: apiPlatformRoot + '/identification/submit', // 提交用户认证资料
      getlist: apiResourceRoot + '/content/mine/getlist', // 获取内容列表
      getfolderlist: apiResourceRoot + '/category/folder/getlist', // 获取文件夹列表
      addfolder: apiResourceRoot + '/category/folder/add', // 新增文件夹
      deletefolder: apiResourceRoot + '/category/folder/delete', // 删除文件夹
      deletetorecyclebin: apiResourceRoot + '/content/deletetorecyclebin', // 删除内容到回收站
      updatefolder: apiResourceRoot + '/category/folder/update', // 更新文件夹
      movefolder: apiResourceRoot + '/content/updatefolder', // 移动文件夹
      deleteContent: apiResourceRoot + '/content/delete', // 彻底删除文件
      uploadtoken: apiPlatformRoot + '/uploadtoken/create', // 获取上传文件token
      uploadFile: apiStorageRoot + '/upload', // 上传文件
      getlisttype: apiResourceRoot + '/category/getlist', // 获得上传内容类型
      identifydetail: apiPlatformRoot + '/identification/detail', // 获得用户认证资料
      gettypelist: apiResourceRoot + '/category/folder/gettypelist', // 获得文件夹类型
      sendverifycode: apiPlatformRoot + '/account/forgetpwd/sendverifycode', // 找回密码发送验证码
      forgetverify: apiPlatformRoot + '/account/forgetpwd/verify', // 找回密码验证
      resetpwd: apiPlatformRoot + '/account/forgetpwd/reset', // 找回密码重置密码
      updateavatar: apiPlatformRoot + '/account/avatar/update', // 修改用户头像
      getpayinfo: apiWebappRoot + '/withdraw/payment/account/getinfo', // 修改收益账户
      applypay: apiWebappRoot + '/withdraw/apply', // 提现
      getpaylist: apiWebappRoot + '/withdraw/application/getlist', // 获取提现记录
      getrecyclefolder: apiResourceRoot + '/category/folder/getdeletedlist', // 获取已删除的文件夹
      permanentlydelete: apiResourceRoot + '/category/folder/permanentlydelete' // 永久删除文件夹
    }
  } else {
    // 产品
    var apiHost = '';
    var apiRoot = apiHost + '/manage/v1';
    var apiPlatformRoot = apiHost + '/platform/v1';
    var apiStorageRoot = apiHost + '/storage/v1';
    var apiResourceRoot = apiHost + '/resource/v1';
    var apiWebappRoot = apiHost + '/webapp/v1';
    return {
      login: apiPlatformRoot + '/account/login', // 登录
      logout: apiPlatformRoot + '/account/logout', // 退出
      register: apiPlatformRoot + '/account/register', // 注册
      checkregstatus: apiPlatformRoot + '/account/checkregstatus', // 查询用户是否已注册
      getdetail: apiPlatformRoot + '/account/getdetail', // 获取用户详情
      publish: apiResourceRoot + '/content/publish', // 发布内容
      send: apiPlatformRoot + '/verifycode/send', // 发送验证码
      updateInfo: apiPlatformRoot + '/account/profile/update', // 更新用户信息
      updatePass: apiPlatformRoot + '/account/password/update', // 更新密码
      identification: apiPlatformRoot + '/identification/submit', // 提交用户认证资料
      getlist: apiResourceRoot + '/content/mine/getlist', // 获取内容列表
      getfolderlist: apiResourceRoot + '/category/folder/getlist', // 获取文件夹列表
      addfolder: apiResourceRoot + '/category/folder/add', // 新增文件夹
      deletefolder: apiResourceRoot + '/category/folder/delete', // 删除文件夹
      deletetorecyclebin: apiResourceRoot + '/content/deletetorecyclebin', // 删除内容到回收站
      updatefolder: apiResourceRoot + '/category/folder/update', // 更新文件夹
      movefolder: apiResourceRoot + '/content/updatefolder', // 移动文件夹
      deleteContent: apiResourceRoot + '/content/delete', // 彻底删除文件
      uploadtoken: apiPlatformRoot + '/uploadtoken/create', // 获取上传文件token
      uploadFile: apiStorageRoot + '/upload', // 上传文件
      getlisttype: apiResourceRoot + '/category/getlist', // 获得上传内容类型
      identifydetail: apiPlatformRoot + '/identification/detail', // 获得用户认证资料
      gettypelist: apiResourceRoot + '/category/folder/gettypelist', // 获得文件夹类型
      sendverifycode: apiPlatformRoot + '/account/forgetpwd/sendverifycode', // 找回密码发送验证码
      forgetverify: apiPlatformRoot + '/account/forgetpwd/verify', // 找回密码验证
      resetpwd: apiPlatformRoot + '/account/forgetpwd/reset', // 找回密码重置密码
      updateavatar: apiPlatformRoot + '/account/avatar/update', // 修改用户头像
      getpayinfo: apiWebappRoot + '/withdraw/payment/account/getinfo', // 修改收益账户
      applypay: apiWebappRoot + '/withdraw/apply', // 提现
      getpaylist: apiWebappRoot + '/withdraw/application/getlist', // 获取提现记录
      getrecyclefolder: apiResourceRoot + '/category/folder/getdeletedlist', // 获取已删除的文件夹
      permanentlydelete: apiResourceRoot + '/category/folder/permanentlydelete' // 永久删除文件夹
    }
  }
}