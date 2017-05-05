<!--Copyright (C) 2017 QIANKUN HANLIN Corporation Limited-->
<!--推送任务调度页面-->
<template>
  <div class="fileaudit-wrap">
    <!-- 列表页面 -->
    <el-col v-if="listPageVisible">
      <el-row>
        <h3 class="top-title">
          <span>推送任务调度</span>
          <el-button @click="showTaskLayer('')" type="primary" class="large-btn">新增</el-button>
        </h3>
      </el-row>
      <v-divline></v-divline>
      <!--查询表单-->
      <div class="fix-wrapper">
        <table class="table-custom" width="100%">
          <tr class="search-title">
            <td colspan="4">
              查询
            </td>
          </tr>
          <tr>
            <td>
              <label>
                <span>推送状态</span>
                <el-select v-model="searchForm.status" placeholder="请选择">
                  <el-option label="未执行" :value="0"></el-option>
                  <el-option label="已执行" :value="1"></el-option>
                </el-select>
              </label>
            </td>
            <td>
              <label>
                <span>任务名称</span>
                <el-input v-model="searchForm.title" :maxlength="50" placeholder=""></el-input>
              </label>
            </td>
            <td>
              <label>
                <span>执行时间起</span>
                <el-date-picker type="datetime" placeholder="选择时间" :editable="false" v-model="searchForm.startTime" ></el-date-picker>
              </label>
            </td>
            <td>
              <label>
                <span>执行时间止</span>
                <el-date-picker type="datetime" placeholder="选择时间" :editable="false" v-model="searchForm.endTime" ></el-date-picker>
              </label>
            </td>
          </tr>
        </table>
        <div class="buttons-wrap">
          <el-button type="cancel" @click="clearFormData" class="clear-icon"><i></i>清空</el-button>
          <el-button type="primary" @click="searchTaskData" class="search-icon"><i></i>搜索</el-button>
        </div>
      </div>
      <v-divline></v-divline>
      <!--任务列表-->
      <div class="fix-wrapper">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column type="index" label="序号" width="70">
            <template scope="scope">
              <span>{{scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="任务名称" width="180"></el-table-column>
          <el-table-column prop="content" label="内容名称" width="180"></el-table-column>
          <el-table-column label="组合条件" min-width="180">
            <template scope="scope">
              <a @click="showTaskLayer(scope.$index, scope.row)">{{scope.row.taskConditions}}</a>
            </template>
          </el-table-column>
          <el-table-column label="执行时间" width="180">
            <template scope="scope">
              {{scope.row.pushTime ? jst.timestampFormat(Number(scope.row.pushTime)) : ''}}
            </template>
          </el-table-column>
          <el-table-column label="状态" width="90">
            <template scope="scope">
              <label v-if="scope.row.status == executed" class="pass-info">已执行</label>
              <label v-else>未执行</label>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140">
            <template scope="scope">
              <a @click="showTaskLayer(scope.$index, scope.row)">{{scope.row.status == executed ? '查看' : '更新'}}</a>
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
      <!-- 新增、更新推送任务 -->
      <el-dialog :title="(layerTaskForm.isEdit ? '更新' : '新增') + '推送任务'" size="large" top="10%" v-model="dialogFormVisible" class="middle-dialog" :close-on-click-modal="false">
        <div class="scroll-content">
          <el-form :model="layerTaskForm">
            <el-form-item label="* 任务名称" :label-width="formLabelWidth">
              <el-input v-model="layerTaskForm.title" :maxlength="50" :disabled="layerTaskForm.isExec" class="text-input" placeholder="请输入任务名称"></el-input>
            </el-form-item>
            <el-form-item label="* 推送条件" :label-width="formLabelWidth">
              <el-input v-model="layerTaskForm.conditionName" :disabled="layerTaskForm.isExec" :readonly="true" class="text-input" placeholder="请输入推送条件"></el-input>
              <el-button class="push-choice" :disabled="layerTaskForm.isExec" @click="showPushConditionLayer">选择</el-button>
            </el-form-item>
            <el-form-item label="* 推送内容" :label-width="formLabelWidth">
              <el-input v-model="layerTaskForm.resName" :disabled="layerTaskForm.isExec" :readonly="true" class="text-input" placeholder="请输入推送内容"></el-input>
              <el-button class="push-choice" :disabled="layerTaskForm.isExec" @click="showPushContentLayer">选择</el-button>
            </el-form-item>
            <el-form-item label="* 执行时间" :label-width="formLabelWidth">
              <el-date-picker type="datetime" :disabled="layerTaskForm.isExec" :editable="false" format="yyyy-MM-dd HH:mm" placeholder="选择日期时间" v-model="layerTaskForm.pushTime"></el-date-picker>
            </el-form-item>
            <el-form-item label="* 推送显示内容" :label-width="formLabelWidth">
              <el-input v-model="layerTaskForm.content" type="textarea" :maxlength="250" :disabled="layerTaskForm.isExec" placeholder="需要推送的提示内容在pad端呈现"></el-input>
            </el-form-item>

            <div v-if="addUpdateTableData.length">
              <v-divline></v-divline>
              <h4 style="padding: 20px 0;margin-top: -10px;color: #767676;">推送内容详细</h4>
              <el-table :data="addUpdateTableData" border style="width: 100%">
                <el-table-column prop="title" label="标题名称" width="180"></el-table-column>
                <el-table-column label="类型" width="90">
                  <template scope="scope">
                    {{scope.row.paid == 0 ? '免费' : '付费'}}
                  </template>
                </el-table-column>
                <el-table-column prop="conditions" label="文件分类" min-width="180"></el-table-column>
                <el-table-column label="文件名" min-width="180">
                  <template scope="scope">
                    <a :href="downloadLink" target="_blank">{{scope.row.files ? scope.row.files[0].fileName : ''}}</a>
                  </template>
                </el-table-column>
                <el-table-column label="上传日期" width="120">
                  <template scope="scope">
                    {{scope.row.createTime ? jst.timestampFormat(Number(scope.row.createTime), 'Y-m-d') : ''}}
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form>
        </div>
        <div class="t-c pading-t20" v-if="layerTaskForm.status != executed">
          <el-button @click="submitTask(layerTaskForm.tableIndex)" type="primary" class="large-btn">提交任务</el-button>
          <el-button @click="dialogFormVisible = false" type="cancel" class="large-btn">取消</el-button>
        </div>
      </el-dialog>
    </el-col>
    <!-- 新增页面 -->
    <el-col v-else>
      <el-row>
        <h3 class="top-title">
          <span>新增推送任务</span>
          <el-button @click="listPageVisible = true" class="back-icon"><i></i>返回</el-button>
        </h3>
      </el-row>
      <v-divline></v-divline>
      <div class="fix-wrapper">
        <el-form :model="layerTaskForm" style="width: 800px;margin: 0 auto;">
          <el-form-item label="* 任务名称" :label-width="formLabelWidth">
            <el-input v-model="layerTaskForm.title" :maxlength="50" :disabled="layerTaskForm.isExec" class="text-input" placeholder="请输入任务名称"></el-input>
          </el-form-item>
          <el-form-item label="* 推送条件" :label-width="formLabelWidth">
            <el-input v-model="layerTaskForm.conditionName" :disabled="layerTaskForm.isExec" :readonly="true" class="text-input" placeholder="请输入推送条件"></el-input>
            <el-button class="push-choice" :disabled="layerTaskForm.isExec" @click="showPushConditionLayer">选择</el-button>
          </el-form-item>
          <el-form-item label="* 推送内容" :label-width="formLabelWidth">
            <el-input v-model="layerTaskForm.resName" :disabled="layerTaskForm.isExec" :readonly="true" class="text-input" placeholder="请输入推送内容"></el-input>
            <el-button class="push-choice" :disabled="layerTaskForm.isExec" @click="showPushContentLayer">选择</el-button>
          </el-form-item>
          <el-form-item label="* 执行时间" :label-width="formLabelWidth">
            <el-date-picker type="datetime" :disabled="layerTaskForm.isExec" :editable="false" format="yyyy-MM-dd HH:mm" placeholder="选择日期时间" v-model="layerTaskForm.pushTime"></el-date-picker>
          </el-form-item>
          <el-form-item label="* 推送显示内容" :label-width="formLabelWidth">
            <el-input v-model="layerTaskForm.content" type="textarea" :maxlength="250" :disabled="layerTaskForm.isExec" placeholder="需要推送的提示内容在pad端呈现"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="addUpdateTableData.length">
        <v-divline></v-divline>
        <h4 style="padding: 20px 40px;margin-top: -10px;color: #767676;">推送内容详细</h4>
        <div class="fix-wrapper">
          <el-table :data="addUpdateTableData" border style="width: 100%;margin-bottom: 65px;">
            <el-table-column prop="title" label="标题名称" width="180"></el-table-column>
            <el-table-column label="类型" width="90">
              <template scope="scope">
                {{scope.row.paid == 0 ? '免费' : '付费'}}
              </template>
            </el-table-column>
            <el-table-column prop="conditions" label="文件分类" min-width="180"></el-table-column>
            <el-table-column label="文件名" min-width="180">
              <template scope="scope">
                <a :href="downloadLink" target="_blank">{{scope.row.files ? scope.row.files[0].fileName : ''}}</a>
              </template>
            </el-table-column>
            <el-table-column label="上传日期" width="120">
              <template scope="scope">
                {{scope.row.createTime ? jst.timestampFormat(Number(scope.row.createTime), 'Y-m-d') : ''}}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="t-c pading-t20" v-if="layerTaskForm.status != executed">
        <el-button @click="submitTask(layerTaskForm.tableIndex)" type="primary" class="large-btn">提交任务</el-button>
        <el-button @click="showTaskLayer('')" type="cancel" class="large-btn">重置</el-button>
      </div>
    </el-col>

    <!--推送条件查询-->
    <el-dialog title="推送条件查询" v-model="dialogFormPushCondition" :close-on-click-modal="false">
      <v-push-search-condition :visible="dialogFormPushCondition" @click-choice="changeChoiceCondition"></v-push-search-condition>
    </el-dialog>

    <!--推送内容查询-->
    <el-dialog title="推送内容查询" v-model="dialogFormPushContent" :close-on-click-modal="false">
      <v-push-search-content :visible="dialogFormPushContent" @click-choice="changeChoiceContent"></v-push-search-content>
    </el-dialog>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import { CHANGE_PENDING } from 'store/globalStore'
  import pushSearchContent from './pushSearchContent.vue'
  import pushSearchCondition from './pushSearchCondition.vue'
  import { PUSH_TASK_GET_LIST, PUSH_TASK_ADD_UPDATE, PUSH_TASK_DELETE } from 'store/modules/pushStore'
  import { CONTENT_FILE_GET_URL } from 'store/modules/contentStore'
  import * as jst from 'js-common-tools'
  import * as CONFIG from '../../config/'
  import * as CODE from '../../config/code'
  import * as MSG from '../../config/messages'
  import { cleanFormEmptyValue, globalErrorPrint, date2secondsTimestamp, errorMessage, judgeNotNetwork } from '../../utils/'
  export default {
    name: 'pushTaskList',
    components: {
      'v-push-search-content': pushSearchContent,
      'v-push-search-condition': pushSearchCondition
    },
    data () {
      return {
        jst: jst,
        executed: 1, // 1 已执行； 0 未执行
        // 查询任务表单数据
        searchForm: {
          status: '',
          title: '',
          startTime: '',
          endTime: ''
        },
        tableData: [], // 任务调度list
        addUpdateTableData: [], // 新增选后内容后的table的数据
        currentPage: 1,
        totalSize: 1,
        pageSize: CONFIG.PAGE_SIZE,
        dialogFormVisible: false, // 新增更新任务 默认false
        dialogFormPushCondition: false, // 条件查询 默认false
        dialogFormPushContent: false, // 内容查询 默认false
        listPageVisible: true, // 列表页面和新增页面
        // 新增、更新任务表单数据
        layerTaskForm: {
          id: '',
          title: '', // 推送标题
          content: '', // 推送显示内容
          resIds: '', // 推送内容ID集合
          strIds: '', // 推送策略集合
          conditionName: '',
          resName: '',
          pushTime: '', // 推送时间，utc时间戳（秒）
          status: null,
          tableIndex: 0,
          isEdit: false, // 是否是编辑框 true编辑 false新增
          isExec: false // 是否已经执行 true已执行 false未执行
        },
        downloadLink: '',
        phaseMap: {
          0: '小学',
          1: '初中',
          2: '高中'
        },
        formLabelWidth: '120px'
      }
    },
    mounted () {
      // 初始化页面
      this.getTaskLit()
    },
    methods: {
      ...mapActions([CHANGE_PENDING, PUSH_TASK_GET_LIST, PUSH_TASK_ADD_UPDATE, PUSH_TASK_DELETE, CONTENT_FILE_GET_URL]),
      /**
       * 删除任务数据
       */
      deleteRow (index, rowData) {
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.CHANGE_PENDING(true)
          this.PUSH_TASK_DELETE({id: rowData.id}).then(res => {
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
            this.CHANGE_PENDING(false)
            if (judgeNotNetwork(this, err)) {
              return
            }
            this.$message.error(MSG.DELETE_FAIL_MSG)
          })
        }).catch(() => {
          // 此处是取消回调，但不需要做任何处理。必须加上catch否则会报错
        })
      },

      /**
       * 显示并处理任务弹出层
       */
      showTaskLayer (index, rowData) {
        if (rowData && typeof rowData === 'object') {
          this.layerTaskForm.isEdit = true
          this.layerTaskForm.tableIndex = index
          let conditions = ''
          let contents = rowData.contents[0]
          this.downloadFile(contents)
          conditions = contents.cateName ? ` ${contents.cateName} >` : ''
          conditions += contents.phaseCateName ? ` ${contents.phaseCateName} >` : ''
          conditions += contents.subjectCateName ? ` ${contents.subjectCateName} >` : ''
          conditions += contents.editionCateName ? ` ${contents.editionCateName} >` : ''
          conditions += contents.gradeCateName ? ` ${contents.gradeCateName} >` : ''
          conditions = conditions.substr(0, conditions.length - 1)
          this.addUpdateTableData = [Object.assign({}, contents, {
            conditions: conditions
          })]
          Object.assign(this.layerTaskForm, rowData, {
            pushTime: jst.timestampFormat(rowData.pushTime, 'Y-m-d H:i:s'),
            conditionName: rowData.strategies[0] ? rowData.strategies[0].title : '',
            resName: rowData.contents[0] ? rowData.contents[0].title : ''
          })
          if (rowData.status == this.executed) {
            this.layerTaskForm.isExec = true
          } else {
            this.layerTaskForm.isExec = false
          }
          this.dialogFormVisible = true
        } else {
          for (let item in this.layerTaskForm) {
            this.layerTaskForm[item] = ''
          }
          this.addUpdateTableData = []
          this.layerTaskForm.isEdit = false
          this.layerTaskForm.isExec = false
          this.listPageVisible = false
        }
      },

      /**
       * 提交任务
       */
      submitTask () {
        let {pushTime, title, resIds, strIds, content} = this.layerTaskForm
        if (new Date(pushTime).getTime() < new Date().getTime()) {
          errorMessage(this, '执行推送时间必须在现在时以后')
          return
        }
        if (title && resIds && strIds && pushTime && content) {
          let newParam = cleanFormEmptyValue(this.layerTaskForm)
          Object.assign(newParam, {
            resIds: typeof resIds === 'string' ? [resIds] : resIds,
            strIds: typeof strIds === 'string' ? [strIds] : strIds,
            pushTime: new Date(pushTime).getTime() / 1000
          })
          this.CHANGE_PENDING(true)
          this.PUSH_TASK_ADD_UPDATE(newParam).then(res => {
            if (res.code == CODE.SUCCESS) {
              if (this.layerTaskForm.isEdit) {
                Object.assign(this.tableData[this.layerTaskForm.tableIndex], this.layerTaskForm)
                this.$message({
                  type: 'success',
                  message: '更新成功'
                })
              } else {
                this.getTaskLit()
                this.$message({
                  type: 'success',
                  message: '新增成功'
                })
              }
              this.CHANGE_PENDING(false)
              this.dialogFormVisible = false
              this.listPageVisible = true
            } else {
              this.layerTaskForm.isEdit ? this.$message.error(MSG.UPDATE_FAIL_MSG) : this.$message.error(MSG.ADD_FAIL_MSG)
            }
          }).catch(err => {
            globalErrorPrint(err)
            this.CHANGE_PENDING(false)
            if (judgeNotNetwork(this, err)) {
              return
            }
            this.layerTaskForm.isEdit ? this.$message.error(MSG.UPDATE_FAIL_MSG) : this.$message.error(MSG.ADD_FAIL_MSG)
          })
        } else {
          errorMessage(this, '（任务名称/推送条件/推送内容/执行时间/推送显示内容）都必须填写')
        }
      },

      /**
       * 查询任务表单数据
       */
      searchTaskData () {
        let {startTime, endTime} = this.searchForm
        if (startTime > endTime) {
          errorMessage(this, MSG.STARTTIME_GREATER_THAN_ENDTIME_MSG)
          return
        }
        this.currentPage = 1 // 设置为第一页
        this.getTaskLit()
      },

      /**
       * 获取任务列表
       */
      getTaskLit () {
        this.CHANGE_PENDING(true)
        let {startTime, endTime} = this.searchForm
        let newParm = {
          startTime: startTime ? date2secondsTimestamp(startTime) : null,
          endTime: endTime ? date2secondsTimestamp(endTime) : null,
          page: this.currentPage,
          pageSize: this.pageSize
        }
        let newForm = cleanFormEmptyValue(this.searchForm)
        let params = Object.assign({}, newForm, newParm)
        this.PUSH_TASK_GET_LIST(params).then(res => {
          if (res.code == CODE.SUCCESS) {
            let newData = res.data.items.map((item) => {
              item.taskConditions = item.strategies[0] && item.strategies[0].provinceName ? ` ${item.strategies[0].provinceName} >` : ''
              item.taskConditions += item.strategies[0] && item.strategies[0].cityName ? ` ${item.strategies[0].cityName} >` : ''
              item.taskConditions += item.strategies[0] && item.strategies[0].countyName ? ` ${item.strategies[0].countyName} >` : ''
              item.taskConditions += item.strategies[0] && item.strategies[0].schoolName ? ` ${item.strategies[0].schoolName} >` : ''
              item.taskConditions += item.strategies[0] && item.strategies[0].phase !== null ? ` ${this.phaseMap[item.strategies[0].phase]} >` : ''
              item.taskConditions += item.strategies[0] && item.strategies[0].gradeName ? ` ${item.strategies[0].gradeName} >` : ''
              item.taskConditions = item.taskConditions.substr(0, item.taskConditions.length - 1)
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
       * 下载文件
       * @param rowData
       */
      downloadFile (rowData) {
        let {files, resId} = rowData
        let params = {
          resId: resId,
          fileKey: files[0].fileKey
        }
        this.CONTENT_FILE_GET_URL(params).then(res => {
          if (res.code == CODE.SUCCESS) {
            this.downloadLink = `${res.data.url}&d=true`
          }
        }).catch((err) => {
          globalErrorPrint(err)
          if (judgeNotNetwork(this, err)) {
            return
          }
        })
      },

      /**
       * 清除查询任务表单数据
       */
      clearFormData () {
        for (let item in this.searchForm) {
          this.searchForm[item] = ''
        }
      },

      /**
       * 绑定推送条件查询弹出层的选择数据
       */
      changeChoiceCondition (parms) {
        this.layerTaskForm.conditionName = parms.choiceData.title
        this.layerTaskForm.strIds = parms.choiceData.id
        this.dialogFormPushCondition = parms.dialogVisible
      },

      /**
       * 绑定内容查询弹出层的选择数据
       */
      changeChoiceContent (parms) {
        this.layerTaskForm.resName = parms.choiceData.title
        this.layerTaskForm.resIds = parms.choiceData.resId
        this.downloadFile(parms.choiceData)
        this.addUpdateTableData = []
        this.addUpdateTableData.push(parms.choiceData)
        this.dialogFormPushContent = parms.dialogVisible
      },

      /**
       * 显示（推送条件）查询
       */
      showPushConditionLayer () {
        this.dialogFormPushCondition = true
      },

      /**
       * 显示（推送内容）查询
       */
      showPushContentLayer () {
        this.dialogFormPushContent = true
      },
      /**
       * 点击分页码
       * @param val 页码
       */
      handleCurrentChange (val) {
        this.currentPage = val
        this.getTaskLit()
      }
    }
  }
</script>
