/*
 * Copyright (C) 2017 QIANKUN HANLIN Corporation Limited
 *
 * flash(Web Uploader) 上传
 */
var flashUpload = function() {
  var uploader = null; // Uploader 对象

  /**
   * 初始化上传控件
   * @param type 上传文件类型 CONTENT_TYPE: 内容文件 IMAGE_TYPE 图片类型
   * @param name 控件ID
   */
  this.init = function(type, name) {
    var accept = { // 只允许选择图片文件
      title : 'Images',
      extensions : 'gif,jpg,jpeg,png',
      mimeTypes : 'image/jpeg,image/jpg,image/png,image/gif'
    }
    var fileSizeLimit = 2 * 1024 * 1024; // 图片限制为2M
    if (type == 'CONTENT_TYPE') {
      accept = {
        title : 'Contents',
        extensions : 'gif,jpg,jpeg,png,doc,docx,xls,xlsx,ppt,pptx,mp4,pdf,txt',
        mimeTypes : 'image/jpeg,image/jpg,image/png,image/gif,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,video/mp4,application/pdf,text/plain'
      }
      fileSizeLimit = 200 * 1024 * 1024; // 文件限制为200M
    }
    uploader = new WebUploader.Uploader({
      auto : true, // 选完文件后，是否自动上传
      swf : window.baseUrl + '/vendors/webuploader/Uploader.swf', // swf文件路径
      server : apiUrlConfig().uploadFile, // 文件接收服务端地址
      pick : {
        id : '#' + name,
        multiple : false // 不支持选择多个文件
      },
      accept : accept, // 支持的文件类型
//      runtimeOrder : 'flash', // 强制上传方式为flash，也可以为html5
      fileSizeLimit : fileSizeLimit // 文件上传限制大小
    });
  }

  /**
   * flash上传
   * @param type 上传文件类型 CONTENT_TYPE: 内容文件 IMAGE_TYPE 图片类型
   * @param filePickerName 控件ID
   * @param successfn 上传成功回调函数
   * @param errorfn 上传失败回调函数
   * @param selecterrfn 选择文件限制失败回调函数
   * @param startfn 开始上传前回调函数
   */
  this.startUpload = function(type, filePickerName, successfn, errorfn, selecterrfn, startfn) {
    try {
      this.init(type, filePickerName); // 初始化上传配置
    } catch(err) {
      selecterrfn(); // 没有安装flash或flash版本过低
      return;
    }
    var data = {}
    if (type == 'CONTENT_TYPE') {
      data.bucket = 'resource';
    } else if (type == 'IMAGE_TYPE') {
      data.bucket = 'coverimage';
    } else if (type == 'AVATAR_TYPE') {
      data.bucket = 'avatar';
    } else {
      return;
    }
    var fu = this;
    // 获取上传文件token
    $.post(apiUrlConfig().uploadtoken, data, function(data) {
      token = data.data.token;
      uploader.option('formData', {
        'token' : token
      });
      // 上传事件监听
      fu.createEvent(type, successfn, errorfn, selecterrfn, startfn);
      debugInfo(data)
    }, function(err) {
      layer_server_err();
      debugInfo(err);
    });
  }

  /**
   * 上传事件监听
   * @param type 上传文件类型 CONTENT_TYPE: 内容文件 IMAGE_TYPE 图片类型
   * @param successfn 上传成功回调函数
   * @param errorfn 上传失败回调函数
   * @param selecterrfn 选择文件限制失败回调函数
   * @param startfn 开始上传前回调函数
   */
  this.createEvent = function(type, successfn, errorfn, selecterrfn, startfn) {
    this.error(type, selecterrfn);
    this.uploadStart(startfn);
    this.uploadProgress();
    this.uploadSuccess(successfn);
    this.uploadError(errorfn);
  }

  /**
   * @param type 上传文件类型 CONTENT_TYPE: 内容文件 IMAGE_TYPE 图片类型
   * 上传选择文件错误事件监听
   */
  this.error = function(type, selecterrfn) {
    uploader.on('error', function(type) {
      selecterrfn(type);
    });
  }

  /**
   * 上传前事件监听(类似ajax beforeSend)
   */
  this.uploadStart = function(startfn) {
    uploader.on('uploadStart', function(file) {
      startfn(file);
      // 显示进度条
      uploadProgress('open');
    });
  }

  /**
   * 上传进度事件监听
   */
  this.uploadProgress = function() {
    uploader.on('uploadProgress', function(file, percentage) {
      $('#processbar').attr('style', 'width:' + (Math.round(percentage * 100, 2) - 1) + '%');
      $('#processInfo').text('上传中 ' + +(Math.round(percentage * 100, 2) - 1) + '%');
    });
  }

  /**
   * 上传成功事件监听
   * @param successfn 上传成功回调函数
   */
  this.uploadSuccess = function(successfn) {
    // 文件上传成功，给item添加成功class, 用样式标记上传成功。
    uploader.on('uploadSuccess', function(data, response) {
      $('#processbar').attr('style', 'width:100%');
      $('#processInfo').text('上传中 100%');
      setTimeout(function() {
        uploadProgress('close');
        successfn(response);
      }, 1000);
    });
  }

  /**
   * 上传失败事件监听
   * @param successfn 上传成功回调函数
   */
  this.uploadError = function(errorfn) {
    // 文件上传失败，显示上传出错。
    uploader.on('uploadError', function(file, response) {
      errorfn(response)
    });
  }
}