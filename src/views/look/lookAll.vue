<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="11">
        <el-select v-model="value" placeholder="请选择" @change="coursePractice(value)"
          style="margin-top:10px;margin-left:50px;">
          <el-option label="任务状态" value="任务状态" />
          <el-option label="任务配置" value="任务配置" />
          <el-option label="任务明细" value="任务明细" />
        </el-select>
      </el-col>
      <el-col :span="6">
        <h2>{{task.name}}</h2>
      </el-col>
    </el-row>
    <div v-if="taskDisplay">
      <el-form ref="task" :model="task" label-width="100px" class="dialog">
        <el-form-item label="任务状态">
          <el-input
            :value="task.state == 'RUN' ? '进行中' : task.state == 'PAUSE' ? '暂停' :task.state == 'END' ? '结束':task.state == 'ABNORMAL' ? '异常':task.state == 'MANUAL' ? '手动终止':task.state == 'ARCHIVE' ? '归档':task.state == 'NEW' ? '未开始': task.state"
            :disabled="true" />
        </el-form-item>
        <el-form-item label="数据总量">
          <el-input v-model="task.handleNum" :disabled="true" />
        </el-form-item>
        <el-form-item label="已 完 成">
          <el-input v-model="task.finishNum" :disabled="true" />
        </el-form-item>
        <el-form-item label="剩　　余">
          <el-input v-model="task.lastNum" :disabled="true" />
        </el-form-item>
        <el-form-item label="已 用 时">
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
    </div>












    <div v-if="Sign">
      <el-form ref="configuration" :model="configuration" label-width="130px" class="dialog">
        <div style="display: flex;">
          <el-form-item label="创建时间">
            <el-input v-model="configuration.created" :disabled="true" />
          </el-form-item>
          <el-form-item label="创建人">
            <el-input v-model="configuration.creatorName" :disabled="true" />
          </el-form-item>
          <el-form-item label="任务类型">
            <el-input v-model="configuration.taskType" :disabled="true" />
          </el-form-item>
          <el-form-item label="线程数量">
            <el-input v-model="configuration.thread" :disabled="true" />
          </el-form-item>




        </div>

        <div style="display: flex;">
          <el-form-item label="数据源名">
            <el-input v-model="configuration.dataSourceName" :disabled="true" />
          </el-form-item>
          <el-form-item label="节点名称">
            <el-input v-model="configuration.enterpriseNodeName" :disabled="true" />
          </el-form-item>
          <el-form-item label="数据模板" v-if="configuration.dataTemplate!=null">
            <el-input v-model="configuration.dataTemplate" :disabled="true" />
          </el-form-item>

          <el-form-item label="操作类型">
            <el-input v-model="configuration.operatingType" :disabled="true" />
          </el-form-item>

        </div>
        <div style="display: flex;">
          <el-form-item label="状　态">
            <el-input v-model="configuration.state" :disabled="true" />
          </el-form-item>
          <el-form-item label="表/文件">
            <el-input v-model="configuration.tableName" :disabled="true" />
          </el-form-item>
          <el-form-item label="标识列">
            <el-input v-model="configuration.handle" :disabled="true" />
          </el-form-item>
          <el-form-item label="前　缀">
            <el-input v-model="configuration.prefix" :disabled="true" />
          </el-form-item>



        </div>
        <div style="display: flex;">
          <el-form-item label="时间点" v-if="configuration.updateAt!=null">
            <el-input v-model="configuration.updateAt" :disabled="true" />
          </el-form-item>
          <el-form-item label="时间戳" v-if="configuration.updateBasis!=null">
            <el-input v-model="configuration.updateBasis" :disabled="true" />
          </el-form-item>
        </div>
      </el-form>
      <div v-if="relationShip!=null">
        <h3 style="margin-left:5%;">对应数据项</h3>
        <div v-for="(domain,index) in relationShip" :key="index" style="margin: 10px 0;margin-left:5%;">
          <el-input v-model="domain.dataItem" style="width: 20%;" :disabled="true" />--
          <el-input v-model="domain.dataSource" style="width: 20%;" :disabled="true" />
        </div>
      </div>

    </div>







    <div style="padding:0 30px;" v-if="operation">
      <div style="display: flex;   width: 100%; ">
        <div style="margin: 10px;">状态:
          <el-select v-model="successFlie" placeholder="请选择状态" @change="seeLists()">
            <el-option label="全部" value="all" />
            <el-option label="成功" value="success" />
            <el-option label="失败" value="failed" />
            <el-option label="删除" value="delect" />
          </el-select>
        </div>

        <div style="margin: 10px;">执行:
          <el-select v-model="state" placeholder="请选择状态" @change="seeLists()">
            <el-option label="全部" value="stateAll" />
            <el-option label="已执行" value="PERFORMED" />
            <el-option label="未执行" value="NOTPERFORMED" />
          </el-select>
        </div>


        <div>标识名称:
          <el-input v-model="search" placeholder="请输入关键字" style="width:70%;margin: 10px;">
            <el-button @click="seeLists" slot="append" icon="el-icon-search"
              style="background-color: #538ef4;color: #fff;border: 1px solid #538ef4;"></el-button>
          </el-input>
        </div>
        <el-button style="background-color: #538ef4;color: #fff;border: 1px solid #538ef4;margin: 10px;"
          @click="download(task.name)">导出</el-button>
      </div>
      <template>
        <el-table ref="multipleTable" :cell-style="rowClass" border :header-cell-style="headClass" :data="tableData2"
          tooltip-effect="dark" style="width: 100%;color:#43454a;margin: 0px auto;"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" min-width="100" />
          <el-table-column prop="handle" label="标识名称" min-width="100" />
          <el-table-column prop="prefix" label="前缀" min-width="45" />
          <el-table-column prop="updated" label="执行时间" show-overflow-tooltip min-width="80" />
          <el-table-column prop="type" label="类型" show-overflow-tooltip min-width="25" />
          <el-table-column prop="state" label="执行" show-overflow-tooltip min-width="35" />

          <el-table-column prop="success" label="状态" show-overflow-tooltip min-width="25" />
          <el-table-column prop="msg" label="失败原因" show-overflow-tooltip min-width="100" />
          <el-table-column label="操作" min-width="100">
            <template slot-scope="scope">
              <el-button type="text" class="tableButton" @click="seeData(scope.row.id)">查看数据</el-button>
              <el-button v-if="operatingType!='DELETE'" type="text" class="tableButton" @click="reImport(scope.row.id)">
                重新导入</el-button>
              <el-button v-if="operatingType!='DELETE'" type="text" class="tableButton" @click="modify(scope.row.id)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <div style="text-align: center;margin: 5%; 0">
        <el-pagination :current-page="seeCurrentPage" :page-size="seePageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="seeLength" @size-change="seeHandleSizeChange"
          @current-change="seeHandleCurrentChange" />
      </div>
      <div style="width: 100%; margin: 0 auto;text-align: right;">
        <el-button class="stop" type="primary " size="mini" @click="bulkImport">批量导入</el-button>
        <el-button type="danger" size="mini" @click="bulkDelete">批量删除</el-button>
      </div>
      <!--查看数据弹出框 -->
      <el-dialog width="40%" top="6vh" :visible.sync="lookData" append-to-body title="查看数据"
        :close-on-click-modal="false">
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
          <el-form-item v-for="(item,index) in lookDataList.value" :key="index" v-model="lookDataList.value"
            :label="item.idType">
            <el-input :value="item.value" :disabled="true" />
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>

  </div>
