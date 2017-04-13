<!--Copyright (C) 2017 QIANKUN HANLIN Corporation Limited-->
<!--文件审核列表页-->
<template>
  <div class="fileaudit-wrap">
    <el-row>
      <h3 class="top-title">文件审核</h3>
    </el-row>
    <v-divline></v-divline>
    <!-- 搜索条件组合 begin -->
    <div class="fix-wrapper">
      <table class="table-custom" width="100%">
        <tr>
          <td>
            <label>
              <span>状态</span>
              <el-select v-model="searchForm.status" placeholder="请选择">
                <el-option label="等待审核" :value="1"></el-option>
                <el-option label="审核未通过" :value="2"></el-option>
                <el-option label="审核通过" :value="3"></el-option>
              </el-select>
            </label>
          </td>
          <td>
            <label>
              <span>付费类型</span>
              <el-select v-model="searchForm.paid" placeholder="请选择">
                <el-option label="公开免费" :value="0"></el-option>
                <el-option label="公开付费" :value="1"></el-option>
              </el-select>
            </label>
          </td>
          <td>
            <label>
              <span>分类</span>
              <el-select v-model="selectsObj.categoryValue" placeholder="请选择" @change="changeSelect('cate', $event,  selectsObj, cateRootObj)">
                <el-option v-for="item in selectsObj.categoryData" :label="item.name" :value="item"></el-option>
              </el-select>
            </label>
          </td>
          <td>
            <label>
              <span>学段</span>
              <el-select v-model="selectsObj.courseValue" :disabled="selectsObj.sectionValue && selectsObj.courseData ? false : true"
                         placeholder="请选择" @change="changeSelect('course', $event, selectsObj, cateRootObj)">
                <el-option v-for="item in selectsObj.courseData" :label="item.name" :value="item"></el-option>
              </el-select>
            </label>
          </td>
        </tr>
        <tr>
          <td>
            <label>
              <span>学科</span>
              <el-select v-model="selectsObj.courseValue" :disabled="selectsObj.sectionValue && selectsObj.courseData ? false : true"
                         placeholder="请选择" @change="changeSelect('course', $event, selectsObj, cateRootObj)">
                <el-option v-for="item in selectsObj.courseData" :label="item.name" :value="item"></el-option>
              </el-select>
            </label>
          </td>
          <td>
            <label>
              <span>版本</span>
              <el-select v-model="selectsObj.versionValue" :disabled="selectsObj.courseValue && selectsObj.versionData ? false : true"
                         placeholder="请选择" @change="changeSelect('version', $event, selectsObj, cateRootObj)">
                <el-option v-for="item in selectsObj.versionData" :label="item.name" :value="item"></el-option>
              </el-select>
            </label>
          </td>
          <td>
            <label>
              <span>年级</span>
              <el-select v-model="selectsObj.gradeValue" :disabled="selectsObj.versionValue && selectsObj.gradeData ? false : true"
                         placeholder="请选择" @change="changeSelect('grade', $event, selectsObj, cateRootObj)">
                <el-option v-for="item in selectsObj.gradeData" :label="item.name" :value="item"></el-option>
              </el-select>
            </label>
          </td>
          <td>
            <label>
              <span>用户名称</span>
              <el-input v-model="searchForm.userId" placeholder="请输入" class="text-input"></el-input>
            </label>
          </td>
        </tr>
        <tr>
          <td>
            <label>
              <span>用户手机</span>
              <el-input v-model="searchForm.phoneNo" placeholder="请输入" class="text-input"></el-input>
            </label>
          </td>
          <td>
            <label>
              <span>上传时间</span>
              <el-date-picker type="date" placeholder="选择日期" v-model="searchForm.startTime"></el-date-picker>
            </label>
          </td>
          <td>
            <label>
              <span>至</span>
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
    <!-- 搜索条件组合 end -->
    <!-- 表格数据 -->
    <div class="fix-wrapper">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" label="序号" width="70">
          <template scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="名称" width="180"></el-table-column>
        <el-table-column label="类型" width="70">
          <template scope="scope">
            {{scope.row.paid == 1 ? '付费' : '免费'}}
          </template>
        </el-table-column>
        <el-table-column label="文件分类" min-width="180">
          <template scope="scope">
            {{scope.row.conditions}}
          </template>
        </el-table-column>
        <el-table-column prop="userId" label="上传者" width="150"></el-table-column>
        <el-table-column label="上传日期" width="120">
          <template scope="scope">
            {{scope.row.createTime ? jst.timestampFormat(Number(scope.row.createTime), 'Y-m-d') : ''}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template scope="scope">
            <!--0 私有，1 审核中，2 审核未通过，3 审核通过已公开， 4 已删除到回收站-->
            <a @click="showLayer(scope.$index, scope.row)" v-if="scope.row.status == 1" class="default-info">去审核</a>
            <a @click="showLayer(scope.$index, scope.row)" v-if="scope.row.status == 2" class="notpass-info">未通过</a>
            <a @click="showLayer(scope.$index, scope.row)" v-if="scope.row.status == 3" class="pass-info">已通过</a>
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
    <el-dialog :title="layerForm.dialogTitle" v-model="dialogFormVisible" :close-on-click-modal="false">
      <div class="scroll-content">
        <el-form :model="layerForm">
          <el-form :model="layerForm">
            <el-form-item label="文件作者:" :label-width="formLabelWidth">
              <label>{{layerForm.userId}}</label>
            </el-form-item>
            <el-form-item label="作者归属:" :label-width="formLabelWidth">
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

          <div v-if="layerForm.status == 1">
            <el-form-item>
              <v-divline></v-divline>
            </el-form-item>
            <el-form-item label="* 审核操作:" :label-width="formLabelWidth">
              <el-select placeholder="请选择" v-model="layerForm.optionStatus">
                <el-option label="驳回" :value="2"></el-option>
                <el-option label="同意" :value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="* 审核评论:" :label-width="formLabelWidth">
              <el-input type="textarea" v-model="layerForm.rejectReason" placeholder="请备注审批评论"></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="t-c pading-t20">
        <el-button @click="submitAudit" type="primary" class="large-btn">提交审核</el-button>
        <el-button @click="dialogFormVisible = false" type="cancel" class="large-btn">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import {CHANGE_PENDING, GET_CONTENT_CATEGORYS} from 'store/globalStore'
  import { CONTENT_GET_REVIEW_LIST, CONTENT_REVIEW, CONTENT_FILE_GET_URL } from 'store/modules/contentStore'
  import { USER_GET_PROFILE } from '../store/modules/userStore'
  import * as jst from 'js-common-tools'
  import * as CODE from '../config/code'
  import * as CONFIG from '../config/'
  import * as MSG from '../config/messages'
  import { cleanFormEmptyValue, globalErrorPrint, date2secondsTimestamp } from '../utils/'
  import GlobalService from '../services/GlobalService'
  export default {
    name: 'fileAuditList',
    data () {
      return {
        jst: jst,
        searchForm: {
          status: '',
          paid: '',
          category: '',
          studySection: '',
          subject: '',
          version: '',
          grade: '',
          userId: '',
          phoneNo: '',
          startTime: '',
          endTime: ''
        },
        tableData: [],
        currentPage: 1,
        totalSize: 1,
        pageSize: CONFIG.PAGE_SIZE,
        dialogFormVisible: false,
        layerForm: {
          dialogTitle: '',
          userId: null,
          name: '',
          region: '',
          fileKey: null,
          fileName: null,
          downloadLink: null,
          summary: null,
          optionStatus: '', // 0 私有，1 审核中，2 审核未通过，3 审核通过已公开， 4 已删除到回收站
          rejectReason: ''
        },
        formLabelWidth: '120px',
        cateRootObj: '', // 分类的整个对象
        selectsObj: '' // CATE,选择了后的各层级的对象
      }
    },
    mounted () {
      this.getData()
      // CATE 获取所有分类
      this.GET_CONTENT_CATEGORYS().then((res) => {
        this.cateRootObj = res.data
        this.changeSelect('', '', '', this.cateRootObj)
      })
    },
    methods: {
      ...mapActions([CHANGE_PENDING, GET_CONTENT_CATEGORYS, CONTENT_GET_REVIEW_LIST, CONTENT_REVIEW, CONTENT_FILE_GET_URL,
        USER_GET_PROFILE]),
      /**
       * 点击分页码
       */
      handleCurrentChange (val) {
        this.currentPage = val
        this.getData()
      },

      /**
       * CATE,改变每个select时
       * @type param 类型
       * @selected param 选择的当前级别信息
       * @selectsObj param 选择了后的各层级的对象
       * @cateRootObj param 分类的整个对象
       */
      changeSelect (type, selectedData, selectsObj, cateRootObj) {
        this.selectsObj = GlobalService.selectRelation(type, selectedData, selectsObj, cateRootObj)
      },

      /**
       * 显示并处理弹出层
       */
      showLayer (index, rowData) {
        let {status, files, resId, userId} = rowData
        this.downloadFile(resId, files[0].fileKey)
        this.getUserProfile(userId)
        let statusText = ''
        // 0 私有，1 审核中，2 审核未通过，3 审核通过已公开， 4 已删除到回收站
        if (status == 1) {
          statusText = '未审核'
        } else if (status == 2) {
          statusText = '未通过'
        } else if (status == 3) {
          statusText = '已通过'
        }
        this.layerForm.dialogTitle = `内容审核（审核状态：${statusText}）`
        Object.assign(this.layerForm, rowData, {
          fileName: files[0].fileName,
          fileKey: files[0].fileKey,
          tableIndex: index
        })
        this.layerForm.optionStatus = ''
        this.layerForm.rejectReason = ''

        this.dialogFormVisible = true
      },

      /**
       * 提交审核
       */
      submitAudit () {
        let {resId, optionStatus, rejectReason, tableIndex} = this.layerForm
        if (optionStatus && rejectReason) {
          let param = {
            resId: resId,
            status: optionStatus,
            rejectReason: rejectReason
          }
          let newParam = cleanFormEmptyValue(param)
          this.CHANGE_PENDING(true)
          this.CONTENT_REVIEW(newParam).then(res => {
            if (res.code == CODE.SUCCESS) {
              this.tableData[tableIndex].status = optionStatus
              this.$message({
                type: 'success',
                message: MSG.UPDATE_SUCCUSS_MSG
              })
            }
            this.CHANGE_PENDING(false)
            this.dialogFormVisible = false
          }).catch(() => {
            this.$message.error(MSG.UPDATE_FAIL_MSG)
            this.CHANGE_PENDING(false)
          })
        } else {
          this.$message.error('审核操作与评论必须填写')
        }
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
        let {startTime, endTime} = this.searchForm
        if (startTime > endTime) {
          this.$message.error(MSG.STARTTIME_GREATER_THAN_ENDTIME_MSG)
          return
        }
        this.getData()
      },

      /**
       * 获取数据
       */
      getData () {
        this.CHANGE_PENDING(true)
        Object.assign(this.searchForm, {
          cateId: GlobalService.getEndCateId(this.selectsObj) // CATE
        })
        let {startTime, endTime, status} = this.searchForm
        let newParm = {
          startTime: startTime ? date2secondsTimestamp(startTime) / 1000 : null,
          endTime: endTime ? date2secondsTimestamp(endTime) / 1000 : null,
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
        this.CONTENT_GET_REVIEW_LIST(params).then(res => {
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
      }
    }
  }
</script>
