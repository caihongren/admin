<template>
  <div class="node">
    <div class="head">
      <el-form :inline="true" :model="query" class="demo-form-inline">
        <el-form-item label="企业节点" style="font-size:12px">
          <el-input v-model="query.name" placeholder="请输入数据源名称" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="query.type" placeholder="请选择类型">
            <el-option label="全部" value="" />
            <el-option label="SNMS系统" value="SNMS" />
            <el-option label="标识代理服务" value="LAS" />
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
        <p style="float:left;border-left: 5px solid #4283d8;padding-left: 10px;color: #4283d8;">企业节点列表</p>
        <el-button type="text" icon="el-icon-plus" style="float:right;color: #4283d8;padding-top: 18px;" @click="addNode()">添加企业节点</el-button>
      </div>
      <el-table :data="tableData" style="color:#43454a;" :cell-style="rowClass" stripe :header-cell-style="headClass" @sort-change="sort_change">
        <el-table-column fixed label="序号" type="index" min-width="100" />
        <el-table-column prop="creatorName" label="创建人" min-width="180" sortable="custom" />
        <el-table-column prop="name" label="名称" min-width="180" sortable="custom" />
        <el-table-column prop="created" label="创建时间" min-width="180" sortable="custom" />
        <el-table-column prop="typeAlias" label="类型" min-width="180" />
        <el-table-column label="操作" min-width="250">
          <template slot-scope="scope">
            <el-button type="text" style="color: #4283d8;" @click="see(scope.row.id)">查看</el-button>
            <el-button type="text" style="color: #4283d8;" @click="modify(scope.row.id)">修改</el-button>
            <el-button type="text" style="color: #d05e5e;" @click="det(scope.row.id)">删除</el-button>

          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: center;margin-top: 5%;">
        <el-pagination :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="length" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>

    <!-- 添加数据源弹窗 -->
    <el-dialog width="35%" :visible.sync="addisanswer" append-to-body title="添加企业节点">
      <el-form ref="addForm" :model="addForm" label-width="100px" class="dialog">
        <el-form-item label="企业节点名称">
          <el-input v-model="addForm.name" placeholder="请输入数据源名称" />
        </el-form-item>
        <el-form-item label="企业节点类型">
          <el-select v-model="addForm.type" placeholder="请选择类型" @change="updateAdddisplay">
            <el-option label="SNMS系统" value="SNMS" />
            <el-option label="标识代理服务" value="LAS" />
          </el-select>
          <el-button v-show="addDataShow" size="small" type="warning" @click="notDisabled">不填写用户名和密码</el-button>
          <el-button v-show="addDataShow2" size="small" type="success" style="background:#4283d8;border:#4283d8" @click="inDisabled">填写用户名和密码</el-button>

        </el-form-item>
        <el-form-item label="接口地址">
          <el-input v-model="addForm.url" placeholder="请输入连接地址" />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="addForm.username" placeholder="请输入用户名" :disabled="isdisabledFn" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="addForm.password" placeholder="请输入密码" :disabled="isdisabledFn" />
        </el-form-item>
        <el-form-item style="margin-left: -80px;">
          <el-row :gutter="20">
            <el-col :span="20">
              <el-button type="warning" size="mini" round :loading="link" @click="connectionTest">连接测试</el-button>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" size="mini" round @click="database">确定</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 修改数据源弹窗 -->
    <el-dialog width="35%" :visible.sync="changeisanswe" append-to-body title="修改企业节点">
      <el-form ref="addForm" :model="addForm" label-width="100px" class="dialog">
        <el-form-item label="企业节点名称">
          <el-input v-model="addForm.name" />
        </el-form-item>
        <el-form-item label="企业节点类型">
          <el-input v-model="addForm.type" :disabled="true" />
        </el-form-item>
        <el-form-item label="接口地址">
          <el-input v-model="addForm.url" />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="addForm.username" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input :key="password" ref="password" v-model="addForm.password" :type="password" />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="password === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <el-form-item style="margin-left: -80px;">
          <el-row :gutter="20">
            <el-col :span="20">
              <el-button type="warning" size="mini" round :loading="link" @click="connectionTest">连接测试</el-button>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" size="mini" round @click="updateDatabase">确定</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 数据表格查看弹出框 -->
    <el-dialog width="35%" :visible.sync="isanswer" append-to-body title="查看企业节点">
      <el-form ref="addForm" :model="addForm" label-width="100px" class="dialog">
        <el-form-item label="企业节点名称">
          <el-input v-model="addForm.name" :disabled="true" />
        </el-form-item>
        <el-form-item label="企业节点类型">
          <el-input v-model="addForm.type" :disabled="true" />
        </el-form-item>
        <el-form-item label="接口地址">
          <el-input v-model="addForm.url" :disabled="true" />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="addForm.username" :disabled="true" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="addForm.password" :disabled="true" />
        </el-form-item>
      </el-form>

    </el-dialog>
  </div>
