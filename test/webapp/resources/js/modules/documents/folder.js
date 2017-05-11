/*
 * Copyright (C) 2017 QIANKUN HANLIN Corporation Limited
 *
 * 我的文档文件及文件夹操作js
 */

$(function(){
    var selectNode; // 当前文件节点
    var folderData; // 文件夹数据
    var folderNode; // 当前文件夹节点
    var folderContent = $('#tableBody'); // 文件夹父节点
    var folderMove = $('#folderModal .body-content'); // 移动文件夹父节点
    getAllFolders();

    /**
     * 获取所有文件夹信息并进行分页
     * @param currentNode 当前文件夹节点
     */
    function getAllFolders(currentNode) {
        $.post(apiUrlConfig().getfolderlist, null, function(data) {
            folderData = data;
            templateDateParse();
            if(currentNode != null) {
                render(folderData.data, currentNode.folderId, 'folder');
                if(selectNode != null) {
                    folderContent.html(template('folders', selectNode));
                    paginationDone(0, 1, currentNode.folderId, true);
                }
            } else {
                folderContent.html(template('folders', data));
                folderMove.html(template('mvfolder', data));
                paginationDone(0, 1, null, true);
            }
            debugInfo(data)
        }, function(err) {
            layer_server_err();
            debugInfo(err);
        });
    }

    /**
     * 获取子文件夹
     * @param obj 当前文件夹节点
     * @param type 子文件夹类型
     */
    floderHierarchy = function (obj, type){
        var folderId = $(obj).attr('data-id');
        if (type == 'folder') {
            render(folderData.data, folderId, 'folder');
            paginationDone(0, 1, folderId, true);
            if(selectNode != null) {
                folderContent.html(template('folders', selectNode));
                openOperation();
                $('#newFolder').addClass('enabled');
            }
            $('#backFolder').removeClass('enabled');
//            History.pushState({ title: '翰林三方上传平台文件夹' , page: 1, type: 1},
//                '翰林三方上传平台文件夹', location.href.split("?")[0] + "?folder=" + folderId);
        } else if(type == 'mvfolder') {
            render(folderData.data, folderId, 'mvfolder');
            if (folderNode != null) {
                folderMove.html(template('mvfolder', folderNode));
            }
        }
        pageScrollTop();
    }

    /**
     * 根据文件夹ID查找文件夹节点
     * @param d 文件夹数据
     * @param val 需要查找的文件夹ID
     * @param type 子文件夹类型
     */
    function render(d, val, type) {
        if (!d)
            return;
        $.each(d, function(k, v) {
            if ($.isArray(this) || $.isPlainObject(this)) {
                render(this, val, type);// 当前节点是数组，继续递归
            } else {
                if (k == 'folderId' && v == val) {
                    if (type == 'folder') {
                        selectNode = d;
                    } else if (type == 'mvfolder') {
                        folderNode = d;
                    }
                    return false;
                }
            }
        });
    }

    /**
     * 点击后退文件夹
     */
    $('#backFolder').click(function() {
        if ($(this).hasClass('enabled')) {
            return;
        }
        // 后退重新加载文件夹和内容列表
        if (selectNode != null) {
            $('#levels > li:last-child').remove();
            paginationDone(0, 1, selectNode.parentFolderId, true);
            if (selectNode.parentFolderId == null) {
                var html = template('folders', folderData)
                folderContent.html(html);
                selectNode = null;
                $('#backFolder').addClass('enabled');
                $('#newFolder').removeClass('enabled');
            } else {
                render(folderData.data, selectNode.parentFolderId, 'folder');
                if (selectNode != null) {
                    var html = template('folders', selectNode)
                    folderContent.html(html);
                }
            }
            openOperation();
        } else {
          // 分页后退
          pageHistoryBack();
        }
    });

    /**
     * 点击后退移动文件夹
     */
    $('#mvBackFolder').click(function() {
        // 移动内容文件时后退重新加载文件夹
        if (folderNode != null) {
            if (folderNode.parentFolderId == null) {
                folderMove.html(template('mvfolder', folderData));
                folderNode = null;
            } else {
                render(folderData.data, folderNode.parentFolderId, 'mvfolder');
                if (folderNode != null) {
                    folderMove.html(template('mvfolder', folderNode));
                }
            }
            // 隐藏不同类型的文件夹
            var folderCheck = $("#tableBody input[name='checkbox']:checkbox:checked");
            var folder = folderCheck.parent().parent().find('a');
            var folderPaid = folder.attr('data-paid');
            var folderStatus = folder.attr('data-status');
            // folderStatus 文件夹状态，1  公开免费；2 公开付费；3 班级私有
            var folderType = folderStatus == 0 ? 3 : (Number(folderPaid) + 1);
            $('#folderModal .body-content .odd').each(function(){
                var folder = $(this).find('a');
                if(folder.attr('data-type') != folderType
                        && folder.attr('data-parent') == '') {
                    $(this).css('display', 'none');
                }
            })
        }
    });

    /**
     * 点击新建文件夹
     */
    $('#newFolder').click(function(){
        // 文件夹里不允许创建新文件夹
        if ($(this).hasClass('enabled') || selectNode != null) {
          return false;
        }
        // 创建文件夹UI
        var newFolderItem = $('#tableBody .new-dir-item');
        if (newFolderItem.length != 0) {
            newFolderItem.find('#folderName').focus();
            return;
        }
        var nfolder = '';
        nfolder += '<tr role="row" class="odd">';
        nfolder += '<td class="sorting_1"><input type="checkbox"></td>';
        nfolder += '<td colspan=5><div class="bg-nf-forder"></div>';
        nfolder += '<div class="new-dir-item">';
        nfolder += '<input node-type="new-dir-box" maxlength="30" autofocus="autofocus" ';
        nfolder += 'id="folderName" class="boxfolder" type="text" placeholder="新建文件夹">';
        if (selectNode == null) {
            nfolder += '<select id="new-folder-type"><option value="1">';
            nfolder += '公开免费</option><option value="2">公开付费</option></select>';
        }
        nfolder += '<span node-type="new-dir-sure" onclick="createFolder();" ';
        nfolder += 'class="sure glyphicon glyphicon-ok"></span>';
        nfolder += '<span node-type="new-dir-cancel" onclick="canselFolder(this);" ';
        nfolder += 'class="cancel glyphicon glyphicon-remove"></span></tr>';
        folderContent.prepend(nfolder);
    });

    /**
     * 创建文件夹并刷新列表
     */
    createFolder = function () {
        var folderName = $('#folderName');
        if (folderName.val() == '') {
          folderName.focus();
          layer.msg('文件夹名不能为空', {
            time: 2000,
            skin: 'layui-layer-alarm',
            icon: 9,
          });
          return;
        }
        var folderType = $('#new-folder-type').val();
        var data = {
            'name': folderName.val()
        }
        if (selectNode == null && folderType) {
            data.type = folderType;
        } else {
            data.type = selectNode.type;
        }
        if (selectNode !=null ) {
            data.parentFolderId = selectNode.folderId;
        }
        var i;
        $.post(apiUrlConfig().addfolder, data, function(data) {
            debugInfo(data);
            getAllFolders(selectNode);
            setTimeout(function() {
              close_load_layer(i);
            }, 200);
        }, function(err) {
            layer_server_err();
            debugInfo(err);
        }, function() {
            i = show_load_layer();
        });
    }

    /**
     * 取消创建文件夹
     * @param obj 取消文件夹的当前对象
     */
    canselFolder = function(obj) {
        $(obj).parent().parent().parent().remove();
    }

    /**
     * 选择文件夹
     * @param obj 选择文件夹的当前对象
     */
    checkFolder = function(obj) {
        $('.body-content > .grid-view-item').each(function(){
            if($(this).hasClass('item-active') &&
                    $(this).find('a').attr('data-id') != $(obj).parent().find('a').attr('data-id')) {
                $(this).removeClass('item-active');
                $(this).find('.checkbox').removeClass('active')
            }
        });
        $(obj).toggleClass('active');
        $(obj).parent().toggleClass('item-active');
    }

    /**
     * 点击删除文件夹
     */
    $('#deleteFolder').click(function(){
        var folderCheck = $("#tableBody input[name='checkbox']:checkbox:checked")
        if (folderCheck.length == 0) {
            layer.msg('请先选择文件', {
              time: 2000,
              skin: 'layui-layer-alarm',
              icon: 9,
            });
            return;
        }
        var folder = folderCheck.parent().parent().find('a');
        if (folder.attr('data-sub') > 0) {
            layer.msg('文件夹中还有内容不能删除', {
              time: 2000,
              skin: 'layui-layer-alarm',
              icon: 9,
            });
            return;
        }
        // 如果是文件夹
        if(folder.attr('data-type')) {
            deleteFolder(folder);
        } else {
            deleteContent(folder);
        }
        $('#deleteModal').modal('hide');
    });

    /**
     * 确认删除文件夹
     * @param folder 删除的文件夹
     */
    function deleteFolder(folder) {
        var i;
        var data = {
            'folderId': folder.attr('data-id')
        }
        $.post(apiUrlConfig().deletefolder, data, function(data) {
            debugInfo(data);
            getAllFolders(selectNode);
            setTimeout(function() {
              close_load_layer(i);
            }, 200);
        }, function(err) {
            layer_server_err();
            debugInfo(err);
        }, function() {
            i = show_load_layer();
        });
    }

    /**
     * 确认删除内容
     * @param folder 删除的内容
     */
    function deleteContent(folder) {
        var i;
        var data = {
            'resId': folder.attr('data-id')
        }
        $.post(apiUrlConfig().deletetorecyclebin, data, function(data) {
            debugInfo(data);
            getAllFolders(selectNode);
            setTimeout(function() {
              close_load_layer(i);
            }, 200);
        }, function(err) {
            layer_server_err();
            debugInfo(err);
        }, function() {
            i = show_load_layer();
        });
    }

    /**
     * 显示确认删除文件夹弹框
     */
    $('#deleteFolderModal').click(function(){
        var folderCheck = $("#tableBody input[name='checkbox']:checkbox:checked");
        if (folderCheck.length == 0) {
            layer.msg('请先选择文件夹或文件', {
              time: 2000,
              skin: 'layui-layer-alarm',
              icon: 9,
            });
            return;
        }
        var folder = folderCheck.parent().parent().find('a');
        if (folder.attr('data-sub') > 0) {
            layer.msg('文件夹中还有内容不能删除', {
              time: 2000,
              skin: 'layui-layer-alarm',
              icon: 9,
            });
            return;
        }
        var modalTitle = $('#deleteModal .modal-title');
        var modalBody = $('#deleteModal .modal-body > div');
        if(folder.attr('data-type')) {
            modalTitle.text('确认删除文件夹');
            modalBody.text('确认要删除选中的文件夹吗？');
        } else {
            modalTitle.text('确认删除文件');
            modalBody.text('确认要删除选中的文件吗？');
        }
        $('#deleteModal').modal();
    });

    /**
     * 显示移动文件夹选择文件弹框
     */
    $('#moveFolder').click(function(){
        var folderCheck = $("#tableBody input[name='checkbox']:checkbox:checked");
        if (folderCheck.length == 0) {
            layer.msg('请先选择文件');
            return;
        }
        var folder = folderCheck.parent().parent().find('a');
        var folderPaid = folder.attr('data-paid');
        var folderStatus = folder.attr('data-status');
        // folderStatus 文件夹状态，1  公开免费；2 公开付费；3 班级私有
        var folderType = folderStatus == 0 ? 3 : (Number(folderPaid) + 1);
        if (!$(this).hasClass('enabled')) {
            folderMove.html(template('mvfolder', folderData));
            $('#folderModal .body-content .odd').each(function(){
                if($(this).find('a').attr('data-type') != folderType) {
                    $(this).css('display', 'none');
                }
            });
            $('#folderModal').modal();
        }
    });

    /**
     * 显示更新文件夹UI
     */
    $('#updateFolder').click(function(){
        if ($('#updateFolder').hasClass('enabled')) {
            return;
        }
        var folderCheck = $("#tableBody input[name='checkbox']:checkbox:checked")
        if (folderCheck.length == 0) {
            layer.msg('请先选择文件');
            return;
        }
        var folder = folderCheck.parent().next().find('a');
        var newFolderItem = $('#tableBody .new-dir-item');
        if (newFolderItem.length != 0) {
            newFolderItem.find('#folderName').focus();
            return;
        }
        // folderType 文件夹类型，1  公开免费；2 公开付费；3 班级私有
        var folderType = folder.attr('data-type')==2?'selected':'';
        var nfolder = '';
        nfolder += '<div class="new-dir-item update-dir-item">';
        nfolder += '<input node-type="new-dir-box" data-id=' + folder.attr('data-id');
        nfolder += ' autofocus="autofocus" maxlength="30" id="folderName" class="boxfolder" ';
        nfolder += 'type="text" value="' + folder.attr('title') + '">';
        if (selectNode == null) {
            nfolder += '<select id="new-folder-type"><option value="1">';
            nfolder += '公开免费</option><option value="2" ' + folderType + '>公开付费</option></select>';
        }
        nfolder += '<span node-type="new-dir-sure" onclick="editFolder();" ';
        nfolder += 'class="sure glyphicon glyphicon-ok"></span>';
        nfolder += '<span node-type="new-dir-cancel" onclick="updateCanselFolder(this);" ';
        nfolder += 'class="cancel glyphicon glyphicon-remove"></span></div>';
        folderCheck.parent().next().append(nfolder);
        // 更新编辑框背景以遮挡原文件夹名
        var updateItem = $('.update-dir-item');
        updateItem.css('background-color', updateItem.closest('tr').css('background-color'));
    });

    /**
     * 取消更新文件夹
     * @param obj 当前更新文件夹对象
     */
    updateCanselFolder = function(obj) {
        $(obj).parent().remove();
    }

    /**
     * 编辑文件夹名
     */
    editFolder = function() {
        var folder = $('#folderName');
        if (folder.val() == '') {
          folder.focus();
          layer.msg('文件夹名不能为空');
          return;
        }
        var data = {
            'folderId': folder.attr('data-id'),
            'name': folder.val()
        }
        $.post(apiUrlConfig().updatefolder, data, function(data) {
            debugInfo(data);
            getAllFolders(selectNode);
            setTimeout(function() {
              close_load_layer(i);
            }, 200);
        }, function(err) {
            layer.msg('服务器错误，请稍候再试');
            debugInfo(err);
        }, function() {
            i = show_load_layer();
        });
    }

    /**
     * 禁用所有操作按钮
     */
    openOperation = function() {
        $('#moveFolder').removeClass('enabled');
        $('#updateFolder').removeClass('enabled');
        $('#deleteFolderModal').removeClass('enabled');
    }

    /**
     * 文件夹选择（只能选择一个文件夹）
     * @param 当前选择的文件夹
     */
    folderSelect = function(obj) {
        $('#folderModal').find('div.modal-body input').each(function(){
            if( $(this)[0] != obj) {
                $(this).prop('checked',false);
            }
        })
        if ($(obj).is(':checked')) {
            $(obj).prop('checked',true);
        } else {
            $(obj).prop('checked',false);
        }
    }

    /**
     * 点击移动文件夹
     */
    $('#mvConfirm').click(function(){
        var folderCheck = $("#folderModal .modal-body input[name='checkbox']:checkbox:checked");
        var contentCheck = $("#tableBody input[name='checkbox']:checkbox:checked");
        if (folderCheck.length == 0) {
            layer.msg('请选择移动到的文件夹');
            return;
        }
        var data = {
            'resId': contentCheck.parent().next().find('a').attr('data-id'),
            'folderId': folderCheck.parent().next().find('a').attr('data-id')
        }
        $.post(apiUrlConfig().movefolder, data, function(data) {
            debugInfo(data);
            $('#folderModal').modal('hide');
            getAllFolders(selectNode);
            setTimeout(function() {
              close_load_layer(i);
            }, 200);
        }, function(err) {
             close_load_layer(i);
             layer.msg('移动失败，请稍后尝试');
             debugInfo(err);
        }, function() {
            i = show_load_layer();
        });
    });
});

