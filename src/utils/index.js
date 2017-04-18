/*
 * Copyright (C) 2017 QIANKUN HANLIN Corporation Limited
 *
 * 其他工具函数
 */
/**
 * 模拟睡眠
 * @param timeout 毫秒值，默认1000毫秒
 * @returns {Promise}
 */
const sleep = (timeout = 1000) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, timeout)
  })
}

/**
 * 将表单数据为空字符窜的字段给移除
 * @param formData参数对象
 * @returns {*}
 */
const cleanFormEmptyValue = (formData) => {
  for (let item in formData) {
    if (formData[item] === '') {
      formData[item] = null
    }
  }
  return formData
}

/**
 * 时间格式转时间戳（秒）
 * @param date 日期对象 Object
 * @param isEndTime 是否为结束时间，是则加一天
 * @returns {number}
 */
const date2secondsTimestamp = (date, isEndTime = false) => {
  let timestamp = new Date(date).getTime() / 1000
  if (isEndTime) {
    timestamp += 86400
  }
  return timestamp
}

/**
 * 处理弹出错误消息，显示下一个message时移除上一个message
 * @param obj 必须传入vue对象，this
 * @param msg 显示的提示消息
 */
const errorMessage = (obj, msg) => {
  if (typeof obj !== 'object' || !msg) return
  let elMessage = document.getElementsByClassName('el-message')
  if (elMessage.length) {
    elMessage[0].remove()
  }
  obj.$message.error(msg)
}

/**
 * 开发环境日志输出
 * @param err
 */
const globalErrorPrint = (err) => {
  let prod = process.env.NODE_ENV === 'production'
  if (!prod) {
    console.log(err)
  }
}

export {
  sleep,
  cleanFormEmptyValue,
  date2secondsTimestamp,
  globalErrorPrint,
  errorMessage
}

