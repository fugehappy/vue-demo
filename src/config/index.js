/*
 * Copyright (C) 2017
 *
 * 基本配置
 */

export const PAGE_SIZE = 10 // 分页大小 pageSize

export const TINY_PAGE_SIZE = 5 // 小分页大小 pageSize（用于推送条件查询的弹出层和推送内容查询的弹出层）

export const BUCKET_ADVERTISEMENT = 'advertisement' // 广告文件空间 bucket

export const LOAD_DATA_COUNT = 3 // 循环加载次数

export const USER_LOCALSTORAGE_KEY = 'hanlinUser' // 用户登录本地存储的key

export const USERNAME_PATTERN = /^(?:\d|[a-zA-Z]|[!@$%^&*]){6,16}$/ // 用户名验证正则

export const PASSWORD_PATTERN = /^(?![a-zA-z]+$)(?![0-9]+$)(?![!@$_%^&*]+$)[a-zA-Z0-9!@$_%^&*]{6,16}$/ // 密码验证正则

export const PHONENO_PATTERN = /^1[34578]\d{9}$/ // 手机号码验证正则

export const IMAGES_PATTERN = /^image\/(jpg|jpeg|png|gif)/ // 图片格式验证正则

export const VIDEO_PATTERN = /^video\/(mp4)/ // 视频格式验证正则

export const UPLOAD_IMAGES_MAX_SIZE = 2 * 1024 * 1024 // 上传图片的大小限制

export const UPLOAD_VIDEO_MAX_SIZE = 5 * 1024 * 1024 // 上传视频的大小限制
