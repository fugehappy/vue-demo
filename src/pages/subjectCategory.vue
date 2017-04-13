<!--Copyright (C) 2017 QIANKUN HANLIN Corporation Limited-->
<!--基础学科分类-->
<template>
  <div class="platform-wrap">
    <el-row>
      <h4 class="sub-title">基础学科配置</h4>
      <v-divline></v-divline>
    </el-row>
    <div class="sort-table fix-wrapper">
      <dl class="sort-table-hd">
        <dd>{{categoryLabel.sort}}</dd>
        <dd>{{categoryLabel.section}}</dd>
        <dd>{{categoryLabel.course}}</dd>
        <dd>{{categoryLabel.version}}</dd>
        <dd>{{categoryLabel.grade}}</dd>
        <dd>{{categoryLabel.tag}}</dd>
      </dl>
      <dl class="sort-table-bd">
        <dd>
          <el-select v-model="categoryValue" placeholder="请选择" @change="selectSort('sort', $event)">
            <el-option
                    v-for="item in categoryData"
                    :label="item.name"
                    :value="item">
            </el-option>
          </el-select>
        </dd>
        <dd>
          <el-select v-model="sectionValue" :disabled="options.section" placeholder="请选择"
                     @change="selectSort('section', $event)">
            <el-option
                    v-for="item in sectionData"
                    :label="item.name"
                    :value="item">
            </el-option>
          </el-select>
        </dd>
        <dd>
          <el-select v-model="courseValue" :disabled="options.course" placeholder="请选择"
                     @change="selectSort('course', $event)">
            <el-option
                    v-for="item in courseData"
                    :label="item.name"
                    :value="item">
            </el-option>
          </el-select>
        </dd>
        <dd>
          <el-select v-model="versionValue" :disabled="options.version" placeholder="请选择"
                     @change="selectSort('version', $event)">
            <el-option
                    v-for="item in versionData"
                    :label="item.name"
                    :value="item">
            </el-option>
          </el-select>
        </dd>
        <dd>
          <el-select v-model="gradeValue" :disabled="options.grade" placeholder="请选择"
                     @change="selectSort('grade', $event)">
            <el-option
                    v-for="item in gradeData"
                    :label="item.name"
                    :value="item">
            </el-option>
          </el-select>
        </dd>
        <dd>
          <el-select v-model="tagValue" :disabled="disabledTagFlag" placeholder="请选择">
            <el-option
                    v-for="item in tagData"
                    :label="item.tagName"
                    :value="item.tagName">
            </el-option>
          </el-select>
        </dd>
      </dl>
    </div>
    <div class="category-table fix-wrapper">
      <div class="hd">
        <dl>
          <dd>序号</dd>
          <dd v-if="filterTableNameCellIsVisible" @click="addCategory(rowName)">{{rowName}}&nbsp;&nbsp;<img src="../assets/icons/ic_add.png"></dd>
          <dd v-if="filterTableTagCellIsVisible" @click="addTag">标签&nbsp;&nbsp;<img src="../assets/icons/ic_add.png"></dd>
          <dd>变更</dd>
          <dd>删除</dd>
        </dl>
      </div>
      <div v-for="(item, index) in filterTableData" class="bd">
        <dl>
          <dd>{{index + 1}}</dd>
          <dd v-if="filterTableNameCellIsVisible">{{item.name}}</dd>
          <dd v-if="filterTableTagCellIsVisible">{{item.tagName}}</dd>
          <dd><a @click="openUpdateDialog(index, item)">变更</a></dd>
          <dd><a @click="delSubject(index, item)">删除</a></dd>
        </dl>
      </div>
    </div>
    <!--打开嵌入的表单-->
    <!-- Form -->
    <el-dialog title="变更" v-model="dialogFormVisible" size="tiny" :close-on-click-modal="false" class="tiny-dialog">
      <div class="dialog-box">
        <el-form :model="dataUpdate">
          <el-form-item>
            <el-input v-model="dataUpdate.name" placeholder="请输入内容"></el-input>
          </el-form-item>
          <div class="ft-group">
            <button class="el-button el-button--primary" @click="update ">提交变更</button>
            <button class="el-button el-button--primary" @click="dialogFormVisible = false">取消</button>
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>


