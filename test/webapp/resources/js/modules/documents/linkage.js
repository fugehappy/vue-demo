/*
 * Copyright (C) 2017 QIANKUN HANLIN Corporation Limited
 *
 * 上传文档分类联动js
 */

var linkage = {
    selectNode : null, // 分类联动当前结点
    data : null, // 联动数据
    link : null, // linkage对象
    /**
     * 联动初始化
     * @param data 联动数据
     * @param select1 联动框分类类型
     * @param select2 联动框学段类型
     * @param select3 联动框学科类型
     * @param select4 联动框版本类型
     * @param select5 联动框年级类型
     */
    init : function(data, select1, select2, select3, select4, select5) {
        link = this;
        link.data = data;
        link.appendOption(select1, data.categories);
        select1.change(function() {
            link.entrance($(this), select2);
        });
        select2.change(function() {
            link.entrance($(this), select3);
        });
        select3.change(function() {
            link.entrance($(this), select4);
        });
        select4.change(function() {
            link.entrance($(this), select5);
        });
        select5.change(function() {
          link.entrance($(this), $('<select>'));
      });
    },

    /**
     * 根据类型ID查找当前结点
     * @param d 联动数据
     * @param val 查找类型ID
     */
    visitData : function(d, val) {
        if (!d)
            return;
        $.each(d, function(k, v) {
            if ($.isArray(this) || $.isPlainObject(this)) {
                link.visitData(this, val);// 当前节点是数组，继续递归
            } else {
                if (k == 'cateId' && v == val) {
                    link.selectNode = d;
                    return false;
                }
            }
        });
    },

    /**
     * 移除选择框选项，触发选择change事件
     * @param obj 当前选择下拉框对象
     * @param select 下一级下拉框对象
     */
    entrance : function(obj, select) {
        link.docRemove(select);
        link.docChange(obj, select);
    },

    /**
     * change事件，改变子选择框选项
     * @param obj 当前选择下拉框对象
     * @param select 下一级下拉框对象
     */
    docChange : function(obj, select) {
        link.visitData(link.data, obj.val());
        $('#lable-group').find('div').remove();
        $('.input-label').find('div').remove();
        obj.parent().find('.formtips').remove();
        if (link.selectNode != null && link.selectNode.subCategory != null) {
            select.removeAttr('disabled');
            select.parent().nextAll().find('select').removeAttr('disabled');
            link.appendOption(select, link.selectNode.subCategory.categories);
        } else {
            select.attr('disabled','true');
            select.parent().nextAll().find('select').attr('disabled','true');
            link.tagLink();
        }
    },

    /**
     * 增加选项框选项
     * @param select 当前选择下拉框对象
     * @param subcategory 下一级下拉框对象
     */
    appendOption : function(select, subcategory) {
        for (var i = 0; i < subcategory.length; i++) {
            select.append('<option value="' + subcategory[i].cateId + '">'
                    + subcategory[i].name + '</option>');
        }
    },

    /**
     * 删除选项框选项
     * @param select 当前选择下拉框对象
     */
    docRemove : function(select) {
        select.find('option+option').remove();
        select.parent().nextAll().find('select').find('option+option').remove();
    },

    /**
     * 调用查询标签
     */
    tagLink : function() {
        link.visitTags(link.selectNode);
    },

    /**
     * 查询标签当前结点
     */
    visitTags : function(t) {
        if (!t)
            return;
        $.each(t, function(k, v) {
            if (k != 'tags' && ($.isArray(this) || $.isPlainObject(this))) {
                link.visitTags(this);// 当前节点是数组，继续递归
            } else {
                if (k == 'tags' && v != null && v.length > 0) {
                    $.each(v, function(n, m) {
                      $('#lable-group').append(
                          '<div id="' + m.tagId +'" onclick="labelToggle(this);"><span>'
                          + m.name + '</span></div>');
                    })
                }
            }
        });
    },
}
