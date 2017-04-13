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
 * @returns {number}
 */
const date2secondsTimestamp = (date) => {
  return new Date(date).getTime() / 1000
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
  globalErrorPrint
}

