<!--Copyright (C) 2017 -->
<!--广告管理页面-->
<template>
  <div class="fileaudit-wrap">
    <!-- 列表页面 -->
    <el-col v-if="listPageVisible">
      <el-row>
        <h3 class="top-title">
          <span>广告管理</span>
          <el-button @click="showLayer('')" type="primary" class="large-btn">新增</el-button>
        </h3>
      </el-row>
      <v-divline></v-divline>
      <!-- 搜索条件组合 begin -->
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
                <span>广告类型</span>
                <el-select v-model="searchForm.type" placeholder="请选择">
                  <el-option label="图片广告" :value="0"></el-option>
                  <el-option label="视频广告" :value="1"></el-option>
                </el-select>
              </label>
            </td>
            <td>
              <label>
                <span>广告名称</span>
                <el-input v-model="searchForm.title" class="text-input" placeholder="" :maxlength="100"></el-input>
              </label>
            </td>
            <td>
              <label>
                <span>创建日期起</span>
                <el-date-picker type="date" placeholder="选择日期" :editable="false" v-model="searchForm.startTime"></el-date-picker>
              </label>
            </td>
            <td>
              <label>
                <span>创建日期止</span>
                <el-date-picker type="date" placeholder="选择日期" :editable="false" v-model="searchForm.endTime"></el-date-picker>
              </label>
            </td>
          </tr>
        </table>
        <div class="buttons-wrap">
          <el-button type="cancel" @click="clearFormData" class="clear-icon"><i></i>清空</el-button>
          <el-button type="primary" @click="searchData" class="search-icon"><i></i>搜索</el-button>
        </div>
      </div>
      <!-- 搜索条件组合 end -->
      <v-divline></v-divline>
      <!-- 表格数据 -->
      <div class="fix-wrapper">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column type="index" label="序号" width="70">
            <template scope="scope">
              <span>{{scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="广告名称" width="180"></el-table-column>
          <el-table-column prop="type" label="类型" width="90">
            <template scope="scope">
              {{scope.row.type == 0 ? '图片' : '视频'}}
            </template>
          </el-table-column>
          <el-table-column prop="targetResTitle" label="文档名称" width="180"></el-table-column>
          <el-table-column label="广告展台地址" min-width="200">
            <template scope="scope">
              {{scope.row.type == 0 ? scope.row.bgImage : scope.row.videoUrl}}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="发布时间" width="120">
            <template scope="scope">
              {{jst.timestampFormat(scope.row.createTime, 'Y-m-d')}}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template scope="scope">
              <a @click="showLayer(scope.$index, scope.row)">更新</a>
              <a @click="deleteRow(scope.$index, scope.row)">删除</a>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!--打开嵌入的表单-->
      <el-dialog :title="(layerForm.isEdit ? '更新' : '新增') + '广告信息'" v-model="dialogFormVisible" top="10%" class="middle-dialog" :close-on-click-modal="false">
        <el-form :model="layerForm">
          <el-form-item label="* 广告名称" :label-width="formLabelWidth">
            <el-input v-model="layerForm.title" class="text-input" placeholder="" :maxlength="100"></el-input>
          </el-form-item>
          <el-form-item label="* 广告类型" :label-width="formLabelWidth">
            <el-select v-model="layerForm.type" @change="changeAdvType" :disabled="layerForm.isEdit" placeholder="请选择">
              <el-option label="图片广告" :value="0"></el-option>
              <el-option label="视频广告" :value="1"></el-option>
            </el-select>
          </el-form-item>

          <!--选择为图片时-->
          <div v-if="!isVideo">
            <el-form-item label="* 展示内容" :label-width="formLabelWidth">
              <el-input v-model="layerForm.bgImage" class="text-input" placeholder="请输入图片地址或选择图片" :disabled="layerForm.isEdit"></el-input>
              <label class="el-button el-button--default push-choice " :class="layerForm.isEdit ? 'is-disabled' : ''" id="imagePicker">
                <!--<input type="file" @change="choiceAdvBgFile($event, 1)" accept="image/png,image/gif,image/jpeg" :disabled="layerForm.isEdit" style="display: none"/>-->
                选择</label>
            </el-form-item>
          </div>
          <!--选择为视频时-->
          <div v-else>
            <el-form-item label="* 展示内容" :label-width="formLabelWidth">
              <el-input v-model="layerForm.videoUrl" class="text-input" placeholder="请输入视频地址或选择视频":disabled="layerForm.isEdit"></el-input>
              <label class="el-button el-button--default push-choice " :class="layerForm.isEdit ? 'is-disabled' : ''" id="vadeoPicker">
                <!--<input type="file" @change="choiceAdvBgFile($event, 2)" accept="video/mp4"  :disabled="layerForm.isEdit" style="display: none"/>-->
                选择</label>
            </el-form-item>
            <el-form-item label="* 视频背景" :label-width="formLabelWidth">
              <el-input v-model="layerForm.bgImage" class="text-input" placeholder="请输入图片地址或选择图片" :disabled="layerForm.isEdit"></el-input>
              <label class="el-button el-button--default push-choice" :class="layerForm.isEdit ? 'is-disabled' : ''" id="imagePicker">
                <!--<input type="file" @change="choiceAdvBgFile($event, 1)" :disabled="layerForm.isEdit" accept="image/png,image/gif,image/jpeg" style="display: none"/>-->
                选择
              </label>
            </el-form-item>
          </div>

          <el-form-item label="* 推广连接" :label-width="formLabelWidth">
            <el-input v-model="layerForm.targetResTitle" class="text-input" :readonly="true" placeholder="请选择"></el-input>
            <label class="el-button push-choice el-button--default push-choice" @click="showPushContentLayer">选择</label>
          </el-form-item>
          <el-form-item label="备注信息" :label-width="formLabelWidth">
            <el-input v-model="layerForm.remark" type="textarea" placeholder="请备注需要说明的补充信息" :maxlength="250"></el-input>
          </el-form-item>
        </el-form>
        <div class="t-c pading-t20">
          <el-button @click="submitAdv(layerForm.tableIndex)" type="primary" class="large-btn">提交广告</el-button>
          <el-button @click="dialogFormVisible = false" type="cancel" class="large-btn">取消</el-button>
        </div>
      </el-dialog>
    </el-col>

    <!-- 新增页面 -->
    <el-col v-else>
      <el-row>
        <h3 class="top-title">
          <span>新增广告信息</span>
          <el-button @click="listPageVisible = true" class="back-icon"><i></i>返回</el-button>
        </h3>
      </el-row>
      <v-divline></v-divline>
      <div class="fix-wrapper">
        <el-form :model="layerForm" style="width: 800px;margin: 0 auto;" method="post" id="uploadForm" role="form" enctype="multipart/form-data">
          <el-form-item label="* 广告名称" :label-width="formLabelWidth">
            <el-input v-model="layerForm.title" class="text-input" placeholder="" :maxlength="100"></el-input>
          </el-form-item>
          <el-form-item label="* 广告类型" :label-width="formLabelWidth">
            <el-select v-model="layerForm.type" @change="changeAdvType" :disabled="layerForm.isEdit" placeholder="请选择">
              <el-option label="图片广告" :value="0"></el-option>
              <el-option label="视频广告" :value="1"></el-option>
            </el-select>
          </el-form-item>

          <!--选择为图片时-->
          <div v-if="!isVideo">
            <el-form-item label="* 展示内容" :label-width="formLabelWidth">
              <el-input v-model="layerForm.bgImage" class="text-input" placeholder="请输入图片地址或选择图片" :disabled="layerForm.isEdit"></el-input>
              <label class="el-button el-button--default push-choice " :class="layerForm.isEdit ? 'is-disabled' : ''" id="imagePicker">
                <!--<input type="file" @change="choiceAdvBgFile($event, 1)" accept="image/png,image/gif,image/jpeg" :disabled="layerForm.isEdit" style="display: none"/>-->
                选择</label>
            </el-form-item>
          </div>
          <!--选择为视频时-->
          <div v-else>
            <el-form-item label="* 展示内容" :label-width="formLabelWidth">
              <el-input v-model="layerForm.videoUrl" class="text-input" placeholder="请输入视频地址或选择视频":disabled="layerForm.isEdit"></el-input>
              <label class="el-button el-button--default push-choice " :class="layerForm.isEdit ? 'is-disabled' : ''" id="vadeoPicker">
                <!--<input type="file" @change="choiceAdvBgFile($event, 2)" accept="video/mp4"  :disabled="layerForm.isEdit" style="display: none"/>-->
                选择</label>
            </el-form-item>
            <el-form-item label="* 视频背景" :label-width="formLabelWidth">
              <el-input v-model="layerForm.bgImage" class="text-input" placeholder="请输入图片地址或选择图片" :disabled="layerForm.isEdit"></el-input>
              <label class="el-button el-button--default push-choice" :class="layerForm.isEdit ? 'is-disabled' : ''" id="imagePicker">
                <!--<input type="file" @change="choiceAdvBgFile($event, 1)" :disabled="layerForm.isEdit" accept="image/png,image/gif,image/jpeg" style="display: none"/>-->
                选择
              </label>
            </el-form-item>
          </div>

          <el-form-item label="* 推广连接" :label-width="formLabelWidth">
            <el-input v-model="layerForm.targetResTitle" class="text-input" :readonly="true" placeholder="请选择"></el-input>
            <label class="el-button push-choice el-button--default push-choice" @click="showPushContentLayer">选择</label>
          </el-form-item>
          <el-form-item label="备注信息" :label-width="formLabelWidth">
            <el-input v-model="layerForm.remark" type="textarea" placeholder="请备注需要说明的补充信息" :maxlength="250"></el-input>
          </el-form-item>
        </el-form>
        <br>
        <div class="t-c pading-t20">
          <el-button @click="submitAdv(layerForm.tableIndex)" type="primary" class="large-btn">提交广告</el-button>
          <el-button @click="showLayer('')" type="cancel" class="large-btn">重置</el-button>
        </div>
      </div>
    </el-col>

    <!--推送内容查询-->
    <el-dialog title="推送内容查询" v-model="dialogFormPushContent" :close-on-click-modal="false">
      <v-push-search-content :visible="dialogFormPushContent" @click-choice="changeChoiceContent"></v-push-search-content>
    </el-dialog>
    <!-- 文件上传进度条 -->
    <v-uprogress :value="progressValue" v-if="progressVisible"></v-uprogress>
    <!-- 未安装flash提示 -->
    <el-dialog title="提示" v-model="installFlashVisible" size="tiny" class="" :close-on-click-modal="false">
      <br>
      <div class="flash-prompt">
        您尚未安装flash player或版本过低，将不能上传文件<br><br>
        <a class="log-xsend" href="https://get.adobe.com/cn/flashplayer/?no_redirect" target="_blank">点击此处</a>
        下载安装最新版本flash player
        <br><br>
        ps: 安装成功后刷新页面重试
      </div>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
  .flash-prompt{
    font-size: 16px;
    text-align: center;
  }
</style>
<script>
  import { mapActions } from 'vuex'
  import { CHANGE_PENDING, PLATFORM_UPLOAD_TOKEN_CREATE, STORAGE_UPLOAD } from 'store/globalStore'
  import { ADV_GET_LIST, ADV_ADD_UPDATE, ADV_DELETE } from 'store/modules/advStore'
  import pushSearchContent from 'pages/push/pushSearchContent.vue'
  import * as jst from 'js-common-tools'
  import * as CONFIG from '../config/'
  import * as CODE from '../config/code'
  import * as MSG from '../config/messages'
  import { globalErrorPrint, cleanFormEmptyValue, date2secondsTimestamp, errorMessage, judgeNotNetwork } from '../utils/'
  import { FlashUploadFile } from '../utils/flashupload'
  import { apiUrlConfig } from '../config/ApiConfig'
  export default {
    name: 'pushConditionList',
    components: {
      'v-push-search-content': pushSearchContent
    },
    mounted () {
      this.getList()
      // 获取上传token
      this.getUploadToken()
    },
    data () {
      let {uploadtoken} = this.$store.state._global
      return {
        jst: jst,
        uploadToken: uploadtoken,
        progressVisible: false, // 上传进度条
        progressValue: 0,
        loadCount: 0,
        searchForm: {
          title: '',
          type: '',
          startTime: '',
          endTime: ''
        },
        tableData: [], // 列表数据
        dialogFormVisible: false, // 更新新增dialog
        dialogFormPushContent: false, // 内容查询 dialog
        listPageVisible: true, // 列表页面和新增页面
        isVideo: false, // 是否为视频
        layerForm: {
          id: null,
          location: 'index_banner',
          type: '',
          title: null,
          bgImage: null, // 广告展台图片、视频背景
          videoUrl: null, // 视频
          targetResId: null, // 广告跳转的内容id
          targetResTitle: null,
          remark: null,
          tableIndex: 0
        },
        installFlashVisible: false, // 是否显示安装flash提示
        formLabelWidth: '120px'
      }
    },
    methods: {
      ...mapActions([CHANGE_PENDING, ADV_GET_LIST, ADV_ADD_UPDATE, ADV_DELETE, PLATFORM_UPLOAD_TOKEN_CREATE, STORAGE_UPLOAD]),
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
          this.ADV_DELETE({id: rowData.id}).then(res => {
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
            this.CHANGE_PENDING(false)
            if (judgeNotNetwork(this, err)) {
              return
            }
            globalErrorPrint(err)
            this.$message.error(MSG.DELETE_FAIL_MSG)
          })
        }).catch(() => {
          // 此处是取消回调，但不需要做任何处理。必须加上catch否则会报错
        })
      },

      /**
       * 获得列表数据
       */
      getList () {
        let {startTime, endTime} = this.searchForm
        let newParm = {
          startTime: startTime ? date2secondsTimestamp(startTime) : null,
          endTime: endTime ? date2secondsTimestamp(endTime, true) : null
        }
        let newForm = cleanFormEmptyValue(this.searchForm)
        let params = Object.assign({}, newForm, newParm)
        this.CHANGE_PENDING(true)
        this.ADV_GET_LIST(params).then((res) => {
          if (res.code == CODE.SUCCESS) {
            this.tableData = res.data
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
       * 选择文件错误
       * @param type 1 图片；2 视频
       * @notInstallFlash 未安装flash判断
       */
      selectFileErr (type, notInstallFlash) {
        if (notInstallFlash) {
          this.installFlashVisible = true
          document.getElementById('imagePicker').addEventListener('click', () => {
            this.installFlashVisible = true
          })
          return
        }
        if (type == 2) {
          this.$message.error(MSG.UPLOAD_VIDEO_FORMAT_ERR_MSG)
        } else {
          this.$message.error(MSG.UPLOAD_IMAGES_FORMAT_ERR_MSG)
        }
      },

      /**
       * 上传开始
       */
      startUpload () {
        this.progressValue = 0
        this.progressVisible = true // 上传进度条
      },

      /**
       * 上传进行中
       * @param file 上传的文件
       * @param percentage 上传中的进度
       */
      uploadProgress (file, percentage) {
        // 上传进度回调
        this.progressValue = Math.round(percentage * 100, 2) - 1 // 已经上传的百分比
      },

      /**
       * 上传成功
       * @param type 1图片， 2视频
       * @param file 上传成功的文件
       * @param res 返回结果
       */
      uploadSuccess (type, file, res) {
        if (res.code == CODE.SUCCESS) {
          let {bucketHost, fileKey} = res.data
          let url = `http://${bucketHost}/${fileKey}`
          if (type == 1) {
            this.layerForm.bgImage = url
          } else {
            this.layerForm.videoUrl = url
          }
        } else {
          this.$message.error(MSG.UPLOAD_FILE_FAIL_MSG)
        }
        setTimeout(() => {
          this.progressVisible = false
        }, 1000)
      },

      /**
       * 上传失败
       * @param err 错误信息
       */
      uploadError (err) {
        this.progressVisible = false
        globalErrorPrint(err)
        this.$message.error(MSG.UPLOAD_FILE_FAIL_MSG)
      },

      /**
       * 上传文件
       */
      initUploadAdvFile () {
        let uploadUrl = apiUrlConfig().storageUpload
        let imagePicker = document.getElementById('imagePicker')
        let vadeoPicker = document.getElementById('vadeoPicker')
        if (imagePicker) {
          imagePicker.innerHTML = '选择'
        }
        if (vadeoPicker) {
          vadeoPicker.innerHTML = '选择'
        }
        // 1图片， 2视频
        new FlashUploadFile().startUpload(1, uploadUrl, 'imagePicker', this.uploadtoken, this.selectFileErr, this.startUpload, this.uploadProgress, this.uploadSuccess, this.uploadError)
        new FlashUploadFile().startUpload(2, uploadUrl, 'vadeoPicker', this.uploadtoken, this.selectFileErr, this.startUpload, this.uploadProgress, this.uploadSuccess, this.uploadError)
      },

      /**
       * 选择背景图片
       * @param event 选择文件dom
       * @param type 1：对应图片选择 2：对应视频选择
       */
      choiceAdvBgFile (event, type) {
        if (!event.target.files) return
        let file = event.target.files[0]
        var formData = new FormData()
        formData.append('token', this.uploadtoken)
        formData.append('file', file)

        if (type == 2) {
          // 视频验证 (mp4)(5M以内)
          if (!CONFIG.VIDEO_PATTERN.test(file.type) || file.size > CONFIG.UPLOAD_VIDEO_MAX_SIZE) {
            this.$message.error(MSG.UPLOAD_VIDEO_FORMAT_ERR_MSG)
            return
          }
        } else {
          // 图片验证 (jpg，gif，png)(2M以内)
          if (!CONFIG.IMAGES_PATTERN.test(file.type) || file.size > CONFIG.UPLOAD_IMAGES_MAX_SIZE) {
            this.$message.error(MSG.UPLOAD_IMAGES_FORMAT_ERR_MSG)
            return
          }
        }
        this.progressValue = 0
        this.progressVisible = true // 上传进度条
        // 开始上传文件
        this.STORAGE_UPLOAD({
          formData: formData,
          onprogress: (evt) => {
            // 上传进度回调
            var loaded = evt.loaded // 已经上传大小情况
            var total = evt.total // 附件总大小
            var per = Math.floor(100 * loaded / total) // 已经上传的百分比
            this.progressValue = per
          }
        }).then(res => {
          if (res.code == CODE.SUCCESS) {
            let {bucketHost, fileKey} = res.data
            let url = `http://${bucketHost}/${fileKey}`
            if (type == 1) {
              this.layerForm.bgImage = url
            } else {
              this.layerForm.videoUrl = url
            }
          } else {
            this.$message.error(MSG.UPLOAD_FILE_FAIL_MSG)
          }
          setTimeout(() => {
            this.progressVisible = false
          }, 500)
        }).catch((err) => {
          globalErrorPrint(err)
          if (judgeNotNetwork(this, err)) {
            return
          }
          this.$message.error(MSG.UPLOAD_FILE_FAIL_MSG)
          this.progressVisible = false
        })
      },

      /**
       * 显示并处理弹出层
       */
      showLayer (index, rowData) {
        if (rowData && typeof rowData === 'object') {
          this.layerForm.isEdit = true
          this.layerForm.tableIndex = index
          Object.assign(this.layerForm, rowData)
          this.dialogFormVisible = true
        } else {
          for (let item in this.layerForm) {
            this.layerForm[item] = ''
          }
          this.layerForm.type = 0
          this.layerForm.isEdit = false
          this.listPageVisible = false
          setTimeout(() => {
            this.initUploadAdvFile()
          }, 300)
        }
      },

      /**
       * 提交
       */
      submitAdv () {
        let {title, targetResTitle, bgImage, videoUrl, targetResId} = this.layerForm

        if (this.isVideo) {
          // 如果是视频（标题，类型，推广链接，展示内容，背景图片以及视频，描述）不能为空
          if (!title || !targetResTitle || !targetResId || !videoUrl || !bgImage) {
            errorMessage(this, '（广告名称/广告类型/展示内容/视频背景/推广连接）都必须填写')
            return
          }
          if (!jst.isUrl(videoUrl)) {
            errorMessage(this, '展示内容格式不正确，请填写正确的视频地址')
            return
          }
          if (!jst.isUrl(bgImage)) {
            errorMessage(this, '视频背景图片格式不正确，请填写正确的图片地址')
            return
          }
        } else {
          // 如果是图片（标题，类型，推广链接，展示内容，描述）不能为空
          if (!title || !targetResTitle || !targetResId || !bgImage) {
            errorMessage(this, '（广告名称/广告类型/展示内容/推广连接）都必须填写')
            return
          }
          if (!jst.isUrl(bgImage)) {
            errorMessage(this, '展示内容格式不正确，请填写正确的图片地址')
            return
          }
        }
        let newParam = cleanFormEmptyValue(this.layerForm)
        this.CHANGE_PENDING(true)
        if (newParam.remark === null) newParam.remark = ''
        this.ADV_ADD_UPDATE(newParam).then((res) => {
          if (res.code == CODE.SUCCESS) {
            this.dialogFormVisible = false
            this.listPageVisible = true
            if (this.isEdit) {
              Object.assign(this.tableData[this.layerForm.tableIndex], this.layerForm)
            } else {
              this.getList()
            }
          } else {
            this.isEdit ? this.$message.error(MSG.UPDATE_FAIL_MSG) : this.$message.error(MSG.ADD_FAIL_MSG)
          }
          this.CHANGE_PENDING(false)
        }).catch((err) => {
          this.CHANGE_PENDING(false)
          if (judgeNotNetwork(this, err)) {
            return
          }
          this.isEdit ? this.$message.error(MSG.UPDATE_FAIL_MSG) : this.$message.error(MSG.ADD_FAIL_MSG)
        })
      },

      /**
       * 改变广告类型
       */
      changeAdvType () {
        // 0 图片， 1 视频
        if (this.layerForm.type == 1) {
          this.isVideo = true
        } else {
          this.isVideo = false
        }
        if (!this.layerForm.isEdit) this.layerForm.bgImage = ''
        setTimeout(() => {
          this.initUploadAdvFile()
        }, 300)
      },

      /**
       * 绑定内容查询弹出层的选择数据
       */
      changeChoiceContent (parms) {
        this.layerForm.targetResTitle = parms.choiceData.title
        this.layerForm.targetResId = parms.choiceData.resId
        this.dialogFormPushContent = parms.dialogVisible
      },

      /**
       * 显示（推送内容）查询
       */
      showPushContentLayer () {
        this.dialogFormPushContent = true
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
          errorMessage(this, MSG.STARTTIME_GREATER_THAN_ENDTIME_MSG)
          return
        }
        this.currentPage = 1 // 设置为第一页
        this.getList()
      },

      /**
       * 获取上传的token
       */
      getUploadToken () {
        this.PLATFORM_UPLOAD_TOKEN_CREATE({
          bucket: CONFIG.BUCKET_ADVERTISEMENT
        }).then(res => {
          if (res.code == CODE.SUCCESS) {
            this.uploadtoken = res.data.token
          } else {
            // 没有获取成功继续获取
            if (this.loadCount < CONFIG.LOAD_DATA_COUNT) {
              this.getUploadToken()
              this.loadCount++
            }
          }
        }).catch((err) => {
          globalErrorPrint(err)
          // 没有获取成功继续获取
          if (this.loadCount < CONFIG.LOAD_DATA_COUNT) {
            this.getUploadToken()
            this.loadCount++
          }
        })
      }
    }
  }
</script>
