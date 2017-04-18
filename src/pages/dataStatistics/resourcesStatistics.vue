<!--Copyright (C) 2017 QIANKUN HANLIN Corporation Limited-->
<!--资源统计页面-->
<template>
  <div class="statistics-wrap" :chartactive="changeChartTab">
    <!--查询表单-->
    <el-row>
      <div class="form-wrap">
        <el-form ref="searchForm" :model="searchForm" label-width="80px">
          <table class="table-custom" width="75%">
            <tr>
              <td>
                <label>
                  <span>资源渠道</span>
                  <el-select v-model="searchForm.type" placeholder="请选择">
                    <el-option label="上传数量" value="0"></el-option>
                    <el-option label="下载数量" value="1"></el-option>
                  </el-select>
                </label>
              </td>
              <td>
                <label>
                  <span>统计区间起</span>
                  <el-date-picker type="month" placeholder="选择日期" v-model="searchForm.startTime"></el-date-picker>
                </label>
              </td>
              <td>
                <label>
                  <span>统计区间止</span>
                  <el-date-picker type="month" placeholder="选择日期" v-model="searchForm.endTime"></el-date-picker>
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
        <h3>资源数量统计</h3>
        <div class="echart-wrap" id="resourcesStatistics"></div>
      </div>
    </el-row>
  </div>
</template>
<script>
  import { mapActions } from 'vuex'
  import { CHANGE_PENDING } from 'store/globalStore'
  import { CONTENT_GET_STATISTICS } from 'store/modules/statisticsStore'
  import { globalErrorPrint, date2secondsTimestamp, errorMessage } from '../../utils/'
  import * as jst from 'js-common-tools'
  import * as CODE from '../../config/code'
  import * as MSG from '../../config/messages'
  export default {
    name: 'resourcesStatistics',
    props: {
      active: String
    },
    computed: {
      changeChartTab: function () {
        return this.active
      }
    },
    mounted () {
      // 设置第一个select的值
      this.searchForm.type = '0' // 0 上传数量,1 下载数量
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
          type: '',
          startTime: '',
          endTime: ''
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
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: '{value} 件'
            }
          },
          series: []
        }
      }
    },
    methods: {
      ...mapActions([CHANGE_PENDING, CONTENT_GET_STATISTICS]),

      /**
       * 初始化图表
       */
      initChart (options) {
        var myChart = window.echarts.init(document.getElementById('resourcesStatistics'))
        myChart.setOption(options)
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
        if (this.searchForm.startTime && this.searchForm.endTime) {
          if (this.searchForm.startTime > this.searchForm.endTime) {
            errorMessage(this, MSG.STARTTIME_GREATER_THAN_ENDTIME_MSG)
            return
          }
        }
        this.getDatas()
      },

      /**
       * 获取数据
       */
      getDatas () {
        let postData = {}
        let {type, startTime, endTime} = this.searchForm
        Object.assign(postData, {
          type: type != '' ? type : 0,
          startTime: startTime ? date2secondsTimestamp(startTime) : null,
          endTime: endTime ? date2secondsTimestamp(endTime, true) : null
        })

        this.CHANGE_PENDING(true)
        this.CONTENT_GET_STATISTICS(postData).then(res => {
          if (res.code == CODE.SUCCESS) {
            let legendData = []
            let series = []
            let xAxisDataAll = []

            // 先设定 X 轴
            res.data.map(item => {
              legendData.push(item.cateName)
              item.monthStatistics.map(sub => {
                if (!jst.inArray(sub.yearMonth, xAxisDataAll)) {
                  xAxisDataAll.push(sub.yearMonth)
                }
              })
            })
            xAxisDataAll.sort() // 将月份升序
            xAxisDataAll = this.getRangeMonth(xAxisDataAll)
            // 循环所有的分类
            res.data.map(item => {
              let seriesData = []
              // 循环得到的所有的月份
              xAxisDataAll.map(xAsis => {
                let thisCount = 0
                item.monthStatistics.map(sub => {
                  if (xAsis == sub.yearMonth) {
                    thisCount = sub.count
                  }
                })
                seriesData.push(thisCount)
              })
              series.push({
                name: item.cateName,
                type: 'line',
                data: seriesData
              })
            })

            this.chartOptions.legend.data = legendData
            this.chartOptions.xAxis[0].data = xAxisDataAll
            this.chartOptions.series = series

            this.initChart(this.chartOptions)
          } else {
            this.$message.error(MSG.GET_DATA_FAIL_MESSATE)
          }
          this.CHANGE_PENDING(false)
        }).catch((err) => {
          globalErrorPrint(err)
          this.$message.error(MSG.GET_DATA_FAIL_MESSATE)
          this.CHANGE_PENDING(false)
        })
      },

      /**
       * 获取月份范围
       * param result 数组
       */
      getRangeMonth (result) {
        if (result instanceof Array) {
          let dateArr = []
          let count = result[result.length - 1]
          do {
            if (count % 100 == 0) {
              count = (count / 100 - 1) * 100 + 12
            } else {
              dateArr.push(count)
              count = count - 1
            }
          } while (count >= result[0])
          dateArr.sort()
          return dateArr
        } else {
          return result
        }
      }
    }
  }
</script>
