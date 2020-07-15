<template>
  <div class="mylectures">
    <el-tabs v-model="activeName" stretch>
      <el-tab-pane label="个人信息" name="first">
        <div class="information">
          <el-form ref="form" :model="form" :rules="rules" label-width="70px">
            <el-form-item label="账号">
              <el-input v-model="form.accountNumber" :disabled="true" />
            </el-form-item>
            <el-form-item label="用户名">
              <el-input v-model="form.name" :disabled="true" />
            </el-form-item>
            <el-form-item label="角色">
              <el-input v-model="form.role" :disabled="true" />
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="form.password" :disabled="true" />
            </el-form-item>
            <el-form-item>
              <el-button type="warning" size="small" icon="el-icon-edit" @click="changename=true">修改用户名</el-button>
              <el-button type="warning" size="small" icon="el-icon-edit" @click="changePasswordVisible=true"> 修改密码</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="登录历史" name="second">
        <div class="history">
          <el-table :data="History" border style="color:#43454a;" :cell-style="rowClass" :header-cell-style="headClass">
            <el-table-column fixed label="序号" type="index" width="100" />
            <el-table-column prop="accountName" label="用户名" width="180" />
            <el-table-column prop="loginTime" label="登录时间" :formatter="formatSex" />
            <el-table-column prop="logoutTime" label="退出时间" :formatter="finishTime" />
            <el-table-column prop="online" label="在线时长(分钟)" />

          </el-table>
          <div style=" text-align: center;padding-top: 5%;">
            <el-pagination :current-page="currentPage4" :page-sizes="[10, 20, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="length" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
          </div>
        </div>

      </el-tab-pane>
    </el-tabs>

    <el-dialog :visible.sync="changename" append-to-body width="25%" top="15vh" title="编辑用户名" class="modify" :close-on-click-modal="false">
      <el-input v-model="nickname" placeholder="请输入内容" clearable />
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="changename = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="updateUser()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 更改密码弹出框 -->
    <el-dialog type="password" :visible.sync="changePasswordVisible" append-to-body width="400px" top="15vh" title="更改密码" class="modify" :close-on-click-modal="false">
      <el-form ref="ruleForm" :model="ruleForm" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="原密码" prop="oldpass">
          <el-input v-model="ruleForm.oldpass" type="password" autocomplete="off" placeholder="请输入原密码" />
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input v-model="ruleForm.pass" type="password" autocomplete="off" placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input v-model="ruleForm.checkPass" type="password" autocomplete="off" placeholder="请输入确认密码" />
        </el-form-item>
        <el-form-item class="dialog-footer">
          <el-button type="primary" size="mini" class="Sure" @click="submitForm('ruleForm')">提交</el-button>
          <el-button size="mini" class="Reset" @click="resetForm('ruleForm')">重置</el-button>
          <el-button size="mini" class="Reset" @click="changePasswordVisible=flase">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import Vue from 'vue'
