<!--Copyright (C) 2017 QIANKUN HANLIN Corporation Limited-->
<!-- 导航组件 -->
<template>
  <div class="row menu-wrap">
    <ul>
      <a :href="'#'+item.path" v-for="item in menuList" v-if="jst.inArray(item.pMenu, owneMenu)">
        <li :class="$route.path == item.path ? 'nav-active' : ''">
          <span class="menu-icons" :class="item.navclass"></span>{{item.value}}</li>
      </a>
    </ul>
  </div>
</template>

<script>
  import * as jst from 'js-common-tools'
  export default {
    props: {
      owneMenu: Array
    },
    data () {
      let {menuList} = this.$store.state
      return {
        jst: jst,
        menuList: menuList
      }
    }
  }
</script>
