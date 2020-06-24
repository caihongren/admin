<template>
  <div class="">
    <div v-show="isshowheight" class="Import" :style="{height:isshowheight?'100%':'0px'}">

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
          <el-form-item style="float: right; line-height: 40px;">
            <el-checkbox v-model="formInline.seeFile" @change="getLists">查看归档</el-checkbox>
          </el-form-item>

        </el-form>
      </div>
      <div class="conter">
        <div style="padding:10px 0;">
          <p class="tableList" style="float:left;padding-left: 10px;">导入导出管理列表</p>
          <el-button type="text" icon="el-icon-plus" class="tableButton" style="float:right;padding-top: 18px;" @click="addTask">新建任务</el-button>
        </div>
        <el-table :data="tableData" :cell-style="rowClass" style="color:#43454a;" stripe :header-cell-style="headClass" @sort-change="sort_change">
          <el-table-column fixed label="序号" type="index" width="100" />
          <el-table-column prop="name" label="任务名" min-width="80" sortable="custom" />
          <el-table-column prop="created" label="创建时间" sortable="custom" min-width="80" />
          <el-table-column prop="dataSourceName" label="数据源名称" min-width="80" sortable="custom" />
          <el-table-column prop="enterpriseNodeName" label="企业节点名称" min-width="80" sortable="custom" />
          <el-table-column prop="taskType" label="任务类型" sortable="custom" min-width="80" :formatter="completionTaskType" />
          <el-table-column label="任务状态" sortable="custom" :formatter="completionStatusc" min-width="100">
            <template slot-scope="scope">
              <div style="display: flex; justify-content: left; width: 100%;margin-top: 5px;">
                <span>{{ completionStatusc(scope.row) }}</span>
                 <el-progress :show-text="false" :stroke-width="5" :percentage="num(scope.row.handlePerformed,scope.row.handleTotal)" style="width: 78%;margin-left: 10px;margin-top: 8px;" />
              </div>
              <div class="tableButton" style="text-align: center;font-size: 12px;font-weight: 700;">{{ scope.row.handlePerformed }}　/　{{ scope.row.handleFailed }} /　 {{ scope.row.handleTotal }}</div>
             </template>
          </el-table-column>
          <el-table-column label="操作" min-width="80">
            <template slot-scope="scope">
              <el-button type="text" class="tableButton" @click="see(scope.row.id)">查看</el-button>
              <el-button v-if="scope.row.state == 'END'" type="text" class="tableButton" @click="file(scope.row.id)">归档</el-button>
              <el-button v-if="scope.row.state == 'NEW'" type="text" style="color: #d05e5e;" @click="tabelDelete(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align: center;margin-top: 5%;">
          <el-pagination :current-page="currentPage" :page-size="pageSize" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" :total="length" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
      </div>
    </div>
    <!-- 数据表格进行中查看弹出框 -->
    <el-dialog width="35%" :visible.sync="isanswer" append-to-body title="查看导入任务" :close-on-click-modal="false">
      <el-form ref="task" :model="task" label-width="100px" class="dialog">
        <el-form-item label="任务名称">
          <el-input v-model="task.name" :disabled="true" />
        </el-form-item>
        <el-form-item label="任务状态">
          <el-input :value="task.state == 'RUN' ? '进行中' : task.state == 'PAUSE' ? '暂停' :task.state == 'END' ? '结束':task.state == 'ABNORMAL' ? '异常':task.state == 'MANUAL' ? '手动终止':task.state == 'ARCHIVE' ? '归档':task.state == 'NEW' ? '未开始': task.state" :disabled="true" />

        </el-form-item>
        <el-form-item label="数据总量">
          <el-input v-model="task.handleNum" :disabled="true" />
        </el-form-item>
        <el-form-item label="已完成">
          <el-input v-model="task.finishNum" :disabled="true" />
        </el-form-item>
        <el-form-item label="剩余">
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
        <el-form-item>
          <div style="display: flex; justify-content: center; width: 100%; ">
            <div style=" width: 80%; ">
              <!-- 进行中状态 -->
              <el-button v-if="task.state == 'RUN'" class="stop" type="danger" size="mini" @click="suspend('stop')">暂停</el-button>
              <!-- 暂停状态 -->
              <el-button v-if="task.state == 'PAUSE'" class="stop" type="danger" size="mini" @click="pauseTask('start')">继续</el-button>
            </div>
            <div style=" width: 20%; ">
              <!-- 进行中状态 -->
              <el-button v-if="task.state == 'RUN'" type="primary" size="mini" @click="termination('end')">终止</el-button>
              <!-- 手动终止状态 -->
              <el-button v-if="task.state == 'MANUAL'" type="primary" size="mini" @click="termination('start')">重启</el-button>
            </div>
          </div>
          <!-- 异常状态 -->
          <div v-if="task.state == 'ABNORMAL'">
            <el-button type="primary" size="mini" @click="pauseTask('start')">重启</el-button>
          </div>
          <!-- 新建状态 -->
          <div v-if="task.state == 'NEW'">
            <el-button type="primary" size="mini" @click="startTask">开始</el-button>
          </div>
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
          @selection-change="handleSelectionChange"
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
          <el-table-column label="操作" min-width="100">
            <template slot-scope="scope">
              <el-button type="text" class="tableButton" @click="seeData(scope.row.id)">查看数据</el-button>
              <el-button type="text" class="tableButton" @click="reImport(scope.row.id)">重新导入</el-button>
              <el-button type="text" class="tableButton" @click="modify(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <div style="text-align: center;margin: 5%; 0">
        <el-pagination :current-page="seeCurrentPage" :page-size="seePageSize" layout="total, sizes, prev, pager, next, jumper" :total="seeLength" @size-change="seeHandleSizeChange" @current-change="seeHandleCurrentChange" />
      </div>
      <div style="width: 80%; margin: 0 auto;text-align: right;">
        <el-button class="stop" type="primary " size="mini" @click="bulkImport">批量导入</el-button>
        <el-button type="danger" size="mini" @click="bulkDelete">批量删除</el-button>
        <el-button class="stop" size="mini" @click="endIsanswer=false">取消</el-button>
      </div>
    </el-dialog>
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
    <div style="width:100%;" :style="{height:!isshowheight?'100%':'0px'}">
      <addtask v-if="!isshowheight" @detpage="detpage" />
    </div>
  </div>
