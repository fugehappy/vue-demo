<!--Copyright (C) 2017 QIANKUN HANLIN Corporation Limited-->
<!--用户权限分配-->
<template>
  <div class="platform-wrap">
    <el-row v-if="!dialogFormVisibleUpgrade">
      <h4 class="sub-title">
        <span>用户权限分配</span>
        <button class="el-button el-button--primary btn large-btn" @click="openUpgradeDialog">升级管理员</button>
      </h4>
      <v-divline></v-divline>
    </el-row>
    <el-form v-if="!dialogFormVisibleUpgrade" class="fix-wrapper">
      <el-table :data="allManageInfo" border style="width: 100%">
        <el-table-column type="index" label="序号" width="90">
          <template scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="user.userId" label="翰林账号" width="120"></el-table-column>
        <el-table-column label="性别" width="90">
          <template scope="scope">
            {{scope.row.user.gender ? '男' : '女'}}
          </template>
        </el-table-column>
        <el-table-column prop="user.phoneNo" label="手机号码" width="150"></el-table-column>
        <el-table-column label="角色说明" min-width="180">
          <template scope="scope">
            <span v-for="(item, index) in scope.row.roles">
              {{index != scope.row.roles.length - 1 ? item.name + '，' : item.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="user.createTime" label="分配日期" width="180"></el-table-column>
        <el-table-column label="操作" width="120">
          <template scope="scope">
            <a @click="openChangeRoleDialog(scope.row.user, scope.row.roles)">变更角色</a>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div class="block">
        <el-pagination
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-size="pageSize"
                layout="total, prev, pager, next"
                :total="totalSize">
        </el-pagination>
      </div>
    </el-form>
    <!--打开嵌入的表单-->
    <el-dialog title="变更用户角色" v-model="dialogFormVisible" :close-on-click-modal="false">
      <div class="role-dialog">
        <div class="role-dialog-cell">
          <ul class="list">
              <li><span>翰林账号：</span>{{userOneInfo.userId}}</li>
              <li><span>手机号码：</span>{{userOneInfo.phoneNo}}</li>
              <li><span>分配时间：</span>{{userOneInfo.createTime}}</li>
          </ul>
        </div>
        <div class="role-dialog-cell">
          <ul class="check-group">
            <li v-for="item in roleList">
              <label><input type="checkbox" :checked="item.isChecked" @change="selectRole(item)"><span>{{item.name}}</span></label>
            </li>
          </ul>
        </div>
        <div class="ft-group">
          <button class="el-button el-button--primary large-btn" @click="changeRoleAssign">提交变更</button>
          <button class="el-button el-button--cancel large-btn" @click="dialogFormVisible = false">取消</button>
        </div>
      </div>
    </el-dialog>
    <div v-if="dialogFormVisibleUpgrade">
      <div class="role-dialog">
        <h3 class="title">普通用户升级管理员</h3>
        <div class="role-dialog-hd">
          <div class="form-wrap">
            <el-form :inline="true" :model="manager" class="demo-form-inline">
              <table class="table-custom" width="50%">
                <tr>
                  <td>
                    <label>
                      <span>翰林账号</span>
                      <el-input v-model="manager.userId" :maxlength="32"></el-input>
                    </label>
                  </td>
                  <td>
                    <label>
                      <span>手机号码</span>
                      <div class="el-input text-input">
                        <input class="el-input__inner" v-model="manager.phoneNo" :maxlength="11"
                               @keyup="manager.phoneNo = manager.phoneNo.replace(/[^0-9]/, '')">
                      </div>
                    </label>
                  </td>
                </tr>
              </table>
              <div class="btn-group">
                <el-form-item>
                  <el-button type="primary" @click="queryManager">查询</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="button" class="back-icon" @click="closeUpgradeDialog"><i></i>返回</el-button>
                </el-form-item>
              </div>
            </el-form>
          </div>
        </div>
        <div>
          <div class="role-dialog-cell">
            <h4>账号关联信息</h4>
            <ul class="list">
              <li><span>用户姓名：</span>{{userInfo.userId}}</li>
              <li><span>用户性别：</span>{{userInfo.gender}}</li>
              <li><span>手机号码：</span>{{userInfo.phoneNo}}</li>
              <li><span>用户类型：</span>{{userInfo.type}}</li>
              <li><span>当前状态：</span>{{userInfo.state}}</li>
              <li><span>注册时间：</span>{{userInfo.createTime}}</li>
            </ul>
          </div>
          <div class="role-dialog-cell">
            <h4>分配管理员角色</h4>
            <ul class="check-group">
              <li v-for="item in roleList">
                <label><input type="checkbox" :checked="item.isChecked" @change="selectRole(item)"><span>{{item.name}}</span></label>
              </li>
            </ul>
          </div>
          <div class="ft-group">
            <button class="el-button el-button--primary large-btn" @click="updateroleAssign">提交</button>
            <button class="el-button el-button--cancel large-btn" @click="resetUpgradeQueryManager">重置</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import { CHANGE_PENDING } from 'store/globalStore'
  import { GET_ALL_MANAGER_LIST, GET_ALL_ROLE, GET_USER_INFO, GET_USER_ROLE, UPGRADE_ONE_ROLE, CHANGE_ROLE_ONE } from '../store/modules/roleAssignStore'
  import { SUCCESS } from '../config/code'
  import * as CONFIG from '../config/'
  import * as jst from 'js-common-tools'
  import { judgeNotNetwork } from '../utils/'
  export default {
    name: 'roleAssign',
    mounted () {
      /**
       * 获取所有管理员列表
       */
      this.getAllManagerList()

      /**
       * 获取所有角色
       */
      this.GET_ALL_ROLE().then((res) => {
        if (res.code === SUCCESS) {
          this.roleList = res.data
        } else {
          // 异常错误处理
          this.$message.error('获取所有角色失败')
        }
      }).catch((err) => {
        if (judgeNotNetwork(this, err)) {
          return
        }
        // 异常错误处理
        this.$message.error('异常错误')
      })
    },
    /**
     * data数据模型
     */
    data () {
      return {
        allManageInfo: [],
        currentPage4: 4,
        dialogFormVisible: false,
        dialogFormVisibleUpgrade: false,
        formLabelWidth: '120px',
        userOneInfo: {
          userId: '',
          phoneNo: '',
          createTime: ''
        },
        userInfo: {
        },
        manager: {
          userId: null,
          phoneNo: null
        },
        roleList: [],
        currentPage: 1,
        totalSize: 1,
        pageSize: CONFIG.PAGE_SIZE
      }
    },
    methods: {
      ...mapActions([GET_ALL_MANAGER_LIST, GET_ALL_ROLE, GET_USER_INFO, GET_USER_ROLE, UPGRADE_ONE_ROLE, CHANGE_ROLE_ONE, CHANGE_PENDING]),

      /**
       * 分页函数
       * param val 当前第几页
       */
      handleCurrentChange (val) {
        this.currentPage = val
        this.getAllManagerList()
      },

      /**
       * 获取所有管理员列表
       */
      getAllManagerList () {
        this.CHANGE_PENDING(true)
        this.GET_ALL_MANAGER_LIST({
          page: this.currentPage,
          pageSize: this.pageSize
        }).then((res) => {
          this.CHANGE_PENDING(false)
          if (res.code === SUCCESS) {
            // 分页数据
            this.currentPage = res.data.currentPage
            this.pageSize = res.data.pageSize
            this.totalSize = res.data.totalSize
            if (res.data.items) {
              // 处理时间
              let result = res.data.items
              for (let i = 0, len = result.length; i < len; i++) {
                if (result[i].user) {
                  let time = result[i].user.createTime
                  if (time) {
                    result[i].user.createTime = jst.timestampFormat(time, 'Y-m-d')
                  } else {
                    // 后台拿出数据时间为0的处理
                    result[i].user.createTime = '1970-01-01'
                  }
                }
              }

              // 所有管理员信息
              this.allManageInfo = result
            }
          } else {
            // 异常错误处理
            this.$message.error('获取所有管理员列表失败')
          }
        }).catch((err) => {
          this.CHANGE_PENDING(false)
          if (judgeNotNetwork(this, err)) {
            return
          }
          // 异常错误处理
          this.$message.error('异常错误')
        })
      },

      /**
       * 打开升级管理员对话框
       */
      openUpgradeDialog () {
        this.resetUpgradeQueryManager()
        this.dialogFormVisibleUpgrade = true
      },

      /**
       * 关闭升级管理员对话框
       */
      closeUpgradeDialog () {
        // 清空数据
        this.resetUpgradeQueryManager()
        this.dialogFormVisibleUpgrade = false
        return false
      },

      /**
       * 普通用户升级管理员
       */
      updateroleAssign () {
        // 没有任何选择,就不进行升级操作
        if (!this.manager.userId && !this.manager.phoneNo) {
          return false
        }
        // 得到选中的角色
        let rids = []
        for (let i = 0, len = this.roleList.length; i < len; i++) {
          if (this.roleList[i].isChecked) {
            rids.push(this.roleList[i].rid)
          }
        }

        // 当前用户的信息
        let data = {
          userId: this.userInfo.userId,
          rids: rids
        }

        this.CHANGE_PENDING(true)
        // 升级
        this.UPGRADE_ONE_ROLE(data).then((res) => {
          this.CHANGE_PENDING(false)
          if (res.code === SUCCESS) {
            // 升级成功
            this.dialogFormVisibleUpgrade = false
            this.$message({
              message: '升级成功',
              type: 'success'
            })

            // 重新获得管理员列表
            this.getAllManagerList()
            // 清空数据
            this.resetUpgradeQueryManager()
          } else {
            // 异常错误处理
            this.$message.error('升级管理员失败')
          }
        }).catch((err) => {
          this.CHANGE_PENDING(false)
          if (judgeNotNetwork(this, err)) {
            return
          }
          // 异常错误处理
          this.$message.error('异常错误')
        })
      },

      /**
       * 修改权限的复选框操作
       * param item
       */
      selectRole (item) {
        item.isChecked = !item.isChecked
      },

      /**
       * 根据条件查询管理员
       */
      queryManager () {
        if (!this.manager.phoneNo && !this.manager.userId) {
          // 没输入内容恢复默认值
          this.resetUpgradeQueryManager()
          return false
        }
        if (this.manager.phoneNo && !CONFIG.PHONENO_PATTERN.test(this.manager.phoneNo)) {
          this.$message.error('手机号码格式错误')
          return false
        }
        this.CHANGE_PENDING(true)
        this.GET_USER_INFO(this.manager).then((res) => {
          this.CHANGE_PENDING(false)
          if (res.code === SUCCESS) {
            if (res.data) {
              // 数据性别转换处理
              let gender = res.data.gender
              if (gender) {
                res.data.gender = '男'
              } else {
                res.data.gender = '女'
              }

              // 处理时间格式
              let time = res.data.createTime
              if (time) {
                res.data.createTime = jst.timestampFormat(time, 'Y-m-d')
              } else {
                res.data.createTime = '1970-01-01'
              }

              // 添加类型和状态
              res.data.state = '激活'
              res.data.type = '普通用户'

              this.userInfo = res.data
              // 查询管理员
              let data = {
                userId: this.userInfo.userId
              }
              this.GET_USER_ROLE(data).then((res) => {
                if (res.code === SUCCESS) {
                  if (res.data) {
                    // 处理用户角色选中
                    res.data.map((item) => {
                      for (let i = 0, len = this.roleList.length; i < len; i++) {
                        if (this.roleList[i].rid == item.rid) {
                          this.roleList[i].isChecked = true
                        }
                      }
                    })
                    this.$forceUpdate()
                  }
                }
              }).catch(() => {
                // 异常错误处理
                this.$message.error('异常错误')
                this.resetUpgradeQueryManager()
              })
            } else {
              this.$message.error('查询管理员不存在')
              this.resetUpgradeQueryManager()
            }
          } else {
            // 异常错误处理
            this.$message.error('查询管理员失败')
            this.resetUpgradeQueryManager()
          }
        }).catch((err) => {
          this.CHANGE_PENDING(false)
          if (judgeNotNetwork(this, err)) {
            return
          }
          // 异常错误处理
          this.$message.error('异常错误')
          this.resetUpgradeQueryManager()
        })
      },

      /**
       * 重置升级管理员查询结果
       */
      resetUpgradeQueryManager () {
        // 用户信息值空
        this.userInfo = {
          userId: null,
          gender: null,
          phoneNo: null,
          type: null,
          state: null,
          createTime: null
        }

        // 取消所有角色选中
        for (let i = 0, len = this.roleList.length; i < len; i++) {
          this.roleList[i].isChecked = false
        }

        // 输入内容值空
        this.manager = {
          userId: null,
          phoneNo: null
        }
      },

      /**
       * 打开变更角色对话框
       * param user 用户信息
       * param roles 用户角色
       */
      openChangeRoleDialog (user, roles) {
        this.userOneInfo = {
          userId: user.userId,
          phoneNo: user.phoneNo,
          createTime: user.createTime
        }

        // checkbox重置
        for (let i = 0, len = this.roleList.length; i < len; i++) {
          this.roleList[i].isChecked = false
        }
        // 勾选
        roles.map((item) => {
          for (let i = 0, len = this.roleList.length; i < len; i++) {
            if (this.roleList[i].rid == item.rid) {
              this.roleList[i].isChecked = true
            }
          }
        })

        // 显示对话框
        this.dialogFormVisible = true
      },

      /**
       * 变更角色
       */
      changeRoleAssign () {
        // 得到选中的角色
        let rids = []
        for (let i = 0, len = this.roleList.length; i < len; i++) {
          if (this.roleList[i].isChecked) {
            rids.push(this.roleList[i].rid)
          }
        }

        // 当前用户的信息
        let data = {
          userId: this.userOneInfo.userId,
          rids: rids
        }

        this.CHANGE_PENDING(true)
        // 变更角色
        this.CHANGE_ROLE_ONE(data).then((res) => {
          this.CHANGE_PENDING(false)
          if (res.code === SUCCESS) {
            // 关闭对话框
            this.dialogFormVisible = false
            // 提示变更角色成功
            this.$message({
              message: '变更角色成功',
              type: 'success'
            })
            this.getAllManagerList()
          } else {
            // 异常错误处理
            this.$message.error('变更角色失败')
          }
        }).catch((err) => {
          this.CHANGE_PENDING(false)
          if (judgeNotNetwork(this, err)) {
            return
          }
          // 异常错误处理
          this.$message.error('异常错误')
        })
      }
    }
  }
</script>
