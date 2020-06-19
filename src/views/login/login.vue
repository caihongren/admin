<template>
  <div class="login-container">

    <el-form ref="loginForm" :model="loginUser" :rules="rules1" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">工业互联网标识数据对接系统</h3>
      </div>
      <!-- 用户名 -->
      <el-form-item prop="loginName">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input v-model="loginUser.loginName" placeholder="请输入账号" name="loginName" type="text" tabindex="1" auto-complete="on" @keyup.enter.native="submitForm('loginForm')" @input.native="changeCode" />
      </el-form-item>
      <!-- 密码 -->
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input :key="password" ref="password" v-model="loginUser.password" :type="password" placeholder="请输入密码" name="password" tabindex="2" auto-complete="on" @keyup.enter.native="submitForm('loginForm')" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="password === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <!-- 验证图片 -->
      <el-row :gutter="20">
        <el-col :span="15">
          <el-form-item prop="pictureCode">
            <span class="svg-container">
              <i class="el-icon-key" style="font-weight: 700;font-size: 20px;" />
            </span>
            <el-input :key="pictureCode" v-model="loginUser.pictureCode" placeholder="请输入验证码" name="pictureCode" type="text" tabindex="1" auto-complete="on" @keyup.enter.native="submitForm('loginForm')" />
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <div style="border: 1px solid #dddddd; height:50px;cursor: pointer;" title="点击刷新验证码">
            <img :src="pictureCode" alt="" height="100%;" width="100%" @click="account">
          </div>

        </el-col>

      </el-row>

      <el-button type="primary" style="width:100%;margin-bottom:30px;" @click="submitForm('loginForm')">登录</el-button>

    </el-form>
  </div>
</template>

<script>
// import { validUsername } from '@/utils/validate'
import { login, account } from '@/api/user.js'
export default {
  // name: 'Login',
  data() {
    return {
      pictureCode: '',
      loginUser: {
        loginName: '',
        password: '',
        pictureId: '',
        pictureCode: ''
      },
      rules1: {
        loginName: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9]{5,18}$/,
            message: '长度在5到18个大小写字母',
            trigger: ['blur', 'change']
          }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9_]{6,18}$/,
            message: '长度在6到18个大小写字母和数字或者下划线组合',
            trigger: ['blur', 'change']
          }
        ],
        pictureCode: [
          { required: true, message: '验证码不能为空', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9_]{4}$/,
            message: '长度在4个字符,数字和英文组合',
            trigger: ['blur', 'change']
          }
        ]
      },
      password: 'password',
      redirect: ''
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    this.account()
  },

  methods: {
    changeCode() {
      this.$nextTick(() => {
        if (this.loginUser.loginName !== null) {
          this.loginUser.loginName = this.loginUser.loginName.replace(/[^\w\.\/]/ig, '')
        }
      })
    },
    // 登录验证
    account() {
      account().then(res => {
        const pictureId = res.data.pictureId
        sessionStorage.setItem('pictureId', JSON.stringify(pictureId))
        let str = res.data.pictureCode.replace(/\. +/g, '')
        str = str.replace(/[\r\n]/g, '')
        this.pictureCode = str
        this.loginUser.pictureId = pictureId
      })
    },
    showPwd() {
      if (this.password === 'password') {
        this.password = ''
      } else {
        this.password = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          sessionStorage.clear()
          login(this.loginUser).then(res => {
            console.log(res, 'ffff')
            if (res.code == 0) {
              const token = res.data.token
              const user = res.data.accountEntity
              localStorage.setItem('token', token)
              sessionStorage.setItem('token', token)
              sessionStorage.setItem('user', JSON.stringify(user))
              // if (res.data.role == 'admin') {
              //   alert(1111)
              //   this.$router.push({ path: this.redirect || '/IndustryHome' })
              // } else if (res.data.role == 'data') {
              //   alert(1333111)

              //   this.$router.push({ path: this.redirect || '/IndustryHome' })
              // }
              this.$router.push({ path: this.redirect || '/IndustryHome' })
            } else {
              this.$message.error({
                showClose: true,
                message: res.msg,
                type: 'warning',
                duration: 1000
              })
              this.account()
            }
          })
        } else {
          this.$message.error({
            showClose: true,
            duration: 1000,
            message: '您输入的账号或密码输入不正确,验证码不正确',
            type: 'warning'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #e5e5e5;
$light_gray: black;
$cursor: black;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
// $bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #5a7ea2;

.login-container {
  min-height: 100%;
  width: 100%;
  background-image:url('./../../img/loginbeijin.jpg');
  overflow: hidden;

  .login-form {
   position: relative;
    width: 520px;
    max-width: 100%;
    padding: 40px 35px 0;
    margin: 10% auto;
    overflow: hidden;
    background-color: #ffffff;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
