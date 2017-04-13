<!--Copyright (C) 2017 QIANKUN HANLIN Corporation Limited-->
<!-- 导航组件 -->
<template>
  <div class="row menu-wrap">
    <ul>
      <a :href="'#'+item.path" v-for="item in menuList" v-if="jst.inArray(item.pMenu, owneMenu)">
        <li :class="currentPath == item.path || '/'+currentPathName == item.path ? 'nav-active' : ''" @click="handleSelect">
          <span class="menu-icons" :class="item.navclass"></span>{{item.value}}</li>
      </a>
    </ul>
  </div>
</template>

<style scoped>

</style>

<script>
  import * as jst from 'js-common-tools'
  export default {
    props: {
      owneMenu: Array
    },
    mounted () {

    },
    data () {
      let {menuList, menuKeys} = this.$store.state
      let { path, name } = this.$router.history.current
      return {
        jst: jst,
        menuList: menuList,
        menuKeys: menuKeys,
        currentPath: path,
        currentPathName: name
      }
    },
    route: {
      data: function (transition) {
        transition.next({
          currentPath: transition.to.path
        })
      }
    },
    methods: {
      /**
       * 选择每个菜单时的事件处理
       * @param event
       */
      handleSelect (event) {
        this.menuList.forEach((tabObject, index) => {
          let text = event.target.innerText ? event.target.innerText : event.target.textContent
          if (text.trim() === tabObject.value) {
            this.currentPath = tabObject.path
            this.currentPathName = tabObject.path
            tabObject.isActive = true
          } else {
            tabObject.isActive = false
          }
        })
      }
    }
  }
</script>
