<!--Copyright (C) 2017 QIANKUN HANLIN Corporation Limited-->
<!--用户认证列表页-->
<template>
  <div class="auth-wrap">
    <!-- 列表页面 begin -->
    <el-col v-show="!dialogFormVisible" :span="24">
      <el-row>
        <h3 class="top-title">用户认证</h3>
      </el-row>
      <v-divline></v-divline>
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
                <span>认证状态</span>
                <el-select v-model="searchForm.status" placeholder="请选择">
                  <el-option label="等待审核" :value="0"></el-option>
                  <el-option label="审核通过" :value="1"></el-option>
                  <el-option label="审核未通过" :value="2"></el-option>
                </el-select>
              </label>
            </td>
            <td>
              <label>
                <span>认证类型</span>
                <el-select v-model="searchForm.type" placeholder="请选择">
                  <el-option label="教师" :value="0"></el-option>
                  <el-option label="三方个人" :value="1"></el-option>
                  <el-option label="三方机构" :value="2"></el-option>
                </el-select>
              </label>
            </td>
            <td>
              <label>
                <span>翰林账号</span>
                <el-input v-model="searchForm.userId" placeholder="" :maxlength="32" class="text-input"></el-input>
              </label>
            </td>
            <td>
              <label>
                <span>用户手机</span>
                <div class="el-input text-input">
                  <input class="el-input__inner" v-model="searchForm.phoneNo" :maxlength="11"
                         @keyup="searchForm.phoneNo = searchForm.phoneNo.replace(/[^0-9]/, '')" placeholder="">
                </div>
              </label>
            </td>
          </tr>
          <tr>
            <td>
              <label>
                <span>申请时间起</span>
                <el-date-picker type="date" placeholder="选择日期" v-model="searchForm.startTime"></el-date-picker>
              </label>
            </td>
            <td>
              <label>
                <span>申请时间止</span>
                <el-date-picker type="date" placeholder="选择日期" v-model="searchForm.endTime"></el-date-picker>
              </label>
            </td>
            <td></td>
            <td></td>
          </tr>
        </table>
        <div class="buttons-wrap">
          <el-button type="cancel" @click="clearFormData" class="clear-icon"><i></i>清空</el-button>
          <el-button type="primary" @click="searchData" class="search-icon"><i></i>搜索</el-button>
        </div>
      </div>
      <v-divline></v-divline>
      <div class="fix-wrapper">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column label="序号" width="70">
            <template scope="scope">
              <span>{{scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="user.userId" label="翰林账号" min-width="180"></el-table-column>
          <el-table-column prop="user.phoneNo" label="用户手机" min-width="180"></el-table-column>
          <el-table-column label="认证类型" min-width="180">
            <template scope="scope">
              <span v-if="scope.row.type == 0">教师</span>
              <span v-if="scope.row.type == 1">三方个人</span>
              <span v-if="scope.row.type == 2">三方机构</span>
            </template>
          </el-table-column>
          <el-table-column label="认证状态" min-width="180">
            <template scope="scope">
              <span v-if="scope.row.status == 0">等待审核</span>
              <span v-if="scope.row.status == 1" class="pass-info">审核通过</span>
              <span v-if="scope.row.status == 2" class="notpass-info">审核未通过</span>
            </template>
          </el-table-column>
          <el-table-column label="申请日期" min-width="120">
            <template scope="scope">
              {{scope.row.createTime ? jst.timestampFormat(Number(scope.row.createTime), 'Y-m-d') : ''}}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template scope="scope">
              <a @click="showLayer(scope.$index, scope.row)" v-if="scope.row.status == 0">去认证</a>
              <a @click="showLayer(scope.$index, scope.row)" v-if="scope.row.status == 1 || scope.row.status == 2">查看详情</a>
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
    </el-col>
    <!-- 列表页面 end -->
    <!-- 审核详情页面 begin -->
    <el-col v-show="dialogFormVisible" :span="24">
      <!--打开嵌入的表单-->
      <el-row>
        <h3 class="top-title">
          <span>认证审核页面</span>
          <el-button @click="dialogFormVisible = false" class="back-icon"><i></i>返回</el-button>
        </h3>
      </el-row>
      <v-divline></v-divline>
      <div class="fix-wrapper" style="padding: 0 110px">
        <el-form label-width="72px">
          <div class="auth-block">
            <el-col :span="12">
              <el-form-item label="翰林账号:">
                <label>{{layerForm.userId}}</label>
              </el-form-item>
              <el-form-item label="真实姓名:">
                <label>{{layerForm.realname[0]}}</label>
              </el-form-item>
              <el-form-item label="认证类型:">
                <span v-if="layerForm.type == 0">教师</span>
                <span v-if="layerForm.type == 1">三方个人</span>
                <span v-if="layerForm.type == 2">三方机构</span>
              </el-form-item>
              <el-form-item label="认证状态:">
                <span v-if="layerForm.status == 0">等待审核</span>
                <span v-if="layerForm.status == 1" class="pass-info">审核通过</span>
                <span v-if="layerForm.status == 2" class="notpass-info">审核未通过</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="真实头像:" style="height: auto;">
                <img :src="layerForm.avatar[0]" class="photo" alt="真实头像">
              </el-form-item>
              <el-form-item label="申请时间:">
                <label>{{layerForm.createTime ? jst.timestampFormat(Number(layerForm.createTime), 'Y-m-d') : ''}}</label>
              </el-form-item>
            </el-col>
          </div>
          <v-divline></v-divline>
          <div class="auth-block">
            <el-col :span="12">
              <div class="sub-title pading-b20">身份证正面</div>
            </el-col>
            <el-col :span="12">
              <div class="sub-title pading-b20">身份证反面</div>
            </el-col>
            <el-col :span="12">
              <img :src="layerForm.identity[0]" @click="eImgClick($event)" class="identity" alt="身份证正面">

            </el-col>
            <el-col :span="12">
              <img :src="layerForm.identity[1]" class="identity" @click="eImgClick($event)" alt="身份证反面">
            </el-col>
            <el-col :span="24" class="pading-tb20">
              1.请上传身份证正面带有头像的扫描件或清晰照片<br>
              2.照片要求格式为JPG/JPEG/GIF/PNG，大小不要超过2M<br>
              注：您的证件信息不会被其他网友看到，我们将严格保密，请放心上传
            </el-col>
          </div>

          <v-divline></v-divline>
          <div class="auth-block">
            <el-col :span="24">
              <div class="sub-title pading-b20">认证材料</div>
            </el-col>
            <el-col :span="8" v-for="item in layerForm.credentials">
              <img :src="item" class="material" @click="eImgClick($event)" v-if="item" alt="认证材料">
            </el-col>
            <el-col :span="24" class="pading-tb20">
              1.请上传您的教师资格证、单位证明、资格证明等一切可证明专业身份的材料照片<br>
              2.照片要求格式为JPG/JPEG/GIF/PNG，大小不要超过3M<br>
              注：您的证件信息不会被其他网友看到，我们将严格保密，请放心上传
            </el-col>
          </div>
        </el-form>
        <el-form label-width="90px">
          <div v-if="layerForm.status == 0">
            <v-divline></v-divline>
            <div class="auth-block">
              <el-col :span="4">&nbsp;</el-col>
              <el-col :span="16">
                <el-form-item label="* 审核操作:">
                  <el-select v-model="layerForm.identiStatus" placeholder="请选择" class="text-mid-input">
                    <el-option label="审核通过" :value="1"></el-option>
                    <el-option label="审核驳回" :value="2"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="* 审核评论:">
                  <el-input type="textarea" v-model="layerForm.reason"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submit" class="large-btn">提交审核</el-button>
                  <el-button @click="resetSubmitData" type="cancel" class="large-btn">重置</el-button>
                </el-form-item>
              </el-col>
              <el-col :span="4">&nbsp;</el-col>
            </div>
          </div>
        </el-form>
      </div>
      <!--假设这里放的是views的组件-->
      <transition name="ts">
        <v-imgviews v-if="isImgViewsShow" :src="imgViewsSrc" @clickit="eImgViewClick"></v-imgviews>
      </transition>
    </el-col>
    <!-- 审核详情页面 begin -->
  </div>
</template>
<style lang="scss" scoped>
  .auth-wrap img{
    max-width: 95%;
  }
</style>
<script>
  import { mapActions } from 'vuex'
  import { CHANGE_PENDING } from 'store/globalStore'
  import { IDENTIFICATION_GET_LIST, IDENTIFICATION_UPDATE } from '../../store/modules/userStore'
  import * as jst from 'js-common-tools'
  import * as CODE from '../../config/code'
  import * as CONFIG from '../../config/'
  import * as MSG from '../../config/messages'
  import { cleanFormEmptyValue, date2secondsTimestamp, errorMessage, judgeNotNetwork } from '../../utils/'
  export default {
    name: 'authList',
    mounted () {
      this.getData()
    },
    data () {
      return {
        jst: jst,
        searchForm: {
          userId: null,
          phoneNo: null,
          type: null, // 认证类型， 0 教师； 1 三方个人； 2 三方机构
          status: null, // 认证状态 ，0 等待审核；1 审核通过；2 审核未通过
          startTime: null,
          endTime: null
        },
        dialogFormVisible: false,
        tableData: [],
        currentPage: 1,
        totalSize: 1,
        pageSize: CONFIG.PAGE_SIZE,
        layerForm: {
          identificationId: null, // 资料认证信息ID
          identiStatus: 0, // 提交状态
          reason: null, // 审核未通过时的原因
          userId: null,
          type: null,
          status: null,
          createTime: null,
          realname: [],
          avatar: [],
          identity: [],
          credentials: []
        },
        isImgViewsShow: false,
        imgViewsSrc: ''
      }
    },
    methods: {
      ...mapActions([CHANGE_PENDING, IDENTIFICATION_GET_LIST, IDENTIFICATION_UPDATE]),
      /**
       * 点击页面中的图片
       */
      eImgClick (e) {
        this.isImgViewsShow = true
        this.imgViewsSrc = e.currentTarget.src
      },

      /**
       * 点击预览图层
       */
      eImgViewClick () {
        this.isImgViewsShow = false
      },
      /**
       * 点击分页码
       */
      handleCurrentChange (val) {
        this.currentPage = val
        this.getData()
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
       * 显示并处理弹出层
       */
      showLayer (index, rowData) {
        for (let item in this.layerForm) {
          if (this.layerForm[item] instanceof Array) {
            this.layerForm[item] = []
          } else {
            this.layerForm[item] = ''
          }
        }
        let {id, user, type, status, createTime, detail} = rowData
        let detailData = {
          identificationId: id,
          userId: user.userId,
          type: type,
          status: status,
          createTime: createTime
        }
        detail.map(item => {
          // 真实姓名
          if (item.key == 'realname') {
            detailData.realname = item.values
          }
          // 真实头像地址
          if (item.key == 'avatar') {
            detailData.avatar = item.values
          }
          // 身份证信息
          if (item.key == 'identity') {
            detailData.identity = item.values
          }
          // 证件信息
          if (item.key == 'credentials') {
            detailData.credentials = item.values
          }
        })
        detailData.tableIndex = index
        Object.assign(this.layerForm, detailData)
        this.dialogFormVisible = true
      },

      /**
       * 查询表单数据
       */
      searchData () {
        let {startTime, endTime, phoneNo} = this.searchForm
        if (startTime > endTime) {
          errorMessage(this, MSG.STARTTIME_GREATER_THAN_ENDTIME_MSG)
          return
        }
        if (phoneNo && !CONFIG.PHONENO_PATTERN.test(phoneNo)) {
          errorMessage(this, MSG.PHONENO_PATTERN_ERR_MSG)
          return
        }
        this.currentPage = 1 // 设置为第一页
        this.getData()
      },

      /**
       * 获取数据
       */
      getData () {
        let {startTime, endTime} = this.searchForm
        let newParm = {
          startTime: startTime ? date2secondsTimestamp(startTime) : null,
          endTime: endTime ? date2secondsTimestamp(endTime, true) : null,
          page: this.currentPage,
          pageSize: this.pageSize
        }
        let newForm = cleanFormEmptyValue(this.searchForm)
        let params = Object.assign({}, newForm, newParm)
        this.CHANGE_PENDING(true)
        this.IDENTIFICATION_GET_LIST(params).then(res => {
          if (res.code == CODE.SUCCESS) {
            this.tableData = res.data.items
            this.totalSize = res.data.totalSize
            this.pageSize = res.data.pageSize
            this.currentPage = res.data.currentPage
          } else {
            this.$message.error(MSG.GET_DATA_FAIL_MESSATE)
          }
          this.CHANGE_PENDING(false)
        }).catch((err) => {
          this.CHANGE_PENDING(false)
          if (judgeNotNetwork(this, err)) {
            return
          }
          this.$message.error(MSG.GET_DATA_FAIL_MESSATE)
        })
      },

      /**
       * 提交审核认证
       */
      submit () {
        let {identificationId, identiStatus, reason, tableIndex} = this.layerForm
        if (!identiStatus) {
          errorMessage(this, '请选择审核操作是否通过')
          return
        }
        // 1 通过，2驳回
        if (identiStatus == 2 && !reason.trim()) {
          errorMessage(this, '审核驳回，请填写原因')
          return
        }
        let params = {
          identificationId: identificationId,
          status: identiStatus,
          reason: reason
        }

        this.CHANGE_PENDING(true)
        this.IDENTIFICATION_UPDATE(params).then(res => {
          if (res.code == CODE.SUCCESS) {
            this.tableData[tableIndex].status = identiStatus
            this.dialogFormVisible = false
          } else {
            this.$message.error(MSG.UPDATE_FAIL_MSG)
          }
          this.CHANGE_PENDING(false)
        }).catch((err) => {
          this.CHANGE_PENDING(false)
          if (judgeNotNetwork(this, err)) {
            return
          }
          this.$message.error(MSG.UPDATE_FAIL_MSG)
        })
      },

      /**
       * 重置提交的内容
       */
      resetSubmitData () {
        this.layerForm.identiStatus = ''
        this.layerForm.reason = ''
      }
    }
  }

</script>
