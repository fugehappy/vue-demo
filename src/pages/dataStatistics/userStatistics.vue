<!--Copyright (C) 2017 QIANKUN HANLIN Corporation Limited-->
<!--用户统计页面-->
<template>
  <div class="statistics-wrap" :chartactive='changeChartTab'>
    <!--查询表单-->
    <el-row>
      <div class="form-wrap">
        <el-form ref="searchForm" :model="searchForm" label-width="80px">
          <table class="table-custom" width="75%">
            <tr>
              <td>
                <label>
                  <span>用户类型</span>
                  <el-select v-model="searchForm.userType" placeholder="请选择">
                    <el-option label="教师" :value="0"></el-option>
                    <el-option label="三方个人" :value="1"></el-option>
                    <el-option label="三方认证" :value="2"></el-option>
                  </el-select>
                </label>
              </td>
              <td>
                <label>
                  <span>统计区间起</span>
                  <el-date-picker type="month" placeholder="选择月份" v-model="searchForm.startTime"></el-date-picker>
                </label>
              </td>
              <td>
                <label>
                  <span>统计区间止</span>
                  <el-date-picker type="month" placeholder="选择月份" v-model="searchForm.endTime"></el-date-picker>
                </label>
              </td>
            </tr>
          </table>
          <el-form-item class="btn-group">
            <el-button type="primary" @click="searchData" class="search-icon"><i></i>搜索</el-button>
            <el-button type="primary" class="el-button--cancel clear-icon" @click="clearFormData"><i></i>清除</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-row>
    <el-row>
      <div class="echart-content">
        <h3>用户信息统计</h3>
        <div class="echart-wrap" id="userStatistics"></div>
      </div>
    </el-row>
  </div>
