<template>
  <div>
    <div style="display: flex; justify-content: center; width: 100%; ">
      <p style="font-size: 16px;">任务名称： </p>
      <el-select v-model="timeTask" placeholder="请选择任务名称" @change="see(timeTask)">
        <el-option v-for="(item,index) in seeTimeTask" :key="index" :label="item.label" :value="item.value" />
      </el-select>
      <p style="padding-left: 20px;font-size: 16px;">数据总量：</p>
      <p style="width:3%;color: #738498;font-weight: 700;font-size:16px;">{{ handleNum }}</p>
      <p style="font-size: 16px;">成功： </p>
      <p style="width:3%;color: #738498;font-weight: 700;font-size:16px;">{{ successNum }}</p>
      <p style="font-size: 16px;">失败： </p>
      <p style="width:3%;color: #738498;font-weight: 700;font-size:16px;">{{ failedNum }}</p>
      <p style="font-size: 16px;">启动时间： </p>
      <p style="width:13%;color: #738498;font-weight: 700;font-size:16px;">{{ startTime }}</p>

      <p style="font-size: 16px;">新增： </p>
      <p style="width:5%;color: #738498;font-weight: 700;font-size:16px;">{{ insert }}</p>
      <p style="font-size: 16px;">修改： </p>
      <p style="width:5%;color: #738498;font-weight: 700;font-size:16px;">{{ update }}</p>
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
        :data="tableData3"
        tooltip-effect="dark"
        style="width: 80%;color:#43454a;margin: 0px auto;"
      >
        <el-table-column
          type="selection"
          min-width="100"
        />
        <el-table-column
          prop="handle"
          label="标识名称"
          min-width="100"
        />
        <el-table-column
          prop="prefix"
          label="前缀"
          min-width="45"
        />
        <el-table-column
          prop="updated"
          label="执行时间"
          show-overflow-tooltip
          min-width="80"
        />
        <el-table-column
          prop="type"
          label="类型"
          show-overflow-tooltip
          min-width="25"
        />
        <el-table-column
          :formatter="seeCompletionStatusc"
          prop="success"
          label="状态"
          show-overflow-tooltip
          min-width="25"
        />
        <el-table-column
          prop="msg"
          label="失败原因"
          show-overflow-tooltip
          min-width="100"
        />
        <el-table-column label="操作" min-width="100">
          <template slot-scope="scope">
            <el-button type="text" class="tableButton" @click="seeData(scope.row.id)">查看数据</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <div style="text-align: center;margin: 5%; 0">
      <el-pagination :current-page="seeCurrentPage" :page-size="seePageSize" layout="total, sizes, prev, pager, next, jumper" :total="seeLength" @size-change="seeHandleSizeChange" @current-change="seeHandleCurrentChange" />
    </div>
    <div style="padding-bottom: 40px;width: 80%; margin: 0 auto;">
      <div style="float: left;">
        <el-button v-if="timeTaskState == 'RUN'" class="stop" type="danger" size="mini" @click="suspend('stop')">暂停</el-button>
        <el-button v-if="timeTaskState == 'PAUSE'" class="stop" type="danger" size="mini" @click="pauseTask('start')">继续</el-button>
        <el-button v-if="timeTaskState == 'RUN'" type="primary" size="mini" @click="termination('end')">终止</el-button>
        <el-button v-if="timeTaskState == 'MANUAL'" type="primary" size="mini" @click="termination('start')">重启</el-button>
        <el-button v-if="timeTaskState == 'NEW'" type="primary" size="mini" @click="startTask">开始</el-button>
      </div>
      <div style="float: right;">
        <el-button class="stop" size="mini" @click="endIsanswer()">取消</el-button>
        <el-button class="stop" size="mini" @click="wipeData">清空数据</el-button>
      </div>
    </div>
    <!-- 异常状态 -->
    <div v-if="timeTaskState == 'ABNORMAL'">
      <el-button type="primary" size="mini" @click="pauseTask('start')">重启</el-button>
    </div>
    <!--查看数据弹出框 -->
    <el-dialog width="40%" top="6vh" :visible.sync="lookData" append-to-body title="查看数据" :close-on-click-modal="false">
      <el-form ref="task" :model="lookDataList" label-width="150px" class="dialog">
        <el-form-item label="前　　缀">
          <el-input v-model="lookDataList.prefix" :disabled="true" />
        </el-form-item>
        <el-form-item label="标　　识">
          <el-input v-model="lookDataList.handle" :disabled="true" />

        </el-form-item>
        <el-form-item label="模　　板">
          <el-input v-model="lookDataList.templateData" :disabled="true" />
        </el-form-item>
        <el-form-item v-for="(item,index) in lookDataList.value" :key="index" v-model="lookDataList.value" :label="item.idType">
          <el-input :value="item.value" :disabled="true" />
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {
  handleInfo, // 查看标识数据

  timeTask, // 获取实时任务
  taskList, // 获取任务列表
  resume, // 任务恢复
  pause, // 任务暂停
  start, // 开始执行任务
  taskInfo, // 查看任务
  manual, // 手动终止
  handleData, // 查看任务数据
  timeHandle// 清空数据
} from '@/api/user.js'
export default {
  props: {
    selected: String

  },
  data() {
    return {
      lookData: false,

      seeCurrentPage: 1,
      seeLength: 0,
      seePageSize: 10,
      handleNum: '',
      successNum: '',
      failedNum: '',
      costTime: '',
      deleteNum: '',
      insert: '',
      startTime: '',
      tableData3: [],
      seeId: '',
      update: '',
      speed: '',
      timeTask: '',
      successFlie: 'all',
      seeTimeTask: [],
      seeOffset: 0,
      seeLimit: 10,
      timeTaskState: '',

      formInline: {

        seeFile: '',
        state: '',

        order: '',
        pageSize: 10,
        pageNum: 1,

        orderBy: '',
        startTimeStr: null,
        endTimeStr: null,
        dataSourceId: '',
        enterpriseNodeId: '',
        creatorId: ''

      },
      lookDataList: {
        handle: '',
        prefix: '',
        templateData: '',
        value: []
      }
    }
  },
  created() {
    this.seeId = this.selected
    this.see(this.seeId)
  },
  methods: {
    endIsanswer() {
      this.$emit('closeGetLists')
    },
    seeData(id) {
      this.lookData = true
      handleInfo(id).then(res => {
        if (res.code == 0) {
          this.lookDataList.handle = res.data.handle
          this.lookDataList.prefix = res.data.prefix
          this.lookDataList.templateData = res.data.templateData
          this.lookDataList.value = res.data.value
        }
      })
    },
    wipeData() {
      this.$confirm('此操作将永久清空该任务, 是否继续?', '提示', {
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
          timeHandle({
            id: this.seeId
          }).then(res => {
            this.$message({
              showClose: true,
              duration: 1000,
              type: 'success',
              message: '删除成功!'
            })
            this.see()
            this.seeLists()
          })
        })
    },
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
    headClass() {
      return 'text-align: left;'
    },
    // 表格样式设置
    rowClass() {
      return 'text-align: left;'
    },
    // 获取数据管理列表
    seeLists() {
      handleData({
        pageNum: this.seeOffset,
        pageSize: this.seeLimit,
        success: this.successFlie == 'all' ? null : this.successFlie,
        taskId: this.seeId
      }).then(res => {
        console.log(res, '获取数据管理列表')
        if (res.code == 0) {
          this.tableData3 = res.data.result
          this.seeLength = res.data.total
        }
      })
    },

    // 分页
    seeHandleSizeChange(val) {
      this.seeLimit = val
      this.seeLists()
    },
    seeHandleCurrentChange(val) {
      this.seeOffset = val
      this.seeLists()
    },

    // 查看按钮
    see(selected) {
      console.log(selected, '222')
      taskInfo(selected || this.seeId).then(res => {
        if (res.code == 0) {
          this.handleNum = res.data.handleNum
          this.successNum = res.data.successNum
          this.failedNum = res.data.failedNum
          this.costTime = res.data.costTime
          this.deleteNum = res.data.deleteNum
          this.insert = res.data.insert
          this.startTime = res.data.startTime
          this.update = res.data.update
          this.timeTask = res.data.taskId
          this.timeTaskState = res.data.state
          this.seeId = res.data.taskId
          this.seeLists()

          this.seeTask()
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
    // 获取任务名称下拉菜单
    seeTask() {
      if (sessionStorage.getItem('user')) {
        const user = JSON.parse(sessionStorage.getItem('user')).id
        timeTask(user).then(res => {
          console.log(res, '获取任务名称下拉菜单')
          if (res.code == 0) {
            this.seeTimeTask = []
            for (let i = 0; i < res.data.length; i++) {
              this.seeTimeTask.push({ label: res.data[i].name, value: res.data[i].id })
            }
          }
        })
      }
    },
    // 获取导入任务列表
    getLists() {
      this.formInline.pageSize = this.pageSize
      this.formInline.pageNum = this.currentPage
      if (sessionStorage.getItem('user')) {
        const user = JSON.parse(sessionStorage.getItem('user'))
        this.formInline.creatorId = user.id
        this.listPage = []
        taskList(this.formInline).then(res => {
          console.log(res, '获取导入任务列表')
          if (res.code == 0) {
            this.tableData = res.data.result
            this.length = res.data.total
            for (let i = 0; i < res.data.result.length; i++) {
              this.listPage.push(res.data.result[i].id)
            }
          }
        })
      }
    },
    // 状态进行中
    suspend(state) {
      if (state == 'stop') {
        pause({
          taskId: this.seeId
        }).then(res => {
          if (res.code == 0) {
            this.$message({
              showClose: true,
              duration: 1000,
              type: 'success',
              message: '暂停成功'
            })
            this.see(this.seeId)
            this.$emit('CallbackGetLists')
          } else {
            this.$message({
              showClose: true,
              duration: 1000,
              type: 'error',
              message: '暂停失败'
            })
          }
        })
      } else if (state == 'start') {
        resume({
          taskId: this.seeId
        }).then(res => {
          if (res.code == 0) {
            this.$message({
              showClose: true,
              duration: 1000,
              type: 'success',
              message: '继续成功'
            })
            this.see(this.seeId)

            this.$emit('CallbackGetLists')
          } else {
            this.$message({
              showClose: true,
              duration: 1000,
              type: 'error',
              message: '继续失败'
            })
          }
        })
      }
    },
    // 暂停状态
    pauseTask(state) {
      if (state == 'start') {
        resume({
          taskId: this.seeId
        }).then(res => {
          if (res.code == 0) {
            this.$message({
              showClose: true,
              duration: 1000,
              type: 'success',
              message: '继续成功'
            })
            this.see(this.seeId)
            this.$emit('CallbackGetLists')
          } else {
            this.$message({
              showClose: true,
              duration: 1000,
              type: 'error',
              message: '继续失败'
            })
          }
        })
      } else if (state == 'stop') {
        pause({
          taskId: this.seeId
        }).then(res => {
          if (res.code == 0) {
            this.$message({
              showClose: true,
              duration: 1000,
              type: 'success',
              message: '暂停成功'
            })
            this.see(this.seeId)
            this.$emit('CallbackGetLists')
          } else {
            this.$message({
              showClose: true,
              duration: 1000,
              type: 'error',
              message: '暂停失败'
            })
          }
        })
      }
    },
    // 状态进行中

    termination(state) {
      if (state == 'end') {
        manual({
          taskId: this.seeId
        }).then(res => {
          if (res.code == 0) {
            this.$message({
              showClose: true,
              duration: 1000,
              type: 'success',
              message: '终止成功'
            })
            this.see(this.seeId)

            this.$emit('CallbackGetLists')
          } else {
            this.$message({
              showClose: true,
              duration: 1000,
              type: 'error',
              message: '终止失败'
            })
          }
        })
      } else if (state == 'start') {
        resume({
          taskId: this.seeId
        }).then(res => {
          if (res.code == 0) {
            this.$message({
              showClose: true,
              duration: 1000,
              type: 'success',
              message: '重启成功'
            })
            this.see(this.seeId)

            this.$emit('CallbackGetLists')
          } else {
            this.$message({
              showClose: true,
              duration: 1000,
              type: 'error',
              message: '重启失败'
            })
          }
        })
      }
    },
    // 状态新建
    startTask() {
      start({
        taskId: this.seeId
      }).then(res => {
        if (res.code == 0) {
          this.$message({
            showClose: true,
            duration: 1000,
            type: 'success',
            message: '开始成功'
          })
          this.see(this.seeId)
          this.$emit('CallbackGetLists')
        } else {
          this.$message({
            showClose: true,
            duration: 1000,
            type: 'error',
            message: '开始失败'
          })
        }
      })
    }
  }
}
</script>

