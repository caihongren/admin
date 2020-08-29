<template>
  <div style="padding:0 30px;">
    <div style="display: flex;   width: 100%; ">
      <div>任务名称：
        <el-input v-model="textName" style="margin: 10px;width:65%"></el-input>

      </div>
      <div style="margin: 10px;">状态筛选:
        <el-select v-model="successFlie" placeholder="请选择状态" @change="seeLists()">
          <el-option label="全部" value="all" />
          <el-option label="成功" value="success" />
          <el-option label="失败" value="failed" />
          <el-option label="删除" value="delect" />
        </el-select>
      </div>
      <div>标识名称:
        <el-input v-model="search" placeholder="请输入关键字" style="width:70%;margin: 10px;">
          <el-button @click="seeLists" slot="append" icon="el-icon-search" style="background-color: #538ef4;color: #fff;border: 1px solid #538ef4;"></el-button>
        </el-input>
      </div>
      <el-button style="background-color: #538ef4;color: #fff;border: 1px solid #538ef4;margin: 10px;" @click="download()" v-loading.fullscreen.lock="link">导出</el-button>
    </div>
    <template>
      <el-table ref="multipleTable" :cell-style="rowClass" border :header-cell-style="headClass" :data="tableData2" tooltip-effect="dark"
        style="width: 100%;color:#43454a;margin: 0px auto;" @selection-change="handleSelectionChange">
        <el-table-column type="selection" min-width="100" />
        <el-table-column prop="handle" label="标识名称" min-width="100" />
        <el-table-column prop="prefix" label="前缀" min-width="45" />
        <el-table-column prop="updated" label="执行时间" show-overflow-tooltip min-width="80" />
        <el-table-column prop="type" label="类型" show-overflow-tooltip min-width="25" />
        <el-table-column prop="success" label="状态" show-overflow-tooltip min-width="25" />
        <el-table-column prop="msg" label="失败原因" show-overflow-tooltip min-width="100" />
        <el-table-column label="操作" min-width="100">
          <template slot-scope="scope">
            <el-button type="text" class="tableButton" @click="seeData(scope.row.id)">查看数据</el-button>
            <el-button v-if="operatingType!='DELETE'" type="text" class="tableButton" @click="reImport(scope.row.id)">重新导入</el-button>
            <el-button v-if="operatingType!='DELETE'" type="text" class="tableButton" @click="modify(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <div style="text-align: center;margin: 5%; 0">
      <el-pagination :current-page="seeCurrentPage" :page-size="seePageSize" layout="total, sizes, prev, pager, next, jumper" :total="seeLength"
        @size-change="seeHandleSizeChange" @current-change="seeHandleCurrentChange" />
    </div>
    <div style="width: 80%; margin: 0 auto;text-align: right;">
      <el-button class="stop" type="primary " size="mini" @click="bulkImport">批量导入</el-button>
      <el-button type="danger" size="mini" @click="bulkDelete">批量删除</el-button>
      <el-button class="stop" size="mini" @click="endIsanswer()">取消</el-button>
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
  download,//下载数据
  timeTask, // 获取实时任务
  taskState, // 获取任务状态
  taskList, // 获取任务列表
  resume, // 任务恢复
  pause, // 任务暂停
  start, // 开始执行任务
  taskInfo, // 查看任务
  manual, // 手动终止
  taskEndList, // 查看已完成任务
  handleData, // 查看任务数据
  archive, // 任务归档
  deleteHandle, // 删除标识
  handle, // 重新导入
  handleInfo, // 查看标识数据
  nodeSelectList, // 获取企业节点下拉列表
  selectList, // 获取数据源下拉列表
  deleteTask, // 删除未开始任务
  timeHandle// 清空数据
} from '@/api/user.js'
// import FileSaver from 'file-saver'
export default {
  props: {
    selected: String,


  },
  data () {
    return {
      search: '',
      textName: '',
      link: false,
      ItemSelected: [], // 表格选中

      seeName: [],
      lookData: false,
      lookDataList: {
        handle: '',
        prefix: '',
        templateData: '',
        value: []
      },
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
      tableData2: [],
      seeId: '',
      update: '',
      speed: '',
      timeTask: '',
      successFlie: 'all',
      seeTimeTask: [],
      seeOffset: 0,
      seeLimit: 10,
      timeTaskState: '',
      taskName: '',
      operatingType: '',
      formInline: {
        pageSize: 10,
        pageNum: 1,
        creatorId: '',
        seePageSize: 10

      }
    }
  },
  created () {
    this.seeId = this.selected
    // this.see(this.seeId)
    this.seeLists()
    // this.seeTask()
  },
  methods: {
    endIsanswer () {
      this.$emit('closelsanswer')
    },
    seeData (id) {
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
    headClass () {
      return 'text-align: left;'
    },
    // 表格样式设置
    rowClass () {
      return 'text-align: left;'
    },
    // 获取导入任务列表
    seeLists () {
      handleData({
        handle: this.search,
        pageNum: this.seeOffset,
        pageSize: this.seeLimit,
        success: this.successFlie == 'all' ? null : this.successFlie,
        taskId: this.seeId
      }).then(res => {
        if (res.code == 0) {
          this.textName = res.data.taskName
          this.tableData2 = res.data.taskData.result
          this.seeLength = res.data.taskData.total
        }
      })
    },
    download () {
      this.link = true
      setTimeout(() => {
        let  elemIF  =  document.createElement('iframe')
        elemIF.src  =  'http://192.168.0.17:9057/job/download?taskId=' + this.seeId + '&handle=' + this.search
                    elemIF.style.display  =  'none'
                    document.body.appendChild(elemIF)
        this.link = false;
      }, 5000);


    },
    // 多选
    handleSelectionChange (val) {
      const list = []
      val.forEach(row => {
        list.push(row.id)
      })
      this.ItemSelected = list
    },
    // 批量导入
    bulkImport () {
      const list = this.ItemSelected
      if (list.length == 0) {
        this.$message({
          showClose: true,
          duration: 1000,
          type: 'error',
          message: '请选择导入的数据'
        })
        return
      }
      handle({
        handles: list,
        taskId: this.seeId
      }).then(res => {
        if (res.code == 0) {
          this.$message({
            showClose: true,
            duration: 1000,
            message: '导入的数据成功',
            type: 'success'
          })
          this.ItemSelected = []
        } else {
          this.$message({
            showClose: true,
            duration: 1000,
            type: 'error',
            message: res.msg
          })
        }
      })
    },
    // 批量删除
    bulkDelete () {
      const list = this.ItemSelected
      if (list.length == 0) {
        this.$message({
          showClose: true,
          duration: 1000,
          type: 'error',
          message: '请选择导入的数据'
        })
        return
      }
      deleteHandle({
        handles: list,
        taskId: this.seeId
      }).then(res => {
        if (res.code == 0) {
          this.$message({
            showClose: true,
            duration: 1000,
            message: '删除成功',
            type: 'success'
          })
          this.ItemSelected = []
        } else {
          this.$message({
            showClose: true,
            duration: 1000,
            type: 'error',
            message: res.msg
          })
        }
      })
    },
    // 重新导入
    reImport (id) {
      handle({
        handles: [id],
        taskId: this.seeId
      }).then(res => {
        if (res.code == 0) {
          this.$message({
            showClose: true,
            duration: 1000,
            message: '重新导入成功',
            type: 'success'
          })
          this.ItemSelected = []
          this.seeLists()
          // this.see(this.seeId)
        } else {
          this.$message({
            showClose: true,
            duration: 1000,
            type: 'error',
            message: res.msg
          })
        }
      })
    },
    // 删除
    modify (id) {
      this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
        confirmButtonText: '取消',
        cancelButtonText: '确定',
        confirmButtonClass: 'classStyle2',
        closeOnClickModal: false,
        showClose: false,
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
        .catch(() => {
          deleteHandle({
            handles: [id],
            taskId: this.seeId
          }).then(res => {
            if (res.code == 0) {
              this.$message({
                showClose: true,
                duration: 1000,
                type: 'success',
                message: '删除成功!'
              })
              this.ItemSelected = []
              this.seeLists()
            } else {
              this.$message({
                showClose: true,
                duration: 1000,
                type: 'error',
                message: res.msg
              })
            }
          })
        })
    },
    // 分页
    seeHandleSizeChange (val) {
      this.seeLimit = val
      this.seeLists()
    },
    seeHandleCurrentChange (val) {
      this.seeOffset = val
      this.seeLists()
    },
    // 查看已完成任务
    seeNames () {
      if (sessionStorage.getItem('user')) {
        const user = JSON.parse(sessionStorage.getItem('user')).id
        taskEndList(user).then(res => {
          if (res.code == 0) {
            this.seeName = []
            for (let i = 0; i < res.data.length; i++) {
              this.seeName.push({ label: res.data[i].name, value: res.data[i].id })
            }
          }
        })
      }
    },
    // 查看按钮
    // see(selected) {
    //   taskInfo(selected || this.seeId).then(res => {
    //     if (res.code == 0) {
    //       this.handleNum = res.data.handleNum
    //       this.successNum = res.data.successNum
    //       this.failedNum = res.data.failedNum
    //       this.costTime = res.data.costTime
    //       this.deleteNum = res.data.deleteNum
    //       this.speed = res.data.speed
    //       this.taskName = res.data.taskId
    //       this.operatingType = res.data.operatingType

    //       this.seeId = res.data.taskId

    //       this.seeLists()
    //       this.seeNames()
    //     } else {
    //       this.$message({
    //         showClose: true,
    //         duration: 1000,
    //         type: 'error',
    //         message: '此表单无数据'
    //       })
    //     }
    //   })
    // },
    // seeTask() {
    //   if (sessionStorage.getItem('user')) {
    //     const user = JSON.parse(sessionStorage.getItem('user')).id
    //     timeTask(user).then(res => {
    //       if (res.code == 0) {
    //         this.seeTimeTask = []
    //         for (let i = 0; i < res.data.length; i++) {
    //           this.seeTimeTask.push({ label: res.data[i].name, value: res.data[i].id })
    //         }
    //       }
    //     })
    //   }
    // },
    // 获取导入任务列表
    getLists () {
      this.formInline.pageSize = this.pageSize
      this.formInline.pageNum = this.currentPage
      if (sessionStorage.getItem('user')) {
        const user = JSON.parse(sessionStorage.getItem('user'))
        this.formInline.creatorId = user.id
        this.listPage = []
        taskList(this.formInline).then(res => {
          if (res.code == 0) {
            this.tableData = res.data.result
            this.length = res.data.total
            for (let i = 0; i < res.data.result.length; i++) {
              this.listPage.push(res.data.result[i].id)
            }
          }
        })
      }
    }

  }
}
</script>