</template>
<script>
import {
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
  deleteTask// 删除未开始任务
} from '@/api/user.js'
import addtask from './addtask'

var time = ''
export default {
  components: {
    addtask
  },
  data() {
    return {
      nodelistsCreatorId: '',
      selectListCreatorId: '',

      taskName: '',
      successFlie: 'all',
      handleNum: '',
      successNum: '',
      failedNum: '',
      costTime: '',
      deleteNum: '',
      speed: '',
      tableData2: [],
      endIsanswer: false,
      times: null,
      nodelist: [], // 企业节点列表
      seeName: [],
      sourcelist: [], // 数据源列表
      datalist: [],
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
      lookDataList: {
        handle: '',
        prefix: '',
        templateData: '',
        value: []
      },
      seeId: '',
      isshowheight: true,
      isanswer: false,
      lookData: false,
      offset: 0,

      limit: 10,
      seeOffset: 0,
      seeLimit: 10,
      length: 0, // 总条数
      currentPage: 1, // 当前页数
      pageSize: 10,

      seeLength: 0,
      seePageSize: 10,
      seeCurrentPage: 1,
      ItemSelected: [], // 表格选中
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
    // time = setInterval(() => {
    //   this.getLists(this.formInline.orderBy = 't.created', this.formInline.order = 'desc', this.formInline.seeFile = false)
    // }, 1000)// 获取导入任务列表

    // this.nodelists() // 获取企业节点列表
    this.nodelists2() // 获取企业节点列表

    // this.datalists() // 获取数据源列表
    this.datalists2() // 获取数据源列表
  },
  methods: {
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
    // 多选
    handleSelectionChange(val) {
      const list = []
      val.forEach(row => {
        list.push(row.id)
      })
      this.ItemSelected = list
    },
    // 批量导入
    bulkImport() {
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
    bulkDelete() {
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
    reImport(id) {
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
          this.see(this.seeId)
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
    modify(id) {
      this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
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
            this.getLists()
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

            this.getLists()
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

            this.getLists()
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

            this.getLists()
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
          this.getLists()
        } else {
          this.$message({
            showClose: true,
            duration: 1000,
            type: 'error',
            message: '开始失败'
          })
        }
      })
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
            this.getLists()
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
            this.getLists()
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
    // 结束状态
    endTask(state) {
      if (state == 'stop') {
        pause({
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
            this.getLists()
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
              message: '继续成功'
            })
            this.see(this.seeId)
            this.getLists()
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
    // 手动终止状态
    manualTask(state) {
      if (state == 'stop') {
        pause({
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
            this.getLists()
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
              message: '继续成功'
            })
            this.see(this.seeId)
            this.getLists()
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
    // 获取企业节点列表
    // nodelists() {
    //   nodeList().then(res => {
    //     if (res.code == 0) {
    //       this.nodelist = []
    //       for (let i = 0; i < res.data.result.length; i++) {
    //         this.nodelist.push({ label: res.data.result[i].name, value: res.data.result[i].name })
    //       }
    //     }
    //   })
    // },
    // // 获取数据源列表
    // datalists() {
    //   list().then(res => {
    //     if (res.code == 0) {
    //       this.datalist = []
    //       for (let i = 0; i < res.data.result.length; i++) {
    //         this.datalist.push({ label: res.data.result[i].name, value: res.data.result[i].name })
    //       }
    //     }
    //   })
    // },
    nodelists2() {
      if (sessionStorage.getItem('user')) {
        const user = JSON.parse(sessionStorage.getItem('user')).id
        this.nodelistsCreatorId = user
        nodeSelectList(this.nodelistsCreatorId).then(res => {
          if (res.code == 0) {
            this.nodelist = []
            for (let i = 0; i < res.data.length; i++) {
              this.nodelist.push({ label: res.data[i].name, value: res.data[i].name })
            }
          }
        })
      }
    },
    datalists2() {
      const user = JSON.parse(sessionStorage.getItem('user')).id
      this.selectListCreatorId = user
      selectList(this.selectListCreatorId).then(res => {
        if (res.code == 0) {
          this.datalist = []
          for (let i = 0; i < res.data.length; i++) {
            this.datalist.push({ label: res.data[i].name, value: res.data[i].name })
          }
        }
      })
    },
    // 获取导入任务列表
    getLists() {
      this.formInline.pageSize = this.pageSize
      this.formInline.pageNum = this.currentPage
      if (sessionStorage.getItem('user')) {
        const user = JSON.parse(sessionStorage.getItem('user'))
        this.formInline.creatorId = user.id
        if (this.times != null && this.times.length == 2) {
          this.formInline.startTimeStr = this.times[0]
          this.formInline.endTimeStr = this.times[1]
        }
        taskList(this.formInline).then(res => {
          if (res.code == 0) {
            this.tableData = res.data.result

            this.length = res.data.total
          }
        })
      }
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
    // 关闭详情页面
    detpage() {
      this.isshowheight = !this.isshowheight
      this.getLists() // 加载导入任务列表
    },
    // 点击新建模态框显示
    addTask() {
      this.isshowheight = false
    },

    headClass() {
      return 'text-align: left;'
    },
    // 表格样式设置
    rowClass() {
      return 'text-align: left;'
    },
    // 分页
    handleSizeChange(val) {
      this.limit = val
      this.getLists()
    },
    handleCurrentChange(val) {
      this.offset = val
      this.getLists()
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
          if (res.data.state == 'END' || res.data.state == 'ARCHIVE') {
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
          } else if (res.data.state == 'NEW' || res.data.state == 'RUN' || res.data.state == 'PAUSE' || res.data.state == 'ABNORMAL' || res.data.state == 'MANUAL') {
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
            this.seeLists()
            this.seeNames()
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
    file(id) {
      this.$confirm('此操作将归档该数据, 是否继续?', '提示', {
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
            message: '已取消归档'
          })
        })
        .catch(() => {
          archive({
            taskId: id
          }).then(res => {
            this.$message({
              showClose: true,
              duration: 1000,
              type: 'success',
              message: '归档成功!'
            })
            this.getLists()
          })
        })

      // archive({
      //   taskId: id
      // }).then(res => {
      //   if (res.code == 0) {
      //     this.$message({
      //       showClose: true,
      //       duration: 1000,
      //       type: 'success',
      //       message: '归档成功'
      //     })
      //     this.getLists()
      //   } else {
      //     this.$message({
      //       showClose: true,
      //       duration: 1000,
      //       type: 'error',
      //       message: '归档失败'
      //     })
      //   }
      // })
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
    // 分页
    seeHandleSizeChange(val) {
      this.seeLimit = val
      this.seeLists()
    },
    seeHandleCurrentChange(val) {
      this.seeOffset = val
      this.seeLists()
    }

  }

}
</script>
<style lang="less" scoped>

.Import {
  min-height: 100%;
  width: 98%;
  margin: 0 auto;
  padding-top: 20px;
  padding-bottom: 40px;
}
.head {
  background-color: #ffffff;
  border-radius: 3px;
  padding-top: 2%;
  padding-left: 1%;
  padding-right: 1%;
}
.conter {
  background-color: #ffffff;
  margin-top: 10px;
  padding-left: 1%;
  padding-right: 1%;

  min-height: 750px;
  border-radius: 3px;
}
</style>
<style>
.classStyle2{
    background: #4283d8 !important;
    color:#fff !important;
    border:1px solid #4283d8 !important;
}
.Import .el-form-item__label {
  font-size: 12px;
}
.Import .el-input__inner {
  height: 33px;
  line-height: 33px;
}
.Import .el-table__header tr,
.el-table__header th {
  padding: 0;
  height: 40px;
}
.Import .el-table__body tr,
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
  font-size: 14px;
  padding: 0 20px;
}
.Import .el-table th > .cell {
  height: 50px;
  line-height: 50px;
}
</style>

