<!--Copyright (C) 2017 QIANKUN HANLIN Corporation Limited-->
<!--精品推荐列表页-->
<template>
  <div class="fileaudit-wrap">
    <el-row>
      <h3 class="top-title">精品推荐</h3>
    </el-row>
    <v-divline></v-divline>
    <div class="fix-wrapper">
      <table class="table-custom" width="100%">
        <tr>
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
              <span>学科</span>
              <el-select v-model="searchForm.subjectCode" placeholder="请选择">
                <el-option v-for="item in searchDatas.subjectData" :label="item.subjectName" :value="item.subjectCode"></el-option>
              </el-select>
            </label>
          </td>
          <td>
            <label>
              <span>上传者</span>
              <el-input v-model="searchForm.userId" placeholder="请输入" :maxlength="20" class="text-input"></el-input>
            </label>
          </td>
        </tr>
        <tr>
          <td>
            <label>
              <span>手机号</span>
              <div class="el-input text-input">
                <input class="el-input__inner" v-model="searchForm.phoneNo" :maxlength="11"
                       @keyup="searchForm.phoneNo = searchForm.phoneNo.replace(/[^0-9]/, '')" placeholder="请输入">
              </div>
            </label>
          </td>
          <td>
            <label>
              <span>上传时间起</span>
              <el-date-picker type="date" placeholder="选择日期" v-model="searchForm.startTime"></el-date-picker>
            </label>
          </td>
          <td>
            <label>
              <span>上传时间止</span>
              <el-date-picker type="date" placeholder="选择日期" v-model="searchForm.endTime"></el-date-picker>
            </label>
          </td>
          <td>
          </td>
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
        <el-table-column label="名称" min-width="180">
          <template scope="scope">
            <a @click="showLayer(scope.row)">{{scope.row.title}}</a>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="70">
          <template scope="scope">
            {{scope.row.paid == 1 ? '付费' : '免费'}}
          </template>
        </el-table-column>
        <el-table-column label="组合条件" min-width="180">
          <template scope="scope">
            {{scope.row.conditions}}
          </template>
        </el-table-column>
        <el-table-column prop="downloadTimes" label="下载" width="90"></el-table-column>
        <el-table-column prop="userId" label="作者" width="150"></el-table-column>
        <el-table-column label="上架日期" width="120">
          <template scope="scope">
            {{scope.row.createTime ? jst.timestampFormat(Number(scope.row.createTime), 'Y-m-d') : ''}}
          </template>
        </el-table-column>
        <el-table-column label="排序" width="80">
          <template scope="scope">
            <input @blur="recommendRow(scope.$index, scope.row, tableData)" v-model="scope.row.recSort" style="width: 40px;">
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
    <el-dialog title="文件详细信息" v-model="dialogFormVisible" :close-on-click-modal="false">
      <el-form :model="layerForm">
        <el-form-item label="文件作者:" :label-width="formLabelWidth">
          <label>{{layerForm.userId}}</label>
        </el-form-item>
        <el-form-item label="作者归属:" :label-width="formLabelWidth">
          <!--0 教师； 1 三方个人； 2 三方机构-->
          <label v-if="layerForm.region === ''">未认证</label>
          <label v-if="layerForm.region === 0">教师</label>
          <label v-if="layerForm.region === 1">三方个人</label>
          <label v-if="layerForm.region === 2">三方机构</label>
        </el-form-item>
        <el-form-item label="联系电话:" :label-width="formLabelWidth">
          <label>{{layerForm.phoneNo}}</label>
        </el-form-item>
        <el-form-item label="学科分类:" :label-width="formLabelWidth">
          <label>{{layerForm.conditions}}</label>
        </el-form-item>
        <el-form-item label="文件名称:" :label-width="formLabelWidth">
          <label>{{layerForm.fileName}}</label>
        </el-form-item>
        <el-form-item label="内容简介:" :label-width="formLabelWidth">
          <label>{{layerForm.summary}}</label>
        </el-form-item>
        <el-form-item label="点击下载:" :label-width="formLabelWidth">
          <a :href="layerForm.downloadLink" target="_blank">{{layerForm.fileName}}</a>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import { CHANGE_PENDING, BASIC_DATA_PHASE_GRADE_GET_LIST, BASIC_DATA_SUBJECT_GET_LIST } from 'store/globalStore'
  import { CONTENT_GET_LIST, COMTENT_RECOMMEND, CONTENT_FILE_GET_URL } from 'store/modules/contentStore'
  import { USER_GET_PROFILE } from '../store/modules/userStore'
  import * as jst from 'js-common-tools'
  import * as CONFIG from '../config/'
  import * as CODE from '../config/code'
  import * as MSG from '../config/messages'
  import { cleanFormEmptyValue, globalErrorPrint, date2secondsTimestamp } from '../utils/'
  import GlobalService from '../services/GlobalService'
  export default {
    name: 'recommendList',
    data () {
      return {
        jst: jst,
        loadCount: 0, // 数据加载次数，设定超过2次提示用户刷新页面再试
        hasSearched: false, // true点击搜索后 false点击搜索前
        searchForm: {
          recommended: null, // 1推荐 0未推荐
          phase: null, // 学段
          gradeCode: null, // 年级
          subjectCode: null, // 学科编码
          userId: null,
          phoneNo: null,
          startTime: null,
          endTime: null
        },
        searchDatas: {
          subjectData: null, // 学科
          studySectionData: null, // 学段
          gradeData: null // 年级
        },
        tableData: [],
        currentPage: 1,
        totalSize: 1,
        pageSize: CONFIG.PAGE_SIZE,
        dialogFormVisible: false,
        layerForm: {
          userId: null,
          phoneNo: null,
          name: '',
          region: '',
          fileKey: null,
          fileName: null,
          downloadLink: null,
          summary: null
        },
        formLabelWidth: '120px',
        cateRootObj: '', // 分类的整个对象
        selectsObj: '' // CATE,选择了后的各层级的对象
      }
    },
    mounted () {
      // 初始化学段年级数据
      this.initPhaseGrade()
      // 初始化学科数据
      this.initSubject()
      this.isSearch2EmptyData()
    },
    methods: {
      ...mapActions([CHANGE_PENDING, CONTENT_GET_LIST, COMTENT_RECOMMEND, BASIC_DATA_PHASE_GRADE_GET_LIST,
        BASIC_DATA_SUBJECT_GET_LIST, CONTENT_FILE_GET_URL, USER_GET_PROFILE]),
      /**
       * 点击分页码
       */
      handleCurrentChange (val) {
        this.currentPage = val
        this.getData()
      },

      /**
       * 显示并处理弹出层
       */
      showLayer (rowData) {
        let {state, files, resId, userId} = rowData
        this.downloadFile(resId, files[0].fileKey)
        this.getUserProfile(userId)
        let stateText = state == 2 ? '已通过' : '未审核'
        this.layerForm.dialogTitle = `内容审核（审核状态：${stateText}）`
        Object.assign(this.layerForm, rowData, {
          fileName: files[0].fileName,
          fileKey: files[0].fileKey
        })
        this.dialogFormVisible = true
      },

      /**
       * 清除查询表单数据
       */
      clearFormData () {
        for (let item in this.searchForm) {
          this.searchForm[item] = ''
        }
        // CATE,清除级联选项的值
        for (let item in this.selectsObj) {
          if (item.indexOf('Value') != -1) {
            this.selectsObj[item] = ''
          }
        }
      },

      /**
       * 查询表单数据
       */
      searchData () {
        this.hasSearched = true
        let {startTime, endTime, gradeCode, subjectCode, phase, phoneNo} = this.searchForm
        if (!gradeCode || !subjectCode || !phase) {
          this.$message.error(MSG.SELECT_PHASE_GRADE_SUBJECT_2_SEARCH)
          return
        }
        if (startTime > endTime) {
          this.$message.error(MSG.STARTTIME_GREATER_THAN_ENDTIME_MSG)
          return
        }
        if (phoneNo && !CONFIG.PHONENO_PATTERN.test(phoneNo)) {
          this.$message.error(MSG.PHONENO_PATTERN_ERR_MSG)
          return
        }
        this.currentPage = 1 // 设置为第一页
        this.getData()
      },

      /**
       * 获取数据
       */
      getData () {
        this.isSearch2EmptyData()
        this.CHANGE_PENDING(true)
        Object.assign(this.searchForm, {
          cateId: GlobalService.getEndCateId(this.selectsObj) // CATE
        })
        let {startTime, endTime, phase} = this.searchForm
        let newParams = {
          startTime: startTime ? date2secondsTimestamp(startTime) : null,
          endTime: endTime ? date2secondsTimestamp(endTime) : null,
          phase: phase.phaseCode,
          page: this.currentPage,
          pageSize: this.pageSize
        }
        let newForm = cleanFormEmptyValue(this.searchForm)
        let params = Object.assign({}, newForm, newParams)
        this.CONTENT_GET_LIST(params).then(res => {
          if (res.code == CODE.SUCCESS) {
            let newData = res.data.items.map((item) => {
              item.conditions = item.cateName ? ` ${item.cateName} >` : ''
              item.conditions += item.phaseCateName ? ` ${item.phaseCateName} >` : ''
              item.conditions += item.subjectCateName ? ` ${item.subjectCateName} >` : ''
              item.conditions += item.editionCateName ? ` ${item.editionCateName} >` : ''
              item.conditions += item.gradeCateName ? ` ${item.gradeCateName} >` : ''
              item.conditions = item.conditions.substr(0, item.conditions.length - 1)
              return item
            })
            this.tableData = newData
            this.totalSize = res.data.totalSize
            this.pageSize = res.data.pageSize
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
       * 是否是查询后无数据
       */
      isSearch2EmptyData () {
        let emptyDom = document.getElementsByClassName('el-table__empty-text')
        if (!emptyDom.length) {
          return
        }
        if (this.hasSearched) {
          emptyDom[0].innerHTML = '暂无数据'
        } else {
          emptyDom[0].innerHTML = '请选择（学段、年级、学科）点击搜索'
        }
      },

      /**
       * 提交推荐
       */
      recommendRow (index, rowData, tableData) {
        let {resId, recSort} = rowData
        let param = {
          resId: resId,
          recommended: recSort ? 1 : 0, // 1推荐 0未推荐
          recSort: recSort ? Number(recSort) : ''
        }
        let newParam = cleanFormEmptyValue(param)
        this.CHANGE_PENDING(true)
        this.COMTENT_RECOMMEND(newParam).then(res => {
          if (res.code == CODE.SUCCESS) {
            this.tableData[index].recommended = newParam.recommended
            this.$message({
              type: 'success',
              message: MSG.UPDATE_SUCCUSS_MSG
            })
          }
          this.CHANGE_PENDING(false)
        }).catch(() => {
          this.$message.error(MSG.UPDATE_FAIL_MSG)
          this.CHANGE_PENDING(false)
        })
      },

      /**
       * 下载文件
       */
      downloadFile (resId, fileKey) {
        let params = {
          resId: resId,
          fileKey: fileKey
        }
        this.CONTENT_FILE_GET_URL(params).then(res => {
          if (res.code == CODE.SUCCESS) {
            this.layerForm.downloadLink = res.data.url
          }
        }).catch((err) => {
          globalErrorPrint(err)
        })
      },

      /**
       * 获取三方用户信息
       */
      getUserProfile (userId) {
        let params = {
          userId: userId
        }
        this.USER_GET_PROFILE(params).then(res => {
          if (res.code == CODE.SUCCESS) {
            this.layerForm.userId = res.data.userId
            this.layerForm.phoneNo = res.data.phoneNo
            this.layerForm.region = res.data.identification ? res.data.identification.type : ''
          }
        }).catch((err) => {
          globalErrorPrint(err)
        })
      },

      /**
       * 学段选择下拉框发生变化
       * @param event 选择后的值
       */
      changeSelectStudySection (event) {
        if (!event || typeof event != 'object') return
        this.searchForm.gradeCode = ''
        this.searchDatas.gradeData = event.grades
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
        }).catch(() => {
          if (this.loadCount < CONFIG.LOAD_DATA_COUNT) {
            this.initPhaseGrade()
            this.loadCount++
          }
        })
      },

      /**
       * 初始化学科数据
       */
      initSubject () {
        this.BASIC_DATA_SUBJECT_GET_LIST().then(res => {
          if (res.code == CODE.SUCCESS) {
            this.searchDatas.subjectData = res.data
            this.loadCount = 0
          } else {
            if (this.loadCount < CONFIG.LOAD_DATA_COUNT) {
              this.initSubject()
              this.loadCount++
            }
          }
        }).catch(() => {
          if (this.loadCount < CONFIG.LOAD_DATA_COUNT) {
            this.initSubject()
            this.loadCount++
          }
        })
      }
    }
  }
</script>
