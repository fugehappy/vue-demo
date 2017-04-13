<!--Copyright (C) 2017 QIANKUN HANLIN Corporation Limited-->
<!--数据统计总页面-->
<template>
  <div class="statistics-wrap fix-wrapper">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="用户统计" name="userStatistics" id="usTab" ref="usTab" class="tabpanel-box">
        <v-us :active="activeName"></v-us>
      </el-tab-pane>
      <el-tab-pane label="资源统计" name="resourcesStatistics" id="rsTab" ref="rsTab" class="tabpanel-box">
        <v-rs :active="activeName"></v-rs>
      </el-tab-pane>
      <el-tab-pane label="交易统计" name="dealStatistics" id="dsTab" ref="dsTab" class="tabpanel-box">
        <v-ds :active="activeName"></v-ds>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import US from './userStatistics.vue'
  import RS from './resourcesStatistics.vue'
  import DS from './dealStatistics.vue'
  export default {
    name: 'statistics',
    data () {
      return {
        activeName: 'userStatistics'
      }
    },
    methods: {
    },
    components: {
      'v-us': US,
      'v-rs': RS,
      'v-ds': DS
    }
  }
</script>