</template>
<script>
import {
  nodeList, // 获取企业节点列表
  enterpriseNode, // 删除企业节点
  putEnterpriseNode, // 修改企业节点
  postEnterpriseNode, // 添加企业节点
  getEnterpriseNode, // 查看企业节点
  nodeConnectionTest // 连接测试
} from '@/api/user.js'
export default {
  data() {
    return {
      link: false,

      times: null,
      password: '******',

      isdisabledFn: false,
      addDataShow: false,
      addDataShow2: false,

      query: {
        putid: '',

        order: '',
        orderBy: '',
        pageNum: 1,
        pageSize: 10,
        startTimeStr: null,
        endTimeStr: null,
        type: '',
        name: ''
      },
      addForm: {
        name: '',
        type: '',
        password: '',
        url: '',
        username: ''
      },

      changeisanswe: false,
      addisanswer: false,
      isanswer: false,
      offset: 0,
      limit: 10,
      length: 0, // 总条数
      pageSize: 10, // 每页个数
      currentPage: 1, // 当前页数
      pageNum: 1,
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
  created() {
    this.list()
  },
  methods: {
    // 重置按钮
    Reset() {
      this.query.name = ''
      this.query.type = ''
      this.times = ''
      this.query.startTimeStr = ''
      this.query.endTimeStr = ''
      this.list()
    },
    // 排序功能
    sort_change(column) {
      console.log(column.prop)
      if (column.order == 'descending') {
        this.query.order = 'desc'
      } else if (column.order == 'ascending') {
        this.query.order = 'asc'
      }
      if (column.prop == 'creatorName') {
        this.query.orderBy = ' e.creator_id'
      } else if (column.prop == 'name') {
        this.query.orderBy = 'e.name'
      } else if (column.prop == 'created') {
        this.query.orderBy = ' e.created'
      }
      this.list()
    },
    notDisabled() {
      this.isdisabledFn = true
      this.addDataShow2 = true
      this.addDataShow = false
    },
    inDisabled() {
      this.addDataShow2 = false
      this.isdisabledFn = false
      this.addDataShow = true
    },
    // 新增弹出框，数据类型联动
    updateAdddisplay() {
      this.addDataShow = (this.addForm.type == 'LAS')
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
    headClass() {
      return 'text-align: center;background:#738498;color:#fff'
    },
    // 表格样式设置
    rowClass() {
      return 'text-align: center;'
    },
    // 分页
    handleSizeChange(val) {
      this.limit = val
      this.list()
    },
    handleCurrentChange(val) {
      this.offset = val
      this.list()
    },
    // 查询数据列表
    list() {
      this.query.pageSize = this.pageSize
      this.query.pageNum = this.currentPage
      this.query.pageSize = this.pageSize

      if (sessionStorage.getItem('user')) {
        const user = JSON.parse(sessionStorage.getItem('user'))
        this.query.creatorld = user.id
        if (this.times != null && this.times.length == 2) {
          this.query.startTimeStr = this.times[0]
          this.query.endTimeStr = this.times[1]
        }
        nodeList(this.query).then(res => {
          if (res.code == 0) {
            this.tableData = res.data.result
            this.length = res.data.total
          }
        })
      }
    },
    addNode() {
      this.addisanswer = true
      this.addForm.name = ''
      this.addForm.type = ''
      this.addForm.password = ''
      this.addForm.url = ''
      this.addForm.username = ''
    },
    // 添加企业节点
    database() {
      if (this.addForm.name == '') {
        this.$message({
          showClose: true,
          duration: 1000,
          type: 'error',
          message: '请输入企业节点名称'
        })
      } else if (this.addForm.type == '') {
        this.$message({
          showClose: true,
          duration: 1000,
          type: 'error',
          message: '请输入企业节点类型'
        })
      } else if (this.addForm.url == '') {
        this.$message({
          showClose: true,
          duration: 1000,
          type: 'error',
          message: '请输入企业节点名称'
        })
      } else {
        if (sessionStorage.getItem('user')) {
          const user = JSON.parse(sessionStorage.getItem('user')).id
          this.addForm.creatorId = user
          postEnterpriseNode(this.addForm).then(res => {
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
              this.addForm.password = ''
              this.addForm.url = ''
              this.addForm.username = ''
            } else {
              this.$message({
                showClose: true,
                duration: 1000,
                type: 'error',
                message: '添加失败'
              })
            }
          })
        }
      }
    },
    // 查看按钮
    see(id) {
      this.isanswer = true
      getEnterpriseNode(id).then(res => {
        if (res.code == 0) {
          this.addForm.name = res.data.name
          this.addForm.type = res.data.typeAlias
          this.addForm.url = res.data.url
          this.addForm.username = res.data.username
          this.addForm.password = res.data.password
        }
      })
    },
    // 数据库连接测试
    connectionTest() {
      // this.$message({
      //   showClose: true,
      //   message: '正在链接。。。请稍后',
      //   duration: 2000
      // })
      // // return;

      if (this.addForm.name == '') {
        this.$message({
          showClose: true,
          duration: 1000,
          type: 'error',
          message: '请输入企业节点名称'
        })
        this.link = true
      } else if (this.addForm.type == '') {
        this.$message({
          showClose: true,
          duration: 1000,
          type: 'error',
          message: '请输入企业节点类型'
        })
        this.link = true
      } else if (this.addForm.url == '') {
        this.$message({
          showClose: true,
          duration: 1000,
          type: 'error',
          message: '请输入接口地址'
        })
        this.link = true
      } else {
        if (sessionStorage.getItem('user')) {
          const user = JSON.parse(sessionStorage.getItem('user')).id
          this.addForm.creatorId = user
          this.link = true
          nodeConnectionTest(this.addForm).then(res => {
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
        }
      }
    },
    // 修改初始化
    modify(id) {
      this.putid = id
      this.changeisanswe = true
      getEnterpriseNode(id).then(res => {
        console.log(res, '0000')
        this.addForm.name = res.data.name
        this.addForm.type = res.data.type
        this.addForm.url = res.data.url
        this.addForm.username = res.data.username
        this.addForm.password = res.data.password
      })
    },
    // 确定修改初始化
    updateDatabase() {
      if (this.addForm.name == '') {
        this.$message({
          showClose: true,
          duration: 1000,
          type: 'error',
          message: '请企业节点名称'
        })
      } else if (this.addForm.type == '') {
        this.$message({
          showClose: true,
          duration: 1000,
          type: 'error',
          message: '请输入企业节点类型'
        })
      } else if (this.addForm.url == '') {
        this.$message({
          showClose: true,
          duration: 1000,
          type: 'error',
          message: '请输入连接地址'
        })
      } else {
        putEnterpriseNode({
          url: this.addForm.url,
          username: this.addForm.username,
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
              message: '修改失败'
            })
          }
        })
      }
    },
    // 删除
    det(id) {
      this.$confirm('此操作将删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        confirmButtonClass: 'btnFalses',
        type: 'warning'
      })
        .then(() => {
          enterpriseNode({
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
 .show-pwd {
    position: absolute;
    right: 10px;
    top: 3px;
    font-size: 16px;
    color: #889aa4;
    cursor: pointer;
    user-select: none;
  }
.node {
  min-height: 100%;
  width: 98%;
  margin: 0 auto;
  padding-top: 20px;
  padding-bottom: 40px;
}
.node .el-button--primary {
  background-color: #4283d8;
  border-color: #4283d8;
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

  min-height: 750px;
  border-radius: 3px;
}
</style>
<style>
.node .el-form-item__label{
    font-size: 12px;
}
.node .head .el-input__inner {
  height: 33px;
  line-height: 33px;
}
.node .el-table__header tr,
  .el-table__header th {
    padding: 0;
    height: 40px;
}
.node .el-table__body tr,
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
.dialog .el-button--primary {
  background-color: #4283d8;
  border-color: #4283d8;
}
.dialog .el-form-item__label{
  font-size: 12px;

}
 .node .el-table th>.cell{
  height: 50px;
  line-height:50px;
}
</style>

