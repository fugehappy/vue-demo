<!--Copyright (C) 2017 QIANKUN HANLIN Corporation Limited-->
<!--主页-->
<template>
    <div class="fix-wrapper">
        <h3 class="top-title">乾坤翰林内容云平台 HOME </h3>
    </div>
</template>
<script>
  import {mapActions} from 'vuex'
  import {CHANGE_PENDING} from 'store/globalStore'
  export default {
    data () {
      return {
        fullScreenLoading: true
      }
    },
    methods: {
      ...mapActions([CHANGE_PENDING]),
      showLoading () {
        let {pending} = this.$store.state._global
        if (pending) return
        this.CHANGE_PENDING(true)
        setTimeout(() => {
          this.CHANGE_PENDING(false)
        }, 2000)
      }
    }
  }
</script>