<script>
  import {mapActions} from 'vuex'
  import {CHANGE_PENDING} from 'store/globalStore'
  import {
          GET_CATEGORY_LIST,
          UPDATE_CATEGORY,
          ADD_CATEGORY,
          DEL_CATEGORY,
          ADD_TAGS,
          DEL_CATEGORY_TAG
  } from '../store/modules/subjectStore'
  import {SUCCESS} from '../config/code'
  import {globalErrorPrint} from '../utils/'
  import * as jst from 'js-common-tools'
  export default {
    name: 'subjectCategory',
    mounted () {
      this.getCategoryList()
    },
    data () {
      return {
        rowName: '',
        cateId: null,
        categoryLabel: {
          sort: '分类',
          section: '学段',
          course: '学科',
          version: '版本',
          grade: '年级',
          tag: '标签'
        },
        categoryData: [],
        categoryValue: '',
        sectionData: [],
        sectionValue: '',
        courseData: [],
        courseValue: '',
        versionData: [],
        versionValue: '',
        gradeData: [],
        gradeValue: '',
        tagData: [],
        tagValue: '',
        disabledTagFlag: true, // tag
        filterTableData: [],
        filterTableTagCellIsVisible: false, // 是否显示表格标签列
        filterTableNameCellIsVisible: true, // 是否显示表格中分类列
        options: {
          section: true,
          course: true,
          version: true,
          grade: true
        },
        dialogFormVisible: false,
        formLabelWidth: '120px',
        dataUpdate: {
          name: null
        },
        dataSortUpdate: null,
        selectIsChanging: false // 选择下拉框是否逆向选择中
      }
    },
    methods: {
      ...mapActions([CHANGE_PENDING, GET_CATEGORY_LIST, UPDATE_CATEGORY, ADD_CATEGORY, DEL_CATEGORY, ADD_TAGS, DEL_CATEGORY_TAG]),

      /**
       * 删除基础学科分类
       * @rowData param
       */
      delSubject (index, rowData) {
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 判断删除类型
          let data = {}

          if (!jst.isNullOrEmpty(rowData.subCategory ? rowData.subCategory.categories : rowData.subCategory, true) || !jst.isNullOrEmpty(rowData.tags, true)) {
            // 有下级类别或者有标签，该类别不能删除
            this.$message.error('不能删除，请删除下级类别和该级标签再操作')
            return
          } else if (jst.isNullOrEmpty(rowData.subCategory, true) && rowData.tagId) {
            // 没有下级类别并且有标记，可以删除标记
            data = {
              tagId: rowData.tagId,
              state: 'tag'
            }
          } else if (jst.isNullOrEmpty(rowData.subCategory, true)) {
            // 删除类别
            data = {
              cateId: rowData.cateId,
              state: 'cate'
            }
          }
          if (data) {
            this.CHANGE_PENDING(true)
            this.DEL_CATEGORY(data).then((res) => {
              this.CHANGE_PENDING(false)
              if (res.code === SUCCESS) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.filterTableData.splice(index, 1)
                this.getCategoryList(true)
              } else {
                this.$message.error('删除失败')
              }
            }).catch((err) => {
              globalErrorPrint(err)
              this.CHANGE_PENDING(false)
              this.$message.error('异常错误')
            })
          }
        }).catch(() => {
          // 此处是取消回调，但不需要做任何处理。必须加上catch否则会报错
        })
      },

      /**
       * 选择分类
       * @type param 类型
       * @evt param 数据
       */
      async selectSort (type, evt) {
        await this.resetSelect(type)
        if (this.selectIsChanging) return
        this.selectIsChanging = true
        // 传入参数判断
        if (!type) return false
        let data = evt.subCategory && evt.subCategory.categories ? evt.subCategory.categories : null

        // 根据不同条件筛选数据
        switch (type) {
          case 'sort':
            this.filterTableNameCellIsVisible = true
            // 点击分类,填充下拉学段数据
            this.sectionValue = ''
            this.sectionData = data
            // 选择该分类的cateId
            if (evt.cateId) {
              this.cateId = evt.cateId
            }
            this.rowName = this.categoryLabel.section
            this.tagValue = '' // tag下拉中显示为请选择
            if (!jst.isNullOrEmpty(data, true)) {
              // 该分类下学段有数据, 则学段启用,学科,版本,年级不可用,标签下拉也不可用,筛选的表格数据呈现序号,学段,变更,删除
              this.filterTableTagCellIsVisible = false // 筛选表格中不显示tags
              this.options.section = false // 学段下拉启用
              this.disabledTagFlag = true // 标签下拉不启用
              this.filterTableData = this.sectionData
            } else {
              // 该分类下学段无数据, 则学段,学科,版本,年级的下拉都不可用,筛选的表格数据呈现序号,学段,标签,变更,删除
              this.filterTableTagCellIsVisible = true // 筛选表格中显示tags
              this.options.section = true // 学段下拉不启用
              if (!jst.isNullOrEmpty(evt.tags, true)) {
                this.disabledTagFlag = false // 标签下拉启用
              } else {
                this.disabledTagFlag = true // 标签下拉不启用
              }

              this.tagData = evt.tags
              if (this.tagData) {
                for (let i = 0, len = this.tagData.length; i < len; i++) {
                  this.tagData[i].tagName = this.tagData[i].tagName ? this.tagData[i].tagName : this.tagData[i].name
                  this.tagData[i].name = ''
                }
              }
              this.filterTableData = this.tagData
            }
            break
          case 'section':
            this.filterTableNameCellIsVisible = true
            // 点击学段,填充下级学科数据
            this.courseValue = ''
            this.courseData = data
            // 选择该学段的cateId
            if (evt.cateId) {
              this.cateId = evt.cateId
            }
            this.rowName = this.categoryLabel.course
            this.tagValue = '' // tag下拉中显示为请选择
            if (!jst.isNullOrEmpty(data, true)) {
              // 该学段下的学科有数据, 则学科启用,版本,年级不可用,标签下拉也不可用,筛选的表格数据呈现序号,学科,变更,删除
              this.filterTableTagCellIsVisible = false // 筛选表格中不显示tags
              this.options.course = false // 学科下拉启用
              this.disabledTagFlag = true // 标签下拉不启用
              this.filterTableData = this.courseData
            } else {
              // 该学段下的学科无数据, 则学科,版本,年级都不可用,标签下拉可用,筛选的表格数据呈现序号,学科,标签,变更,删除
              this.filterTableTagCellIsVisible = true // 筛选表格中显示tags
              this.options.course = true // 学科下拉不启用
              if (!jst.isNullOrEmpty(evt.tags, true)) {
                this.disabledTagFlag = false // 标签下拉启用
              } else {
                this.disabledTagFlag = true // 标签下拉不启用
              }

              this.tagData = evt.tags
              if (this.tagData) {
                for (let i = 0, len = this.tagData.length; i < len; i++) {
                  this.tagData[i].tagName = this.tagData[i].tagName ? this.tagData[i].tagName : this.tagData[i].name
                  this.tagData[i].name = ''
                }
              }
              this.filterTableData = this.tagData
            }
            break
          case 'course':
            this.filterTableNameCellIsVisible = true
            // 点击学科,填充下级版本数据
            this.versionValue = ''
            this.versionData = data
            // 选择该学科的cateId
            if (evt.cateId) {
              this.cateId = evt.cateId
            }
            this.rowName = this.categoryLabel.version
            this.tagValue = '' // tag下拉中显示为请选择
            if (!jst.isNullOrEmpty(data, true)) {
              // 如果学科下有类别数据, 则版本,年级都不可用,标签下拉可用,筛选的表格数据呈现序号,标签,变更,删除
              this.filterTableTagCellIsVisible = false // 筛选表格中不显示tags
              this.options.version = false // 学段下拉启用
              this.disabledTagFlag = true // 标签下拉不启用
              this.filterTableData = this.versionData
            } else {
              // 如果学科下无类别数据, 则版本,年级都不可用,标签下拉可用,筛选的表格数据呈现序号,版本,标签,变更,删除
              this.filterTableTagCellIsVisible = true // 筛选表格中显示tags
              this.options.version = true // 学段下拉不启用
              if (!jst.isNullOrEmpty(evt.tags, true)) {
                this.disabledTagFlag = false // 标签下拉启用
              } else {
                this.disabledTagFlag = true // 标签下拉不启用
              }

              this.tagData = evt.tags
              if (this.tagData) {
                for (let i = 0, len = this.tagData.length; i < len; i++) {
                  this.tagData[i].tagName = this.tagData[i].tagName ? this.tagData[i].tagName : this.tagData[i].name
                  this.tagData[i].name = ''
                }
              }
              this.filterTableData = this.tagData
            }
            break
          case 'version':
            this.filterTableNameCellIsVisible = true
            // 点击版本,填充下级年级数据
            this.gradeValue = ''
            this.gradeData = data
            // 选择该版本的cateId
            if (evt.cateId) {
              this.cateId = evt.cateId
            }
            this.rowName = this.categoryLabel.grade
            this.tagValue = '' // tag下拉中显示为请选择
            if (!jst.isNullOrEmpty(data, true)) {
              // 如果版本下有类别数据, 则年级下拉不可用,标签下拉可用,筛选的表格数据呈现序号,标签,变更,删除
              this.filterTableTagCellIsVisible = false // 筛选表格中不显示tags
              this.options.grade = false // 学段下拉启用
              this.disabledTagFlag = true // 标签下拉不启用
              this.filterTableData = this.gradeData
            } else {
              // 该版本下类别无数据, 则年级启用,标签下拉不可用,筛选的表格数据呈现序号,年级,标签,变更,删除
              this.filterTableTagCellIsVisible = true // 筛选表格中显示tags
              this.options.grade = true // 学段下拉不启用
              if (!jst.isNullOrEmpty(evt.tags, true)) {
                this.disabledTagFlag = false // 标签下拉启用
              } else {
                this.disabledTagFlag = true // 标签下拉不启用
              }

              this.tagData = evt.tags
              if (this.tagData) {
                for (let i = 0, len = this.tagData.length; i < len; i++) {
                  this.tagData[i].tagName = this.tagData[i].tagName ? this.tagData[i].tagName : this.tagData[i].name
                  this.tagData[i].name = ''
                }
              }
              this.filterTableData = this.tagData
            }
            break
          case 'grade':
            this.filterTableNameCellIsVisible = false
            this.rowName = this.categoryLabel.tag
            if (!jst.isNullOrEmpty(evt.tags, true)) {
              // 如果年级的tags存在, 标签下拉可用,筛选的表格数据呈现序号,标签,变更,删除
              this.filterTableTagCellIsVisible = true // 筛选表格中显示tags
              this.disabledTagFlag = false // 标签下拉启用
              this.tagData = evt.tags
              if (this.tagData) {
                for (let i = 0, len = this.tagData.length; i < len; i++) {
                  this.tagData[i].tagName = this.tagData[i].tagName ? this.tagData[i].tagName : this.tagData[i].name
                  this.tagData[i].name = ''
                }
              }
              this.tagValue = '' // 标签下拉显示‘请选择’
              this.filterTableData = this.tagData
            } else {
              // 年级的tags 没有数据.标签下拉不可同
              this.filterTableTagCellIsVisible = true // 筛选表格中显示tags
              this.disabledTagFlag = true // 标签下拉不启用
              this.tagData = []
              this.tagValue = '' // 标签下拉显示‘请选择’
              this.filterTableData = this.tagData
            }
            break
        }
        await new Promise((resolve, reject) => setTimeout(() => resolve(this.selectIsChanging = false), 300))
      },

      /**
       * 重置被选择的下一级别
       */
      resetSelect (type) {
        this.filterTableData = []
        this.tagData = []
        this.rowName = ''
        this.filterTableTagCellIsVisible = false
        switch (type) {
          case 'sort':
            this.sectionValue = ''
            this.courseValue = ''
            this.options.course = true
            this.versionValue = ''
            this.options.version = true
            this.gradeValue = ''
            this.options.grade = true
            break
          case 'section':
            this.courseValue = ''
            this.versionValue = ''
            this.options.version = true
            this.gradeValue = ''
            this.options.grade = true
            break
          case 'course':
            this.versionValue = ''
            this.gradeValue = ''
            this.options.grade = true
            break
          case 'version':
            this.gradeValue = ''
            break
          case 'grade':
            break
        }
      },

      /**
       * 打开变更对话框
       * @rowData param 数据
       */
      openUpdateDialog (index, rowData) {
        if (rowData.tagId) {
          // 更新标签
          this.dataUpdate = {
            name: rowData.tagName
          }
          this.dataSortUpdate = {
            tagId: rowData.tagId,
            name: rowData.tagName,
            state: 'tag'
          }
        } else {
          // 更新类别
          this.dataUpdate = {
            name: rowData.name
          }
          this.dataSortUpdate = {
            cateId: rowData.cateId,
            name: rowData.name,
            state: 'cate'
          }
        }
        Object.assign(this.dataUpdate, {
          tableIndex: index,
          type: rowData.type
        })
        Object.assign(this.dataSortUpdate, {
          tableIndex: index
        })
        this.dialogFormVisible = true
      },

      /**
       * 更新
       * @data param 数据
       */
      update () {
        // 判断是更新的是标签还是类别
        this.dataSortUpdate.name = this.dataUpdate.name
        this.UPDATE_CATEGORY(this.dataSortUpdate).then((res) => {
          if (res.code === SUCCESS) {
            this.getCategoryList(true, this.dataUpdate.type)
            this.dialogFormVisible = false
            if (this.dataSortUpdate.state == 'cate') {
              this.filterTableData[this.dataSortUpdate.tableIndex].name = this.dataSortUpdate.name
            } else {
              this.filterTableData[this.dataSortUpdate.tableIndex].tagName = this.dataSortUpdate.name
            }
            this.$message({
              message: '更新成功',
              type: 'success'
            })
          } else {
            // 异常错误处理
            this.$message.error('更新失败')
          }
        }).catch((err) => {
          globalErrorPrint(err)
          // 异常错误处理
          this.$message.error('异常错误')
        })
      },
      /**
       * 添加类别
       * @type param 类型
       */
      addCategory (state) {
        if (!state) return false
        let type = null
        let parentCateId = this.cateId
        switch (state) {
          case '分类':
            type = 0
            break
          case '学段':
            type = 1
            break
          case '学科':
            type = 2
            break
          case '版本':
            type = 3
            break
          case '年级':
            type = 4
            break
        }
        this.$prompt('添加类别', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({value}) => {
          let data = {
            parentCateId: parentCateId,
            name: value,
            type: type
          }
          this.ADD_CATEGORY(data).then((res) => {
            if (res.code === SUCCESS) {
              // 添加分类成功
              Object.assign(data, res.data)
              let newTableData = []
              // 添加类别成功后，将移除标签数据
              if (this.filterTableData) {
                this.filterTableData.map((item, index) => {
                  if (!item.tagId) {
                    newTableData.push(item)
                  }
                })
              }
              newTableData.push(data)
              this.filterTableData = newTableData
              this.filterTableTagCellIsVisible = false

              // type 1学段，2学科，3版本，4年级
              this.addCategoryAfterUpdateSelectData(type, data)
              this.getCategoryList(true, type)
              this.$message({
                type: 'success',
                message: '添加成功'
              })
            } else {
              // 异常错误处理
              this.$message.error('添加分类失败')
            }
          }).catch((err) => {
            globalErrorPrint(err)
            // 异常错误处理
            this.$message.error('异常错误')
          })
        })
      },

      /**
       * 新增成功后更新下拉框的数据列表
       * 当有标签时而新增其子分类的变化
       * @param type 新增的类别
       * @param data 新增当前数据
       */
      addCategoryAfterUpdateSelectData (type, data) {
        // 如果data不是对象则直接返回
        if (!data || typeof data !== 'object') return
        switch (type) {
          case 1: // '学段'
            // 给（分类）增加子类，将其tag清空，并将data添加到当前选择的（分类）的子级
            this.categoryData.map(item => {
              if (item.cateId == this.cateId) {
                item.tags = null
                item.subCategory = item.subCategory ? item.subCategory : {}
                let thisCategories = item.subCategory.categories ? item.subCategory.categories : []
                thisCategories.push(data)
                Object.assign(item.subCategory, {
                  type: 1,
                  typeName: '学段',
                  categories: thisCategories
                })
                this.selectSort('sort', item)
              }
              return item
            })

            break
          case 2: // '学科'
            // 给（学段）增加子类，将其tag清空，并将data添加到当前选择的（学段）的子级
            this.sectionData.map(item => {
              if (item.cateId == this.cateId) {
                item.tags = null
                item.subCategory = item.subCategory ? item.subCategory : {}
                let thisCategories = item.subCategory.categories ? item.subCategory.categories : []
                thisCategories.push(data)
                Object.assign(item.subCategory, {
                  type: 2,
                  typeName: '学科',
                  categories: thisCategories
                })
                this.selectSort('section', item)
              }
              return item
            })
            break
          case 3: // '版本'
            // 给学科增加子类，将其tag清空，并将data添加到当前选择的学科的子级
            this.courseData.map(item => {
              if (item.cateId == this.cateId) {
                item.tags = null
                item.subCategory = item.subCategory ? item.subCategory : {}
                let thisCategories = item.subCategory.categories ? item.subCategory.categories : []
                thisCategories.push(data)
                Object.assign(item.subCategory, {
                  type: 3,
                  typeName: '版本',
                  categories: thisCategories
                })
                this.selectSort('course', item)
              }
              return item
            })
            break
          case 4: // '年级'
            // 给版本增加子类，将其tag清空，并将data添加到当前选择的版本的子级
            this.versionData.map(item => {
              if (item.cateId == this.cateId) {
                item.tags = null
                item.subCategory = item.subCategory ? item.subCategory : {}
                let thisCategories = item.subCategory.categories ? item.subCategory.categories : []
                thisCategories.push(data)
                Object.assign(item.subCategory, {
                  type: 4,
                  typeName: '年级',
                  categories: thisCategories
                })
                this.selectSort('version', item)
              }
              return item
            })
            break
        }
        this.tagData = []
        this.tagValue = '' // 标签下拉显示‘请选择’
        this.disabledTagFlag = true // 标签下拉不启用
      },

      /**
       * 添加标签
       */
      addTag () {
        this.$prompt('添加标签', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({value}) => {
          let data = {
            cateId: this.cateId,
            name: value
          }
          this.ADD_TAGS(data).then((res) => {
            if (res.code === SUCCESS) {
              // 添加标签成功
              Object.assign(data, res.data)
              data.tagName = res.data.name
              data.name = ''
              if (this.filterTableData) {
                this.filterTableData.push(data)
              } else {
                this.filterTableData = [data]
              }
              this.getCategoryList(true)
              this.$message({
                type: 'info',
                message: '添加成功'
              })
            } else {
              this.$message.error('添加失败')
            }
          }).catch((err) => {
            globalErrorPrint(err)
            // 异常错误处理
            this.$message.error('异常错误')
          })
        })
      },

      /**
       * 获取分类列表
       */
      getCategoryList (isReload, type) {
        if (isReload && type !== 0) return
        this.GET_CATEGORY_LIST().then((res) => {
          if (res.code === SUCCESS) {
            this.categoryData = res.data
            for (let i = 0, len = this.categoryData.length; i < len; i++) {
              this.categoryData[i].tagName = this.categoryData[i].name
            }
            this.filterTableData = this.categoryData
            this.rowName = this.categoryLabel.sort
          } else {
            // 异常错误处理
            this.$message.error('获取分类列表,请尝试刷新')
          }
        }).catch((err) => {
          globalErrorPrint(err)
          // 异常错误处理
          this.$message.error('异常错误')
        })
      }
    }
  }
</script>
