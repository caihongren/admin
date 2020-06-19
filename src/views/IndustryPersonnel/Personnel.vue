<template>
  <div class="personnel">
    <p style="float:left;border-left: 5px solid #4283d8;padding-left: 10px;color: #4283d8;">人员管理列表</p>
    <el-button type="text" icon="el-icon-plus" style="float:right;color: #4283d8;padding-top: 18px;" @click="dialogFormVisibleadd=true">添加用户</el-button>
    <el-table
      style="color:#43454a;"
      :data="tableData"
      stripe
      :cell-style="rowClass"
      :header-cell-style="headClass"
    >
      <el-table-column fixed label="序号" type="index" width="100" />
      <el-table-column prop="name" label="用户名" min-width="100" />
      <el-table-column prop="role" label="角色" min-width="100" />
      <el-table-column prop="accountNumber" label="账号" min-width="100" />
      <el-table-column prop="state" label="状态" min-width="100" :formatter="completionStatusc" />
      <el-table-column prop="created" label="创建时间" min-width="100" :formatter="formatSex" />
      <el-table-column label="操作" min-width="100">
        <template slot-scope="scope">
          <el-button type="text" round size="mini" style="color: #d05e5e;" @click="changePassword(scope.row.id)">重置密码</el-button>
          <el-button v-if="scope.row.state=='0'" type="text" style="color: #d05e5e;" round size="mini" @click="Deactivation(scope.row.id)">停用</el-button>
          <el-button v-if="scope.row.state=='1'" type="text" style="color: #4283d8;" round size="mini" @click="startUp(scope.row.id)">启动</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: center;margin-top: 5%;">
      <el-pagination :current-page="currentPage4" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="length" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <!-- 新增加弹出框 -->
    <el-dialog title="新增用户" :visible.sync="dialogFormVisibleadd" width="25%" :close-on-click-modal="false">
      <el-form ref="formadd" :model="formadd" :rules="rules" label-width="70px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="formadd.name" maxlength="20" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="用户名" prop="accountNumber">
          <el-input v-model="formadd.accountNumber" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="formadd.roleId" placeholder="请选择角色" style="width:100%">
            <el-option
              v-for="item in teacherOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="defaultPassword" style="width:100%" :disabled="true" />
        </el-form-item>
        <el-form-item>
          <div style="width: 40%;float:right">
            <el-button type="primary" size="small" @click="addteacher('formadd')">确认</el-button>
            <el-button size="small" @click="Reset">重置</el-button>
          </div>

        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {
  formatDate,
  userList, // 获取所有用户
  addUser, // 添加用户
  roleList, // 获取角色
  passwordReset, // 管理员重置密码
  accountDeactivate, // 账号停用
  accountEnable// 账号启动
} from '@/api/user.js'
export default {
  data() {
    return {
      defaultPassword: 'bssj123',
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          {
            min: 0,
            max: 20,
            message: '长度为限制为20位',
            trigger: ['blur', 'change']
          }
        ],
        accountNumber: [

          { required: true, message: '请输入6位以上账号', trigger: 'blur' },
          { min: 6, message: '长度在 6位以上', trigger: 'blur' }

        ]
      },
      formadd: {
        name: '',
        accountNumber: '',
        roleId: ''
      },
      teacherOptions: [],
      dialogFormVisibleadd: false,
      offset: 0,
      limit: 15,
      length: 0,
      currentPage4: 1,
      pageSize: 20,
      tableData: []
    }
  },
  created() {
    this.allPersonnel() // 获取所有用户
    this.roleList()// 获取角色
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
      return formatDate(row.created)
    },
    // 表格状态值
    completionStatusc(row) {
      if (row.state == 1) {
        return '停用'
      } else if (row.state == 0) {
        return '正常'
      }
    },
    // 获取所有用户
    allPersonnel() {
      userList({
        pageNum: this.offset,
        pageSize: this.limit
      }).then(res => {
        this.tableData = res.data.result
        this.length = res.data.total
      })
    },
    // 点击重置密码
    changePassword(userId) {
      this.$confirm('此操作将重置密码', '提示', {
        confirmButtonText: '取消',
        cancelButtonText: '确定',
        confirmButtonClass: 'classStyle2',
        showClose: false,
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        this.$message({
          showClose: true,
          duration: 1000,
          type: 'info',
          message: '已取消重置'
        })
      }).catch(() => {
        passwordReset({
          id: userId
        }).then(res => {
          if (res.code == 0) {
            this.$message({
              showClose: true,
              duration: 1000,
              message: '重置密码成功',
              type: 'success'
            })
          }
        })
      })
    },
    // 分页
    handleSizeChange(val) {
      this.limit = val

      this.allPersonnel()
    },
    handleCurrentChange(val) {
      this.offset = val

      this.allPersonnel()
    },
    // 获取角色
    roleList() {
      roleList().then(res => {
        if (res.code == 0) {
          this.teacherOptions = []
          for (let i = 0; i < res.data.length; i++) {
            this.teacherOptions.push({ label: res.data[i].alias, value: res.data[i].id })
          }
        } else {
          this.$message.error({
            showClose: true,
            duration: 1000,
            message: res.data.msg,
            type: 'warning'
          })
        }
      })
    },
    // 添加用户
    addteacher(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addUser(this.formadd)
            .then(res => {
              if (res.code == 0) {
                this.$message({
                  showClose: true,
                  duration: 1000,
                  message: '新增用户成功',
                  type: 'success'
                })
                this.dialogFormVisibleadd = false
                this.allPersonnel()
                this.formadd = {
                  name: '',
                  accountNumber: '',
                  roleId: ''
                }
              } else {
                this.$message.error({
                  showClose: true,
                  duration: 1000,
                  message: res.msg,
                  type: 'warning'
                })
              }
            })
        } else {
          this.$message.error({
            showClose: true,
            duration: 1000,
            message: '输入异常，请看错误提示',
            type: 'warning'
          })
          return false
        }
      })
    },
    // 账号停用
    Deactivation(row) {
      this.$confirm('此操作将停用该账号, 是否继续?', '提示', {
        confirmButtonText: '取消',
        cancelButtonText: '确定',
        confirmButtonClass: 'classStyle2',
        showClose: false,
        closeOnClickModal: false,
        type: 'warning'
      })
        .then(() => {
          this.$message.error({
            type: 'info',
            duration: 1000,
            message: '已取消停用'
          })
        })
        .catch(() => {
          accountDeactivate({
            id: row
          }).then(res => {
            if (res.code == 0) {
              this.$message({
                showClose: true,
                duration: 1000,
                message: '已停用',
                type: 'success'
              })
              this.allPersonnel()
            } else {
              this.$message.error({
                showClose: true,
                duration: 1000,
                message: '输入异常，请看错误提示',
                type: 'warning'
              })
            }
          })
        })
    },
    // 账号启动
    startUp(row) {
      this.$confirm('此操作将启动该账号, 是否继续?', '提示', {
        confirmButtonText: '取消',
        cancelButtonText: '确定',
        confirmButtonClass: 'classStyle2',
        showClose: false,
        closeOnClickModal: false,
        type: 'warning'
      })
        .then(() => {
          this.$message({
            showClose: true,
            duration: 1000,
            type: 'info',
            message: '已取消'
          })
        }).catch(() => {
          accountEnable({
            id: row
          }).then(res => {
            if (res.code == 0) {
              this.$message({
                showClose: true,
                duration: 1000,
                message: '已启动',
                type: 'success'
              })
              this.allPersonnel()
            } else {
              this.$message.error({
                showClose: true,
                duration: 1000,
                message: '输入异常，请看错误提示',
                type: 'warning'
              })
            }
          })
        })
    },
    Reset() {
      this.formadd.name = ''
      this.formadd.accountNumber = ''
      this.formadd.roleId = ''
    }

  }

}
</script>
<style lang="less" scoped>
.personnel {
  min-height: 850px;
  padding: 0 15px;
  width: 98%;
  margin: 2% auto;
  padding-bottom: 40px;
  background-color: #fff;
}
</style>
<style>
.personnel .el-input__inner {
  height: 33px;
  line-height: 33px;
}
.personnel .el-table__header tr,
  .el-table__header th {
    padding: 0;
    height: 40px;
}
.personnel .el-table__body tr,
  .el-table__body td {
    padding: 0;
    height: 40px;
}

 .personnel .el-table th>.cell{
  height: 50px;
  line-height:50px;
}
.classStyle2{
    background: #4283d8 !important;
    color:#fff !important;
    border:1px solid #4283d8 !important;
}
</style>

