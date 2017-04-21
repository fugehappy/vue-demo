<!--Copyright (C) 2017 QIANKUN HANLIN Corporation Limited-->
<!--登录页面-->
<template>
  <div class="main login-main" v-loading.fullscreen.lock="this.$store.state._global.pending" :element-loading-text="this.$store.state._global.loadingText">
    <!-- 顶部 -->
    <div class="row top-wrap">
      <router-link to="/index" class="left-link">
        <img src="/static/images/logo.png" alt="LOGO">
        <span>乾坤翰林内容云平台</span>
      </router-link>
    </div>
    <!-- 登录框 -->
    <div class="login-wrap">
      <div class="login-box">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="登录名">
            <el-input v-model="form.loginName" @change="checkLoginName" placeholder="请输入登录名"></el-input>
            <div class="tips" v-show="btn && loginNameTips">{{loginNameTips}}</div>
          </el-form-item>
          <el-form-item label="登录密码">
            <el-input v-model="form.password" @change="checkLoginPassword" placeholder="请输入登录密码" type="password"></el-input>
            <div class="tips" v-show="btn && loginPasswordTips">{{loginPasswordTips}}</div>
            <div class="tips" v-show="validate.errMsg">{{validate.errMsg}}</div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="submit-btn" @click="submit">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 底部 -->
    <v-footer></v-footer>
  </div>
</template>

<script>
  import {mapActions} from 'vuex'
  import {USER_SIGNIN, MENU_GET_USER_MENU_KEYS} from '../store/modules/userStore'
  import {CHANGE_PENDING} from 'store/globalStore'
  import * as Messages from '../config/messages'
  import * as CODE from '../config/code'
  import * as CONFIG from '../config/'
  import { globalErrorPrint, judgeNotNetwork } from '../utils/'

  export default {
    data () {
      this.$store.state
      return {
        ...Messages,
        btn: true, // true 已经提交过， false没有提交过
        loginNameTips: '', // 登录名错误提示
        loginPasswordTips: '', // 登录密码错误提示
        form: {
          loginName: '',
          password: ''
        },
        validate: {
          errMsg: ''
        },
        loginDone: false
      }
    },
    mounted () {
      // 监听Enter键自动提交事件
      let pressEnter = (event) => {
        if (event.keyCode == 13) {
          let ret = this.submit()
          if (ret) {
            ret.then(() => {
              // 登录成功
              if (this.loginDone) {
                document.removeEventListener('keyup', pressEnter, false)
              }
            })
          }
        }
      }
      document.addEventListener('keyup', pressEnter, false)
    },
    methods: {
      ...mapActions([USER_SIGNIN, CHANGE_PENDING, MENU_GET_USER_MENU_KEYS]),
      /**
       * 检查登录名
       */
      checkLoginName () {
        this.validate.errMsg = ''
        let {loginName} = this.form
        if (!loginName) {
          this.loginNameTips = Messages.LOGIN_USERNAME_NOT_EMPTY
          return false
        } else if (!CONFIG.USERNAME_PATTERN.test(loginName)) {
          this.loginNameTips = Messages.LOGIN_USERNAME_PATTERN_ERR_MSG
          return false
        }
        this.loginNameTips = ''
        return true
      },
      /**
       * 检查登录密码
       */
      checkLoginPassword () {
        this.validate.errMsg = ''
        let {password} = this.form
        if (!password) {
          this.loginPasswordTips = Messages.LOGIN_PASSWORD_NOT_EMPTY
          return false
        } else if (!CONFIG.PASSWORD_PATTERN.test(password)) {
          this.loginPasswordTips = Messages.LOGIN_PASSWORD_PATTERN_ERR_MSG
          return false
        }
        this.loginPasswordTips = ''
        return true
      },
      submit () {
        this.btn = true
        this.validate.errMsg = ''
        if (!this.checkLoginName() || !this.checkLoginPassword()) {
          return
        }
        this.CHANGE_PENDING(true)
        return this.USER_SIGNIN(this.form).then(res => {
          this.CHANGE_PENDING(false)
          if (res.code == CODE.SUCCESS) {
            // 获取已有的权限菜单，并跳转到第一个
            this.MENU_GET_USER_MENU_KEYS().then((res) => {
              let {hasPath} = this.$store.state.user
              this.$router.replace({path: hasPath[2]})
            }).catch((err) => {
              globalErrorPrint(err)
              this.$router.replace({path: '/index'})
            })
            this.loginDone = true
          } else {
            this.validate.hasErr = true
            this.$message.error(Messages.LOGIN_PWDNAME_ERR_MSG)
          }
        }).catch((err) => {
          this.CHANGE_PENDING(false)
          globalErrorPrint(err)
          if (judgeNotNetwork(this, err)) {
            return
          }
          if (err.responseJSON) {
            let {responseJSON} = err
            if (responseJSON.code == CODE.PASSWORD_ERROR) {
              // 用户名或密码错误
              this.validate.errMsg = Messages.LOGIN_PWDNAME_ERR_MSG
            } else if (responseJSON.code == CODE.NO_MANAGE_PERMISION) {
              // 无管理权限
              this.validate.errMsg = Messages.LOGIN_NO_MANAGE_PERMISION_MSG
            } else {
              this.validate.errMsg = Messages.SERVER_ERROR_MSG
            }
          } else {
            this.$message.error(Messages.SERVER_ERROR_MSG)
          }
        })
      }
    }
  }
</script>
