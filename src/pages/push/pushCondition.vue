<!--Copyright (C) 2017 QIANKUN HANLIN Corporation Limited-->
<!--推送条件管理页面-->
<template>
  <div class="fileaudit-wrap">
    <el-row>
      <h3 class="top-title">
        <span>推送条件管理</span>
        <el-button @click="showLayer('')" type="primary" class="large-btn">新增</el-button>
      </h3>
    </el-row>
    <v-divline></v-divline>
    <div class="fix-wrapper">
      <table class="table-custom" width="100%">
        <tr>
          <td>
            <label>
              <span>人群</span>
              <el-select v-model="searchForm.receiverType" placeholder="请选择">
                <el-option label="学生" :value="0"></el-option>
                <el-option label="教师" :value="1"></el-option>
              </el-select>
            </label>
          </td>
          <td>
            <label>
              <span>省份</span>
              <el-select v-model="searchForm.provinceZip" placeholder="请选择" @change="changeSelectRegion('province', $event)">
                <el-option v-for="item in searchDatas.provinceData" :label="item.name" :value="item"></el-option>
              </el-select>
            </label>
          </td>
          <td>
            <label>
              <span>城市</span>
              <el-select v-model="searchForm.cityZip" :disabled="!searchForm.provinceZip" @change="changeSelectRegion('city', $event)" placeholder="请选择">
                <el-option v-for="item in searchDatas.cityData" :label="item.name" :value="item"></el-option>
              </el-select>
            </label>
          </td>
          <td>
            <label>
              <span>地区</span>
              <el-select v-model="searchForm.countyZip" :disabled="!searchForm.cityZip" @change="changeSelectRegion('county', $event)" placeholder="请选择">
                <el-option v-for="item in searchDatas.countyData" :label="item.name" :value="item"></el-option>
              </el-select>
            </label>
          </td>
        </tr>
        <tr>
          <td>
            <label>
              <span>学校</span>
              <el-select v-model="searchForm.schoolCode" :disabled="!searchForm.countyZip || !searchForm.phase" placeholder="请选择">
                <el-option v-for="item in searchDatas.schoolData" :label="item.name" :value="item.scode"></el-option>
              </el-select>
            </label>
          </td>
          <td>
            <label>
              <span>学段</span>
              <el-select v-model="searchForm.phase" @change="changeSelectStudySection($event)"  placeholder="请选择">
                <el-option v-for="item in searchDatas.studySectionData" :label="item.name" :value="item"></el-option>
              </el-select>
            </label>
          </td>
          <td>
            <label>
              <span>年级</span>
              <el-select v-model="searchForm.gradeCode" :disabled="!searchForm.phase"  placeholder="请选择">
                <el-option v-for="item in searchDatas.gradeData" :label="item.gradeName" :value="item.gradeCode"></el-option>
              </el-select>
            </label>
          </td>
          <td>
            <label>
              <span>条件名称</span>
              <el-input v-model="searchForm.title" class="text-input" :maxlength="50" placeholder="请输入"></el-input>
            </label>
          </td>
        </tr>
        <tr>
          <td>
            <label>
              <span>创建日期起</span>
              <el-date-picker type="date" placeholder="选择日期" v-model="searchForm.startTime"></el-date-picker>
            </label>
          </td>
          <td>
            <label>
              <span>创建日期止</span>
              <el-date-picker type="date" placeholder="选择日期" v-model="searchForm.endTime"></el-date-picker>
            </label>
          </td>
          <td></td>
          <td></td>
        </tr>
      </table>
      <div class="buttons-wrap">
        <el-button type="primary" @click="searchData" class="search-icon"><i></i>搜索</el-button>
        <el-button type="cancel" @click="clearFormData" class="clear-icon"><i></i>清除</el-button>
      </div>
    </div>
    <v-divline></v-divline>
    <div class="fix-wrapper">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" label="序号" width="70">
          <template scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="条件名称" width="200"></el-table-column>
        <el-table-column label="推送人群" width="100">
          <template scope="scope">
            <span>{{scope.row.receiverType == 1 ? '教师' : '学生'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="组合条件" min-width="180">
          <template scope="scope">
            <a @click="showLayer(scope.$index, scope.row)">{{scope.row.conditions}}</a>
          </template>
        </el-table-column>
        <el-table-column label="创建日期" width="120">
          <template scope="scope">
            {{scope.row.createTime ? jst.timestampFormat(Number(scope.row.createTime), 'Y-m-d') : ''}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template scope="scope">
            <a @click="showLayer(scope.$index, scope.row)">更新</a>
            <a @click="deleteRow(scope.$index, scope.row)">删除</a>
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
    <!--打开嵌入的表单-->
    <!-- Form -->
    <el-dialog :title="(layerForm.isEdit ? '更新' : '新增') + '定向推送条件'" v-model="dialogFormVisible" :close-on-click-modal="false">
      <div class="scroll-content">
        <el-form ref="layerForm" :model="layerForm">
          <el-col :span="12">
            <el-form-item label="* 条件名称" :label-width="formLabelWidth" placeholder="请输入策略名称" >
              <el-input v-model="layerForm.title" class="text-input" :maxlength="50" placeholder="请输入" style="width: 252px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="* 推送人群" :label-width="formLabelWidth">
              <el-select v-model="layerForm.receiverType" placeholder="请选择">
                <el-option label="学生" :value="0"></el-option>
                <el-option label="教师" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="* 省份选择" :label-width="formLabelWidth">
              <el-select v-model="layerForm.provinceZip" placeholder="请选择" @change="changeSelectRegion('province', $event)">
                <el-option v-for="item in layerDatas.provinceData" :label="item.name" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="* 城市选择" :label-width="formLabelWidth">
              <el-select v-model="layerForm.cityZip" :disabled="!layerForm.provinceZip" @change="changeSelectRegion('city', $event)" placeholder="请选择">
                <el-option v-for="item in layerDatas.cityData" :label="item.name" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地区选择" :label-width="formLabelWidth">
              <el-select v-model="layerForm.countyZip" :disabled="!layerForm.cityZip" @change="changeSelectRegion('county', $event)" placeholder="请选择">
                <el-option v-for="item in layerDatas.countyData" :label="item.name" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学校选择" :label-width="formLabelWidth">
              <el-select v-model="layerForm.schoolCode" :disabled="!layerForm.countyZip || !layerForm.phase" placeholder="请选择">
                <el-option v-for="item in layerDatas.schoolData" :label="item.name" :value="item.scode"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学段选择" :label-width="formLabelWidth">
              <el-select v-model="layerForm.phase" @change="changeSelectStudySection($event)" placeholder="请选择">
                <el-option v-for="item in layerDatas.studySectionData" :label="item.name" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年级选择" :label-width="formLabelWidth">
              <el-select v-model="layerForm.gradeCode" :disabled="!layerForm.phase"  placeholder="请选择">
                <el-option v-for="item in layerDatas.gradeData" :label="item.gradeName" :value="item.gradeCode"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
      <div class="t-c pading-t20">
        <el-button @click="submitPushCondition(layerForm.tableIndex)" type="primary" class="large-btn">确认提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import { CHANGE_PENDING, BASIC_DATA_REGION_GET_LIST, BASIC_DATA_SCHOOL_GET_LIST, BASIC_DATA_PHASE_GRADE_GET_LIST } from 'store/globalStore'
  import { PUSH_CONDITION_GET_LIST, PUSH_CONDITION_ADD_UPDATE, PUSH_CONDITION_DELETE } from 'store/modules/pushStore'
  import * as jst from 'js-common-tools'
  import * as CODE from '../../config/code'
  import * as CONFIG from '../../config/'
  import * as MSG from '../../config/messages'
  import { cleanFormEmptyValue, globalErrorPrint, date2secondsTimestamp } from '../../utils/'
  export default {
    name: 'pushConditionList',
    mounted () {
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
        searchForm: {
          receiverType: '',
          provinceZip: '',
          cityZip: '',
          countyZip: '',
          schoolCode: '',
          phase: '',
          gradeCode: '',
          title: '',
          startTime: '',
          endTime: ''
        },
        searchDatas: {
          provinceData: null,
          cityData: null,
          countyData: null,
          schoolData: null,
          studySectionData: null,
          gradeData: null
        },
        layerDatas: {
          provinceData: null,
          cityData: null,
          countyData: null,
          schoolData: null,
          studySectionData: null,
          gradeData: null
        },
        tableData: [],
        currentPage: 1,
        totalSize: 1,
        pageSize: CONFIG.PAGE_SIZE,
        dialogFormVisible: false,
        layerForm: {
          id: null,
          title: '',
          receiverType: '',
          provinceZip: '',
          cityZip: '',
          countyZip: '',
          schoolCode: '',
          phase: '',
          gradeCode: '',
          tableIndex: 0,
          editLoading: false // 编辑弹出层数据是否正在初始化中
        },
        phaseMap: {
          '0': '小学',
          '1': '初中',
          '2': '高中'
        },
        formLabelWidth: '120px'
      }
    },
    methods: {
      ...mapActions([CHANGE_PENDING, PUSH_CONDITION_GET_LIST, BASIC_DATA_REGION_GET_LIST, BASIC_DATA_SCHOOL_GET_LIST,
        BASIC_DATA_PHASE_GRADE_GET_LIST, PUSH_CONDITION_ADD_UPDATE, PUSH_CONDITION_DELETE]),
      /**
       * 删除数据
       */
      deleteRow (index, rowData) {
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 确定处理事件
          this.CHANGE_PENDING(true)
          this.PUSH_CONDITION_DELETE({id: rowData.id}).then(res => {
            if (res.code == CODE.SUCCESS) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.tableData.splice(index, 1)
            } else {
              this.$message.error(MSG.DELETE_FAIL_MSG)
            }
            this.CHANGE_PENDING(false)
          }).catch(err => {
            globalErrorPrint(err)
            this.$message.error(MSG.DELETE_FAIL_MSG)
            this.CHANGE_PENDING(false)
          })
        }).catch(() => {
          // 此处是取消回调，但不需要做任何处理。必须加上catch否则会报错
        })
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this.getData()
      },

      /**
       * 显示并处理弹出层
       */
      showLayer (index, rowData) {
        if (rowData && typeof rowData === 'object') {
          this.layerForm.editLoading = true
          this.layerForm.isEdit = true
          this.layerForm.tableIndex = index
          let {provinceZip, provinceName, cityZip, cityName, countyZip, countyName, schoolName, gradeCode, gradeName, phase} = rowData
          let phaseText = this.phaseMap[phase]
          Object.assign(this.layerForm, rowData, {
            provinceCode: provinceZip,
            provinceZip: provinceName,
            cityCode: cityZip,
            cityZip: cityName,
            countyCode: countyZip,
            countyZip: countyName,
            schoolCode: schoolName,
            phaseCode: phase,
            phase: phaseText,
            gradeSubmitCode: gradeCode
          })
          this.dialogFormVisible = true
          // 修改时初始化城市和地区的数据
          this.editInitLayer(provinceZip, cityZip, phase, gradeName)
        } else {
          for (let item in this.layerForm) {
            this.layerForm[item] = ''
          }
          this.layerForm.isEdit = false
          this.dialogFormVisible = true
        }
      },

      /**
       * 点击更新按钮弹出编辑框初始化对应数据
       */
      async editInitLayer (provinceZip, cityZip, phase, gradeName) {
        await this.initProvince()
        await this.initCity(provinceZip)
        await this.initCounty(cityZip)
        await this.changeSelectStudySection(this.layerDatas.studySectionData[phase])
        this.layerForm.gradeCode = gradeName
        setTimeout(() => {
          this.layerForm.editLoading = false
        }, 600)
      },

      /**
       * 提交新增，更新
       */
      submitPushCondition () {
        let {receiverType, title, provinceZip, countyZip, cityZip, phase, provinceCode, cityCode, countyCode, phaseCode, gradeSubmitCode, gradeCode} = this.layerForm
        let submitPhase = null
        if (typeof phase === 'number') {
          submitPhase = phase
        } else if (typeof phase === 'object') {
          submitPhase = phase.phaseCode
        } else {
          submitPhase = phaseCode
        }
        let newParam = {}
        let params = {
          provinceZip: provinceZip && typeof provinceZip === 'object' ? provinceZip.zip : provinceCode,
          countyZip: countyZip && typeof countyZip === 'object' ? countyZip.zip : countyCode,
          cityZip: cityZip && typeof cityZip === 'object' ? cityZip.zip : cityCode,
          phaseCode: submitPhase,
          // gradeCode存在且不包含中文则使用gradeCode，否则使用转换后的 gradeSubmitCode
          gradeCode: gradeCode && !(/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(gradeCode)) ? gradeCode : gradeSubmitCode
        }

        // 接收人群，省份，城市，名称都不能为空
        if (receiverType !== '' && params.provinceZip && params.cityZip && title) {
          Object.assign(newParam, this.layerForm, params)
          delete newParam.phase
          newParam.phase = submitPhase
          newParam = cleanFormEmptyValue(newParam)
          this.CHANGE_PENDING(true)
          this.PUSH_CONDITION_ADD_UPDATE(newParam).then(res => {
            if (res.code == CODE.SUCCESS) {
              this.getData()
              if (this.layerForm.isEdit) {
                this.$message({
                  type: 'success',
                  message: '更新成功'
                })
              } else {
                this.$message({
                  type: 'success',
                  message: '新增成功'
                })
              }
              this.CHANGE_PENDING(false)
              this.dialogFormVisible = false
            } else {
              this.layerForm.isEdit ? this.$message.error(MSG.UPDATE_FAIL_MSG) : this.$message.error(MSG.ADD_FAIL_MSG)
            }
          }).catch(err => {
            globalErrorPrint(err)
            this.layerForm.isEdit ? this.$message.error(MSG.UPDATE_FAIL_MSG) : this.$message.error(MSG.ADD_FAIL_MSG)
            this.CHANGE_PENDING(false)
          })
        } else {
          this.$message.error('（条件名称/推送人群/省份选择/城市选择）都必须填写')
        }
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
        let {startTime, endTime} = this.searchForm
        if (startTime > endTime) {
          this.$message.error(MSG.STARTTIME_GREATER_THAN_ENDTIME_MSG)
          return
        }
        this.currentPage = 1 // 设置为第一页
        this.getData()
      },

      /**
       * 获取数据
       */
      getData () {
        this.CHANGE_PENDING(true)
        let {startTime, endTime, status, provinceZip, cityZip, countyZip, phase, provinceCode, cityCode, countyCode, phaseCode} = this.searchForm
        let newParm = {
          provinceZip: provinceZip && typeof provinceZip === 'object' ? provinceZip.zip : provinceCode,
          countyZip: countyZip && typeof countyZip === 'object' ? countyZip.zip : countyCode,
          cityZip: cityZip && typeof cityZip === 'object' ? cityZip.zip : cityCode,
          phase: phase && typeof phase === 'object' ? phase.phaseCode : phaseCode,
          startTime: startTime ? date2secondsTimestamp(startTime) : null,
          endTime: endTime ? date2secondsTimestamp(endTime) : null,
          page: this.currentPage,
          pageSize: this.pageSize
        }
        if (typeof status == 'number') {
          Object.assign(newParm, {
            status: [status]
          })
        }
        let newForm = cleanFormEmptyValue(this.searchForm)
        let params = Object.assign({}, newForm, newParm)
        this.PUSH_CONDITION_GET_LIST(params).then((res) => {
          if (res.code == CODE.SUCCESS) {
            let newData = res.data.items.map((item) => {
              item.conditions = item.provinceName ? ` ${item.provinceName} >` : ''
              item.conditions += item.cityName ? ` ${item.cityName} >` : ''
              item.conditions += item.countyName ? ` ${item.countyName} >` : ''
              item.conditions += item.schoolName ? ` ${item.schoolName} >` : ''
              item.conditions += ` ${this.phaseMap[item.phase]} >`
              item.conditions += item.gradeName ? ` ${item.gradeName} >` : ''
              item.conditions = item.conditions.substr(0, item.conditions.length - 1)
              return item
            })
            this.tableData = newData
            this.totalSize = res.data.totalSize
            this.currentPage = res.data.currentPage
          } else {
            this.$message.error(MSG.GET_DATA_FAIL_MESSATE)
          }
          this.CHANGE_PENDING(false)
        }).catch(() => {
          this.$message.error(MSG.GET_DATA_FAIL_MESSATE)
          this.CHANGE_PENDING(false)
        })
      },

      /**
       * 省、市、区选择下拉框发生变化
       * @param type 选择框区别
       * @param event 选择后的值
       */
      changeSelectRegion (type, event) {
        if (this.layerForm.editLoading) return
        switch (type) {
          case 'province': // 选择省
            if (event) {
              this.initCity(event.zip)
              if (this.dialogFormVisible) {
                this.layerForm.cityZip = ''
                this.layerForm.cityCode = ''
              } else {
                this.searchForm.cityZip = ''
              }
            }
            break
          case 'city': // 选择市
            if (event) {
              this.initCounty(event.zip)
            }
            if (this.dialogFormVisible) {
              this.layerForm.countyZip = ''
              this.layerForm.countyCode = ''
            } else {
              this.searchForm.countyZip = ''
            }
            break
          case 'county': // 选择区
            this.dialogFormVisible ? this.layerForm.schoolCode = '' : this.searchForm.schoolCode = ''
            this.getSchoolList()
            break
        }
      },

      /**
       * 学段选择下拉框发生变化
       * @param event 选择后的值
       */
      changeSelectStudySection (event) {
        if (!event || typeof event != 'object') return
        if (this.dialogFormVisible) {
          this.layerForm.gradeCode = ''
          this.layerDatas.gradeData = event.grades
        } else {
          this.searchForm.gradeCode = ''
          this.searchDatas.gradeData = event.grades
        }
        this.getSchoolList()
      },

      /**
       * 初始化省份
       */
      initProvince () {
        this.BASIC_DATA_REGION_GET_LIST({zip: null}).then(res => {
          if (res.code == CODE.SUCCESS) {
            this.searchDatas.provinceData = res.data
            this.layerDatas.provinceData = res.data
          } else {
            if (this.loadCount < CONFIG.LOAD_DATA_COUNT) {
              this.initProvince()
              this.loadCount++
            }
          }
        }).catch(() => {
          if (this.loadCount < CONFIG.LOAD_DATA_COUNT) {
            this.initProvince()
            this.loadCount++
          }
        })
      },

      /**
       * 初始化市
       */
      initCity (zip) {
        if (!zip) return
        this.BASIC_DATA_REGION_GET_LIST({zip: zip}).then(res => {
          if (res.code == CODE.SUCCESS) {
            this.dialogFormVisible ? this.layerDatas.cityData = res.data : this.searchDatas.cityData = res.data
          } else {
            if (this.loadCount < CONFIG.LOAD_DATA_COUNT) {
              this.initCity(zip)
              this.loadCount++
            }
          }
        }).catch(() => {
          if (this.loadCount < CONFIG.LOAD_DATA_COUNT) {
            this.initCity(zip)
            this.loadCount++
          }
        })
      },

      /**
       * 初始化区域
       */
      initCounty (zip) {
        if (!zip) return
        this.BASIC_DATA_REGION_GET_LIST({zip: zip}).then(res => {
          if (res.code == CODE.SUCCESS) {
            this.dialogFormVisible ? this.layerDatas.countyData = res.data : this.searchDatas.countyData = res.data
          } else {
            if (this.loadCount < CONFIG.LOAD_DATA_COUNT) {
              this.initCounty(zip)
              this.loadCount++
            }
          }
        }).catch(() => {
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
        if (this.dialogFormVisible) {
          if (!this.layerForm.phase || !this.layerForm.countyZip) return
          zip = this.layerForm.countyZip.zip
          phaseCode = this.layerForm.phase.phaseCode
        } else {
          if (!this.searchForm.phase || !this.searchForm.countyZip) return
          zip = this.searchForm.countyZip.zip
          phaseCode = this.searchForm.phase.phaseCode
        }

        if (!zip || !phaseCode) return
        // 请求接口获取数据
        this.BASIC_DATA_SCHOOL_GET_LIST({zip: zip, phase: phaseCode}).then(res => {
          if (res.code == CODE.SUCCESS) {
            this.dialogFormVisible ? this.layerDatas.schoolData = res.data : this.searchDatas.schoolData = res.data
          } else {
            if (this.loadCount < CONFIG.LOAD_DATA_COUNT) {
              this.getSchoolList()
              this.loadCount++
            }
          }
        }).catch(() => {
          if (this.loadCount < CONFIG.LOAD_DATA_COUNT) {
            this.getSchoolList()
            this.loadCount++
          }
        })
      },

      /**
       * 初始化学段年级数据
       */
      initPhaseGrade () {
        this.BASIC_DATA_PHASE_GRADE_GET_LIST().then(res => {
          if (res.code == CODE.SUCCESS) {
            this.layerDatas.studySectionData = res.data
            this.searchDatas.studySectionData = res.data
            this.loadCount = 0
          } else {
            if (this.loadCount < CONFIG.LOAD_DATA_COUNT) {
              this.initPhaseGrade()
              this.loadCount++
            }
          }
        }).catch(() => {
          if (this.loadCount < CONFIG.LOAD_DATA_COUNT) {
            this.initPhaseGrade()
            this.loadCount++
          }
        })
      }
    }
  }
</script>

