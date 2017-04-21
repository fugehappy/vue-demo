<!--Copyright (C) 2017 QIANKUN HANLIN Corporation Limited-->
<!--平台账户管理页面-->
<template>
  <div class="account-wrap fix-wrapper">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="支付宝账户" name="alipay" class="tabpanel-box">
        <div class="form-wrap">
          <el-form label-width="180px" class="tabpanel">
            <el-form-item label="支付宝账户:">
              <label>{{accountData.alipayAccount}}</label>
            </el-form-item>
            <el-form-item>
              <a :href="accountData.alipayLink" target="_blank">点我去查看</a>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>

      <el-tab-pane label="微信账户" name="weixin" class="tabpanel-box" v-if="false">
        <div class="form-wrap">
          <el-form label-width="180px" class="tabpanel">
            <el-form-item label="微信账户:">
              <label>{{accountData.weixinAccount}}</label>
            </el-form-item>
            <el-form-item>
              <a :href="accountData.wexinLink" target="_blank">点我去查看</a>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<style lang="scss" scoped>
</style>
<script>
  import { mapActions } from 'vuex'
  import { CHANGE_PENDING } from 'store/globalStore'
  import { WITHDRAW_PAYMENT_ACCOUNT_INFO } from 'store/modules/userStore'
  import * as CODE from '../config/code'
  import * as MSG from '../config/messages'
  import { judgeNotNetwork } from '../utils/'
  export default {
    name: 'account',
    data () {
      return {
        activeName: 'alipay',
        accountData: {
          alipayAccount: 'mykj@qkhl.net',
          alipayLink: 'http://www.alipay.com',
          weixinAccount: 'mykjk12@qkhl.net',
          wexinLink: 'http://wx.qq.com'
        }
      }
    },
    mounted () {
      this.getData()
    },
    methods: {
      ...mapActions([CHANGE_PENDING, WITHDRAW_PAYMENT_ACCOUNT_INFO]),
      /**
       * 获得数据
       */
      getData () {
        this.CHANGE_PENDING(true)
        this.WITHDRAW_PAYMENT_ACCOUNT_INFO().then((res) => {
          if (res.code == CODE.SUCCESS) {
            this.tableData = res.data
            res.data.map(item => {
              // 1支付宝 2微信
              if (item.tdPlatform == 1) {
                this.accountData.alipayAccount = item.account
                this.accountData.alipayLink = item.getBalanceUrl
              } else if (item.tdPlatform == 2) {
                this.accountData.weixinAccount = item.account
                this.accountData.wexinLink = item.getBalanceUrl
              }
            })
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
      }
    }
  }
</script>

