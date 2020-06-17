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
        <p style="border-left: 5px solid #4283d8;padding-left: 10px;color: #4283d8;">企业节点列表</p>

      </div>
      <el-table :data="tableData" style="color:#43454a;" :cell-style="rowClass" stripe :header-cell-style="headClass" @sort-change="sort_change">
        <el-table-column fixed label="序号" type="index" min-width="100" />
        <el-table-column prop="creatorName" label="创建人" min-width="100" sortable="custom" />
        <el-table-column prop="name" label="名称" min-width="100" sortable="custom" />
        <el-table-column prop="created" label="创建时间" min-width="100" sortable="custom" />
        <el-table-column prop="type" label="类型" min-width="100" :formatter="completionStatusc" />
        <el-table-column prop="interType" label="接口访问类型" min-width="100" :formatter="completionStatusc2" />
        <el-table-column label="操作" min-width="100">
          <template slot-scope="scope">
            <el-button type="text" style="color: #4283d8;" @click="see(scope.row.id)">查看</el-button>

          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: center;margin-top: 5%;">
        <el-pagination :current-page="currentPage4" :page-sizes="[10, 20, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="length" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>

    <!-- 数据表格查看弹出框 -->
    <!-- 数据表格查看弹出框 -->
    <el-dialog width="35%" top="4vh" :visible.sync="isanswer" append-to-body title="查看企业节点" :close-on-click-modal="false">
      <el-form ref="addForm" :model="addForm" label-width="100px" class="dialog">
        <el-form-item label="名　称">
          <el-input v-model="addForm.name" :disabled="true" />
        </el-form-item>
        <el-form-item label="模　式">
          <el-input v-model="addForm.type" :disabled="true" />
        </el-form-item>
        <el-form-item v-show="selfBuilt" label="类　型">
          <el-input v-model="addForm.interType" :disabled="true" />
        </el-form-item>
        <el-form-item v-show="managed" label="类　型">
          <el-input v-model="addForm.accessType" :disabled="true" />

        </el-form-item>
        <!-- 自建模式下 -->
        <!-- 标识代理服务 -->
        <el-form-item v-show="selfBuilt">
          <el-divider content-position="center">标识代理服务</el-divider>
        </el-form-item>
        <el-form-item v-show="selfBuilt" label="地　址">
          <el-input v-model="addForm.oneselfAgentUrl" :disabled="true" />
        </el-form-item>
        <el-form-item v-show="selfBuilt">
          <el-checkbox v-model="addForm.oneselfAgentCheck" :disabled="true">跳过登录验证</el-checkbox>
        </el-form-item>
        <el-form-item v-show="selfBuilt" label="用户名">
          <el-input v-model="addForm.oneselfAgentUsername" :disabled="true" />
        </el-form-item>
        <el-form-item v-show="selfBuilt" label="密　码">
          <el-input v-model="addForm.oneselfAgentPassword" :disabled="true" />
        </el-form-item>
        <!-- 标识基础服务 -->
        <el-form-item v-show="selfBuilt">
          <el-divider content-position="center">标识基础服务</el-divider>
        </el-form-item>
        <el-form-item v-show="selfBuilt" label="地　址">
          <el-input v-model="addForm.oneselfBasicsUrl" :disabled="true" />
        </el-form-item>
        <el-form-item v-show="selfBuilt">
          <el-checkbox v-model="addForm.oneselfBasicsCheck" :disabled="true">跳过登录验证</el-checkbox>
        </el-form-item>
        <el-form-item v-show="selfBuilt" label="用户名">
          <el-input v-model="addForm.oneselfBasicsUsername" :disabled="true" />
        </el-form-item>
        <el-form-item v-show="selfBuilt" label="密　码">
          <el-input v-model="addForm.oneselfBasicsPassword" :disabled="true" />
        </el-form-item>
        <!-- 托管模式下 -->
        <!-- SNMS系统 -->
        <el-form-item v-show="managed">
          <el-divider v-show="managed" content-position="center">SNMS系统</el-divider>
        </el-form-item>
        <el-form-item v-show="managed" label="地　址">
          <el-input v-model="addForm.trusteeshipSnmsUrl" :disabled="true" />
        </el-form-item>
        <el-form-item v-show="managed" label="用户名">
          <el-input v-model="addForm.trusteeshipSnmsUsername" :disabled="true" />
        </el-form-item>
        <el-form-item v-show="managed" label="密　码">
          <el-input v-model="addForm.trusteeshipSnmsPassword" :disabled="true" />
        </el-form-item>
        <!-- 标识代理服务 -->
        <el-form-item v-show="managed">
          <el-divider v-show="managed" content-position="center">标识代理服务</el-divider>
        </el-form-item>
        <el-form-item v-show="managed" label="地　址">
          <el-input v-model="addForm.trusteeshipAgentUrl" :disabled="true" />
        </el-form-item>
        <el-form-item v-show="managed">
          <el-checkbox v-model="addForm.trusteeshipAgentCheck" :disabled="true">跳过登录验证</el-checkbox>
        </el-form-item>
        <el-form-item v-show="managed" label="用户名">
          <el-input v-model="addForm.trusteeshipAgentUsername" :disabled="true" />
        </el-form-item>
        <el-form-item v-show="managed" label="密　码">
          <el-input v-model="addForm.trusteeshipAgentPassword" :disabled="true" />
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {
  nodeList, // 获取企业节点列表
  getEnterpriseNode // 查看企业节点
} from '@/api/user.js'
export default {
  data() {
    return {
      times: null,
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
      // 查看企业节点数据绑定
      addForm: {
        name: '', // 名称
        type: '', // 模式
        interType: '', // 接口访问类型（自建）
        accessType: '', // 接口访问类型（托管）
        oneselfAgentUrl: '', // 自建代理url
        oneselfAgentCheck: false, // 自建代理登录验证
        oneselfAgentUsername: '', // 自建代理用户名
        oneselfAgentPassword: '', // 自建代理密码
        oneselfBasicsUrl: '', // 自建基础url
        oneselfBasicsCheck: false, // 自建基础登录验证
        oneselfBasicsUsername: '', // 自建基础用户名
        oneselfBasicsPassword: '', // 自建基础密码
        trusteeshipSnmsUrl: '', // 托管MNMSurl
        trusteeshipSnmsUsername: '', // 托管MNMS用户名
        trusteeshipSnmsPassword: '', // 托管MNMS密码
        trusteeshipAgentUrl: '', // 托管代理url
        trusteeshipAgentCheck: false, // 托管代理登录验证
        trusteeshipAgentUsername: '', // 托管代理用户名
        trusteeshipAgentPassword: '' // 托管代理密码
      },
      selfBuilt: false,
      managed: false,
      changeisanswe: false,
      addisanswer: false,
      isanswer: false,
      offset: 0,
      limit: 10,
      length: 0, // 总条数
      pageSize: 10, // 每页个数
      currentPage: 1, // 当前页数
      currentPage4: 1, // 当前页数

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
    // 表格状态值
    completionStatusc(row) {
      if (row.type == 'ESCROW') {
        return '托管模式'
      } else if (row.type == 'BUILT') {
        return '自建模式'
      }
    },
    completionStatusc2(row) {
      if (row.interType == 'SNMS') {
        return 'snms系统'
      } else if (row.interType == 'LAS') {
        return '标识代理服务'
      }
    },
    headClass() {
      return 'text-align: center;'
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
    // 查看按钮
    see(id) {
      this.isanswer = true
      getEnterpriseNode(id).then(res => {
        if (res.code == 0) {
          this.addForm.name = res.data.name
          this.addForm.type = res.data.type
          if (res.data.type == '自建模式') {
            this.addForm.interType = res.data.interType
            for (var i = 0; i < res.data.interfaceTypes.length; i++) {
              if (res.data.interfaceTypes[i].type == '标识代理服务') {
                this.addForm.oneselfAgentUrl = res.data.interfaceTypes[i].url
                this.addForm.oneselfAgentCheck = res.data.interfaceTypes[i].token
                this.addForm.oneselfAgentUsername = res.data.interfaceTypes[i].username
                this.addForm.oneselfAgentPassword = res.data.interfaceTypes[i].password
              } else if (res.data.interfaceTypes[i].type == '标识基础服务') {
                this.addForm.oneselfBasicsUrl = res.data.interfaceTypes[i].url
                this.addForm.oneselfBasicsCheck = res.data.interfaceTypes[i].token
                this.addForm.oneselfBasicsUsername = res.data.interfaceTypes[i].username
                this.addForm.oneselfBasicsPassword = res.data.interfaceTypes[i].password
              }
            }
            this.selfBuilt = true
            this.managed = false
          } else if (res.data.type == '托管模式') {
            this.addForm.accessType = res.data.interType
            for (var j = 0; j < res.data.interfaceTypes.length; j++) {
              if (res.data.interfaceTypes[j].type == 'snms系统') {
                this.addForm.trusteeshipSnmsUrl = res.data.interfaceTypes[j].url
                this.addForm.trusteeshipSnmsUsername = res.data.interfaceTypes[j].username
                this.addForm.trusteeshipSnmsPassword = res.data.interfaceTypes[j].password
              } else if (res.data.interfaceTypes[j].type == '标识代理服务') {
                this.addForm.trusteeshipAgentUrl = res.data.interfaceTypes[j].url
                this.addForm.trusteeshipAgentCheck = res.data.interfaceTypes[j].token
                this.addForm.trusteeshipAgentUsername = res.data.interfaceTypes[j].username
                this.addForm.trusteeshipAgentPassword = res.data.interfaceTypes[j].password
              }
            }
            this.selfBuilt = false
            this.managed = true
          }
        }
      })
    }

  }

}
</script>
<style lang="less" scoped>
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
/* .dialog .el-button--primary {
  background-color: #4283d8;
  border-color: #4283d8;
} */
.dialog .el-form-item__label{
  font-size: 12px;

}
 .node .el-table th>.cell{
  height: 50px;
  line-height:50px;
}

</style>

