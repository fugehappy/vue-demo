<!--Copyright (C) 2017 QIANKUN HANLIN Corporation Limited-->
<!--角色权限关系配置-->
<template>
  <div class="platform-wrap">
    <el-row>
      <h3 class="title">角色权限关系配置</h3>
    </el-row>
    <el-form>
      <div class="w-cell" v-for="item in roleData">
        <h4>{{item.role.name}}</h4>
        <ul>
          <li v-for="permission in item.permissions"><label><input type="checkbox" checked disabled>{{permission.permName}}</label></li>
        </ul>
      </div>
    </el-form>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import { GET_ROLE_RELATION } from '../store/modules/roleRelationStore'
  import { SUCCESS } from '../config/code'
  export default {
    name: 'roleRelation',
    data () {
      return {
        roleData: null
      }
    },
    mounted () {
      // 初始化请求数据
      this.GET_ROLE_RELATION().then((res) => {
        if (res.code === SUCCESS) {
          this.roleData = res.data
        } else {
          // 异常错误处理
          this.$message.error('获取角色关系失败，请尝试刷新')
        }
      }).catch(() => {
        // 异常错误处理
        this.$message.error('异常错误')
      })
    },
    methods: {
      ...mapActions([GET_ROLE_RELATION])
    }
  }

</script>
