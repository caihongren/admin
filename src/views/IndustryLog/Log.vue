<template>
  <div class="log">

    <div style="background-color: #ffffff;padding: 1%;">
      <span style="font-size:18px;font-weight:600;">类型　</span>
      <el-select v-model="value" placeholder="请选择" style="margin-right:20px" @change="coursePractice(value)">
        <el-option label="任务日志" value="任务日志" />
        <el-option label="登录日志" value="登录日志" />
      </el-select>
    </div>
    <div v-if="taskDisplay">

      <div class="head">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="数据源" style="font-size:12px">
            <el-select v-model="formInline.dataSourceId" placeholder="请选择数据源">
              <el-option v-for="(item,index) in datalist" :key="index" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="企业节点">
            <el-select v-model="formInline.enterpriseNodeId" placeholder="请选择企业节点">
              <el-option v-for="(item,index) in nodelist" :key="index" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="请选择任务状态" style="font-size:12px">
            <el-select v-model="formInline.state" placeholder="请选择状态" @change="seeLists()">
              <el-option label="全部" value="" />
              <el-option label="进行中" value="RUN" />
              <el-option label="暂停" value="PAUSE" />
              <el-option label="结束" value="END" />
              <el-option label="异常" value="ABNORMAL" />
              <el-option label="手动终止" value="MANUAL" />
              <el-option label="归档" value="ARCHIVE" />
              <el-option label="未开始" value="NEW" />
            </el-select>

          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker v-model="times" style="margin-right:20px" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" round icon="el-icon-search" @click="getLists">查询</el-button>
            <el-button type="warning" size="mini" round icon="el-icon-refresh" @click="Reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="conter">
        <div style="padding:10px 0;">
          <p class="tableList" style="padding-left: 10px;">任务日志管理列表</p>
        </div>
        <el-table :data="tableData" :cell-style="rowClass" style="color:#43454a;" stripe :header-cell-style="headClass" @sort-change="sort_change">
          <el-table-column fixed label="序号" type="index" width="60" />
          <el-table-column prop="creatorName" label="创建者" min-width="80" sortable="custom" />

          <el-table-column prop="name" label="任务名" min-width="80" sortable="custom" />
          <el-table-column prop="created" label="创建时间" sortable="custom" min-width="80" />
          <el-table-column prop="dataSourceName" label="数据源名称" min-width="80" sortable="custom" />
          <el-table-column prop="enterpriseNodeName" label="企业节点名称" min-width="80" sortable="custom" />
          <el-table-column prop="taskType" label="任务类型" sortable="custom" min-width="80" :formatter="completionTaskType" />
          <el-table-column label="任务状态" sortable="custom" :formatter="completionStatusc" min-width="100">
            <template slot-scope="scope">
              <div style="display: flex; justify-content: left; width: 100%;margin-top: 5px;">
                <span>{{ completionStatusc(scope.row) }}</span>
                 <el-progress :show-text="false" :stroke-width="5" :percentage="num(scope.row.handlePerformed,scope.row.handleTotal)" color="#4283d8" style="width: 78%;margin-left: 10px;margin-top: 8px;" />
              </div>
              <div style="text-align: center;font-size: 12px;font-weight: 700;color: #4283d8;">{{ scope.row.handlePerformed }} / {{ scope.row.handleFailed }} / {{ scope.row.handleTotal }}</div>

             </template>
          </el-table-column>
          <el-table-column label="操作" min-width="80">
            <template slot-scope="scope">
              <el-button type="text" class="tableButton" @click="see(scope.row.id)">查看</el-button>

              <el-button v-if="scope.row.state == 'NEW'" type="text" style="color: #4283d8;" @click="tabelDelete(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align: center;margin-top: 5%;">
          <el-pagination :current-page="currentPage1" :page-sizes="[10, 20, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="length1" @size-change="handleSizeChange1" @current-change="handleCurrentChange1" />
        </div>
      </div>

    </div>
    <div v-if="Sign">
      <div class="SignIn">
        <div style="padding:10px 0;">
          <p class="tableList" style="padding-left: 10px;">登录日志管理列表</p>
        </div>
        <el-table style="color:#43454a;" :data="History" stripe :cell-style="rowClass" :header-cell-style="headClass">
          <el-table-column fixed label="序号" type="index" width="100" />

          <el-table-column prop="accountName" label="用户名" min-width="100" />
          <el-table-column prop="loginTime" label="登陆时间" :formatter="formatSex" min-width="100" />
          <el-table-column prop="logoutTime" label="退出时间" :formatter="finishTime" min-width="100" />
          <el-table-column prop="online" label="在线时长(分钟)" min-width="100" />
          <el-table-column label="操作" min-width="100">
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
    <!-- 数据表格进行中查看弹出框 -->
    <el-dialog width="35%" :visible.sync="isanswer" append-to-body title="查看任务" :close-on-click-modal="false">
      <el-form ref="task" :model="task" label-width="100px" class="dialog">
        <el-form-item label="名　称">
          <el-input v-model="task.name" :disabled="true" />
        </el-form-item>
        <el-form-item label="状　态">
          <el-input :value="task.state == 'RUN' ? '进行中' : task.state == 'PAUSE' ? '暂停' :task.state == 'END' ? '结束':task.state == 'ABNORMAL' ? '异常':task.state == 'MANUAL' ? '手动终止':task.state == 'ARCHIVE' ? '归档':task.state == 'NEW' ? '未开始': task.state" :disabled="true" />
        </el-form-item>
        <el-form-item label="总　量">
          <el-input v-model="task.handleNum" :disabled="true" />
        </el-form-item>
        <el-form-item label="已完成">
          <el-input v-model="task.finishNum" :disabled="true" />
        </el-form-item>
        <el-form-item label="剩　余">
          <el-input v-model="task.lastNum" :disabled="true" />
        </el-form-item>
        <el-form-item label="已用时">
          <el-input v-model="task.costTime" :disabled="true" />
        </el-form-item>
        <el-form-item label="剩余时间">
          <el-input v-model="task.lastTime" :disabled="true" />
        </el-form-item>
        <el-form-item label="实时速度">
          <el-input v-model="task.speed" :disabled="true" />
        </el-form-item>
        <el-form-item label="平均速度">
          <el-input v-model="task.avgSpeed" :disabled="true" />
        </el-form-item>
      </el-form>

    </el-dialog>
    <!-- 数据表格已结束查看弹出框 -->
    <el-dialog width="70%" top="2vh" :visible.sync="endIsanswer" append-to-body title="导入数据管理" :close-on-click-modal="false">
      <div style="display: flex; justify-content: center; width: 100%; ">
        <p style="font-size: 16px;">任务名称： </p>
        <el-select v-model="taskName" placeholder="请选择任务名称" @change="see(taskName)">
          <el-option v-for="(item,index) in seeName" :key="index" :label="item.label" :value="item.value" />
        </el-select>
        <p style="padding-left: 20px;font-size: 16px;">数据总量：</p>
        <p style="width:3%;color: #738498;font-weight: 700;font-size:16px;">{{ handleNum }}</p>
        <p style="font-size: 16px;">成功： </p>
        <p style="width:3%;color: #738498;font-weight: 700;font-size:16px;">{{ successNum }}</p>
        <p style="font-size: 16px;">失败： </p>
        <p style="width:3%;color: #738498;font-weight: 700;font-size:16px;">{{ failedNum }}</p>
        <p style="font-size: 16px;">用时： </p>
        <p style="width:10%;color: #738498;font-weight: 700;font-size:16px;">{{ costTime }}</p>

        <p style="font-size: 16px;">平均速度： </p>
        <p style="width:5%;color: #738498;font-weight: 700;font-size:16px;">{{ speed }}</p>
      </div>
      <div style="width: 80%; margin: 20px auto;display: flex; justify-content: center;">
        <p>状态筛选:　</p>
        <el-select v-model="successFlie" placeholder="请选择状态" @change="seeLists()">
          <el-option label="全部" value="all" />

          <el-option label="成功" value="success" />
          <el-option label="失败" value="failed" />
          <el-option label="删除" value="delect" />

        </el-select>
      </div>
      <template>
        <el-table
          ref="multipleTable"
          :cell-style="rowClass"
          border
          :header-cell-style="headClass"
          :data="tableData2"
          tooltip-effect="dark"
          style="width: 80%;color:#43454a;margin: 0px auto;"
        >
          <el-table-column fixed label="序号" type="index" width="100" />
          <el-table-column
            prop="handle"
            label="标识名称"
            min-width="100"
          />
          <el-table-column
            prop="prefix"
            label="前缀"
            min-width="100"
          />
          <el-table-column
            :formatter="seeCompletionStatusc"
            prop="success"
            label="状态"
            show-overflow-tooltip
            min-width="100"
          />
          <el-table-column
            prop="msg"
            label="失败原因"
            show-overflow-tooltip
            min-width="100"
          />
        </el-table>
      </template>
      <div style="text-align: center;margin: 5%; 0">
        <el-pagination :current-page="seeCurrentPage" :page-size="seePageSize" layout="total, sizes, prev, pager, next, jumper" :total="seeLength" @size-change="seeHandleSizeChange" @current-change="seeHandleCurrentChange" />
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  deleteloginHistory, // 删除历史记录
  formatDate, // 时间转换
  loginHistory, // 获取历史登录
  taskList,
  nodeSelectList,
  selectList,
  taskInfo,
  handleData,
  taskEndList,
  deleteTask

} from '@/api/user.js'

