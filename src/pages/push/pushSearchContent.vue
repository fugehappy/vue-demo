<!--Copyright (C) 2017 QIANKUN HANLIN Corporation Limited-->
<!--推送内容查询的弹出层-->
<template>
  <div>
    <div class="scroll-content">
      <el-form ref="searchContentForm" :model="searchContentForm" label-width="80px">
        <el-col :span="24">
          <el-col :span="12">
            <el-form-item label="付费类型">
              <el-select v-model="searchContentForm.paid" placeholder="请选择">
                <el-option label="公开免费" :value="0"></el-option>
                <el-option label="公开付费" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分类">
              <el-select v-model="selectsObj.categoryValue" placeholder="请选择" @change="changeSelect('cate', $event,  selectsObj, cateRootObj)">
                <el-option v-for="item in selectsObj.categoryData" :label="item.name" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span="24">
          <el-col :span="12">
            <el-form-item label="学段">
              <el-select v-model="selectsObj.sectionValue" :disabled="selectsObj.categoryValue ? false : true" placeholder="请选择" @change="changeSelect('section',  $event, selectsObj, cateRootObj)">
                <el-option v-for="item in selectsObj.sectionData" :label="item.name" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学科">
              <el-select v-model="selectsObj.courseValue" :disabled="selectsObj.sectionValue && selectsObj.courseData ? false : true"
                         placeholder="请选择" @change="changeSelect('course', $event, selectsObj, cateRootObj)">
                <el-option v-for="item in selectsObj.courseData" :label="item.name" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span="24">
          <el-col :span="12">
            <el-form-item label="版本">
              <el-select v-model="selectsObj.versionValue" :disabled="selectsObj.courseValue && selectsObj.versionData ? false : true"
                         placeholder="请选择" @change="changeSelect('version', $event, selectsObj, cateRootObj)">
                <el-option v-for="item in selectsObj.versionData" :label="item.name" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年级">
              <el-select v-model="selectsObj.gradeValue" :disabled="selectsObj.versionValue && selectsObj.gradeData ? false : true"
                         placeholder="请选择" @change="changeSelect('grade', $event, selectsObj, cateRootObj)">
                <el-option v-for="item in selectsObj.gradeData" :label="item.name" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-col>

        <el-col :span="24">
          <el-col :span="12">
            <el-form-item label="上传者">
              <el-input v-model="searchContentForm.userId" placeholder="请输入" class="text-mid-input"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号">
              <el-input v-model="searchContentForm.phoneNo" placeholder="请输入" class="text-mid-input"></el-input>
            </el-form-item>
          </el-col>
        </el-col>

        <el-col :span="24">
          <el-col :span="12">
            <el-form-item label="上传时间起">
              <el-date-picker type="date" placeholder="选择日期" v-model="searchContentForm.startTime"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标题名称">
              <el-input v-model="searchContentForm.keyWord" placeholder="请输入" class="text-mid-input"></el-input>
            </el-form-item>
          </el-col>
        </el-col>

        <el-col :span="24">
          <el-col :span="12">
            <el-form-item label="上传时间止">
              <el-date-picker type="date" placeholder="选择日期" v-model="searchContentForm.endTime"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="t-c">
            <el-button type="primary" @click="searchContentData" class="search-icon"><i></i>搜索</el-button>
            <el-button type="cancel" @click="clearContentFormData" class="clear-icon"><i></i>清除</el-button>
          </el-col>
        </el-col>
      </el-form>

      <v-divline></v-divline>

      <el-table :data="tableContentData" border style="width: 97%">
        <el-table-column label="选择" width="60">
          <template scope="scope">
            <input type="radio" name="contentRadio" @click="choiceContentTableData(scope.row)" autocomplete="off"
                   value="scope.row.contentId">
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题名称" width="150"></el-table-column>
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
        <el-table-column label="上传日期" width="120">
          <template scope="scope">
            {{scope.row.createTime ? jst.timestampFormat(Number(scope.row.createTime), 'Y-m-d') : ''}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template scope="scope">
            <!-- 展开 begin -->
            <el-popover
                    ref="conditionPopover"
                    placement="left"
                    width="400"
                    trigger="hover">
              <div class="condition-propover">
                <div><span>文件作者:</span> {{scope.row.userId}}</div>
                <div>
                  <span>作者归属:</span>
                  <label v-if="scope.row.region === ''">未认证</label>
                  <label v-if="scope.row.region === 0">教师</label>
                  <label v-if="scope.row.region === 1">三方个人</label>
                  <label v-if="scope.row.region === 2">三方机构</label>
                </div>
                <div><span>联系电话:</span> {{scope.row.phoneNo}}</div>
                <div><span>学科分类:</span> {{scope.row.conditions}}</div>
                <div><span>文件名称:</span> {{scope.row.files ? scope.row.files[0].fileName : ''}}</div>
                <div><span>上传日期:</span> {{scope.row.createTime ? jst.timestampFormat(Number(scope.row.createTime), 'Y-m-d') : ''}}</div>
                <div><span>内容简介:</span> {{scope.row.summary}}</div>
              </div>
            </el-popover>
            <!-- 展开 end -->
            <a v-popover:conditionPopover>查看详细</a>
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
      <el-button type="primary" @click="choicePushContent" class="large-btn">选择</el-button>
    </div>
  </div>
</template>
<script>
  import { mapActions } from 'vuex'
  import { CHANGE_PENDING, GET_CONTENT_CATEGORYS } from 'store/globalStore'
  import { CONTENT_GET_LIST } from 'store/modules/contentStore'
  import { USER_GET_PROFILE } from 'store/modules/userStore'
  import * as jst from 'js-common-tools'
  import GlobalService from '../../services/GlobalService'
  import * as CONFIG from '../../config/'
  import * as CODE from '../../config/code'
  import * as MSG from '../../config/messages'
  import { cleanFormEmptyValue, globalErrorPrint, date2secondsTimestamp } from '../../utils/'

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
      this.resetRadio()
      this.getData()
      // CATE 获取所有分类
      this.GET_CONTENT_CATEGORYS().then((res) => {
        this.cateRootObj = res.data
        this.changeSelect('', '', '', this.cateRootObj)
      })
    },
    data () {
      return {
        jst: jst,
        // 查询内容表单数据
        searchContentForm: {
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
          endTime: '',
          keyWord: ''
        },
        // 内容查询
        tableContentData: [],
        currentPage: 1,
        totalSize: 1,
        pageSize: CONFIG.TINY_PAGE_SIZE,
        // 选择后的（推送内容）数据
        choiceContentData: {},
        formLabelWidth: '120px',
        cateRootObj: '', // 分类的整个对象
        selectsObj: '' // CATE,选择了后的各层级的对象
      }
    },
    methods: {
      ...mapActions([CHANGE_PENDING, GET_CONTENT_CATEGORYS, CONTENT_GET_LIST, USER_GET_PROFILE]),
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
       * 点击推送内容table的单选按钮
       */
      choiceContentTableData (val) {
        Object.assign(this.choiceContentData, val)
      },
      /**
       * 点击（推送内容）选择【选定条件】
       */
      choicePushContent () {
        if (jst.isNullOrEmpty(this.choiceContentData, true)) {
          this.$message.error('请选择一条推送内容')
          return
        }
        // 将值传给父组件
        this.$emit('click-choice', {
          choiceData: this.choiceContentData,
          dialogVisible: false
        })
      },
      /**
       * 清除查询内容表单数据
       */
      clearContentFormData () {
        for (let item in this.searchContentForm) {
          this.searchContentForm[item] = ''
        }
        // CATE,清除级联选项的值
        for (let item in this.selectsObj) {
          if (item.indexOf('Value') != -1) {
            this.selectsObj[item] = ''
          }
        }
      },
      /**
       * 查询推送内容表单数据
       */
      searchContentData () {
        let {startTime, endTime} = this.searchContentForm
        if (startTime > endTime) {
          this.$message.error(MSG.STARTTIME_GREATER_THAN_ENDTIME_MSG)
          return
        }
        this.currentPage = 1 // 设置为第一页
        this.getData()
      },
      /**
       * 重置被选择的项
       */
      resetRadio () {
        let selectContent = document.getElementsByName('contentRadio')
        for (let i = 0, len = selectContent.length; i < len; i++) {
          selectContent[i].checked = false
        }
      },

      /**
       * 获取数据
       */
      getData () {
        this.CHANGE_PENDING(true)
        Object.assign(this.searchContentForm, {
          cateId: GlobalService.getEndCateId(this.selectsObj) // CATE
        })
        let {startTime, endTime, status} = this.searchContentForm
        let newParm = {
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
        let newForm = cleanFormEmptyValue(this.searchContentForm)
        let params = Object.assign({}, newForm, newParm)
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
            this.tableContentData = newData
            this.totalSize = res.data.totalSize
            this.currentPage = res.data.currentPage
            // 循环列表获取用户相关信息
            this.tableContentData.map((item, index) => {
              this.getUserProfile(index, item)
            })
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
       * 强制更新表格数据
       */
      forceUpdateTable () {
        let firstData = this.tableContentData.shift()
        this.tableContentData.unshift(firstData)
        console.log(JSON.stringify(this.tableContentData))
        this.$forceUpdate()
      },

      /**
       * 获取三方用户信息
       */
      getUserProfile (index, rowData) {
        let params = {
          userId: rowData.userId
        }
        this.USER_GET_PROFILE(params).then(res => {
          if (res.code == CODE.SUCCESS) {
            this.tableContentData[index].userId = res.data.userId
            this.tableContentData[index].phoneNo = res.data.phoneNo
            this.tableContentData[index].region = res.data.identification ? res.data.identification.type : ''
          }
          if (index == this.tableContentData.length - 1) {
            setTimeout(() => {
              this.forceUpdateTable()
            }, 100)
          }
        }).catch((err) => {
          globalErrorPrint(err)
          this.forceUpdateTable()
        })
      }
    }
  }
</script>
