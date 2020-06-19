<template>
  <div class="dataSource">
    <div class="head">
      <el-form :inline="true" :model="query" class="demo-form-inline">
        <el-form-item label="数据源" style="font-size:12px">
          <el-input v-model="query.name" placeholder="请输入数据源名称" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="query.type" placeholder="请选择类型">
            <el-option label="全部" value="" />
            <el-option label="数据库" value="database" />
            <el-option label="文件" value="file" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker v-model="times" style="margin-right:20px" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" round icon="el-icon-search" @click="list">查询</el-button>
          <el-button type="warning" size="mini" round icon="el-icon-refresh" @click="Reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="conter">
      <div style="padding:10px 0;">
        <p style="float:left;border-left: 5px solid #4283d8;padding-left: 10px;color: #4283d8;">数据源列表</p>
        <el-button type="text" icon="el-icon-plus" style="float:right;color: #4283d8;padding-top: 18px;" @click="adddata">添加数据源</el-button>
      </div>
      <el-table :data="tableData" :cell-style="rowClass" stripe :header-cell-style="headClass" style="color:#43454a;" @sort-change="sort_change">
        <el-table-column fixed label="序号" type="index" width="100" />
        <el-table-column prop="creatorName" label="创建人" min-width="130" sortable="custom" />
        <el-table-column prop="name" label="名称" min-width="130" sortable="custom" />
        <el-table-column prop="created" label="创建时间" min-width="130" sortable="custom" />
        <el-table-column prop="type" label="类型 / 数据库类型" :formatter="completionStatusc" min-width="130">
          <template slot-scope="scope">
            <span>{{ completionStatusc(scope.row) }}</span>
            <span v-if="scope.row.databaseType"> / {{ scope.row.databaseType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="180">
          <template slot-scope="scope">
            <el-button type="text" style="color: #4283d8;" @click="see(scope.row.id)">查看</el-button>
            <el-button type="text" style="color: #4283d8;" @click="seedata(scope.row.id)">查看数据</el-button>

            <el-button v-if="scope.row.type=='database'" type="text" style="color: #4283d8;" @click="modify(scope.row.id)">修改</el-button>
            <el-button type="text" style="color: #d05e5e;" @click="det(scope.row.id)">删除</el-button>

          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: center;margin-top: 5%;">
        <el-pagination :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="length" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>

    <!-- 添加数据源弹窗 -->
    <el-dialog width="35%" :visible.sync="addisanswer" append-to-body title="添加数据源" :close-on-click-modal="false">
      <el-form ref="addForm" :model="addForm" label-width="100px" size="mini" class="dialog">
        <el-form-item label="名　称">
          <el-input v-model="addForm.name" placeholder="请输入数据源名称" />
        </el-form-item>
        <el-form-item label="源类型">
          <el-select v-model="addForm.type" placeholder="请选择类型" 　style="width:100%" @change="updateAdddisplay">
            <el-option label="数据库" value="database" />
            <el-option label="文件" value="file" />
          </el-select>
        </el-form-item>
        <el-form-item v-show="addDataShow" label="库类型">
          <el-select v-model="addForm.databaseType" placeholder="请选择类型" style="width:100%">
            <el-option label="mysql" value="mysql" />
            <el-option label="oracle" value="oracle" />
            <el-option label="postgresql" value="postgresql" />
            <el-option label="sqlserver" value="sqlserver" />
          </el-select>
        </el-form-item>
        <el-form-item v-show="addDataShow" label="库名称">
          <el-input v-model="addForm.databaseName" placeholder="请输入数据库名称" />
        </el-form-item>
        <el-form-item v-show="addDataShow" label="地　址">
          <el-input v-model="addForm.databaseUrl" placeholder="请输入连接地址" />
        </el-form-item>
        <el-form-item v-show="addDataShow" label="端口号">
          <el-input v-model="addForm.databasePort" placeholder="请输入端口号" />
        </el-form-item>
        <el-form-item v-show="addDataShow" label="用户名">
          <el-input v-model="addForm.databaseUsername" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item v-show="addDataShow" label="密　码">
          <el-input v-model="addForm.databasePassword" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item v-show="addFileShow">
          <el-table
            class="tableColor"
            :cell-style="rowClass"
            stripe
            :header-cell-style="headClass"
            :data="dataSourcetable"
            style="width: 100%"
          >
            <el-table-column fixed label="序号" type="index" min-width="100" />

            <el-table-column
              prop="name"
              label="文件名"
              width="180"
            />
            <el-table-column
              prop="type"
              label="拓展名"
              width="180"
            />
            <el-table-column
              prop="size"
              label="文件大小"
            />
          </el-table>
        </el-form-item>
        <el-form-item style="margin-left: -80px;">
          <el-row :gutter="20">
            <el-col v-show="addFileShow" :span="10" style="padding-left: 30px;">
              <div class="file-upload">
                上传文件夹
                 <input ref="file"  class="file-upload-input"   type="file" name="file" webkitdirectory  @change.stop="changesData" />
              </div>
            </el-col>
            <el-col v-show="addDataShow" :span="20">
              <el-button type="warning" size="mini" class="lianjieBtn" round :loading="link" @click="connectionTest">连接测试</el-button>
            </el-col>
            <el-col v-show="addFileShow" :span="10">
              <el-upload class="upload-demo" action="#" enctype="multipart/form-data" :before-upload="( file )=>{return uploading( file)}" style="display: inline-block">
                <el-button type="primary" size="mini" round style="border: 1px solid #4283d8;background:#4283d8;">上传文件</el-button>
              </el-upload>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" size="mini" round class="determine" @click="adddatabase">确定</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 修改数据源弹窗 -->
    <el-dialog width="35%" :visible.sync="changeisanswe" append-to-body title="修改数据源" :close-on-click-modal="false">
      <el-form ref="addForm" :model="addForm" label-width="100px" class="dialog">
        <el-form-item label="名　称">
          <el-input v-model="addForm.name" placeholder="请输入数据源名称" />
        </el-form-item>
        <el-form-item label="源类型">
          <el-input v-model="addForm.type" placeholder="请输入数据源名称" :disabled="true" />
        </el-form-item>
        <el-form-item label="库类型">
          <el-input v-model="addForm.databaseType" placeholder="请输入数据源名称" :disabled="true" />
        </el-form-item>
        <el-form-item label="库名称">
          <el-input v-model="addForm.databaseName" />
        </el-form-item>
        <el-form-item label="地　址">
          <el-input v-model="addForm.databaseUrl" />
        </el-form-item>
        <el-form-item label="端口号">
          <el-input v-model="addForm.databasePort" />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="addForm.databaseUsername" />
        </el-form-item>
        <el-form-item label="密　码">
          <el-input :key="password" ref="password" v-model="addForm.databasePassword" :type="password" />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="password === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <el-form-item style="margin-left: -80px;">
          <el-row :gutter="20">
            <el-col :span="20">
              <el-button type="warning" size="mini" class="lianjieBtn" round :loading="link" @click="connectionTest">连接测试</el-button>
            </el-col>

            <el-col :span="4">
              <el-button type="primary" size="mini" class="determine" round @click="updateDatabase">确定</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 数据表格查看弹出框 -->
    <el-dialog width="35%" :visible.sync="isanswer" append-to-body title="查看数据源" :close-on-click-modal="false">
      <el-form ref="addForm" :model="addForm" label-width="100px">
        <el-form-item label="名　称">
          <el-input v-model="addForm.name" :disabled="true" />
        </el-form-item>
        <el-form-item label="源类型">
          <el-input v-model="addForm.type" :disabled="true" />
        </el-form-item>
        <el-form-item label="库类型">
          <el-input v-model="addForm.databaseType" :disabled="true" />
        </el-form-item>
        <el-form-item label="库名称">
          <el-input v-model="addForm.databaseName" :disabled="true" />
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="addForm.databaseUrl" :disabled="true" />
        </el-form-item>
        <el-form-item label="端口号">
          <el-input v-model="addForm.databasePort" :disabled="true" />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="addForm.databaseUsername" :disabled="true" />
        </el-form-item>
        <el-form-item label="密　码">
          <el-input v-model="addForm.databasePassword" :disabled="true" />
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 产看数据表弹出框 -->
    <el-dialog width="70%" :visible.sync="lookdata" append-to-body title="查看数据" :close-on-click-modal="false">
      <el-select v-model="itemlist" placeholder="请选择排序依据" style="width:30%" @change="addFileInput(itemlist)">
        <el-option
          v-for="item in teacherOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      <el-table :data="tableDatas" :cell-style="rowClass" stripe :header-cell-style="headClass" style="margin:20px  0;">
        <el-table-column
          v-for="(item, index) in tableLabel"
          :key="index"
          :prop="item"
          min-width="60"
          :label="item"
        />
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import {
  tableData, // 获取表结构及数据
  list, // 获取数据源列表
  tableList, // 获取表
  connectionTest, // 连接测试
  getDatabase, // 查看数据库数据源
  putDatabase, // 修改数据库数据源
  deleteDatabase, // 删除数据库数据源
  database, // 添加数据库数据源
  Size, // 计算大小
  dataSourceFile// 上传文件

} from '@/api/user.js'
export default {
  data() {
    return {
      link: false,

      tableData: [], // 数据列表
      dataSourcetable: [],
      putid: '',
      tableLabel: [],
      tableData2: [],
      id333: '',
      itemlist: {},
      teacherOptions: [],
      lookdata: false,
      password: '******',
      times: null,
      query: {
        order: '',
        orderBy: '',
        pageNum: 1,
        pageSize: 10,
        startTimeStr: null,
        endTimeStr: null,
        type: '',
        name: ''
      },
      deleteId: '',
      addDataShow: false,
      addFileShow: false,
      addForm: {
        name: '',
        type: '',
        creatorId: '',
        databaseType: '',
        databaseName: '',
        databasePassword: '',
        databasePort: '',
        databaseUrl: '',
        databaseUsername: '',
        fileName: '',
        id: '',
        fileList: []
      },

      changeisanswe: false,
      addisanswer: false,
      isanswer: false,
      offset: 0,
      limit: 10,
      length: 0, // 总条数
      currentPage: 1, // 当前页数

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

      tableDatas: []
    }
  },
  created() {
    this.list(this.query.order = 'desc', this.query.orderBy = 's.created')
  },
  methods: {
    adddata() {
      this.addisanswer = true
      this.dataSourcetable = []
      this.addDataShow = false
      this.addFileShow = false
      const addForm = {
        name: '',
        type: '',
        creatorId: '',
        databaseType: '',
        databaseName: '',
        databasePassword: '',
        databasePort: '',
        databaseUrl: '',
        databaseUsername: ''
      }
      this.addForm = addForm
    },
    // 排序功能
    sort_change(column) {
      console.log(column.order)
      if (column.order == 'descending') {
        this.query.order = 'desc'
      } else if (column.order == 'ascending') {
        this.query.order = 'asc'
      }
      if (column.prop == 'creatorName') {
        this.query.orderBy = 'a.name'
      } else if (column.prop == 'name') {
        this.query.orderBy = 's.name'
      } else if (column.prop == 'created') {
        this.query.orderBy = 's.created'
      }
      this.list()
    },

    // 获取表
    seedata(id) {
      this.id333 = id
      this.lookdata = true
      tableList(id).then(res => {
        if (res.code == 0) {
          if (res.data.length > 0) this.addFileInput(res.data[0])
          this.teacherOptions = []
          for (let i = 0; i < res.data.length; i++) {
            this.teacherOptions.push({ label: res.data[i], value: res.data[i] })
          }
        }
      })
    },
    // 下拉选择文件后，将文件添加到添加内容输入框
    addFileInput(id) {
      tableData({
        table: id,
        id: this.id333
      }).then(res => {
        if (res.code == 0) {
          this.tableDatas = res.data.data
          this.tableLabel = res.data.title
        }
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
    // 表格状态值
    completionStatusc(row) {
      if (row.type == 'database') {
        return '数据库'
      } else if (row.type == 'file') {
        return '文件'
      }
    },
    // 查询数据列表
    list() {
      this.query.pageSize = this.limit
      this.query.pageNum = this.offset
      if (sessionStorage.getItem('user')) {
        const user = JSON.parse(sessionStorage.getItem('user'))
        this.query.creatorld = user.id
        if (this.times != null && this.times.length == 2) {
          this.query.startTimeStr = this.times[0]
          this.query.endTimeStr = this.times[1]
        }
        list(this.query).then(res => {
          if (res.code == 0) {
            this.tableData = res.data.result
            this.length = res.data.total ? res.data.total : 0
          }
        })
      }
    },

    // 新增弹出框，数据类型联动
    updateAdddisplay() {
      this.dataSourcetable = [],
      this.addForm.name = ''
      this.addForm.creatorId = ''
      this.addForm.databaseType = ''
      this.addForm.databaseName = ''
      this.addForm.databasePort = ''
      this.addForm.databasePassword = ''
      this.addForm.databaseUrl = ''
      this.addForm.databaseUsername = ''
      this.addDataShow = (this.addForm.type == 'database')
      this.addFileShow = (this.addForm.type == 'file')
    },
    // 上传文件夹
    changesData() {
      const box = this.$refs.file.files
      this.addForm.fileList = []
      this.dataSourcetable = []
      for (let i = 0; i < box.length; i++) {
        const sort = box[i].name.split('.')
        sort = sort[sort.length - 1]
        if (sort == 'csv' || sort == 'xls' || sort == 'xlsx') {
          this.addForm.fileList.push(box[i])
          this.dataSourcetable.push({ name: box[i].name, type: sort, size: box[i].size + '字节' })
        }
      }
      if (this.dataSourcetable.length <= 0) {
        this.$message.error({
          showClose: true,
          duration: 1000,
          message: '只能上传csv或者xls,xlsx格式文件',
          type: 'warning'
        })
      }
    },
    // 上传文件
    uploading(file) {
      this.dataSourcetable = []
      let sort = file.name.split('.')
      sort = sort[sort.length - 1]
      const size = Size(file.size)
      if (size == '0') {
        this.$message.error({
          showClose: true,
          duration: 1000,
          message: '不允许空文件上传。',
          type: 'warning'
        })
        return
      }
      if (sort == 'csv' || sort == 'xls' || sort == 'xlsx') {
        this.addForm.fileList.push(file)
        this.dataSourcetable.push({ name: file.name, type: sort, size: file.size + '字节' })
      } else {
        this.$message.error({
          showClose: true,
          duration: 2000,
          message: '只能上传csv或者xls,xlsx格式文件。',
          type: 'warning'
        })
        return
      }
    },
    // 数据库连接测试
    connectionTest() {
      if (this.addForm.name == '') {
        this.$message({
          showClose: true,
          duration: 1000,
          type: 'error',
          message: '请输入数据源名称'
        })
        this.link = true
      } else if (this.addForm.type == '') {
        this.$message({
          showClose: true,
          duration: 1000,
          type: 'error',
          message: '请输入数据源类型'
        })
        this.link = true
      } else if (this.addForm.databaseName == '') {
        this.$message({
          showClose: true,
          duration: 1000,
          type: 'error',
          message: '请输入数据库名称'
        })
        this.link = true
      } else if (this.addForm.databaseType == '') {
        this.$message({
          showClose: true,
          duration: 1000,
          type: 'error',
          message: '请输入数据源名称'
        })
        this.link = true
      } else if (this.addForm.databaseUrl == '') {
        this.$message({
          showClose: true,
          duration: 1000,
          type: 'error',
          message: '请输入连接地址'
        })
        this.link = true
      } else if (this.addForm.databasePort == '') {
        this.$message({
          showClose: true,
          duration: 1000,
          type: 'error',
          message: '请输入端口号'
        })
        this.link = true
      } else if (this.addForm.databaseUsername == '') {
        this.$message({
          showClose: true,
          duration: 1000,
          type: 'error',
          message: '请输入用户名'
        })
        this.link = true
      } else {
        if (sessionStorage.getItem('user')) {
          const user = JSON.parse(sessionStorage.getItem('user')).id
          this.addForm.creatorId = user
          connectionTest(this.addForm).then(res => {
            console.log(res, '678')
            if (res.code == 0) {
              this.$message({
                showClose: true,
                duration: 1000,
                type: 'success',
                message: '连接成功'
              })
              this.link = false
            } else {
              this.$message({
                showClose: true,
                duration: 1000,
                type: 'success',
                message: '连接失败'
              })
              this.link = false
            }
          })
            .catch(() => {
              this.$message({
                showClose: true,
                duration: 1000,
                type: 'error',
                message: '连接失败'
              })
            })
        }
      }
    },
    // 添加数据源
    adddatabase() {
      if (this.addDataShow == true) {
        if (this.addForm.name == '') {
          this.$message({
            showClose: true,
            duration: 1000,
            type: 'error',
            message: '请输入数据源名称'
          })
        } else if (this.addForm.type == '') {
          this.$message({
            showClose: true,
            duration: 1000,
            type: 'error',
            message: '请输入数据源类型'
          })
        } else if (this.addForm.databaseName == '') {
          this.$message({
            showClose: true,
            duration: 1000,
            type: 'error',
            message: '请输入数据库名称'
          })
        } else if (this.addForm.databaseType == '') {
          this.$message({
            showClose: true,
            duration: 1000,
            type: 'error',
            message: '请输入数据源名称'
          })
        } else if (this.addForm.databaseUrl == '') {
          this.$message({
            showClose: true,
            duration: 1000,
            type: 'error',
            message: '请输入连接地址'
          })
        } else if (this.addForm.databasePort == '') {
          this.$message({
            showClose: true,
            duration: 1000,
            type: 'error',
            message: '请输入端口号'
          })
        } else if (this.addForm.databaseUsername == '') {
          this.$message({
            showClose: true,
            duration: 1000,
            type: 'error',
            message: '请输入用户名'
          })
        } else {
          if (sessionStorage.getItem('user')) {
            const user = JSON.parse(sessionStorage.getItem('user')).id
            this.addForm.creatorId = user
            database(this.addForm).then(res => {
              if (res.code == 0) {
                this.$message({
                  showClose: true,
                  duration: 1000,
                  type: 'success',
                  message: '添加成功'
                })
                this.list()
                this.addisanswer = false
                this.addForm.name = ''
                this.addForm.type = ''
                this.addForm.creatorId = ''
                this.addForm.databaseType = ''
                this.addForm.databaseName = ''
                this.addForm.databasePassword = ''
                this.addForm.databasePort = ''
                this.addForm.databaseUrl = ''
                this.addForm.databaseUsername = ''
              } else {
                this.$message({
                  showClose: true,
                  duration: 1000,
                  type: 'error',
                  message: res.msg
                })
              }
            })
          }
        }
      } else if (this.addFileShow == true) {
        if (this.addForm.name == '') {
          this.$message({
            showClose: true,
            duration: 1000,
            type: 'error',
            message: '请输入数据源名称'
          })
        } else if (this.addForm.type == '') {
          this.$message({
            showClose: true,
            duration: 1000,
            type: 'error',
            message: '请输入数据源类型'
          })
        } else {
          if (sessionStorage.getItem('user')) {
            const user = JSON.parse(sessionStorage.getItem('user')).id
            this.addForm.creatorId = user
            if (this.addForm.fileList != '' && this.addForm.fileList != null && this.addForm.fileList != undefined) {
              this.$message({
                showClose: true,
                message: '正在上传文件',
                duration: 1000
              })
              const fd = new FormData()
              const list = this.addForm.fileList
              fd.append('length', list.length)
              for (let i = 0; i < list.length; i++) {
                fd.append('fileList' + i, list[i]) // 传多个文件
              }
              fd.append('name', this.addForm.name ? this.addForm.name : '')
              fd.append('type', this.addForm.type ? this.addForm.type : '')
              fd.append('creatorId', this.addForm.creatorId)
              dataSourceFile(fd).then(res => {
                if (res.code == '0') {
                  this.$message({
                    showClose: true,
                    message: '文件上传成功',
                    type: 'success',
                    duration: 1000
                  })
                  this.list()
                  this.addisanswer = false
                }
              })
            }
          }
        }
      }
    },
    // 表格样式设置
    // headClass() {
    //   return 'text-align: center;'
    // },
    // // 表格样式设置
    // rowClass() {
    //   return 'text-align: center;'
    // },
    // 分页
    handleSizeChange(val) {
      this.limit = val
      this.list()
    },
    handleCurrentChange(val) {
      this.offset = val
      this.list()
    },

    // 重置按钮
    Reset() {
      this.query.name = ''
      this.query.type = ''
      this.times = ''
      this.query.startTimeStr = ''
      this.query.endTimeStr = ''

      this.list()
    },
    // 查看按钮
    see(id) {
      this.isanswer = true
      getDatabase(id).then(res => {
        if (res.code == 0) {
          this.addForm.name = res.data.name
          this.addForm.type = res.data.type
          this.addForm.databaseType = res.data.databaseType
          this.addForm.databaseName = res.data.databaseName
          this.addForm.databaseUrl = res.data.databaseUrl
          this.addForm.databasePort = res.data.databasePort
          this.addForm.databaseUsername = res.data.databaseUsername
          this.addForm.databasePassword = res.data.databasePassword
        }
      })
    },
    // 修改初始化
    modify(id) {
      this.putid = id
      this.changeisanswe = true
      getDatabase(id).then(res => {
        this.addForm.name = res.data.name
        this.addForm.type = res.data.type
        this.addForm.databaseType = res.data.databaseType
        this.addForm.databaseName = res.data.databaseName
        this.addForm.databaseUrl = res.data.databaseUrl
        this.addForm.databasePort = res.data.databasePort
        this.addForm.databaseUsername = res.data.databaseUsername
        this.addForm.databasePassword = res.data.databasePassword
      })
    },
    updateDatabase() {
      if (this.addForm.name == '') {
        this.$message({
          showClose: true,
          duration: 1000,
          type: 'error',
          message: '请输入数据源名称'
        })
      } else if (this.addForm.type == '') {
        this.$message({
          showClose: true,
          duration: 1000,
          type: 'error',
          message: '请输入数据源类型'
        })
      } else if (this.addForm.databaseName == '') {
        this.$message({
          showClose: true,
          duration: 1000,
          type: 'error',
          message: '请输入数据库名称'
        })
      } else if (this.addForm.databaseType == '') {
        this.$message({
          showClose: true,
          duration: 1000,
          type: 'error',
          message: '请输入数据源名称'
        })
      } else if (this.addForm.databaseUrl == '') {
        this.$message({
          showClose: true,
          duration: 1000,
          type: 'error',
          message: '请输入连接地址'
        })
      } else if (this.addForm.databasePort == '') {
        this.$message({
          showClose: true,
          duration: 1000,
          type: 'error',
          message: '请输入端口号'
        })
      } else if (this.addForm.databaseUsername == '') {
        this.$message({
          showClose: true,
          duration: 1000,
          type: 'error',
          message: '请输入用户名'
        })
      } else {
        putDatabase({
          databaseName: this.addForm.databaseName,
          databasePassword: this.addForm.databasePassword,
          databasePort: this.addForm.databasePort,
          databaseType: this.addForm.databaseType,
          databaseUrl: this.addForm.databaseUrl,
          databaseUsername: this.addForm.databaseUsername,
          id: this.putid,
          name: this.addForm.name,
          type: this.addForm.type
        }).then(res => {
          if (res.code == 0) {
            this.$message({
              showClose: true,
              duration: 1000,
              type: 'success',
              message: '修改成功'
            })
            this.changeisanswe = false
            this.list()
          } else {
            this.$message({
              showClose: true,
              duration: 1000,
              type: 'error',
              message: res.msg
            })
          }
        })
      }
    },
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
            message: '已取消删除'
          })
        })
        .catch(() => {
          deleteDatabase({
            id: id
          }).then(res => {
            this.$message({
              showClose: true,
              duration: 1000,
              type: 'success',
              message: '删除成功!'
            })
            this.list()
          })
        })
    }

  }

}
</script>
<style lang="less" scoped>
.file-upload {
        width: 90px;
        height: 26px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        border: 1px solid #4283d8  ;
        background:#4283d8 ;
        border-radius: 21px;
        font-size: 12px;
        color: #fff;
        text-align: center;
        line-height: 26px;
    }
     .file-upload-input {
        background-color: transparent;
        position: absolute;
        width: 9999px;
        height: 999px;
        top: -10px;
        right: -10px;
        cursor: pointer;
    }
 .show-pwd {
    position: absolute;
    right: 10px;
    top: 3px;
    font-size: 16px;
    color: #889aa4;
    cursor: pointer;
    user-select: none;
  }
.dataSource {
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
  margin-bottom: 10px;

}
.conter {
  background-color: #ffffff;
padding: 0 1%;
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
.dataSource .el-form-item__label {
  font-size: 12px;
}
.dataSource .el-input__inner {
  height: 33px;
  line-height: 33px;
}
.dataSource .el-table__header tr,
.el-table__header th {
  padding: 0;
  height: 40px;
}
.dataSource .el-table__body tr,
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
 .dataSource .el-table th>.cell{
  height: 50px;
  line-height:50px;
}
.xxxx .el-dialog{
       display: flex;
       flex-direction: column;
       margin:0 !important;
       position:absolute;
       top:50%;
       left:50%;
       transform:translate(-50%,-50%);
       /*height:600px;*/
       max-height:calc(100% - 30px);
       max-width:calc(100% - 30px);
   }
  .xxxx .el-dialog .el-dialog__body{
    padding: 10px 20px;
       flex:1;
       overflow: auto;
   }
</style>