</template>
<script>
  import { mapActions } from 'vuex'
  import { CHANGE_PENDING } from 'store/globalStore'
  import { USER_INFORMATION_STATISTICS } from 'store/modules/statisticsStore'
  import { SUCCESS } from '../../config/code'
  import { globalErrorPrint, date2secondsTimestamp, errorMessage } from '../../utils/'
  import * as MSG from '../../config/messages'
  export default {
    name: 'userStatistics',
    props: {
      active: String
    },
    computed: {
      changeChartTab: function () {
        return this.active
      }
    },
    mounted () {
      this.getDatas()
    },
    beforeUpdate () {
      if (this.$el.attributes.chartactive.value != this.active) {
        this.initChart(this.chartOptions)
      }
    },
    data () {
      return {
        // 查询任务表单数据
        searchForm: {
          userType: '',
          startTime: '',
          endTime: ''
        },
        typeMap: {
          '0': '教师',
          '1': '三方个人',
          '2': '三方机构'
        },
        loading: false,
        chartOptions: {
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            y: 'bottom',
            data: []
          },
          grid: {
            x: 40,
            y: 20
          },
          toolbox: {
            feature: {}
          },
          xAxis: [{
            type: 'category',
            boundaryGap: false,
            data: []
          }],
          yAxis: [{
            type: 'value',
            axisLabel: {
              formatter: '{value} 人'
            }
          }],
          series: []
        }
      }
    },
    methods: {
      ...mapActions([CHANGE_PENDING, USER_INFORMATION_STATISTICS]),

      /**
       * 初始化图表
       */
      initChart (options) {
        var myChart = window.echarts.init(document.getElementById('userStatistics'))
        myChart.setOption(options)
      },

      /**
       * 获取表格数据
       */
      getDatas () {
        let postData = {}
        let {userType, startTime, endTime} = this.searchForm

        Object.assign(postData, {
          type: userType != '' ? userType : null,
          startTime: startTime ? date2secondsTimestamp(startTime) : null,
          endTime: endTime ? date2secondsTimestamp(endTime, true) : null
        })

        this.CHANGE_PENDING(true) // 加载遮罩
        // 获取用户信息统计数据
        this.USER_INFORMATION_STATISTICS(postData).then((res) => {
          if (res.code === SUCCESS) {
            // 响应成功
            if (res.data) {
              if (res.data.typeMonthStatistics) {
                let result = res.data.typeMonthStatistics
                let temp = {}
                if (this.searchForm.userType !== '') {
                  for (let item in result) {
                    if (item != this.searchForm.userType) {
                      delete result[item]
                    }
                  }
                  temp[0] = result[this.searchForm.userType]
                } else {
                  temp = result
                }

                let legendData = []
                let series = [] // y轴
                let xAxisDataAll = [] // x轴
                // 先设定 X 轴
                xAxisDataAll = this.getRangeMonth(temp)

                // 循环所有的分类
                for (let item in temp) {
                  let cateName = null
                  if (this.searchForm.userType !== '') {
                    cateName = this.typeMap[this.searchForm.userType]
                    legendData.push(cateName)
                  } else {
                    cateName = this.typeMap[item]
                    legendData.push(this.typeMap[item])
                  }

                  let seriesData = []
                  // 循环得到的所有的月份
                  xAxisDataAll.map(xAsis => {
                    let thisCount = 0
                    temp[item].map(sub => {
                      if (xAsis == `${sub.year}${this.formatMonth(sub.month)}`) {
                        thisCount = sub.count
                      }
                    })
                    seriesData.push(thisCount)
                  })
                  series.push({
                    name: cateName,
                    type: 'line',
                    data: seriesData
                  })
                }

                this.chartOptions.legend.data = legendData // 图表的legend
                this.chartOptions.xAxis[0].data = xAxisDataAll // 图表x轴
                this.chartOptions.series = series // 图表y轴

                this.initChart(this.chartOptions) // 绘制图表
              } else {
                this.$message.error('返回数据有误')
              }
              this.CHANGE_PENDING(false) // 取消加载遮罩
            }
          } else {
            // 异常错误处理
            this.$message.error('获取用户数据失败,请尝试刷新')
          }
        }).catch((err) => {
          // 异常错误处理
          globalErrorPrint(err)
          this.$message.error('异常错误')
          this.CHANGE_PENDING(false)
        })
      },

      /**
       * 获取月份范围
       */
      getRangeMonth (result) {
        // 转化获取对象的长度
        let len = Object.keys(result).length
        let arrDate = []
        // 确定月份的区间范围
        for (let i = 0; i < len; i++) {
          arrDate[i] = []
          if (result[i] && result[i].length) {
            for (let m = 0, l = result[i].length; m < l; m++) {
              let data = parseInt(result[i][m].year + '' + this.formatMonth(result[i][m].month))
              arrDate[i].push(data)
            }
          }
        }
        let arrNewDate = []
        for (let i = 0; i < arrDate.length; i++) {
          if (arrDate[i].length) {
            arrNewDate.push(arrDate[i])
          }
        }
        let maxMonth = this.rangeMonth(arrNewDate, 'max')
        let minMonth = this.rangeMonth(arrNewDate, 'min')
        let rangeMonth = []
        let count = maxMonth
        do {
          if (count % 100 == 0) {
            count = (count / 100 - 1) * 100 + 12
          } else {
            rangeMonth.push(count)
            count = count - 1
          }
        } while (count >= minMonth)

        rangeMonth = rangeMonth.sort()
        return rangeMonth
      },

      /**
       * 格式化月份
       */
      formatMonth (month) {
        let result = parseInt(month)
        result = result < 10 ? ('0' + result) : ('' + result)
        return result
      },

      /**
       * 清除查询表单数据
       */
      clearFormData () {
        for (let item in this.searchForm) {
          this.searchForm[item] = ''
        }
      },

      /**
       * 查询表单数据
       */
      searchData () {
        // 不同的条件
        if (this.searchForm.startTime && this.searchForm.endTime) {
          if (this.searchForm.startTime > this.searchForm.endTime) {
            errorMessage(this, MSG.STARTTIME_GREATER_THAN_ENDTIME_MSG)
            return
          }
        }
        this.getDatas()
      },

      /**
       * 月份最大值和最小值
       */
      rangeMonth (arr, type) {
        let newArray = arr.join(',').split(',')
        if (type === 'max') {
          return Math.max.apply({}, newArray)
        } else {
          return Math.min.apply({}, newArray)
        }
      }
    }
  }
</script>