import {
  formatDate, // 时间转换格式
  accountInfo, // 获取个人信息
  accountName, // 修改名称
  logout, // 退出登录
  password, // 修改用户密码
  loginHistory // 获取历史登录
} from '@/api/user.js'
export default Vue.extend({
  components: {},

  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6 || value.length > 12) {
        callback(new Error('请输入6到12位密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      offset: 0,
      limit: 10,
      length: 10,
      currentPage4: 1,
      nickname: '',
      History: [],
      rules: {

        oldpass: [{ validator: validatePass, trigger: ['blur', 'change'] }],
        pass: [
          { validator: validatePass, trigger: ['blur', 'change'] }, {
            pattern: /^[a-zA-Z0-9_]{6,18}$/,
            message: '长度在6到18个大小写字母和数字或者下划线组合',
            trigger: ['blur', 'change']
          }
        ],
        checkPass: [
          { validator: validatePass2, trigger: ['blur', 'change'] },
          {
            pattern: /^[a-zA-Z0-9_]{6,18}$/,
            message: '长度在6到18个大小写字母和数字或者下划线组合',
            trigger: ['blur', 'change']
          }
        ]
      },
      ruleForm: {
        // 密码提交表单
        oldpass: '',
        pass: '',
        checkPass: ''
      },
      changename: false, // 更改姓名弹出框

      changePasswordVisible: false,
      activeName: 'first',
      form: {
        // 编辑表单
        accountNumber: '',
        name: '',
        role: '',
        password: '******'
      }

    }
  },
  created() {
    this.personalInformation() // 获取个人信息
    this.loginHistory() // 获取历史登录
  },
  mounted() {

  },
  methods: {
    headClass() {
      return 'text-align: center;'
    },
    // 表格样式设置
    rowClass() {
      return 'text-align: center;'
    },
    // 时间格式转换
    formatSex(row) {
      return formatDate(row.loginTime)
    },
    finishTime(row) {
      return formatDate(row.logoutTime)
    },
    // 分页
    handleSizeChange(val) {
      this.limit = val
      this.loginHistory()
    },
    handleCurrentChange(val) {
      this.offset = val
      this.loginHistory()
    },
    // 获取个人信息
    personalInformation() {
      if (sessionStorage.getItem('user')) {
        const user = JSON.parse(sessionStorage.getItem('user')).id
        accountInfo(user).then(res => {
          if (res.code == 0) {
            const from = {
              accountNumber: res.data.accountNumber,
              name: res.data.name,
              role: res.data.role,
              password: '******'
            }
            this.form = from
          }
        })
      }
    },
    // 修改用户名
    updateUser() {
      if (sessionStorage.getItem('user')) {
        const user = JSON.parse(sessionStorage.getItem('user'))
        accountName({
          name: this.nickname,
          id: user.id
        })
          .then(res => {
            if (res.code == 0) {
              this.form.name = res.data.name
              this.$message({
                showClose: true,
                duration: 1000,
                type: 'success',
                message: '更改用户名成功!'
              })
              this.changename = false
            } else {
              this.$message.error({
                showClose: true,
                duration: 1000,
                message: res.msg,
                type: 'warning'
              })
            }
          })
      }
    },
    // 退出登录
    loginout() {
      if (sessionStorage.getItem('user')) {
        const user = JSON.parse(sessionStorage.getItem('user')).id
        logout({

          accountId: user
        }).then(res => {
          if (res.code == 0) {
            // 退出清除缓存信息
            sessionStorage.clear()
            localStorage.clear()
            this.$router.push('/login')
          }
        })
      }
    },
    // 密码提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (sessionStorage.getItem('user')) {
            const user = JSON.parse(sessionStorage.getItem('user')).id
            password({
              oldPassword: this.ruleForm.oldpass,
              newPassword: this.ruleForm.pass,
              userId: user
            })
              .then(res => {
                if (res.code == 0) {
                  this.$alert('修改密码需重新登录', '修改密码提示', {
                    confirmButtonText: '确定',
                    callback: action => {
                      this.loginout()
                      this.$router.push('/login')
                    }
                  })
                }
              })
              .catch(() => {
                this.$message.error({
                  showClose: true,
                  duration: 1000,
                  message: '密码修改错误',
                  type: 'warning'
                })
                return false
              })
          }
        }
      })
    },
    // 密码重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 获取历史登录
    loginHistory() {
      if (sessionStorage.getItem('user')) {
        const user = JSON.parse(sessionStorage.getItem('user')).id
        loginHistory({
          accountId: user,
          pageNum: this.offset,
          pageSize: this.limit
        }).then(res => {
          this.History = res.data.result
          this.length = res.data.total
        })
      }
    }
  }

})
</script>
<style lang="less" scoped>
.mylectures {
  width: 98%;
  margin: 2% auto;
  background-color: #fff;
  height: 850px;
  .information {
    width: 70%;
    background-color: #fff;
    margin: 5% auto;
    padding: 50px;
    box-shadow: darkgrey 5px 5px 30px 2px;
  }
  .history {
    width: 70%;
    background-color: #fff;
    margin: 5% auto;
    padding: 50px;
    box-shadow: darkgrey 5px 5px 30px 2px;
  }
}
</style>
<style>
.mylectures .el-tabs__nav-wrap::after {
  height: 0px;
}
.mylectures .el-tabs__item.is-active {
  color: #4283d8;
  /* background-color: #cdd9f1; */
}
.mylectures .el-tabs__header {
  margin: 0 auto;
  width: 70%;
}
.mylectures .el-tabs__item {
  height: 60px;
  font-size: 16px;
  line-height: 60px;
}
.mylectures .el-tabs__active-bar {
   background-color: #4283d8;

}

.mylectures .el-form-item__label {
  line-height: 60px;
}
.mylectures .el-form-item__content {
  line-height: 60px;
}
.mylectures .el-tabs__item:hover{
  color: #4283d8;

}
.mylectures .el-input__inner {
  height: 33px;
  line-height: 33px;
}
.mylectures .el-table__header tr,
  .el-table__header th {
    padding: 0;
    height: 40px;
}
.mylectures .el-table__body tr,
  .el-table__body td {
    padding: 0;
    height: 40px;
}
 .mylectures .el-table th>.cell{
  height: 50px;
  line-height:50px;
}
</style>
