<!--Copyright (C) 2017 QIANKUN HANLIN Corporation Limited-->
<!-- 文件上传进度组件 -->
<template>
  <div class="progress-wrap">
    <div class="progress-content">
      <div class="progress-title">上传进度</div>
      <div class="progress progress-striped active">
        <div class="progress-bar progress-bar-success" role="progressbar"
             aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" :style="'width:' + value + '%'">
        </div>
      </div>
      <div class="process-info">{{value}} %</div>
    </div>
  </div>
</template>
<script>
  export default{
    props: {
      value: Number
    }
  }
</script>
<style lang="scss" scoped>
  .progress {
    height: 20px;
    margin-bottom: 20px;
    overflow: hidden;
    background-color: #f5f5f5;
    border-radius: 4px;
    -webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, .1);
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, .1);
  }
  .progress-bar {
    float: left;
    width: 0;
    height: 100%;
    font-size: 12px;
    line-height: 20px;
    color: #fff;
    text-align: center;
    background-color: #337ab7;
    -webkit-box-shadow: inset 0 -1px 0 rgba(0, 0, 0, .15);
    box-shadow: inset 0 -1px 0 rgba(0, 0, 0, .15);
    -webkit-transition: width .6s ease;
    -o-transition: width .6s ease;
    transition: width .6s ease;
  }
  .progress-striped .progress-bar,
  .progress-bar-striped {
    background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);
    background-image:      -o-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);
    background-image:         linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);
    -webkit-background-size: 40px 40px;
    background-size: 40px 40px;
  }
  .progress.active .progress-bar,
  .progress-bar.active {
    -webkit-animation: progress-bar-stripes 2s linear infinite;
    -o-animation: progress-bar-stripes 2s linear infinite;
    animation: progress-bar-stripes 2s linear infinite;
  }
  .progress-bar-success {
    background-color: #5cb85c;
  }
  .progress-striped .progress-bar-success {
    background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);
    background-image:      -o-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);
    background-image:         linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);
  }
  .progress-bar-info {
    background-color: #5bc0de;
  }
  .progress-striped .progress-bar-info {
    background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);
    background-image:      -o-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);
    background-image:         linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);
  }
  .progress-wrap {
    display: block;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    z-index: 9999;
  }

  .progress-wrap .progress-content {
    width: 300px;
    height: 150px;
    background-color: #FFFFFF;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -175px;
    margin-left: -150px;
    -webkit-background-clip: content;
    box-shadow: 1px 1px 50px rgba(0, 0, 0, .3);
    border-radius: 2px 2px 0 0;
  }

  .progress-wrap .progress-title {
    background: #5CB85C;
    color: #fff;
    border: none;
    padding: 0 80px 0 20px;
    height: 42px;
    line-height: 42px;
    font-size: 14px;
    overflow: hidden;
    border-radius: 2px 2px 0 0;
  }

  .progress-wrap .progress {
    width: 250px;
    margin: 40px auto 10px;
  }
  .progress-wrap .process-info{
    text-align: center;
    color: #5CB85C;;
  }
</style>
