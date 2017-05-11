/*
 * Copyright (C) 2017 QIANKUN HANLIN Corporation Limited
 *
 * 公共方法js
 */

$(function() {
    /**
     * ajax封装
     * @param url 发送请求的地址
     * @param data 发送到服务器的数据
     * @param dataType 预期服务器返回的数据类型
     * @param successfn 成功回调函数
     * @param errorfn 失败回调函数
     * @param beforefn 请求前调用函数
     */
    jQuery.post = function(url, data, successfn, errorfn, beforefn) {
        data = (data == null || data == "" || typeof (data) == "undefined") ? {
            "date" : new Date().getTime()
        } : JSON.stringify(data);
        $.ajax({
            type : "post",
            contentType : "application/json",
            data : data,
            timeout : 20000,
            url : url,
            dataType : "json",
            success : function(d) {
                successfn(d);
            },
            error : function(e) {
                if(e.readyState == 0) {
                  layer.msg('网络超时，请稍后再试', {
                    time: 2000,
                    skin: 'layui-layer-alarm',
                    icon: 2,
                  });
                  return;
                }
                errorfn(e);
            },
            beforeSend : function() {
                if(typeof(beforefn) == "function") {
                    beforefn();
                }
            }
        });
    };

    var t_type; // 内容数据类型
    var t_pageSize = 30; // 分页条数
    var isFirstInit = true; // 是否第一次初始化
    var pageHistory = []; // 分页历史记录
    var isPageHistoryEvent = true; // 分页历史记录事件

    /**
     * 分页历史回退函数
     */
    pageHistoryBack = function() {
      if (pageHistory.length > 1) {
        isPageHistoryEvent = false;
        pageHistory.pop();
        var lastPage = pageHistory[pageHistory.length-1]; // 上一个记录页
        $('.pagination a').each(function(){
            if($(this).text() == lastPage) {
                $(this).click();
            }
        });
      } else if (pageHistory.length == 1){
        isPageHistoryEvent = false;
        pageHistory.pop();
        $('div.pagination').children().eq(1).click();
        $('#backFolder').addClass('enabled');
      }
    }

    /**
     * 分页回调函数
     * @param page_index 回调当前页
     * @param jq jQuerys
     */
    pageselectCallback = function(page_index, jq) {
      if (isPageHistoryEvent) {
        var backFolder = $('#backFolder');
        if (backFolder.hasClass('enabled')) {
          backFolder.removeClass('enabled');
        }
        pageHistory.push(page_index+1);
      } else {
        isPageHistoryEvent = true;
      }
      paginationDone(t_type, page_index+1);
      return false;
    };

    /**
     * 分页
     * @param type 分类list类型 0 我的文档;1 我的贡献-公开文件;2 我的贡献-私有文件;3 我的贡献-提交审核中;4 回收站;5 我的下载记录;6 我的售卖记录;7 我的购买记录
     * @param currentPage 当前页
     * @param folderId 文件夹ID
     * @param reload 是否重新加载
     */
    paginationDone = function(type, currentPage, folderId, reload) {
        var data = {
            'type' : type,
            'page' : currentPage,
            'pageSize' : t_pageSize
        }
        if (folderId && type == 0) {
            data.folderId = folderId;
        }
        if (reload) {
            isFirstInit = reload;
        }
        var i;
        $.post(apiUrlConfig().getlist, data,
            function(data) {
                templateDateParse();
                if(isFirstInit) {
                    if(data.data.items.length == 0 && (type == 0 || type == 4)) {
                      if($('#tableBody tr').length == 0) {
                        $('#tableBody').append('<tr><td colspan="6" style="text-align:center">暂无记录信息</td></tr>');
                      }
                    }
                    initPagination(data.data, type);
                    isFirstInit = false;
                }
                var html = template('docs', data.data);
                if (currentPage != 1) {
                    $('#tableBody .folders').addClass('hide');
                } else {
                    $('#tableBody .folders').removeClass('hide');
                }
                $('#tableBody .files').remove();
                $('#tableBody').append(html);
                debugInfo(data);
                setTimeout(function() {
                  close_load_layer(i);
                    pageScrollTop();
                }, 200);
            }, function(err) {
                layer_server_err();
                debugInfo(err);
            }, function() {
                i = show_load_layer();
            });
    }

    /**
     * 页面滚动至顶部
     */
    pageScrollTop = function () {
        $('html, body').animate({scrollTop:0}, 'slow');
    }

    /**
     * 初始化分页
     * @param d 进行分页的数据data
     * @param t 进行分页的数据类型
     */
    initPagination = function(d, t) {
        var num_entries = d.totalSize;
        t_type = t;
        $(".pagination").pagination(num_entries, {
            callback : pageselectCallback,
            items_per_page : t_pageSize,
            prev_text: ' ',
            next_text: ' ',
            load_first_page:false,
        });
    };

    /**
     * arctemplate时间类型解析
     * @return Date 格式化后的时间
     */
    templateDateParse = function() {
        template.helper("dateFormat", function(date, format) {
            date = new Date(date * 1000);
            var map = {
                "M": date.getMonth() + 1, // 月份
                "d": date.getDate(), // 日
                "h": date.getHours(), // 小时
                "m": date.getMinutes(), // 分
                "s": date.getSeconds(), // 秒
                "q": Math.floor((date.getMonth() + 3) / 3), // 季度
                "S": date.getMilliseconds() // 毫秒
            };
            format = format.replace(/([yMdhmsqS])+/g, function(all, t){
                var v = map[t];
                if(v !== undefined){
                    if(all.length > 1){
                        v = '0' + v;
                        v = v.substr(v.length-2);
                    }
                    return v;
                }
                else if(t === 'y'){
                    return (date.getFullYear() + '').substr(4 - all.length);
                }
                return all;
            });
            return format;
        });
    };

    /**
     * 加载显示loading
     * @return layerLoading layer弹出层
     */
    show_load_layer = function (){
        return layer.load(1, {shade: 0});
    };

    /**
     * 关闭loading
     */
    close_load_layer = function(index) {
        layer.close(index);
    };

    /**
     * 输出日志
     */
    var debug = true;
    debugInfo = function(info) {
        if(debug && window.console) {
            console.log(info);
        }
    }

    /**
     * 显示与隐藏上传进度框
     */
    uploadProgress = function(type) {
        if (type == 'open') {
            var progressHtml = '<div class="progress-wrap">';
            progressHtml += '<div class="progress-content">';
            progressHtml += '<div class="progress-title">上传进度</div>';
            progressHtml += '<div class="progress progress-striped active">';
            progressHtml += '<div class="progress-bar progress-bar-success" role="progressbar" id="processbar"';
            progressHtml += 'aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">';
            progressHtml += '</div><div id="processInfo"></div></div></div></div>';
            $('body').append(progressHtml);
        } else {
            $('body').find('.progress-wrap').remove();
        }
    }

    // layer服务器错误提示
    layer_server_err = function() {
      layer.msg('服务器错误，请稍后再试', {
        time: 2000,
        skin: 'layui-layer-alarm',
        icon: 2,
      });
    }

    /**
     * 绑定浏览器后退按钮事件
     */
    History.Adapter.bind(window,'statechange',function(){ // 用 statechange 代替 popstate
        var state = History.getState(); // 用History.getState() 代替 event.state
        if (state.data && state.url) {
            if(state.data.type) {
                $('#backFolder').click();
            } else {
                $('.pagination a').each(function(){
                    if($(this).text() == state.data.page) {
                        $(this).click();
                    }
                });
            }
        }
    });

    /**
     * 内容文件选择
     * @param obj 当前选择的内容对象
     */
    contentSelect = function(obj) {
        $('#tableBody').find('td.sorting_1 input').each(function(){
            if($(this)[0] != obj) {
                $(this).prop('checked',false);
            }
        })
        // 判断是否能进行移动操作
        var folder = $(obj).parent().next().find('a');
        if (folder.attr('data-type')) {
            $('#moveFolder').addClass('enabled');
        } else {
            $('#moveFolder').removeClass('enabled');
        }
        // 判断是否能进行编辑操作
        if (folder.attr('data-type')) {
            $('#updateFolder').removeClass('enabled');
        } else {
            $('#updateFolder').addClass('enabled');
        }
//        // 判断是否能进行删除操作
//        if (folder.attr('data-sub') && folder.attr('data-sub') > 0) {
//            $('#deleteFolderModal').addClass('enabled');
//        } else {
//            $('#deleteFolderModal').removeClass('enabled');
//        }
        if (!$(obj).is(':checked')) {
            $(obj).prop('checked',false);
            openOperation();
        } else {
            $(obj).prop('checked',true);
        }
    }
});