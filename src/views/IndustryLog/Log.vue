<template>
  <div class="log">

    <div style="background-color: #ffffff;padding: 1%;">
      <span style="font-size:18px;font-weight:600;">类型　</span>
      <el-select v-model="value" placeholder="请选择" style="margin-right:20px" @change="coursePractice(value)">
        <el-option label="任务日志" value="任务日志" />
        <el-option label="登录日志" value="登录日志" />
      </el-select>
    </div>
    <div v-if="task">

      <div class="head">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="数据源" style="font-size:12px">
            <el-input v-model="formInline.user" placeholder="请输入数据源名称" />
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="formInline.region" placeholder="请选择类型">
              <el-option v-for="item in teacherOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker v-model="value2" style="margin-right:20px" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" />
          </el-form-item>
          <el-form-item label="创建者">
            <el-input v-model="formInline.user" placeholder="请输入创建者名称" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" round icon="el-icon-search" @click="query">查询</el-button>
            <el-button type="warning" size="mini" round icon="el-icon-refresh" @click="Reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="conter">
        <div style="padding:10px 0;">
          <p style="border-left: 5px solid #4283d8;padding-left: 10px;color: #4283d8;">任务日志管理列表</p>
        </div>
        <el-table
          :data="tableData"
          stripe
          :cell-style="rowClass"
          :header-cell-style="headClass"
        >
          <el-table-column fixed label="序号" type="index" width="100" />

          <el-table-column prop="date" label="任务名" width="180" />
          <el-table-column prop="name" label="创建者" width="180" />
          <el-table-column prop="address" label="创建时间" />
          <el-table-column prop="address" label="数据源名称" />
          <el-table-column prop="address" label="企业节点名称" />
          <el-table-column prop="address" label="任务类型" />

          <el-table-column prop="address" label="任务状态" />

          <el-table-column label="操作" width="250">
            <template slot-scope="scope">
              <el-button type="text" style="color: #4283d8;" @click="compileClick(scope.row)">查看</el-button>
              <el-button type="text" style="color: #d05e5e;" @click="compileClick(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- <div style="text-align: center;margin-top: 5%;">
          <el-pagination :current-page="currentPage4" :page-sizes="[10, 20, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="length" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div> -->
      </div>

    </div>
    <div v-if="Sign">
      <div class="SignIn">
        <div style="padding:10px 0;">
          <p style="border-left: 5px solid #4283d8;padding-left: 10px;color: #4283d8;">登录日志管理列表</p>
        </div>
        <el-table
          :data="History"
          stripe
          :cell-style="rowClass"
          :header-cell-style="headClass"
        >
          <el-table-column fixed label="序号" type="index" width="100" />

          <el-table-column prop="accountName" label="用户名" width="180" />
          <el-table-column prop="loginTime" label="登陆时间" :formatter="formatSex" />
          <el-table-column prop="logoutTime" label="退出时间" :formatter="finishTime" />
          <el-table-column prop="online" label="在线时长(分钟)" />
          <el-table-column label="操作" width="250">
            <template slot-scope="scope">
              <el-button type="text" style="color:#d05e5e;" :disabled="scope.row.online=='在线'" size="mini" @click="det(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align: center;margin-top: 5%;">
          <el-pagination :current-page="currentPage4" :page-sizes="[10, 20, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="length" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
      </div>

    </div>
    <!-- 数据表格查看弹出框 -->
    <el-dialog width="35%" :visible.sync="isanswer" append-to-body title="查看任务">
      <el-form ref="form" :model="form" label-width="100px" class="dialog">
        <el-form-item label="任务名称">
          <el-input v-model="form.name" :disabled="true" />
        </el-form-item>
        <el-form-item label="任务状态">
          <el-input v-model="form.name" :disabled="true" />
        </el-form-item>
        <el-form-item label="数据总量">
          <el-input v-model="form.name" :disabled="true" />
        </el-form-item>
        <el-form-item label="已完成">
          <el-input v-model="form.name" :disabled="true" />
        </el-form-item>
        <el-form-item label="剩余">
          <el-input v-model="form.name" :disabled="true" />
        </el-form-item>
        <el-form-item label="已用时">
          <el-input v-model="form.name" :disabled="true" />
        </el-form-item>
        <el-form-item label="剩余时间">
          <el-input v-model="form.name" :disabled="true" />
        </el-form-item>
        <el-form-item label="实时速度">
          <el-input v-model="form.name" :disabled="true" />
        </el-form-item>
        <el-form-item label="平均时间">
          <el-input v-model="form.name" :disabled="true" />
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {
  deleteloginHistory, // 删除历史记录
  formatDate, // 时间转换
  loginHistory // 获取历史登录
} from '@/api/user.js'
export default {
  data() {
    return {
      formInline: {
        user: '',
        region: ''
      },
      task: true,
      Sign: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      isanswer: false,
      offset: 0,
      limit: 10,
      length: 10,
      currentPage4: 1,
      newName: '',
      value: '任务日志',
      pickerOptions: {
        shortcuts: [{
          text: '本月',
          onClick(picker) {
            picker.$emit('pick', [new Date(), new Date()])
          }
        }, {
          text: '今年至今',
          onClick(picker) {
            const end = new Date()
            const start = new Date(new Date().getFullYear(), 0)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近六个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setMonth(start.getMonth() - 6)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      value1: '',
      value2: '',
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  created() {
    // 获取历史登录
    this.loginHistory()
  },
  methods: {
    headClass() {
      return 'text-align: center;background:#4283d8;color:#fff'
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
    // 获取日志登陆
    loginHistory() {
      loginHistory({
        pageNum: this.offset,
        pageSize: this.limit
      }).then(res => {
        this.History = res.data.result
        this.length = res.data.total
      })
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
    // 查看按钮
    compileClick(row) {
      this.name = row.name
      this.row = row

      this.isanswer = true
    },
    // 切换日志类型
    coursePractice(id) {
      if (id == '任务日志') {
        this.task = true
        this.Sign = false
      } else {
        this.Sign = true
        this.task = false
      }
    },
    // 删除
    det(id) {
      this.$confirm('此操作将删除该历史记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        confirmButtonClass: 'btnFalses',

        type: 'warning'
      })
        .then(() => {
          deleteloginHistory({
            id: id
          }).then(res => {
            this.$message({
              showClose: true,
              duration: 1000,
              type: 'success',
              message: '删除成功!'
            })
            this.loginHistory()
          })
        })
        .catch(() => {
          this.$message({
            showClose: true,
            duration: 1000,
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }

}
</script>
<style lang="less" scoped>
.log {
  padding: 0 15px;
  width: 100%;
  margin: 2% auto;
  padding-bottom: 40px;
}
.head {
  background-color: #ffffff;
 border-radius: 3px;
  padding-top: 2%;
  padding-left: 1%;
  padding-right: 1%;
  margin-bottom: 10px;

}
.conter {
  background-color: #ffffff;
  padding-left: 1%;
  padding-right: 1%;
  min-height: 700px;
  border-radius: 3px;
}
.SignIn{
   background-color: #ffffff;
  margin-top: 10px;
  padding-left: 1%;
  padding-right: 1%;
  min-height: 750px;
  border-radius: 3px;
}

</style>
<style>
.log .el-button--primary {
  background-color: #4283d8;
  border-color: #4283d8;
}
.btnFalses{
    background: #4283d8 !important;
    color:#fff !important;
    border:#4283d8 !important;
}
.log .el-form-item__label{
    font-size: 12px;
}
.log .el-input__inner {
  height: 33px;
  line-height: 33px;
}
.log .el-table__header tr,
  .el-table__header th {
    padding: 0;
    height: 40px;
}
.log .el-table__body tr,
  .el-table__body td {
    padding: 0;
    height: 40px;
}
 .dialog .el-form-item{
    margin-bottom: 15px;
}
.dialog .el-input__inner {
  height: 33px;
  line-height: 33px;
}
.dialog .el-form-item__label{
  font-size: 12px;

}
</style>