</template>
<script>
  import {
    deleteHandle, // 删除标识
    handle, // 重新导入
    handleInfo, // 查看标识数据
    download,//下载数据
    taskEndList, // 查看已完成任务
    handleData, // 查看任务数据
    taskList, // 获取任务列表
    taskInfo, // 查看任务
    taskConfig,//查看任务配置
  } from '@/api/user.js'
  export default {
    props: {
      selected: String,


    },
    data() {
      return {
        relationShip: [],
        seeId: '',
        value: '任务状态',
        taskDisplay: true,
        Sign: false,
        operation: false,
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
        configuration: {
          created: '',
          creatorName: '',
          dataSourceName: '',
          dataTemplate: '',
          enterpriseNodeName: '',
          handle: '',
          name: '',
          operatingType: '',
          prefix: '',
          state: '',
          tableName: '',
          taskType: '',
          thread: '',
          updateAt: '',
          updateBasis: '',


        },
        search: '',
        textName: '',
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
        state: 'stateAll',
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
    created() {
      this.seeId = this.selected
      this.see()
    },
    methods: {
      // 切换日志类型
      coursePractice(id) {
        if (id == '任务状态') {
          this.taskDisplay = true
          this.Sign = false
          this.operation = false
          this.see()

        } else if (id == '任务配置') {
          this.Sign = true
          this.taskDisplay = false
          this.operation = false
          this.configurationd()

        } else if (id == '任务明细') {
          this.operation = true
          this.Sign = false
          this.taskDisplay = false
          this.seeLists()

        }
      },
      // 查看按钮
      see() {
        let seeId = this.selected
        taskInfo(seeId).then(res => {
          if (res.code == 0) {
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
        })
      },

      configurationd() {
        let seeId = this.selected
        taskConfig(seeId).then(res => {
          if (res.code == 0) {
            let configuration = {
              created: res.data.created,
              creatorName: res.data.creatorName,
              dataSourceName: res.data.dataSourceName,
              dataTemplate: res.data.dataTemplate,
              enterpriseNodeName: res.data.enterpriseNodeName,
              handle: res.data.handle,
              name: res.data.name,
              operatingType: res.data.operatingType,
              prefix: res.data.prefix,
              state: res.data.state,
              tableName: res.data.tableName,
              taskType: res.data.taskType,
              thread: res.data.thread,
              updateAt: res.data.updateAt,
              updateBasis: res.data.updateBasis,

            }
            this.relationShip = res.data.relationShip,
              this.configuration = configuration

          }
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
      headClass() {
        return 'text-align: left;'
      },
      // 表格样式设置
      rowClass() {
        return 'text-align: left;'
      },
      // 获取导入任务列表
      seeLists() {
        handleData({
          handle: this.search,
          pageNum: this.seeOffset,
          pageSize: this.seeLimit,
          success: this.successFlie == 'all' ? null : this.successFlie,
          state: this.state == 'stateAll' ? null : this.state,
          taskId: this.seeId
        }).then(res => {
          if (res.code == 0) {
            this.textName = res.data.taskName
            this.tableData2 = res.data.taskData.result
            this.seeLength = res.data.taskData.total
          }
        })
      },
      // 导出
      download(name) {
        const loading = this.$loading({
          lock: true,
          text: '拼命加载中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });

        download({
          taskId: this.seeId,
          handle: this.search,
          success: this.successFlie == 'all' ? null : this.successFlie,
          state: this.state == 'stateAll' ? null : this.state,
        }).then(res => {
          let blob = new Blob([res], {type: "text/csv;charset=utf-8"  });
          let csvUrl = URL.createObjectURL(blob);
          let link1 = document.createElement('a');
          link1.href = csvUrl;
          link1.download = name+'.csv';
          link1.click();
          loading.close();
        })

        // let url = 'http://192.168.0.17:9057/job/download?taskId=' + this.seeId + '&handle=' + this.search
        // var xhr = new XMLHttpRequest();
        // xhr.open('GET', url);
        // xhr.setRequestHeader("Content-type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        // xhr.responseType = "blob";
        // xhr.onprogress = function (event) {
        //   if (event.lengthComputable) {
        //     console.log(event.loaded);
        //     console.log(event.total);
        //   }
        // };
        // xhr.onload = ((oEvent) => {

        //   if (xhr.readyState === 4 && xhr.status === 200) {
        //     // console.log(xhr.getResponseHeader(),'xhr')
        //     var blob = new Blob([xhr.response], { type: 'video/mp4' });
        //     var csvUrl = URL.createObjectURL(blob);
        //     var link1 = document.createElement('a');
        //     link1.href = csvUrl;
        //     link1.download = 'abababababba.csv';
        //     link1.click();
        //     loading.close();
        //   }
        // })
        // xhr.send();
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
      modify(id) {
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
      seeHandleSizeChange(val) {
        this.seeLimit = val
        this.seeLists()
      },
      seeHandleCurrentChange(val) {
        this.seeOffset = val
        this.seeLists()
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

      // 获取导入任务列表
      getLists() {
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
<style scoped>

</style>