var time = ''
export default {
  data() {
    return {
      tableData2: [],
      seeOffset: 0,
      seeLimit: 10,

      taskName: '',
      seeId: '',
      successFlie: 'all',
      seePageSize: 10,
      seeCurrentPage: 1,

      formInline: {
        state: '',
        order: '',
        orderBy: '',
        pageSize: 10,
        pageNum: 1,

        startTimeStr: null,
        endTimeStr: null,
        dataSourceId: '',
        enterpriseNodeId: ''
      },
      handleNum: '',
      successNum: '',
      failedNum: '',
      costTime: '',
      deleteNum: '',
      speed: '',
      task: {
        avgSpeed: '',
        costTime: '',
        finishNum: '',
        handleNum: '',
        lastNum: '',
        lastTime: '',
        name: '',
        speed: '',
        state: ''
      },
      seeName: [],

      datalist: [],
      nodelist: [],
      History: [],
      taskDisplay: true,
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
      endIsanswer: false,
      seeLength: 0,

      offset: 0,
      limit: 10,
      length: 10,
      length1: 10,
      currentPage1: 1,

      currentPage4: 1,
      taskIimit: 10,
      taskOffset: 0,
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
      options: [],
      times: null,

      tableData: []
    }
  },
  beforeDestroy() { // 组件销毁前调用
    clearInterval(time)
  },
  mounted() {
    time = setInterval(() => {
      this.getLists(this.formInline.orderBy = 't.created', this.formInline.order = 'desc', this.formInline.seeFile = false)
    }, 1000)// 获取导入任务列表
  },
  created() {
    // 获取历史登录
    this.loginHistory()
    this.nodelists2()
    this.datalists2()

    this.getLists(this.formInline.orderBy = 't.created', this.formInline.order = 'desc') // 获取导入任务列表
  },
  methods: {
    // 表格状态值
    seeCompletionStatusc(row) {
      if (row.success == 'SUCCESS') {
        return '成功'
      } else if (row.success == 'FAILED') {
        return '失败'
      } else if (row.success == 'DELETE') {
        return '删除'
      }
    },
    num(num, nums) {
      if (num && nums && nums > 0) {
        return Math.floor(100 * (num / nums))
      } else {
        return 0
      }
    },
    // 删除未开始任务

    tabelDelete(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '取消',
        cancelButtonText: '确定',
        confirmButtonClass: 'classStyle2',
        closeOnClickModal: false,
        showClose: false,
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
        .catch(() => {
          deleteTask({
            id: id
          }).then(res => {
            this.$message({
              showClose: true,
              duration: 1000,
              type: 'success',
              message: '删除成功!'
            })
            this.getLists()
          })
        })
    },
    completionTaskType(row) {
      if (row.taskType == 'STOCK') {
        return '存量导入'
      } else if (row.taskType == 'TIME') {
        return '实时导入'
      }
    },
    // 排序功能
    sort_change(column) {
      if (column.order == 'descending') {
        this.formInline.order = 'desc'
      } else if (column.order == 'ascending') {
        this.formInline.order = 'asc'
      }
      if (column.prop == 'name') {
        this.formInline.orderBy = 't.name'
      } else if (column.prop == 'created') {
        this.formInline.orderBy = 't.created'
      } else if (column.prop == 'dataSourceName') {
        this.formInline.orderBy = 't.data_source_id'
      } else if (column.prop == 'enterpriseNodeName') {
        this.formInline.orderBy = 't.enterprise_node_id'
      } else if (column.prop == 'taskType') {
        this.formInline.orderBy = 't.task_type'
      } else if (column.prop == 'state') {
        this.formInline.orderBy = 't.state'
      }
      this.getLists()
    },
    nodelists2() {
      if (sessionStorage.getItem('user')) {
        const user = JSON.parse(sessionStorage.getItem('user'))
        nodeSelectList(user.accountNumber == 'admin' ? '' : user.id).then(res => {
          if (res.code == 0) {
            this.nodelist = []
            for (let i = 0; i < res.data.length; i++) {
              this.nodelist.push({ label: res.data[i].name, value: res.data[i].id })
            }
          }
        })
      }
    },
    datalists2() {
      if (sessionStorage.getItem('user')) {
        const user = JSON.parse(sessionStorage.getItem('user'))
        selectList(user.accountNumber == 'admin' ? '' : user.id).then(res => {
          if (res.code == 0) {
            this.datalist = []
            for (let i = 0; i < res.data.length; i++) {
              this.datalist.push({ label: res.data[i].name, value: res.data[i].name })
            }
          }
        })
      }
    },
    // 获取任务列表
    getLists() {
      this.formInline.pageSize = this.taskIimit
      this.formInline.pageNum = this.taskOffset
      if (this.times != null && this.times.length == 2) {
        this.formInline.startTimeStr = this.times[0]
        this.formInline.endTimeStr = this.times[1]
      }
      taskList(this.formInline).then(res => {
        if (res.code == 0) {
          this.tableData = res.data.result
          this.length1 = res.data.total
        }
      })
    },
    // 获取导入任务列表
    seeLists() {
      handleData({
        pageNum: this.seeOffset,
        pageSize: this.seeLimit,
        success: this.successFlie == 'all' ? null : this.successFlie,
        taskId: this.seeId
      }).then(res => {
        if (res.code == 0) {
          this.tableData2 = res.data.result
          this.seeLength = res.data.total
        }
      })
    },
    // 查看已完成任务
    seeNames() {
      if (sessionStorage.getItem('user')) {
        const user = JSON.parse(sessionStorage.getItem('user'))
        taskEndList(user.accountNumber == 'admin' ? '' : user.id).then(res => {
          if (res.code == 0) {
            this.seeName = []
            for (let i = 0; i < res.data.length; i++) {
              this.seeName.push({ label: res.data[i].name, value: res.data[i].id })
            }
          }
        })
      }
    },
    // 任务查看分页
    seeHandleSizeChange(val) {
      this.seeLimit = val
      this.seeLists()
    },
    seeHandleCurrentChange(val) {
      this.seeOffset = val
      this.seeLists()
    },
    // 任务日志分页
    handleSizeChange1(val) {
      this.taskIimit = val
      this.getLists()
    },
    handleCurrentChange1(val) {
      this.taskOffset = val
      this.getLists()
    },
    // 表格状态值
    completionStatusc(row) {
      if (row.state == 'NEW') {
        return '未开始'
      } else if (row.state == 'RUN') {
        return '进行中'
      } else if (row.state == 'PAUSE') {
        return '暂停'
      } else if (row.state == 'END') {
        return '结束'
      } else if (row.state == 'ABNORMAL') {
        return '异常'
      } else if (row.state == 'MANUAL') {
        return '手动终止'
      } else if (row.state == 'ARCHIVE') {
        return '归档'
      } else {
        return 'error'
      }
    },
    // 重置按钮
    Reset() {
      this.times = ''
      this.formInline.startTimeStr = ''
      this.formInline.endTimeStr = ''
      this.formInline.enterpriseNodeId = ''
      this.formInline.dataSourceId = ''
      this.formInline.state = ''

      this.getLists()
    },
    // 查看按钮
    see(id) {
      this.seeId = id
      taskInfo(id).then(res => {
        if (res.code == 0 && res.data && res.data.state) {
          if (res.data.state == 'END') {
            this.endIsanswer = true
            this.handleNum = res.data.handleNum
            this.successNum = res.data.successNum
            this.failedNum = res.data.failedNum
            this.costTime = res.data.costTime
            this.deleteNum = res.data.deleteNum
            this.speed = res.data.speed
            this.taskName = res.data.taskId
            this.seeLists()
            this.seeNames()
          } else if (res.data.state == 'NEW' || res.data.state == 'RUN' || res.data.state == 'PAUSE' || res.data.state == 'ABNORMAL' || res.data.state == 'MANUAL' || res.data.state == 'ARCHIVE ') {
            this.isanswer = true
            this.task.avgSpeed = res.data.avgSpeed,
            this.task.costTime = res.data.costTime,
            this.task.finishNum = res.data.finishNum,
            this.task.handleNum = res.data.handleNum,
            this.task.lastNum = res.data.lastNum,
            this.task.lastTime = res.data.lastTime,
            this.task.name = res.data.name,
            this.task.speed = res.data.speed
            this.task.state = res.data.state
          }
        } else {
          this.$message({
            showClose: true,
            duration: 1000,
            type: 'error',
            message: '此表单无数据'
          })
        }
      })
    },

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
    // 登录日志分页
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
        this.taskDisplay = true
        this.Sign = false
      } else {
        this.Sign = true
        this.taskDisplay = false
      }
    },
    // 删除
    det(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '取消',
        cancelButtonText: '确定',
        confirmButtonClass: 'classStyle2',
        closeOnClickModal: false,
        showClose: false,
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'info',
            duration: 1000,
            message: '已取消删除'
          })
        })
        .catch(() => {
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
    }
  }

}
</script>
<style lang="less" scoped>
.log {
  width: 98%;
    margin: 0 auto;
    padding-top: 20px;
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
.SignIn {
  background-color: #ffffff;
  margin-top: 10px;
  padding-left: 1%;
  padding-right: 1%;
  min-height: 750px;
  border-radius: 3px;
}
</style>
<style>
.log .el-form-item__label {
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
.dialog .el-form-item {
  margin-bottom: 15px;
}
.dialog .el-input__inner {
  height: 33px;
  line-height: 33px;
}
.dialog .el-form-item__label {
  font-size: 12px;
}
.log .el-table th > .cell {
  height: 50px;
  line-height: 50px;
}
.classStyle2{
    background: #4283d8 !important;
    color:#fff !important;
    border:1px solid #4283d8 !important;
}
</style>
