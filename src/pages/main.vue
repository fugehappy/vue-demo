<!--Copyright (C) 2017 QIANKUN HANLIN Corporation Limited-->
<!-- 登录后用户所看到的页面的整体框架  -->
<template>
  <div class="main" v-loading.fullscreen.lock="this.$store.state._global.pending" :element-loading-text="this.$store.state._global.loadingText">
    <!-- 顶部 -->
    <div class="row top-wrap">
      <router-link to="/index" class="left-link">
        <img src="/static/images/logo.png" alt="LOGO">
        <span>乾坤翰林内容云平台</span>
      </router-link>
      <a @click="signout" class="right-link">
        <img src="../assets/icons/ic_out_title.png">&nbsp;&nbsp;退出
      </a>
      <a class="right-link">
        <img src="../assets/icons/ic_user_title.png">&nbsp;&nbsp;{{loginName}}
      </a>
    </div>
    <!-- 左侧导航 -->
    <v-menu :owneMenu="owneMenu"></v-menu>
    <!-- 右侧内容部分 -->
    <div class="content-wrap">
      <router-view></router-view>
    </div>
    <!-- 底部 -->
    <v-footer></v-footer>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import { USER_SIGNOUT, MENU_GET_USER_MENU_KEYS } from '../store/modules/userStore'
  import {CHANGE_PENDING} from 'store/globalStore'
  import * as MSG from '../config/messages'
  import { globalErrorPrint, judgeNotNetwork } from '../utils/'
  import * as jst from 'js-common-tools'
  export default {
    name: 'main',
    data () {
      let {user} = this.$store.state
      return {
        owneMenu: [],
        msg: '翰林内容云平台',
        loginName: user.loginName
      }
    },
    mounted () {
      this.MENU_GET_USER_MENU_KEYS().then((res) => {
        this.owneMenu = res.data
        let {hasPath} = this.$store.state.user
        if (!jst.inArray(this.$router.history.current.path, hasPath)) {
          this.$message.error('非法路径')
          this.$router.replace({path: 'login'})
        }
      }).catch(() => {
        this.$message.error('获取信息错误，重新登录')
        this.$router.replace({path: 'login'})
      })
    },
    methods: {
      ...mapActions([USER_SIGNOUT, CHANGE_PENDING, MENU_GET_USER_MENU_KEYS]),
      signout () {
        this.$confirm('确认退出?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 确定处理事件
          this.CHANGE_PENDING(true)
          this.USER_SIGNOUT().then((res) => {
            this.$message({
              type: 'success',
              message: '成功退出!'
            })
            this.CHANGE_PENDING(false)
            this.$router.replace({path: 'login'})
          }).catch((err) => {
            this.CHANGE_PENDING(false)
            globalErrorPrint(err)
            if (judgeNotNetwork(this, err)) {
              return
            }
            this.$message.error(MSG.SERVER_ERROR_MSG)
          })
        }).catch(() => {
          // 此处是取消回调，但不需要做任何处理。必须加上catch否则会报错
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
