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
            <el-input v-model="getYard" readonly="readonly" type="textarea" :disabled="true" :autosize="{ minRows: 16 }" placeholder="没获取到请求码" />
            <input ref="inputCopy" :value="getYard" type="textarea" style="opacity: 0;">
          </div>
          <div class="btn">
            <el-button style="margin:auto;width:70%;" round @click="copy">复制</el-button>

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
import { requestCode, putRequestCode, activationInfo } from '@/api/user.js'
export default {

  data() {
    return {
      copyBtn: null, // 存储初始化复制按钮事件
      type: true,
      time: new Date(),
      setYard: '',
      getYard: ''
    }
  },
  mounted() {

  },
  created() {
    this.requestCode()
    this.activationInfo()
  },
  methods: {
    // 授权时间
    activationInfo() {
      activationInfo().then(res => {
        if (res.code == 0) {
          this.time = res.data.activationTime
          this.type = res.data.activation
        }
      })
    },
    copy() {
      const oInput = this.$refs.inputCopy
      oInput.select() // 选择对象;
      if (document.execCommand('Copy')) {
        this.$message({
          message: '复制成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: '复制失败，不支持复制',
          type: 'success'
        })
      }
    },
    requestCode() {
      requestCode().then(res => {
        if (res.code == 0) {
          this.getYard = res.data
        }
      })
    },
    setValue() {
      if (this.getYard == '' || this.setYard == '') {
        this.$message.error({
          showClose: true,
          duration: 1000,
          message: '请求码与授权码不能为空'
        })
        return
      }
      putRequestCode({
        requestCode: this.getYard,
        activationCode: this.setYard
      }).then(res => {
        if (res.code == 0) {
          this.$message({
            showClose: true,
            duration: 1000,
            type: 'success',
            message: '激活成功!'
          })
          this.requestCode()
          this.activationInfo()
        } else {
          this.$message({
            showClose: true,
            duration: 3000,
            message: res.msg
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.headline {
  width: 100%;
  height: 40px;
  margin: auto;
  color: #4283d8;
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
  color: #4283d8;
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

