<!--Copyright (C) 2017 -->
<!--推送条件查询的弹出层-->
<template>
  <div>
    <div class="scroll-content">
      <el-form ref="searchConditionForm" :model="searchConditionForm" label-width="80px">
        <el-col :span="24">
          <el-col :span="12">
            <el-form-item label="人群">
              <el-select v-model="searchConditionForm.receiverType" placeholder="请选择">
                <el-option label="学生" :value="0"></el-option>
                <el-option label="教师" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="省份">
              <el-select v-model="searchConditionForm.provinceZip" placeholder="请选择" @change="changeSelectRegion('province', $event)">
                <el-option v-for="item in searchDatas.provinceData" :label="item.name" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-col>

        <el-col :span="24">
          <el-col :span="12">
            <el-form-item label="城市">
              <el-select v-model="searchConditionForm.cityZip" :disabled="!searchConditionForm.provinceZip" @change="changeSelectRegion('city', $event)" placeholder="请选择">
                <el-option v-for="item in searchDatas.cityData" :label="item.name" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地区">
              <el-select v-model="searchConditionForm.countyZip" :disabled="!searchConditionForm.cityZip" @change="changeSelectRegion('county', $event)" placeholder="请选择">
                <el-option v-for="item in searchDatas.countyData" :label="item.name" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-col>

        <el-col :span="24">
          <el-col :span="12">
            <el-form-item label="学校">
              <el-select v-model="searchConditionForm.schoolCode" :disabled="!searchConditionForm.countyZip || !searchConditionForm.phase || schoolLoading" placeholder="请选择">
                <el-option v-for="item in searchDatas.schoolData" :label="item.name" :value="item.scode"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学段">
              <el-select v-model="searchConditionForm.phase" @change="changeSelectStudySection($event)"  placeholder="请选择">
                <el-option v-for="item in searchDatas.studySectionData" :label="item.name" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-col>

        <el-col :span="24">
          <el-col :span="12">
            <el-form-item label="年级">
              <el-select v-model="searchConditionForm.gradeCode" :disabled="!searchConditionForm.phase"  placeholder="请选择">
                <el-option v-for="item in searchDatas.gradeData" :label="item.gradeName" :value="item.gradeCode"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="条件名称">
              <el-input v-model="searchConditionForm.title" placeholder="" class="text-mid-input"></el-input>
            </el-form-item>
          </el-col>
        </el-col>

        <el-col :span="24">
          <el-form-item>
            <el-col :span="24" class="t-r">
              <div style="padding-right: 55px;">
                <el-button type="cancel" @click="clearConditionFormData" class="clear-icon"><i></i>清空</el-button>
                <el-button type="primary" @click="searchConditionData" class="search-icon"><i></i>搜索</el-button>
              </div>
            </el-col>
          </el-form-item>
        </el-col>
      </el-form>
      <v-divline></v-divline>
      <el-table :data="tableConditionData" border  style="width: 97%">
        <el-table-column label="选择" width="70">
          <template scope="scope">
            <input type="radio" name="conditonRadio" @click="choiceConditionTableData(scope.row)" value="scope.row.conditionId">
          </template>
        </el-table-column>
        <el-table-column prop="title" label="条件名称" width="180"></el-table-column>
        <el-table-column label="推送人群" width="90">
          <template scope="scope">
            <span>{{scope.row.receiverType == 1 ? '教师' : '学生'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="组合条件" min-width="180">
          <template scope="scope">
            {{scope.row.conditions}}
          </template>
        </el-table-column>
        <el-table-column label="创建日期" width="120">
          <template scope="scope">
            {{scope.row.createTime ? jst.timestampFormat(Number(scope.row.createTime), 'Y-m-d') : ''}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="70">
          <template scope="scope">
            <!-- 展开 begin -->
            <el-popover
                    ref="conditionPopover"
                    placement="left"
                    width="400"
                    trigger="hover">
              <div class="condition-propover">
                <div><span>名&nbsp;称:</span> {{scope.row.title}}</div>
                <div><span>人&nbsp;群:</span> {{scope.row.receiverType == 1 ? '教师' : '学生'}}</div>
                <div><span>省&nbsp;份:</span> {{scope.row.provinceName}}</div>
                <div><span>城&nbsp;市:</span> {{scope.row.cityName}}</div>
                <div><span>地&nbsp;区:</span> {{scope.row.countyName}}</div>
                <div><span>学&nbsp;校:</span> {{scope.row.schoolName}}</div>
                <div><span>学&nbsp;段:</span> {{phaseMap[scope.row.phase]}}</div>
                <div><span>年&nbsp;级:</span> {{scope.row.gradeName}}</div>
              </div>
            </el-popover>
            <!-- 展开 end -->
            <a v-popover:conditionPopover>展开</a>
          </template>
        </el-table-column>
      </el-table>
      <div class="block pading-20-10">
        <el-pagination
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pageSize"
                layout="total, prev, pager, next"
                :total="totalSize">
        </el-pagination>
      </div>
    </div>
    <div class="t-c pading-t20">
      <el-button type="primary" @click="choicePushCondition" class="large-btn">选择</el-button>
    </div>
  </div>
</template>
<script>
  import {mapActions} from 'vuex'
  import { CHANGE_PENDING, BASIC_DATA_REGION_GET_LIST, BASIC_DATA_SCHOOL_GET_LIST, BASIC_DATA_PHASE_GRADE_GET_LIST } from 'store/globalStore'
  import { PUSH_CONDITION_GET_LIST } from 'store/modules/pushStore'
  import * as jst from 'js-common-tools'
  import * as CODE from '../../config/code'
  import * as CONFIG from '../../config/'
  import * as MSG from '../../config/messages'
  import { cleanFormEmptyValue, globalErrorPrint, date2secondsTimestamp, errorMessage, judgeNotNetwork } from '../../utils/'

  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      }
    },
    beforeUpdate () {
      if (!this.visible) {
        this.resetRadio()
      }
    },
    mounted () {
      // 重置被选择的项
      this.resetRadio()
      // 初始化表格数据
      this.getData()
      // 初始化省份
      this.initProvince()
      // 初始化学段年级数据
      this.initPhaseGrade()
    },
    data () {
      return {
        jst: jst,
        loadCount: 0, // 数据加载次数，设定超过2次提示用户刷新页面再试
        phaseMap: {
          '0': '小学',
          '1': '初中',
          '2': '高中'
        },
        // 查询条件表单数据
        searchConditionForm: {
          receiverType: '',
          provinceZip: '',
          cityZip: '',
          countyZip: '',
          schoolCode: '',
          phase: '',
          gradeCode: '',
          title: ''
        },
        searchDatas: {
          provinceData: null,
          cityData: null,
          countyData: null,
          schoolData: null,
          studySectionData: null,
          gradeData: null
        },
        // 条件查询list
        tableConditionData: [],
        currentPage: 1,
        totalSize: 1,
        pageSize: CONFIG.TINY_PAGE_SIZE,
        // 选择后的（推送条件）数据
        choiceConditionData: {},
        schoolLoading: false, // 是否正在加载学校
        formLabelWidth: '120px'
      }
    },
    methods: {
      ...mapActions([CHANGE_PENDING, PUSH_CONDITION_GET_LIST, BASIC_DATA_REGION_GET_LIST, BASIC_DATA_SCHOOL_GET_LIST,
        BASIC_DATA_PHASE_GRADE_GET_LIST]),
      /**
       * 点击推送条件table的单选按钮
       */
      choiceConditionTableData (val) {
        Object.assign(this.choiceConditionData, val)
      },
      /**
       * 点击（推送条件）选择【选定条件】
       */
      choicePushCondition () {
        if (jst.isNullOrEmpty(this.choiceConditionData, true)) {
          errorMessage(this, '请选择一条推送条件')
          return
        }
        // 将值传给父组件
        this.$emit('click-choice', {
          choiceData: this.choiceConditionData,
          dialogVisible: false
        })
      },
      /**
       * 清除查询条件表单数据
       */
      clearConditionFormData () {
        for (let item in this.searchConditionForm) {
          this.searchConditionForm[item] = ''
        }
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this.getData()
      },

      /**
       * 查询推送条件表单数据
       */
      searchConditionData () {
        this.currentPage = 1 // 设置为第一页
        this.getData()
      },

      /**
       * 获取数据
       */
      getData () {
        this.CHANGE_PENDING(true)
        let {startTime, endTime, status, provinceZip, cityZip, countyZip, phase} = this.searchConditionForm
        let newParm = {
          provinceZip: provinceZip ? provinceZip.zip : null,
          cityZip: cityZip ? cityZip.zip : null,
          countyZip: countyZip ? countyZip.zip : null,
          phase: phase ? phase.phaseCode : null,
          startTime: startTime ? date2secondsTimestamp(startTime) : null,
          endTime: endTime ? date2secondsTimestamp(endTime, true) : null,
          page: this.currentPage,
          pageSize: this.pageSize
        }
        if (typeof status == 'number') {
          Object.assign(newParm, {
            status: [status]
          })
        }
        let newForm = cleanFormEmptyValue(this.searchConditionForm)
        let params = Object.assign({}, newForm, newParm)
        this.PUSH_CONDITION_GET_LIST(params).then((res) => {
          this.CHANGE_PENDING(false)
          if (res.code == CODE.SUCCESS) {
            let newData = res.data.items.map((item) => {
              item.conditions = item.provinceName ? ` ${item.provinceName} >` : ''
              item.conditions += item.cityName ? ` ${item.cityName} >` : ''
              item.conditions += item.countyName ? ` ${item.countyName} >` : ''
              item.conditions += item.schoolName ? ` ${item.schoolName} >` : ''
              item.conditions += item.phase !== null ? ` ${this.phaseMap[item.phase]} >` : ''
              item.conditions += item.gradeName ? ` ${item.gradeName} >` : ''
              item.conditions = item.conditions.substr(0, item.conditions.length - 1)
              return item
            })
            this.tableConditionData = newData
            this.totalSize = res.data.totalSize
            this.currentPage = res.data.currentPage
          } else {
            this.$message.error(MSG.GET_DATA_FAIL_MESSATE)
          }
        }).catch((err) => {
          globalErrorPrint(err)
          this.CHANGE_PENDING(false)
          if (judgeNotNetwork(this, err)) {
            return
          }
          this.$message.error(MSG.GET_DATA_FAIL_MESSATE)
        })
      },

      /**
       * 省、市、区选择下拉框发生变化
       * @param type 选择框区别
       * @param event 选择后的值
       */
      changeSelectRegion (type, event) {
        switch (type) {
          case 'province': // 选择省
            if (event) {
              this.initCity(event.zip)
              this.searchConditionForm.cityZip = ''
            }
            break
          case 'city': // 选择市
            if (event) {
              this.initCounty(event.zip)
            }
            this.searchConditionForm.countyZip = ''
            break
          case 'county': // 选择区
            this.searchConditionForm.schoolCode = ''
            this.getSchoolList()
            break
        }
      },

      /**
       * 学段选择下拉框发生变化
       * @param event 选择后的值
       */
      changeSelectStudySection (event) {
        if (!event) return
        this.searchConditionForm.gradeCode = ''
        this.searchDatas.gradeData = event.grades
        this.getSchoolList()
      },

      /**
       * 初始化省份
       */
      initProvince () {
        this.CHANGE_PENDING(true)
        this.BASIC_DATA_REGION_GET_LIST({zip: null}).then(res => {
          if (res.code == CODE.SUCCESS) {
            this.searchDatas.provinceData = res.data
          } else {
            if (this.loadCount < CONFIG.LOAD_DATA_COUNT) {
              this.initProvince()
              this.loadCount++
            }
          }
          this.CHANGE_PENDING(false)
        }).catch((err) => {
          globalErrorPrint(err)
          if (this.loadCount < CONFIG.LOAD_DATA_COUNT) {
            this.initProvince()
            this.loadCount++
          }
          this.CHANGE_PENDING(false)
        })
      },

      /**
       * 初始化市
       */
      initCity (zip) {
        this.CHANGE_PENDING(true)
        this.BASIC_DATA_REGION_GET_LIST({zip: zip}).then(res => {
          if (res.code == CODE.SUCCESS) {
            this.searchDatas.cityData = res.data
          } else {
            if (this.loadCount < CONFIG.LOAD_DATA_COUNT) {
              this.initCity(zip)
              this.loadCount++
            }
          }
          this.CHANGE_PENDING(false)
        }).catch((err) => {
          globalErrorPrint(err)
          if (this.loadCount < CONFIG.LOAD_DATA_COUNT) {
            this.initCity(zip)
            this.loadCount++
          }
          this.CHANGE_PENDING(false)
        })
      },

      /**
       * 初始化区域
       */
      initCounty (zip) {
        this.BASIC_DATA_REGION_GET_LIST({zip: zip}).then(res => {
          if (res.code == CODE.SUCCESS) {
            this.searchDatas.countyData = res.data
          } else {
            if (this.loadCount < CONFIG.LOAD_DATA_COUNT) {
              this.initCounty(zip)
              this.loadCount++
            }
          }
        }).catch((err) => {
          globalErrorPrint(err)
          if (this.loadCount < CONFIG.LOAD_DATA_COUNT) {
            this.initCounty(zip)
            this.loadCount++
          }
        })
      },

      /**
       * 获取学校列表
       */
      getSchoolList () {
        let zip = null
        let phaseCode = null
        if (!this.searchConditionForm.phase || !this.searchConditionForm.countyZip) return
        zip = this.searchConditionForm.countyZip.zip
        phaseCode = this.searchConditionForm.phase.phaseCode

        this.schoolLoading = true
        this.searchConditionForm.schoolCode = ''
        this.CHANGE_PENDING(true)
        // 请求接口获取数据
        this.BASIC_DATA_SCHOOL_GET_LIST({zip: zip, phase: phaseCode}).then(res => {
          if (res.code == CODE.SUCCESS) {
            this.searchDatas.schoolData = res.data
          } else {
            if (this.loadCount < CONFIG.LOAD_DATA_COUNT) {
              this.getSchoolList()
              this.loadCount++
            }
          }
          this.schoolLoading = false
          this.CHANGE_PENDING(false)
        }).catch((err) => {
          this.CHANGE_PENDING(false)
          globalErrorPrint(err)
          if (this.loadCount < CONFIG.LOAD_DATA_COUNT) {
            this.getSchoolList()
            this.loadCount++
          }
          this.schoolLoading = false
        })
      },

      /**
       * 初始化学段年级数据
       */
      initPhaseGrade () {
        this.BASIC_DATA_PHASE_GRADE_GET_LIST().then(res => {
          if (res.code == CODE.SUCCESS) {
            this.searchDatas.studySectionData = res.data
            this.loadCount = 0
          } else {
            if (this.loadCount < CONFIG.LOAD_DATA_COUNT) {
              this.initPhaseGrade()
              this.loadCount++
            }
          }
        }).catch((err) => {
          globalErrorPrint(err)
          if (this.loadCount < CONFIG.LOAD_DATA_COUNT) {
            this.initPhaseGrade()
            this.loadCount++
          }
        })
      },

      /**
       * 重置被选择的项
       */
      resetRadio () {
        let selects = document.getElementsByName('conditonRadio')
        for (let i = 0, len = selects.length; i < len; i++) {
          selects[i].checked = false
        }
      }
    }
  }
</script>
