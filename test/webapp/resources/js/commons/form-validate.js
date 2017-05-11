/*
 * Copyright (C) 2017 QIANKUN HANLIN Corporation Limited
 *
 * 表单校验js
 */

$(function() {
    // 注册文本框失去焦点后
    $('#registerForm :input').blur(function(e) {
        var $parent = $(this).parent();
        $parent.find('.formtips').remove();
        // 验证用户名
        if ($(this).is('#username')) {
            if (!/^(?![0-9]+$)(?:\d|[a-zA-Z]|[!@$%^&*]){6,16}$/.test(this.value)) {
                $(this).parent().find('.glyphicon-ok-sign').remove();
                var errorMsg = '用户名格式为6-16位的字母、数字，且不能为纯数字';
                $(this).css
                $parent
                        .append('<span class="formtips onError">'
                                + errorMsg + '</span>');
                return;
            }
            if(e.originalEvent) {
                checkregstatus($(this), null, null, null);
            }
        }
        // 验证密码
        if ($(this).is('#password')) {
            if (!/^(?![a-zA-z]+$)(?![0-9]+$)(?![!@$_%^&*]+$)[a-zA-Z0-9!@$_%^&*]{6,16}$/
                            .test(this.value)) {
                $(this).parent().find('.glyphicon-ok-sign').remove();
                var errorMsg = '密码格式不正确，为6-16位的字母和数字的组合';
                $parent
                        .append('<span class="formtips onError">'
                                + errorMsg + '</span>');
            } else {
              if (e.originalEvent) {
                $(this).parent().append(
                '<span class="glyphicon glyphicon-ok-sign ok-sign"></span>');
              }
            }
        }
        // 验证确认密码
        if ($(this).is('#rePassword')) {
            if (this.value == ''
                    || this.value != $('#password').val()) {
                $(this).parent().find('.glyphicon-ok-sign').remove();
                var errorMsg = '两次密码输入不一致';
                $parent
                        .append('<span class="formtips onError">'
                                + errorMsg + '</span>');
            } else {
              if (e.originalEvent) {
                $(this).parent().append(
                '<span class="glyphicon glyphicon-ok-sign ok-sign"></span>');
              }
            }
        }
        // 验证手机号
        if ($(this).is('#phoneNo')) {
            if (!/^1[34578]\d{9}$/.test(this.value)) {
                $(this).parent().find('.glyphicon-ok-sign').remove();
                $('#btn-code').attr('disabled', 'true');
                var errorMsg = '手机号码格式不正确，请重新输入';
                $parent
                        .append('<span class="formtips onError">'
                                + errorMsg + '</span>');
                return;
            }
            $('#btn-code').removeAttr('disabled');
            if(e.originalEvent) {
                checkregstatus(null, $(this), null, null);
            }
        }
        // 验证验证码
        if ($(this).is('#valiCode')) {
            if (this.value == "") {
                var errorMsg = '验证码不能为空';
                $parent
                        .append('<span class="formtips onError">'
                                + errorMsg + '</span>');
            }
        }
    }).keyup(function(event) {
      if (event.which != 9) {
        $(this).triggerHandler('blur');
      }
    });// end blur

    // 登陆文本框失去焦点后
    $('#loginForm :input').blur(function() {
        var $parent = $(this).parent();
        $parent.find('.formtips').remove();
        // 验证用户名
        if ($(this).is('#username')) {
            if ($(this).val() == '') {
                var errorMsg = '请输入登录名';
                $(this).css
                $parent.append('<span class="formtips onError">'
                        + errorMsg + '</span>');
            }
        }
        // 验证密码
        if ($(this).is('#password')) {
            if ($(this).val() == '') {
                var errorMsg = '请输入密码';
                $parent.append('<span class="formtips onError">'
                        + errorMsg + '</span>');
            }
        }
    }).keyup(function(event) {
      if (event.which != 9) {
        $(this).triggerHandler('blur');
      }
    });// end blur

    // 个人资料文本框失去焦点后
    $('#basicInfo :input').blur(function() {
        var $parent = $(this).parent();
        $parent.find('.formtips').remove();
        // 验证用户名
        if ($(this).is('#email')) {
            if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test($(this).val())) {
                var errorMsg = '请输入正确的邮箱地址';
                $(this).css
                $parent.append('<span class="formtips onError">'
                        + errorMsg + '</span>');
            }
        }
        // 验证手机号
        if ($(this).is('#phoneNo')) {
            if (!/^1[34578]\d{9}$/.test(this.value)) {
                var errorMsg = '手机号码格式不正确，请重新输入';
                $parent.append('<span class="formtips onError">'
                        + errorMsg + '</span>');
            }
        }
        // 验证验证码
        if ($(this).is('#valiCode')) {
            if (this.value == "") {
                var errorMsg = '验证码不能为空';
                $parent.append('<span class="formtips onError">'
                        + errorMsg + '</span>');
            }
        }
    }).keyup(function(event) {
      if (event.which != 9) {
        $(this).triggerHandler('blur');
      }
    });// end blur

    // 注册提交，最终验证。
    $('#register').click(function() {
        // 用户名验证
        var username = $('#username');
        username.parent().find('.formtips').remove();
        if (!/^(?![0-9]+$)(?:\d|[a-zA-Z]|[!@$%^&*]){6,16}$/.test(username.val())) {
            var errorMsg = '用户名格式为6-16位的字母、数字，且不能为纯数字';
            username.parent().append(
                    '<span class="formtips onError">'
                            + errorMsg + '</span>');
            return false;
        }
        checkregstatus(username, null, null, null);
        // 密码验证
        var password = $('#password');
        password.parent().find('.formtips').remove();
        if (!/^(?![a-zA-z]+$)(?![0-9]+$)(?![!@$_%^&*]+$)[a-zA-Z0-9!@$_%^&*]{6,16}$/
                        .test(password.val())) {
            var errorMsg = '密码格式不正确，为6-16位的字母和数字的组合';
            password.parent().append(
                    '<span class="formtips onError">'
                            + errorMsg + '</span>');
            return false;
        }
        // 重复密码验证
        var rePassword = $('#rePassword');
        rePassword.parent().find('.formtips').remove();
        if (rePassword.val() == ''
                || rePassword.val() != $('#password').val()) {
            var errorMsg = '两次密码输入不一致';
            rePassword.parent().append(
                    '<span class="formtips onError">'
                            + errorMsg + '</span>');
            return false;
        }
        // 手机号验证
        var phoneNo = $('#phoneNo');
        phoneNo.parent().find('.formtips').remove();
        if (!/^1[34578]\d{9}$/.test(phoneNo.val())) {
            var errorMsg = '手机号码格式不正确，请重新输入';
            phoneNo.parent().append(
                    '<span class="formtips onError">'
                            + errorMsg + '</span>');
            return false;
        }
        checkregstatus(null, phoneNo, null, null);
        // 验证码验证
        var valiCode = $('#valiCode');
        valiCode.parent().find('.formtips').remove();
        if (valiCode.val() == '') {
            var errorMsg = '验证码不能为空';
            valiCode.parent().append(
                    '<span class="formtips onError">'
                            + errorMsg + '</span>');
            return false;
        }
        if (!$('#agreement').is(':checked')) {
            $(this).attr('disabled', 'true');
        }
        checkregstatus(username, phoneNo, password, valiCode);
    });

    /**
     * 检验用户名是否存在
     * @param username 用户名
     * @param mobile 手机号
     * @param password 用户密码
     * @param valiCode 验证码
     */
    function checkregstatus(username, mobile, password, valiCode) {
        var data = {}
        if (username) {
          data.userId = username.val();
        }
        if (mobile) {
          data.phoneNo = mobile.val();
        }
        $.post(apiUrlConfig().checkregstatus, data, function(data) {
            // userId 用户名是否已经被注册，0 未被注册 1 已被注册
            if (data.data.userId && data.data.userId == 1) {
                username.parent().find('.glyphicon-ok-sign').remove();
                var errorMsg = '该用户名已经被使用';
                username.parent().append(
                        '<span class="formtips onError">' + errorMsg
                                + '</span>');
                return;
            } else if (data.data.userId != "undefined" && data.data.userId == 0){
              username.parent().append(
                  '<span class="glyphicon glyphicon-ok-sign ok-sign"></span>');
            }
            // phoneNo 手机号是否已经被注册，0 未被注册 1 已被注册
            if (data.data.phoneNo && data.data.phoneNo == 1) {
                var errorMsg = '该手机号码已经被使用';
                mobile.parent().find('.glyphicon-ok-sign').remove();
                mobile.parent().append(
                        '<span class="formtips onError">' + errorMsg
                                + '</span>');
                $('#btn-code').attr('disabled', 'true');
                return;
            } else if (data.data.phoneNo != "undefined" && data.data.phoneNo == 0){
                $('#btn-code').removeAttr('disabled');
                mobile.parent().append(
                '<span class="glyphicon glyphicon-ok-sign ok-sign"></span>');
            }
            if (password && valiCode) {
              register(username, mobile, password, valiCode);
            }
            debugInfo(data);
        }, function(err) {
            layer_server_err();
            debugInfo(err);
        });
    }

    /**
     * 注册提交
     * @param username 用户名
     * @param mobile 手机号
     * @param password 用户密码
     * @param valiCode 验证码
     */
    function register(username, mobile, password, valiCode) {
        var data = {
            'phoneNo' : mobile.val(),
            'userId' : username.val(),
            'password' : password.val(),
            'verifyCode' : valiCode.val()
        }
        $.post(apiUrlConfig().register, data, function(data) {
            debugInfo(data);
            if (data.code == 40003) {
                var errorMsg = '该用户名已经被使用';
                username.parent().append(
                        '<span class="formtips onError">' + errorMsg
                                + '</span>');
                return;
            }
            if (data.code == 40002) {
                var errorMsg = '该手机号码已经被使用';
                mobile.parent().append(
                        '<span class="formtips onError">' + errorMsg
                                + '</span>');
                return;
            }
            // 注册成功，页面跳转
            layer.msg('注册成功！', {
              time: 2000,
              skin: 'layui-layer-alarm',
              icon: 1,
            });
            setTimeout(function(){
              window.location.href = '/index';
            }, 2000);
        }, function(err) {
          debugInfo(err);
            if (err.responseJSON && err.responseJSON.code == 40001) {
                var errorMsg = '手机验证码错误';
                valiCode.parent().append(
                        '<span class="formtips onError">' + errorMsg
                                + '</span>');
                return;
            }
            layer_server_err();
        });
    }

    // 登陆提交，最终验证。
    $('#login').click(function() {
        // 用户名验证
        var username = $('#username');
        username.parent().find('.formtips').remove();
        if (username.val() == '') {
            var errorMsg = '请输入登录名';
            username.parent().append(
                    '<span class="formtips onError">' + errorMsg
                            + '</span>');
            return false;
        }
        // 密码验证
        var password = $('#password');
        password.parent().find('.formtips').remove();
        if (password.val() == '') {
            var errorMsg = '请输入密码';
            password.parent().append(
                    '<span class="formtips onError">' + errorMsg
                            + '</span>');
            return false;
        }
        var data = {
            'loginName' : username.val(),
            'password' : password.val()
        }
        $.post(apiUrlConfig().login, data, function(data) {
            // 登陆成功页面跳转
            sessionStorage.setItem('user-cache', 'current-cache');
            debugInfo(data);
            getUserInfo();
        }, function(err) {
            if (err.responseJSON && err.responseJSON.code == 40000) {
                var errorMsg = '登录名或密码错误';
                password.parent().append(
                        '<span class="formtips onError">' + errorMsg
                                + '</span>');
                return;
            }
            layer_server_err();
            debugInfo(err);
        });
    });

    /**
     * 获取用户信息
     */
    function getUserInfo() {
        $.post(apiUrlConfig().getdetail, null, function(data) {
            window.location.href = '/documents/documents';
            debugInfo(data.data.userId);
        }, function(err) {
            layer_server_err();
            debugInfo(err);
        });
    }

    // 翰林用户协议选项框样式切换
    $('#agreement').change(function() {
        if ($(this).is(':checked')) {
            $('#register').removeAttr('disabled');
            $('#login').removeAttr('disabled');
            $('.checkboxLabel').css('background-position', '0 100%');
        } else {
            $('#register').attr('disabled', 'true');
            $('#login').attr('disabled', 'true');
            $('.checkboxLabel').css('background-position', '0 0');
        }
    });

    // 单选框radio样式切换
    $('.btn-radio input').change(function() {
      $('.btn-radio').each(function(){
        $(this).css('background-position', '0 0');
      });
      $(this).parent().css('background-position', '0 100%');
    });

    // 上传内容验证
    $('#confirmUpload').click(function() {
        // 归属分类验证
        var cate = $('#cate');
        cate.parent().find('.formtips').remove();
        if (cate.val() == "" && cate[0].options.length > 1 && !cate.is(':disabled')) {
            var errorMsg = '请选择分类';
            cate.parent().append(
                    '<span class="formtips onError">' + errorMsg
                            + '</span>');
            return;
        }
        // 学段验证
        var phaseCate = $('#phaseCate');
        phaseCate.parent().find('.formtips').remove();
        if (phaseCate.val() == "" && phaseCate[0].options.length > 1 && !phaseCate.is(':disabled')) {
            var errorMsg = '请选择学段';
            phaseCate.parent().append(
                    '<span class="formtips onError">' + errorMsg
                            + '</span>');
            return;
        }
        // 学科验证
        var subjectCate = $('#subjectCate');
        subjectCate.parent().find('.formtips').remove();
        if (subjectCate.val() == ""
                && subjectCate[0].options.length > 1 && !subjectCate.is(':disabled')) {
            var errorMsg = '请选择学科';
            subjectCate.parent().append(
                    '<span class="formtips onError">' + errorMsg
                            + '</span>');
            return;
        }
        // 版本验证
        var versionCate = $('#versionCate');
        versionCate.parent().find('.formtips').remove();
        if (versionCate.val() == ""
                && versionCate[0].options.length > 1 && !versionCate.is(':disabled')) {
            var errorMsg = '请选择版本';
            versionCate.parent().append(
                    '<span class="formtips onError">' + errorMsg
                            + '</span>');
            return;
        }
        // 年级验证
        var gradeCate = $('#gradeCate');
        gradeCate.parent().find('.formtips').remove();
        if (gradeCate.val() == "" && gradeCate[0].options.length > 1 && !subjectCate.is(':disabled')) {
            var errorMsg = '请选择版本';
            gradeCate.parent().append(
                    '<span class="formtips onError">' + errorMsg
                            + '</span>');
            return;
        }
        // 金额验证
        var paymentMethod = $('input:radio[name="paymentMethod"]:checked').val();
        var contentPrice = $('#input-price');
        $('#pricetag').find('.formtips').remove();
        if (paymentMethod == 1 && (!/^([0-9]+|[0-9]{1,3}(,[0-9]{3})*)(.[0-9]{1,2})?$/.
            test(contentPrice.val()) || contentPrice.val() == 0)) {
            var errorMsg = '输入金额有误';
            $('#pricetag').append(
                    '<span class="formtips onError">' + errorMsg
                            + '</span>');
            return;
        }
        // 内容验证
        var contentTitle = $('#content-title');
        contentTitle.parent().find('.formtips').remove();
        if (contentTitle.val() == '') {
            var errorMsg = '请填写内容标题';
            contentTitle.parent().append(
                    '<span class="formtips onError">' + errorMsg
                            + '</span>');
            return;
        }
        // 内容封面验证
        var coverImage = $('#coverImage');
        coverImage.parent().find('.formtips').remove();
        var paymentMethod = $('input:radio[name="paymentMethod"]:checked').val();
        // paymentMethod 1 公开付费；2 公开免费；3 班级私有
        if (paymentMethod !=3 && coverImage.val() == '') {
            var errorMsg = '请选择内容封面';
            coverImage.parent().append(
                    '<span class="formtips onError">' + errorMsg
                            + '</span>');
            return;
        }
        // 内容简介验证
        var introduction = $('#introduction');
        introduction.parent().find('.formtips').remove();
        if (introduction.val() == '') {
            var errorMsg = '请填写内容简介';
            introduction.parent().append(
                    '<span class="formtips onError">' + errorMsg
                            + '</span>');
            return;
        }
        uploadContent();
    });

    /**
     * 上传内容最终验证提交
     */
    function uploadContent() {
        $('#folder').parent().find('.formtips').remove();
        var tagIds = [];
        $('.input-label > div').each(function() {
            tagIds.push($(this)[0].id);
        });
        var uploadFile = $('#filePicker');
        var data = {
            'status' : status,
            'summary' : $('#introduction').val(),
            'title' : $('#content-title').val(),
            'files' : [ {
                "fileKey" : uploadFile.attr('data-fileKey'),
                "fileName" : uploadFile.attr('data-fileName'),
                "fileSize" : uploadFile.attr('data-fileSize'),
                "fileExt" : uploadFile.attr('data-fileExt'),
                "fileType" : uploadFile.attr('data-fileType')
            } ],
            'tagIds' : tagIds
        };
        // 设置内容状态与是否付费
        // paymentMethod 1 公开付费；2 公开免费；3 班级私有
        var paymentMethod = $('input:radio[name="paymentMethod"]:checked').val();
        var coverImage = $('#coverPicker').attr('data-url');
        if (paymentMethod == 3) {
            if (coverImage != ''){
              data.coverImage = coverImage;
            }
            data.status = 0; // status 0 私有，1 审核中，2 审核未通过，3 审核通过已公开， 4 已删除到回收站
            data.paid = 0; // paid 是否付费，0 免费；1 付费
        } else {
            data.coverImage = coverImage;
            data.status = 1;
            if (paymentMethod == 1) {
                data.paid = 1;
                data.price = $('#input-price').val();
            } else if (paymentMethod == 2) {
                data.paid = 0;
            }
        }
        // 验证归属分类
        if($('#cate').val() != '') {
            data.cateId = $('#cate').val();
        }
        if($('#phaseCate').val() != '') {
            data.phaseCateId = $('#phaseCate').val();
        }
        if($('#subjectCate').val() != '') {
            data.subjectCateId = $('#subjectCate').val();
        }
        if($('#versionCate').val() != '') {
            data.editionCateId = $('#versionCate').val();
        }
        if($('#gradeCate').val() != '') {
            data.gradeCateId = $('#gradeCate').val();
        }
        if($('#folder .folder-wrap').attr('data-id')) {
            data.folderId = $('#folder .folder-wrap').attr('data-id');
        } else {
          if (data.status == 0 && data.paid == 0) {
            var errorMsg = '班级私有文件需选择对应班级文件夹';
            $('#folder').parent().append(
                    '<span class="formtips onError">' + errorMsg
                            + '</span>');
            return;
          }
        }
        $.post(apiUrlConfig().publish, data, function(data) {
            $('#information').removeClass('active').removeClass('in');
            $('#uploadSuccess').addClass('active').addClass('in');
            // 上传成功后清空上传文件
            $('#file_num_1 .col1').text('');
            // 显示上传成功页面
            if (paymentMethod == 3) {
              $('#exresult').css('visibility', 'hidden');
            }
            var stepList = $(".upload-steps > ul > li");
            $(stepList[3]).addClass("active");
            $(stepList[4]).addClass("active");
            pageScrollTop();
            debugInfo(data);
        }, function(err) {
            debugInfo(err);
            layer_server_err();
        });
    }

    // 点击发送验证码
    $("#btn-code").click(function() {
        var phoneNo = $('#phoneNo');
        var btnCode = $("#btn-code");
        $(btnCode).attr("disabled", "disabled");
        phoneNo.parent().find('.formtips').remove();
        if (!/^1[34578]\d{9}$/.test(phoneNo.val())) {
            var errorMsg = '手机号码格式不正确，请重新输入';
            phoneNo.parent().append(
                    '<span class="formtips onError">' + errorMsg
                            + '</span>');
            $(btnCode).attr("disabled", 'true');
            phoneNo.focus();
            return false;
        }
        $.post(apiUrlConfig().send, {
            'phoneNo' : phoneNo.val()
        }, function(data) {
            var intervalTime = 60;
            $(btnCode).text("已发送(" + intervalTime + ")");
            intervalTime--;
            var codeInterval = setInterval(function() {
                $(btnCode).text("已发送(" + intervalTime + ")");
                intervalTime--;
                if (intervalTime < 0) {
                    clearInterval(codeInterval);
                    $(btnCode).text("发送验证码");
                    $(btnCode).removeAttr("disabled");
                }
            }, 1000);
            debugInfo(data);
        }, function(err) {
            layer_server_err();
            debugInfo(err);
        });
    });

    // 修改个人信息验证提交
    $('#btnUserInfo').click(function() {
        var email = $('#email');
        email.parent().find('.formtips').remove();
        if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(email.val())) {
            var errorMsg = '请输入正确的邮箱地址';
            email.parent().append(
                    '<span class="formtips onError">' + errorMsg
                            + '</span>');
            return false;
        }
        var phoneNo = $('#phoneNo');
        phoneNo.parent().find('.formtips').remove();
        if (!/^1[34578]\d{9}$/.test(phoneNo.val())) {
            var errorMsg = '手机号码格式不正确，请重新输入';
            phoneNo.parent().append(
                    '<span class="formtips onError">' + errorMsg
                            + '</span>');
            return false;
        }
        var valiCode = $('#valiCode');
        valiCode.parent().find('.formtips').remove();
        if (valiCode.val() == '') {
            var errorMsg = '验证码不能为空';
            valiCode.parent().append(
                    '<span class="formtips onError">' + errorMsg
                            + '</span>');
            return false;
        }
        // 修改请求的日期格式
        var yearControl = $('#yearControl').val();
        var monthControl = $('#monthControl').val();
        var dayControl = $('#dayControl').val();
        var birthday = yearControl;
        birthday += monthControl.length > 1 ? monthControl : '0'
                + monthControl;
        birthday += dayControl.length > 1 ? dayControl : '0'
                + dayControl
        var data = {
            'gender' : $('input:radio[name="gender"]:checked').val(),
            'birthday' : birthday,
            'email' : email.val(),
            'verifyCode' : valiCode.val(),
            'wepayAccount' : $('#wxAccount').val(),
            'wepayUsername' : $('#wepayUsername').val(),
            'alipayAccount' : $('#alipayAccount').val(),
            'alipayUsername' : $('#alipayUsername').val(),
            'introduction' : $('#introduction').val()
        }
        $.post(apiUrlConfig().updateInfo, data, function(
                data) {
            // 修改用户资料成功
            layer.msg('修改用户资料成功', {
              time: 2000,
              skin: 'layui-layer-alarm',
              icon: 1,
            });
            setTimeout(function() {
              window.location.href = "/user/personal";
            }, 2000);
            debugInfo(data);
        }, function(err) {
            debugInfo(err);
            if (err.responseJSON && err.responseJSON.code == 40000) {
              valiCode.parent().append(
                  '<span class="formtips onError">验证码错误</span>');
              return;
            }
            layer_server_err();
        });
    });

    // 修改密码验证提交
    $('#updatePassword :input').blur(function() {
        var $parent = $(this).parent();
        $parent.find('.formtips').remove();
        // 验证原密码
        if ($(this).is('#currentPass')) {
            if ($(this).val() == '') {
                var errorMsg = '请输入原密码';
                $(this).css
                $parent.append('<span class="formtips onError">'
                        + errorMsg + '</span>');
            }
        }
        // 验证新密码
        if ($(this).is('#newPassowrd')) {
            if (!/^(?![a-zA-z]+$)(?![0-9]+$)(?![!@$_%^&*]+$)[a-zA-Z0-9!@$_%^&*]{6,16}$/
                            .test($(this).val())) {
                var errorMsg = '密码格式不正确，为6-16位的字母和数字的组合';
                $parent.append('<span class="formtips onError">'
                        + errorMsg + '</span>');
            } else if ($(this).val() == $('#currentPass').val()) {
              var errorMsg = '新密码不能与原密码相同';
              $parent.append('<span class="formtips onError">'
                      + errorMsg + '</span>');
            }
        }
        if ($(this).is('#reNewPassowrd')) {
            if ($(this).val() != $('#newPassowrd').val()) {
                var errorMsg = '两次密码输入不一致';
                $parent.append('<span class="formtips onError">'
                        + errorMsg + '</span>');
            }
        }
    }).keyup(function(event) {
      if (event.which != 9) {
        $(this).triggerHandler('blur');
      }
    });// end blur

    // 修改密码最终提交
    $('#btnPassword').click(function() {
        var currentPass = $('#currentPass');
        currentPass.parent().find('.formtips').remove();
        if (currentPass.val() == '') {
            var errorMsg = '请输入原密码';
            currentPass.parent().append(
                    '<span class="formtips onError">'
                            + errorMsg + '</span>');
            return false;
        }
        var newPassowrd = $('#newPassowrd');
        newPassowrd.parent().find('.formtips').remove();
        if (!/^(?![a-zA-z]+$)(?![0-9]+$)(?![!@$_%^&*]+$)[a-zA-Z0-9!@$_%^&*]{6,16}$/
                        .test(newPassowrd.val())) {
            var errorMsg = '密码格式不正确，为6-16位的字母和数字的组合';
            newPassowrd.parent().append(
                    '<span class="formtips onError">'
                            + errorMsg + '</span>');
            return false;
        }else if (newPassowrd.val() == currentPass.val()) {
          var errorMsg = '新密码不能与原密码相同';
          newPassowrd.parent().append('<span class="formtips onError">'
                  + errorMsg + '</span>');
          return false;
        }
        var reNewPassowrd = $('#reNewPassowrd');
        reNewPassowrd.parent().find('.formtips').remove();
        if (reNewPassowrd.val() == ''
                || reNewPassowrd.val() != newPassowrd.val()) {
            var errorMsg = '两次密码输入不一致';
            reNewPassowrd.parent().append(
                    '<span class="formtips onError">'
                            + errorMsg + '</span>');
            return false;
        }
        var data = {
            'oldPwd' : currentPass.val(),
            'newPwd' : newPassowrd.val()
        }
        $.post(apiUrlConfig().updatePass, data,
            function(data) {
                // 修改用户密码
                layer.msg('修改密码成功', {
                  time: 2000,
                  skin: 'layui-layer-alarm',
                  icon: 1,
                });
                setTimeout(function() {
                  window.location.href = '/user/personal';
                }, 2000);
                debugInfo(data);
            }, function(err) {
                if (err.responseJSON && err.responseJSON.code == 40004) {
                  currentPass.parent().append(
                          '<span class="formtips onError">原密码错误 </span>');
                  return;
                }
                layer_server_err();
                debugInfo(err);
            });
    });

    // 修改用户认证最终提交
    $('#btn-authetication').click(function() {
        // 验证真实姓名
        var realname = $('#realName');
        realname.parent().find('.formtips').remove();
        if (realname.val() == '') {
            var errorMsg = '请输入真实姓名';
            realname.parent().append(
                    '<span class="formtips onError">'
                            + errorMsg + '</span>');
            return false;
        }
        // 验证真实头像
        var identifyImage = $('#identifyImage');
        $('#indetifyPhotoPicker').parent().find('.formtips').remove();
        if (identifyImage.attr('data-type') == 0) {
          var errorMsg = '请上传真实头像';
          $('#indetifyPhotoPicker').parent().append(
                  '<span class="formtips onError">'
                          + errorMsg + '</span>');
          return false;
        }
        // 验证身份证正反面
        $('#idCard01').find('.formtips').remove();
        if ($('#idCard01 img').length == 0 || $('#idCard02 img').length == 0) {
          var errorMsg = '请上传您的身份证正反面照片';
          $('#idCard01').append(
                  '<span class="formtips onError">'
                          + errorMsg + '</span>');
          return false;
        }
        // 验证认证材料信息
        $('#otherCard01').parent().find('.formtips').remove();
        if ($('#otherCard01 img').length == 0 && $('#otherCard02 img').length == 0
            && $('#otherCard03 img').length == 0) {
          var errorMsg = '请至少上传一张认证材料照片';
          $('#otherCard01').parent().append(
                  '<span class="formtips onError">'
                          + errorMsg + '</span>');
          return false;
        }
        var data = {
            'type' : $('#authType').val(),
            "detail" : [
                    {
                        "type" : "text",
                        "key" : "realname",
                        "keyDesc" : "真实姓名",
                        "values" : [ realname.val() ]
                    },
                    {
                        "type" : "image",
                        "key" : "avatar",
                        "keyDesc" : "真实头像地址",
                        "values" : [ $('#identifyImage').attr('src') ]
                    },
                    {
                        "type" : "image",
                        "key" : "identity",
                        "keyDesc" : "身份证信息",
                        "values" : [ $('#idCard01 img').attr('src'),
                                $('#idCard02 img').attr('src') ]
                    },
                    {
                        "type" : "image",
                        "key" : "credentials",
                        "keyDesc" : "证件信息",
                        "values" : [ $('#otherCard01 img').attr('src'),
                                $('#otherCard02 img').attr('src'),
                                $('#otherCard03 img').attr('src')]
                    } ]
        };
        $.post(apiUrlConfig().identification, data, function(data) {
            layer.alert('已提交认证资料，请耐心等待审核结果', {
                skin: 'layui-layer-green' //样式类名
                ,closeBtn: 0
            },function(){
                window.location.href = '/user/identification';
            });
            debugInfo(data);
        }, function(err) {
            $('#btn-authetication').text('确认提交');
            $('#btn-authetication').removeAttr('disabled');
            layer_server_err();
            debugInfo(err);
        }, function(){
            $('#btn-authetication').text('正在提交...');
            $('#btn-authetication').attr('disabled', true);
        });
    });

    // 手机号输入框输入验证
    $('#phoneNo').keypress(function(){
        var keyCode = event.keyCode;
        if ((keyCode >= 48 && keyCode <= 57))
        {
            event.returnValue = true;
        } else {
            event.returnValue = false;
        }
    });
});