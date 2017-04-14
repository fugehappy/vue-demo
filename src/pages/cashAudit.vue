<!--Copyright (C) 2017 QIANKUN HANLIN Corporation Limited-->
<!--提现审核列表页-->
<template>
  <div class="fileaudit-wrap">
    <el-row>
      <h3 class="top-title">提现审核</h3>
    </el-row>
    <v-divline></v-divline>
    <div class="fix-wrapper">
      <table class="table-custom" width="100%">
        <tr>
          <td>
            <label>
              <span>提现方式</span>
              <el-select v-model="searchForm.platform" :disabled="true" placeholder="请选择">
                <el-option label="支付宝" :value="1"></el-option>
                <el-option label="微信" :value="2"></el-option>
              </el-select>
            </label>
          </td>
          <td>
            <label>
              <span>状态</span>
              <el-select v-model="searchForm.status" placeholder="请选择">
                <el-option label="未处理" :value="0"></el-option>
                <el-option label="已打款" :value="1"></el-option>
                <el-option label="已驳回" :value="2"></el-option>
              </el-select>
            </label>
          </td>
          <td>
            <label>
              <span>收款账号</span>
              <el-input v-model="searchForm.tdAccount" :maxlength="50" class="text-input"></el-input>
            </label>
          </td>
          <td>
            <label>
              <span>收款人名</span>
              <el-input v-model="searchForm.userName" :maxlength="20" class="text-input"></el-input>
            </label>
          </td>
        </tr>
        <tr>
          <td>
            <label>
              <span>申请日期起</span>
              <el-date-picker type="date" placeholder="选择日期" v-model="searchForm.startTime"></el-date-picker>
            </label>
          </td>
          <td>
            <label>
              <span>申请日期止</span>
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
    <!-- 数据列表 -->
    <div class="fix-wrapper">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" label="序号" width="70">
          <template scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="userId" label="登陆账户" min-width="120"></el-table-column>
        <el-table-column prop="tdUsername" label="收款人名" min-width="120"></el-table-column>
        <el-table-column prop="tdPlatform" label="提现方式" min-width="100">
          <template scope="scope">
            <span v-if="scope.row.tdPlatform == 1">支付宝</span>
            <span v-if="scope.row.tdPlatform == 2">微信</span>
          </template>
        </el-table-column>
        <el-table-column prop="tdAccount" label="提现账号" min-width="180"></el-table-column>
        <el-table-column prop="amount" label="金额" min-width="120"></el-table-column>
        <el-table-column label="申请日期" min-width="120">
          <template scope="scope">
            {{scope.row.createTime ? jst.timestampFormat(Number(scope.row.createTime), 'Y-m-d') : ''}}
          </template>
        </el-table-column>
        <el-table-column prop="adminId" label="操作人员" min-width="120"></el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template scope="scope"><!--提现状态，0 等待处理；1 已处理，提现成功；2 已处理，提现失败-->
            <a @click="showLayer(scope.$index, scope.row)" v-if="scope.row.status == 0" class="default-info">去审核</a>
            <a @click="showLayer(scope.$index, scope.row)" v-if="scope.row.status == 1" class="pass-info">已打款</a>
            <a @click="showLayer(scope.$index, scope.row)" v-if="scope.row.status == 2" class="notpass-info">已驳回</a>
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
    <el-dialog title="提现审核" v-model="dialogFormVisible"  :close-on-click-modal="false">
      <el-form :model="layerForm">
        <el-form-item label="登陆账号:" :label-width="formLabelWidth">
          <label>{{layerForm.userId}}</label>
        </el-form-item>
        <el-form-item label="收款人名:" :label-width="formLabelWidth">
          <label>{{layerForm.tdUsername}}</label>
        </el-form-item>
        <el-form-item label="支付方式:" :label-width="formLabelWidth">
          <span v-if="layerForm.tdPlatform == 1">支付宝</span>
          <span v-if="layerForm.tdPlatform == 2">微信</span>
        </el-form-item>
        <el-form-item label="提现账号:" :label-width="formLabelWidth">
          <label>{{layerForm.tdAccount}}</label>
        </el-form-item>
        <el-form-item label="提现金额:" :label-width="formLabelWidth">
          <label>{{layerForm.amount}}</label>
        </el-form-item>
        <el-form-item label="申请日期:" :label-width="formLabelWidth">
          <label>
            {{layerForm.createTime ? jst.timestampFormat(Number(layerForm.createTime), 'Y-m-d') : ''}}
          </label>
        </el-form-item>

        <v-divline></v-divline>

        <!--未审核状态-->
        <div v-if="layerForm.status == 0">
          <el-form-item label="*审核 操作:" :label-width="formLabelWidth">
            <el-select v-model="layerForm.auditOptionType" no-data-text="同意打款" change="changeAuditOption" placeholder="请选择">
              <el-option label="同意打款" :value="1"></el-option>
              <el-option label="驳回申请" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="* 审核评论:" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="layerForm.defaultComments" placeholder="请备注审批评论"></el-input>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth">
            <el-button @click="submitAudit(layerForm.tableIndex)" type="primary">提交审核</el-button>
            <el-button @click="dialogFormVisible = false">取消</el-button>
          </el-form-item>
        </div>
        <!--已打款状态-->
        <div v-if="layerForm.status == 1">
          <el-form-item :label-width="formLabelWidth">
            <label>已打款状态 {{layerForm.reason ? ', 原因：' + layerForm.reason : ''}}</label>
          </el-form-item>
        </div>
        <!--已驳回状态-->
        <div v-if="layerForm.status == 2">
          <el-form-item :label-width="formLabelWidth">
            <label>已驳回状态{{layerForm.reason ? ', 原因：' + layerForm.reason : ''}}</label>
          </el-form-item>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import {CHANGE_PENDING} from 'store/globalStore'
  import { WITHDRAW_APPLICATION_GET_LIST, WITHDRAW_APPLICATION_HANDLE } from 'store/modules/cashStore'
  import * as jst from 'js-common-tools'
  import * as CONFIG from '../config/'
  import * as CODE from '../config/code'
  import * as MSG from '../config/messages'
  import { globalErrorPrint, cleanFormEmptyValue, date2secondsTimestamp } from '../utils/'
  export default {
    name: 'cashAuditList',
    mounted () {
      // 初始化页面获取数据
      this.getList()
    },
    beforeUpdate () {
      this.changeAuditOption()
    },
    data () {
      return {
        jst: jst,
        searchForm: {
          platform: 1, // 支付平台 1 支付宝；2 微信
          tdAccount: '', // 提现帐号
          userName: '',
          startTime: '',
          endTime: '',
          status: ''
        },
        tableData: [],
        currentPage: 1,
        totalSize: 1,
        pageSize: CONFIG.PAGE_SIZE,
        dialogFormVisible: false,
        layerForm: {
          id: null,
          withdrawId: null,
          userName: '', //
          tdUsername: '', // 收款人名
          tdPlatform: null, //  提现平台，1 支付宝；2 微信
          tdAccount: null,
          amount: 0,
          createTime: null,
          adminId: 'admin',
          status: 0,
          auditOptionType: '',
          defaultComments: '',
          reason: null,
          tableIndex: 0
        },
        formLabelWidth: '120px'
      }
    },
    methods: {
      ...mapActions([CHANGE_PENDING, WITHDRAW_APPLICATION_GET_LIST, WITHDRAW_APPLICATION_HANDLE]),
      deleteRow (index, rows) {
        rows.splice(index, 1)
      },
      /**
       * 点击分页码
       */
      handleCurrentChange (val) {
        this.currentPage = val
        this.getList()
      },

      /**
       * 显示并处理弹出层
       */
      showLayer (index, rowData) {
        Object.assign(this.layerForm, rowData)
        this.layerForm.tableIndex = index
        this.dialogFormVisible = true
      },

      /**
       * 选择改变【审核 操作】select时的事件
       */
      changeAuditOption () {
        if (this.layerForm.auditOptionType == 1) {
          // 同意打款：通过接口立即支付，审核评论默认填充（时间+已打款，可以手动修改）
          this.layerForm.defaultComments = `已打款,${jst.timestampFormat(new Date().getTime(), 'Y-m-d H:i:s')}`
        } else if (this.layerForm.auditOptionType == 2) {
          // 驳回申请：审核评论默认填充（时间+驳回打款，可以手动修改）
          this.layerForm.defaultComments = `驳回打款,${jst.timestampFormat(new Date().getTime(), 'Y-m-d H:i:s')}`
        }
      },

      /**
       * 提交审核
       */
      submitAudit () {
        if (this.layerForm.auditOptionType && this.layerForm.defaultComments) {
          let {id, auditOptionType, defaultComments} = this.layerForm
          let newParam = {
            withdrawId: id,
            status: auditOptionType,
            reason: defaultComments
          }
          this.CHANGE_PENDING(true)
          this.WITHDRAW_APPLICATION_HANDLE(newParam).then((res) => {
            if (res.code == CODE.SUCCESS) {
              this.layerForm.status = auditOptionType
              this.layerForm.reason = defaultComments
              this.dialogFormVisible = false
              Object.assign(this.tableData[this.layerForm.tableIndex], this.layerForm)
            } else {
              this.$message.error('处理失败，请重新尝试')
            }
            this.CHANGE_PENDING(false)
          }).catch(() => {
            this.CHANGE_PENDING(false)
            this.$message.error('处理失败，请重新尝试')
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
        this.searchForm.platform = 1 // 支付宝；暂时只支持
      },

      /**
       * 查询表单数据
       */
      searchData () {
        let {startTime, endTime, phoneNo} = this.searchForm
        if (startTime > endTime) {
          this.$message.error(MSG.STARTTIME_GREATER_THAN_ENDTIME_MSG)
          return
        }
        if (phoneNo && !CONFIG.PHONENO_PATTERN.test(phoneNo)) {
          this.$message.error(MSG.PHONENO_PATTERN_ERR_MSG)
          return
        }
        this.currentPage = 1 // 设置为第一页
        this.getList()
      },

      /**
       * 获得列表数据
       */
      getList () {
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
        this.WITHDRAW_APPLICATION_GET_LIST(params).then((res) => {
          if (res.code == CODE.SUCCESS) {
            this.tableData = res.data.items
            this.totalSize = res.data.totalSize
            this.currentPage = res.data.currentPage
          } else {
            this.$message.error(MSG.GET_DATA_FAIL_MESSATE)
          }
          this.CHANGE_PENDING(false)
        }).catch((err) => {
          globalErrorPrint(err)
          this.$message.error(MSG.GET_DATA_FAIL_MESSATE)
          this.CHANGE_PENDING(false)
        })
      }
    }
  }
</script>
