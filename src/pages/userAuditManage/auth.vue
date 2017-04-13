<!--Copyright (C) 2017 QIANKUN HANLIN Corporation Limited-->
<!--用户认证页面-->
<template>
  <div class="auth-wrap">
    <el-row>
      <h3 class="pading-10 top-title">认证审核页面<el-button @click="goBack" >返回</el-button></h3>
    </el-row>
    <el-form ref="form" :model="form" label-width="100px">
      <v-divline></v-divline>
      <div class="auth-block">
        <el-col :span="12">
          <el-form-item label="翰林账号:">
            <label>{{form.account}}</label>
          </el-form-item>
          <el-form-item label="真实姓名:">
            <label>{{form.account}}</label>
          </el-form-item>
          <el-form-item label="认证类型:">
            <label>{{form.type}}</label>
          </el-form-item>
          <el-form-item label="认证状态:">
            <label>{{form.state}}</label>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="真实头像:">
            <img src="/static/images/logo.png" class="photo" alt="真实头像">
          </el-form-item>
          <el-form-item label="申请时间:">
            <el-date-picker type="date" placeholder="选择日期" v-model="form.date" class="text-input" disabled></el-date-picker>
          </el-form-item>
        </el-col>
      </div>
      <v-divline></v-divline>
      <div class="auth-block">
        <el-col :span="12">
          <div class="sub-title pading-b20">身份证正面</div>
        </el-col>
        <el-col :span="12">
          <div class="sub-title pading-b20">身份证反面</div>
        </el-col>
        <el-col :span="12">
          <img src="/static/images/logo.png" class="identity" alt="身份证正面">
        </el-col>
        <el-col :span="12">
          <img src="/static/images/logo.png" class="identity" alt="身份证反面">
        </el-col>
        <el-col :span="24" class="pading-tb20">
          1.请上传身份证正面带有头像的扫描件或清晰照片<br>
          2. 照片要求格式为JPG/JPEG/GIF/PNG，大小不要超过2M<br>
          注：您的证件信息不会被其他网友看到，我们将严格保密，请放心上传
        </el-col>
      </div>

      <v-divline></v-divline>
      <div class="auth-block">
        <el-col :span="24">
          <div class="sub-title pading-b20">认证材料</div>
        </el-col>
        <el-col :span="8">
          <img src="/static/images/logo.png" class="material" alt="身份证正面">
        </el-col>
        <el-col :span="8">
          <img src="/static/images/logo.png" class="material" alt="身份证反面">
        </el-col>
        <el-col :span="8">
          <img src="/static/images/logo.png" class="material" alt="身份证反面">
        </el-col>
        <el-col :span="24" class="pading-tb20">
          1.请上传您的教师资格证、单位证明、资格证明等一切可证明专业身份的材料照片<br>
          2. 照片要求格式为JPG/JPEG/GIF/PNG，大小不要超过3M<br>
          注：您的证件信息不会被其他网友看到，我们将严格保密，请放心上传
        </el-col>
      </div>
      <v-divline></v-divline>
      <div class="auth-block">
        <el-col :span="4">&nbsp;</el-col>
        <el-col :span="16">
          <el-form-item label="*审核 操作:">
            <el-select v-model="form.account" placeholder="请选择" class="with100">
              <el-option label="审核驳回" value="0"></el-option>
              <el-option label="审核通过" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="* 审核评论:">
            <el-input type="textarea" v-model="form.account"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">提交审核</el-button>
            <el-button >取消</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="4">&nbsp;</el-col>
      </div>
    </el-form>
    <br>
    <br>
    <br>
  </div>
</template>

<script>
  export default {
    name: 'authList',
    mounted () {
      this.$forceUpdate()
    },
    data () {
      return {
        form: {
          number: 1,
          account: 'wangxiaowu',
          tel: '13548784568',
          type: '0',
          state: '0',
          date: '2016-05-02'
        }
      }
    },
    methods: {
      goBack () {
        history.back()
      }
    }
  }

</script>
