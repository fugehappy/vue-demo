<!--Copyright (C) 2017 QIANKUN HANLIN Corporation Limited-->
<!--广告管理页面-->
<template>
  <div class="fileaudit-wrap">
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
              <el-input v-model="searchForm.title" class="text-input" placeholder="请输入" :maxlength="100"></el-input>
            </label>
          </td>
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
        </tr>
      </table>
      <div class="buttons-wrap">
        <el-button type="primary" @click="searchData" class="search-icon"><i></i>搜索</el-button>
        <el-button type="cancel" @click="clearFormData" class="clear-icon"><i></i>清除</el-button>
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
        <el-table-column prop="updateTime" label="发布时间" width="120">
          <template scope="scope">
            {{jst.timestampFormat(scope.row.updateTime, 'Y-m-d')}}
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
    <el-dialog :title="(layerForm.isEdit ? '更新' : '新增') + '广告信息'" v-model="dialogFormVisible" :close-on-click-modal="false">
      <el-form :model="layerForm">
        <el-form-item label="* 广告名称" :label-width="formLabelWidth">
          <el-input v-model="layerForm.title" class="text-input" placeholder="请输入" :maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="* 广告类型" :label-width="formLabelWidth">
          <el-select v-model="layerForm.type" @change="changeAdvType" :value="getAdvTypeText" :disabled="layerForm.isEdit" placeholder="请选择">
            <el-option :value="0">图片广告</el-option>
            <el-option :value="1">视频广告</el-option>
          </el-select>
        </el-form-item>

        <!--选择为图片时-->
        <div v-if="!isVideo">
          <el-form-item label="* 展示内容" :label-width="formLabelWidth">
            <el-input v-model="layerForm.bgImage" class="text-input" placeholder="请输入图片地址或选择图片" :disabled="layerForm.isEdit"></el-input>
            <label class="el-button el-button--default push-choice " :class="layerForm.isEdit ? 'is-disabled' : ''">
              <input type="file" @change="choiceAdvBgFile($event, 1)" accept="image/png,image/gif,image/jpeg" :disabled="layerForm.isEdit" style="display: none"/>
              选择</label>
          </el-form-item>
        </div>
        <!--选择为视频时-->
        <div v-else>
          <el-form-item label="* 展示内容" :label-width="formLabelWidth">
            <el-input v-model="layerForm.videoUrl" class="text-input" placeholder="请输入视频地址或选择视频":disabled="layerForm.isEdit"></el-input>
            <label class="el-button el-button--default push-choice " :class="layerForm.isEdit ? 'is-disabled' : ''">
              <input type="file" @change="choiceAdvBgFile($event, 2)" accept="video/mp4"  :disabled="layerForm.isEdit" style="display: none"/>
              选择</label>
          </el-form-item>
          <el-form-item label="* 视频背景" :label-width="formLabelWidth">
            <el-input v-model="layerForm.bgImage" class="text-input" placeholder="请输入图片地址或选择图片" :disabled="layerForm.isEdit"></el-input>
            <label class="el-button el-button--default push-choice" :class="layerForm.isEdit ? 'is-disabled' : ''">
              <input type="file" @change="choiceAdvBgFile($event, 1)" :disabled="layerForm.isEdit" accept="image/png,image/gif,image/jpeg" style="display: none"/>选择
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

        <el-form-item :label-width="formLabelWidth">
          <el-button @click="submitAdv(layerForm.tableIndex)" type="primary" class="large-btn">提交广告</el-button>
          <el-button @click="dialogFormVisible = false" type="cancel" class="large-btn">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--推送内容查询-->
    <el-dialog title="推送内容查询" v-model="dialogFormPushContent" size="large" :close-on-click-modal="false">
      <v-push-search-content @click-choice="changeChoiceContent"></v-push-search-content>
    </el-dialog>
    <!-- 文件上传进度条 -->
    <v-uprogress :value="progressValue" v-if="progressVisible"></v-uprogress>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import { CHANGE_PENDING, PLATFORM_UPLOAD_TOKEN_CREATE, STORAGE_UPLOAD } from 'store/globalStore'
  import { ADV_GET_LIST, ADV_ADD_UPDATE, ADV_DELETE } from 'store/modules/advStore'
  import pushSearchContent from 'pages/push/pushSearchContent.vue'
  import * as jst from 'js-common-tools'
  import * as CONFIG from '../config/'
  import * as CODE from '../config/code'
  import * as MSG from '../config/messages'
  import { globalErrorPrint, cleanFormEmptyValue, date2secondsTimestamp } from '../utils/'
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
        formLabelWidth: '120px'
      }
    },
    computed: {
      getAdvTypeText: function () {
        let {type} = this.layerForm
        // 0 图片， 1 视频
        if (type != 0 && type != 1) {
          return ''
        } else {
          return type == 0 ? '图片广告' : '视频广告'
        }
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
            globalErrorPrint(err)
            this.$message.error(MSG.DELETE_FAIL_MSG)
            this.CHANGE_PENDING(false)
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
          endTime: endTime ? date2secondsTimestamp(endTime) : null
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
        }).catch(() => {
          this.$message.error(MSG.GET_DATA_FAIL_MESSATE)
          this.CHANGE_PENDING(false)
        })
      },

      /**
       * 选择背景图片
       * @param event 选择文件dom
       * @param type 1：对应图片选择 2：对应视频选择
       */
      choiceAdvBgFile (event, type) {
        let file = event.target.files[0]
        var formData = new FormData()
        formData.append('token', this.uploadtoken)
        formData.append('file', file)

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
        } else {
          for (let item in this.layerForm) {
            this.layerForm[item] = ''
          }
          this.layerForm.type = 0
          this.layerForm.isEdit = false
        }
        this.dialogFormVisible = true
      },

      /**
       * 提交
       */
      submitAdv () {
        let {title, targetResTitle, bgImage, videoUrl, targetResId} = this.layerForm

        if (this.isVideo) {
          // 如果是视频（标题，类型，推广链接，展示内容，背景图片以及视频，描述）不能为空
          if (!title || !targetResTitle || !targetResId || !videoUrl || !bgImage) {
            this.$message.error('（广告名称/广告类型/展示内容/视频背景/推广连接）都必须填写')
            return
          }
          if (!jst.isUrl(videoUrl)) {
            this.$message.error('展示内容格式不正确，请填写正确的视频地址')
            return
          }
          if (!jst.isUrl(bgImage)) {
            this.$message.error('视频背景图片格式不正确，请填写正确的图片地址')
            return
          }
        } else {
          // 如果是图片（标题，类型，推广链接，展示内容，描述）不能为空
          if (!title || !targetResTitle || !targetResId || !bgImage) {
            this.$message.error('（广告名称/广告类型/展示内容/推广连接）都必须填写')
            return
          }
          if (!jst.isUrl(bgImage)) {
            this.$message.error('展示内容格式不正确，请填写正确的图片地址')
            return
          }
        }
        let newParam = cleanFormEmptyValue(this.layerForm)
        this.CHANGE_PENDING(true)
        this.ADV_ADD_UPDATE(newParam).then((res) => {
          if (res.code == CODE.SUCCESS) {
            this.dialogFormVisible = false
            if (this.isEdit) {
              Object.assign(this.tableData[this.layerForm.tableIndex], this.layerForm)
            } else {
              this.getList()
            }
          } else {
            this.isEdit ? this.$message.error(MSG.UPDATE_FAIL_MSG) : this.$message.error(MSG.ADD_FAIL_MSG)
          }
          this.CHANGE_PENDING(false)
        }).catch(() => {
          this.CHANGE_PENDING(false)
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
          this.layerForm.bgImage = ''
        }
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
          this.$message.error(MSG.STARTTIME_GREATER_THAN_ENDTIME_MSG)
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
