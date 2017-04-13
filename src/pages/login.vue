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
            <el-input v-model="form.loginName" @change="changeData" placeholder="请输入登录名"></el-input>
            <div class="tips" v-show="btn && !form.loginName">{{LOGIN_USERNAME_NOT_EMPTY}}</div>
          </el-form-item>
          <el-form-item label="登录密码">
            <el-input v-model="form.password" @change="changeData" placeholder="请输入登录密码" type="password"></el-input>
            <div class="tips" v-show="btn && !form.password">{{LOGIN_PASSWORD_NOT_EMPTY}}</div>
            <div class="tips" v-show="validate.hasErr">{{LOGIN_PASSWORD_NOT_EMPTY}}</div>
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
  import {USER_SIGNIN} from '../store/modules/userStore'
  import {CHANGE_PENDING} from 'store/globalStore'
  import * as Messages from '../config/messages'
  import * as CODE from '../config/code'
  import { globalErrorPrint } from '../utils/'

  export default {
    data () {
      this.$store.state
      return {
        ...Messages,
        btn: false, // true 已经提交过， false没有提交过
        form: {
          loginName: '',
          password: ''
        },
        validate: {
          hasErr: false,
          errMsg: ''
        }
      }
    },
    methods: {
      ...mapActions([USER_SIGNIN, CHANGE_PENDING]),
      changeData () {
        this.validate.hasErr = false
      },
      submit () {
        this.btn = true
        this.validate.hasErr = false
        if (!this.form.loginName) {
          return
        } else if (!this.form.password) {
          return
        }
        this.CHANGE_PENDING(true)
        this.USER_SIGNIN(this.form).then(res => {
          if (res.code == CODE.SUCCESS) {
            this.$router.replace({path: '/index'})
          } else {
            this.validate.hasErr = true
            this.$message.error(Messages.LOGIN_PWDNAME_ERR_MSG)
          }
          this.CHANGE_PENDING(false)
        }).catch((err) => {
          globalErrorPrint(err)
          this.CHANGE_PENDING(false)
          if (err.responseJSON) {
            let {responseJSON} = err
            this.validate.hasErr = true
            if (responseJSON.code == CODE.PASSWORD_ERROR) {
              // 用户名或密码错误
              this.validate.errMsg = Messages.LOGIN_PWDNAME_ERR_MSG
            } else if (responseJSON.code == CODE.NO_MANAGE_PERMISION) {
              // 无管理权限
              this.validate.errMsg = Messages.LOGIN_NO_MANAGE_PERMISION_MSG
            } else {
              this.validate.errMsg = '服务器错误，请稍后重试'
            }
          } else {
            this.$message.error('服务器错误，请稍后重试')
          }
        })
      }
    }
  }
</script>
