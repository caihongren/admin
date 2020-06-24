<template>
  <div>
    <div class="headline">
      <h2>授权管理</h2>
    </div>
    <div class="main">
      <h2>状态：{{ type?'已授权':'未授权' }}</h2>
      <h3 v-if="type">授权有效期至{{ time }}</h3>
      <div class="text">
        <div class="old">
          <h2>请求码：</h2>
          <div class="value">
            <el-input v-model="getYard" type="textarea" :autosize="{ minRows: 16 }" placeholder="没获取到请求码" />
          </div>
          <div class="btn">
            <el-button style="margin:auto;width:70%;" round @click="setYard=getYard">复制</el-button>
          </div>
        </div>
        <div class="new">
          <h2>授权码：</h2>
          <div class="value">
            <el-input v-model="setYard" type="textarea" :autosize="{ minRows: 16 }" placeholder="请在此处输入授权码" />
          </div>
          <div class="btn">
            <el-button style="margin:auto;width:70%;" type="primary" round @click="setValue">确认</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      type: true,
      time: new Date(),
      setYard: '',
      getYard:
        'doksaihfiurehfshFOEHSFHSHFIHSFHOSHEHFIUSHFUIHSIUHFOSHIUFEHIASHFISNKSJBCJSFIUWHIUFEHSBFIJSBFIUBUI'
    }
  },
  mounted() { },
  created() { },
  methods: {
    setValue() {
      // eslint-disable-next-line no-undef
      const value = setYard
      if (value == '' || value == null) {
        this.$message.error({
          showClose: true,
          duration: 1000,
          message: '请输入内容'
        })
      } 
    }
  }
}
</script>
<style lang="less" scoped>
.headline {
  width: 100%;
  height: 40px;
  margin: auto;
  color: rebeccapurple;
  h2 {
    text-align: center;
    height: 100%;
    line-height: 40px;
  }
}
.main {
  width: 100%;
  height: 40px;
  margin: auto;
  color: rebeccapurple;
  h2 {
    text-align: center;
    height: 100%;
    line-height: 40px;
  }
  h3 {
    text-align: center;
    height: 100%;
    line-height: 40px;
  }
  .text {
    display: flex;
    height: 500px;
    width: 100%;
    .old,
    .new {
      width: 30%;
      margin: 40px 10%;
      height: 100%;
      h2 {
        height: 50px;
      }
      .value {
        border: 2px solid black;
        border-radius: 20px;
        padding: 10px;
        height: 80%;
      }
      .btn {
        height: 50px;
        margin: auto;
        padding: 10px;
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>

