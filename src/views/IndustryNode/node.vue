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
        <el-table-column prop="type" label="类型" min-width="180" :formatter="completionStatusc" sortable="custom" />
        <el-table-column prop="interType" label="接口访问类型" min-width="180" :formatter="completionStatusc2" sortable="custom" />
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

    <!-- 添加企业节点弹窗 -->
    <el-dialog width="40%" top="2vh" :visible.sync="addisanswer" append-to-body title="添加企业节点">
      <el-form ref="addForm" :model="addForm" label-width="100px" class="dialog">
        <el-form-item label="名　称">
          <el-input v-model="addForm.name" placeholder="请输入数据源名称" />
        </el-form-item>
        <el-form-item label="模　式">
          <el-select v-model="addForm.type" placeholder="请选择类型" style="width:100%;" @change="update">
            <el-option label="自建" value="BUILT" />
            <el-option label="托管" value="ESCROW" />
          </el-select>
        </el-form-item>
        <el-form-item v-show="selfBuilt" label="访问类型">
          <el-select v-model="addForm.interType" placeholder="请选择类型" style="width:100%;">
            <el-option label="标识代理服务" value="LAS" />
          </el-select>
        </el-form-item>
        <el-form-item v-show="managed" label="访问类型">
          <el-select v-model="addForm.accessType" placeholder="请选择类型" style="width:100%;">
            <el-option label="SNMS系统" value="SNMS" />
            <el-option label="标识代理服务" value="LAS" />
          </el-select>
        </el-form-item>
        <!-- 自建模式下 -->
        <!-- 标识代理服务 -->
        <el-form-item v-show="selfBuilt">
          <el-divider content-position="center">标识代理服务</el-divider>
        </el-form-item>
        <el-form-item v-show="selfBuilt" label="地　址">
          <el-input v-model="addForm.oneselfAgentUrl" placeholder="请输入连接地址" />
        </el-form-item>
        <el-form-item v-show="selfBuilt">
          <el-checkbox v-model="addForm.oneselfAgentCheck" @change="self1">跳过登录验证</el-checkbox>
        </el-form-item>
        <el-form-item v-show="selfBuilt" label="用户名">
          <el-input v-model="addForm.oneselfAgentUsername" placeholder="请输入用户名" :disabled="display" />
        </el-form-item>
        <el-form-item v-show="selfBuilt" label="密　码">
          <el-input v-model="addForm.oneselfAgentPassword" placeholder="请输入密码" :disabled="display" />
        </el-form-item>
        <!-- 标识基础服务 -->
        <el-form-item v-show="selfBuilt">
          <el-divider content-position="center">标识基础服务</el-divider>
        </el-form-item>
        <el-form-item v-show="selfBuilt" label="地　址">
          <el-input v-model="addForm.oneselfBasicsUrl" placeholder="请输入连接地址" />
        </el-form-item>
        <el-form-item v-show="selfBuilt">
          <el-checkbox v-model="addForm.oneselfBasicsCheck" @change="self2">跳过登录验证</el-checkbox>
        </el-form-item>
        <el-form-item v-show="selfBuilt" label="用户名">
          <el-input v-model="addForm.oneselfBasicsUsername" placeholder="请输入用户名" :disabled="display2" />
        </el-form-item>
        <el-form-item v-show="selfBuilt" label="密　码">
          <el-input v-model="addForm.oneselfBasicsPassword" placeholder="请输入密码" :disabled="display2" />
        </el-form-item>
        <!-- 托管模式下 -->
        <!-- SNMS系统 -->
        <el-form-item v-show="managed">
          <el-divider v-show="managed" content-position="center">SNMS系统</el-divider>
        </el-form-item>
        <el-form-item v-show="managed" label="地　址">
          <el-input v-model="addForm.trusteeshipSnmsUrl" placeholder="请输入连接地址" />
        </el-form-item>
        <el-form-item v-show="managed" label="用户名">
          <el-input v-model="addForm.trusteeshipSnmsUsername" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item v-show="managed" label="密　码">
          <el-input v-model="addForm.trusteeshipSnmsPassword" placeholder="请输入密码" />
        </el-form-item>
        <!-- 标识代理服务 -->
        <el-form-item v-show="managed">
          <el-divider v-show="managed" content-position="center">标识代理服务</el-divider>
        </el-form-item>
        <el-form-item v-show="managed" label="地　址">
          <el-input v-model="addForm.trusteeshipAgentUrl" placeholder="请输入连接地址" />
        </el-form-item>
        <el-form-item v-show="managed">
          <el-checkbox v-model="addForm.trusteeshipAgentCheck" @change="self3">跳过登录验证</el-checkbox>
        </el-form-item>
        <el-form-item v-show="managed" label="用户名">
          <el-input v-model="addForm.trusteeshipAgentUsername" placeholder="请输入用户名" :disabled="display3" />
        </el-form-item>
        <el-form-item v-show="managed" label="密　码">
          <el-input v-model="addForm.trusteeshipAgentPassword" placeholder="请输入密码" :disabled="display3" />
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
    <el-dialog width="35%" top="2vh" :visible.sync="changeisanswe" append-to-body title="修改企业节点">
      <el-form ref="addForm" :model="addForm" label-width="100px" class="dialog">
        <el-form-item label="名　称">
          <el-input v-model="addForm.name" placeholder="请输入数据源名称" />
        </el-form-item>
        <el-form-item label="模　式">
          <el-input v-show="false" v-model="addForm.type" :disabled="true" />
          <el-input :value="addForm.type == 'BUILT' ? '自建模式' : addForm.type == 'ESCROW' ? '托管模式' : addForm.type" :disabled="true" />
        </el-form-item>
        <el-form-item v-show="selfBuilt" label="访问类型">
          <el-select v-model="addForm.interType" placeholder="请选择类型" style="width:100%;">
            <el-option label="标识代理服务" value="LAS" />
          </el-select>
        </el-form-item>
        <el-form-item v-show="managed" label="访问类型">
          <el-select v-model="addForm.accessType" placeholder="请选择类型" style="width:100%;">
            <el-option label="SNMS系统" value="SNMS" />
            <el-option label="标识代理服务" value="LAS" />
          </el-select>
        </el-form-item>
        <!-- 自建模式下 -->
        <!-- 标识代理服务 -->
        <el-form-item v-show="selfBuilt">
          <el-divider content-position="center">标识代理服务</el-divider>
        </el-form-item>
        <el-form-item v-show="selfBuilt" label="地　址">
          <el-input v-model="addForm.oneselfAgentUrl" placeholder="请输入连接地址" />
        </el-form-item>
        <el-form-item v-show="selfBuilt">
          <el-checkbox v-model="addForm.oneselfAgentCheck" @change="self1">跳过登录验证</el-checkbox>
        </el-form-item>
        <el-form-item v-show="selfBuilt" label="用户名">
          <el-input v-model="addForm.oneselfAgentUsername" placeholder="请输入用户名" :disabled="display" />
        </el-form-item>
        <el-form-item v-show="selfBuilt" label="密　码">
          <el-input v-model="addForm.oneselfAgentPassword" placeholder="请输入密码" :disabled="display" />
        </el-form-item>
        <!-- 标识基础服务 -->
        <el-form-item v-show="selfBuilt">
          <el-divider content-position="center">标识基础服务</el-divider>
        </el-form-item>
        <el-form-item v-show="selfBuilt" label="地　址">
          <el-input v-model="addForm.oneselfBasicsUrl" placeholder="请输入连接地址" />
        </el-form-item>
        <el-form-item v-show="selfBuilt">
          <el-checkbox v-model="addForm.oneselfBasicsCheck" @change="self2">跳过登录验证</el-checkbox>
        </el-form-item>
        <el-form-item v-show="selfBuilt" label="用户名">
          <el-input v-model="addForm.oneselfBasicsUsername" placeholder="请输入用户名" :disabled="display2" />
        </el-form-item>
        <el-form-item v-show="selfBuilt" label="密　码">
          <el-input v-model="addForm.oneselfBasicsPassword" placeholder="请输入密码" :disabled="display2" />
        </el-form-item>
        <!-- 托管模式下 -->
        <!-- SNMS系统 -->
        <el-form-item v-show="managed">
          <el-divider v-show="managed" content-position="center">SNMS系统</el-divider>
        </el-form-item>
        <el-form-item v-show="managed" label="地　址">
          <el-input v-model="addForm.trusteeshipSnmsUrl" placeholder="请输入连接地址" />
        </el-form-item>
        <el-form-item v-show="managed" label="用户名">
          <el-input v-model="addForm.trusteeshipSnmsUsername" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item v-show="managed" label="密　码">
          <el-input v-model="addForm.trusteeshipSnmsPassword" placeholder="请输入密码" />
        </el-form-item>
        <!-- 标识代理服务 -->
        <el-form-item v-show="managed">
          <el-divider v-show="managed" content-position="center">标识代理服务</el-divider>
        </el-form-item>
        <el-form-item v-show="managed" label="地　址">
          <el-input v-model="addForm.trusteeshipAgentUrl" placeholder="请输入连接地址" />
        </el-form-item>
        <el-form-item v-show="managed">
          <el-checkbox v-model="addForm.trusteeshipAgentCheck" @change="self3">跳过登录验证</el-checkbox>
        </el-form-item>
        <el-form-item v-show="managed" label="用户名">
          <el-input v-model="addForm.trusteeshipAgentUsername" placeholder="请输入用户名" :disabled="display3" />
        </el-form-item>
        <el-form-item v-show="managed" label="密　码">
          <el-input v-model="addForm.trusteeshipAgentPassword" placeholder="请输入密码" :disabled="display3" />
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
    <el-dialog width="35%" top="2vh" :visible.sync="isanswer" append-to-body title="查看企业节点">
      <el-form ref="addForm" :model="addForm" label-width="100px" class="dialog">
        <el-form-item label="名　称">
          <el-input v-model="addForm.name" :disabled="true" />
        </el-form-item>
        <el-form-item label="模　式">
          <el-input v-model="addForm.type" :disabled="true" />
        </el-form-item>
        <el-form-item v-show="selfBuilt" label="访问类型">
          <el-input v-model="addForm.interType" :disabled="true" />
        </el-form-item>
        <el-form-item v-show="managed" label="访问类型">
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
      checked: false,
      checked2: false,
      checked3: false,

      times: null,
      password: '******',

      display: false,
      display2: false,
      display3: false,

      selfBuilt: false,
      managed: false,
      // addDataShow2: false,

      query: {
        putid: '',
        creatorld: '',
        order: '',
        orderBy: '',
        pageNum: 1,
        pageSize: 10,
        startTimeStr: null,
        endTimeStr: null,
        type: '',
        name: ''
      },
      // 添加企业节点数据绑定
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
        trusteeshipAgentPassword: '', // 托管代理密码
        oneselfAgentId: '',
        oneselfBasicsId: '',
        trusteeshipSnmsId: '',
        trusteeshipAgentId: ''
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
    this.list(this.query.order = 'desc', this.query.orderBy = ' e.created')
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
    // 新增弹出框，数据类型联动
    update() {
      this.selfBuilt = (this.addForm.type == 'BUILT')
      this.managed = (this.addForm.type == 'ESCROW')
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
      } else if (column.prop == 'type') {
        this.query.orderBy = 'e.type'
      } else if (column.prop == 'interType') {
        this.query.orderBy = 'e.inter_type'
      }
      this.list()
    },
    self1(val) {
      console.log(val)
      if (val == true) {
        this.display = true
      } else {
        this.display = false
      }
    },
    self2(val) {
      console.log(val)
      if (val == true) {
        this.display2 = true
      } else {
        this.display2 = false
      }
    },
    self3(val) {
      console.log(val)
      if (val == true) {
        this.display3 = true
      } else {
        this.display3 = false
      }
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
    // 添加企业节点清空
    addNode() {
      this.addisanswer = true
      this.addForm.name = '' // 名称
      this.addForm.type = '' // 模式
      this.addForm.interType = '' // 接口访问类型（自建）
      this.addForm.accessType = '' // 接口访问类型（托管）
      this.addForm.oneselfAgentUrl = '' // 自建代理url
      this.addForm.oneselfAgentCheck = false // 自建代理登录验证
      this.addForm.oneselfAgentUsername = '' // 自建代理用户名
      this.addForm.oneselfAgentPassword = '' // 自建代理密码
      this.addForm.oneselfBasicsUrl = '' // 自建基础url
      this.addForm.oneselfBasicsCheck = false // 自建基础登录验证
      this.addForm.oneselfBasicsUsername = '' // 自建基础用户名
      this.addForm.oneselfBasicsPassword = '' // 自建基础密码
      this.addForm.trusteeshipSnmsUrl = '' // 托管MNMSurl
      this.addForm.trusteeshipSnmsUsername = '' // 托管MNMS用户名
      this.addForm.trusteeshipSnmsPassword = '' // 托管MNMS密码
      this.addForm.trusteeshipAgentUrl = '' // 托管代理url
      this.addForm.trusteeshipAgentCheck = false // 托管代理登录验证
      this.addForm.trusteeshipAgentUsername = '' // 托管代理用户名
      this.addForm.trusteeshipAgentPassword = '' // 托管代理密码
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
          message: '请选择模式'
        })
      } else if ((this.addForm.type == 'ESCROW' && this.addForm.accessType == '') || (this.addForm.type == 'BUILT' && this.addForm.interType == '')) {
        this.$message({
          showClose: true,
          duration: 1000,
          type: 'error',
          message: '请选择接口访问类型'
        })
      } else if (
        (this.addForm.type == 'BUILT' && (this.addForm.oneselfAgentUrl == '' || this.addForm.oneselfBasicsUrl == '')) ||
        (this.addForm.type == 'ESCROW' && (this.addForm.trusteeshipSnmsUrl == '' || this.addForm.trusteeshipAgentUrl == ''))
      ) {
        this.$message({
          showClose: true,
          duration: 1000,
          type: 'error',
          message: '请输入地址'
        })
      } else if (
        (this.addForm.type == 'BUILT' && this.addForm.oneselfAgentCheck == false && (this.addForm.oneselfAgentUsername == '' || this.addForm.oneselfAgentPassword == '')) ||
        (this.addForm.type == 'BUILT' && this.addForm.oneselfBasicsCheck == false && (this.addForm.oneselfBasicsUsername == '' || this.addForm.oneselfBasicsPassword == '')) ||
        (this.addForm.type == 'ESCROW' && this.addForm.trusteeshipAgentCheck == false && (this.addForm.trusteeshipAgentUsername == '' || this.addForm.trusteeshipAgentPassword == ''))
      ) {
        this.$message({
          showClose: true,
          duration: 1000,
          type: 'error',
          message: '请输入用户名密码'
        })
      } else if (sessionStorage.getItem('user')) {
        postEnterpriseNode({
          creatorId: JSON.parse(sessionStorage.getItem('user')).id,
          name: this.addForm.name,
          type: this.addForm.type,
          interType: this.addForm.type == 'BUILT' ? this.addForm.interType : this.addForm.type == 'ESCROW' ? this.addForm.accessType : '',
          interfaceTypeReqs:
            this.addForm.type == 'BUILT'
              ? [
                {
                  interType: 'LAS',
                  url: this.addForm.oneselfAgentUrl,
                  token: !this.addForm.oneselfAgentCheck,
                  username: this.addForm.oneselfAgentUsername,
                  password: this.addForm.oneselfAgentPassword
                },
                {
                  interType: 'LBS',
                  url: this.addForm.oneselfBasicsUrl,
                  token: !this.addForm.oneselfBasicsCheck,
                  username: this.addForm.oneselfBasicsUsername,
                  password: this.addForm.oneselfBasicsPassword
                }
              ]
              : this.addForm.type == 'ESCROW'
                ? [
                  {
                    interType: 'SNMS',
                    url: this.addForm.trusteeshipSnmsUrl,
                    username: this.addForm.trusteeshipSnmsUsername,
                    password: this.addForm.trusteeshipSnmsPassword
                  },
                  {
                    interType: 'LAS',
                    url: this.addForm.trusteeshipAgentUrl,
                    token: !this.addForm.trusteeshipAgentCheck,
                    username: this.addForm.trusteeshipAgentUsername,
                    password: this.addForm.trusteeshipAgentPassword
                  }
                ]
                : []
        }).then(res => {
          if (res.code == 0) {
            this.$message({
              showClose: true,
              duration: 1000,
              type: 'success',
              message: '添加成功'
            })
            this.list()
            this.addisanswer = false
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
    // 数据库连接测试
    connectionTest() {
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
          message: '请选择模式'
        })
        this.link = true
      } else if ((this.addForm.type == 'ESCROW' && this.addForm.accessType == '') || (this.addForm.type == 'BUILT' && this.addForm.interType == '')) {
        this.$message({
          showClose: true,
          duration: 1000,
          type: 'error',
          message: '请选择接口访问类型'
        })
        this.link = true
      } else if (
        (this.addForm.type == 'BUILT' && (this.addForm.oneselfAgentUrl == '' || this.addForm.oneselfBasicsUrl == '')) ||
        (this.addForm.type == 'ESCROW' && (this.addForm.trusteeshipSnmsUrl == '' || this.addForm.trusteeshipAgentUrl == ''))
      ) {
        this.$message({
          showClose: true,
          duration: 1000,
          type: 'error',
          message: '请输入地址'
        })
        this.link = true
      } else if (
        (this.addForm.type == 'BUILT' && this.addForm.oneselfAgentCheck == false && (this.addForm.oneselfAgentUsername == '' || this.addForm.oneselfAgentPassword == '')) ||
        (this.addForm.type == 'BUILT' && this.addForm.oneselfBasicsCheck == false && (this.addForm.oneselfBasicsUsername == '' || this.addForm.oneselfBasicsPassword == '')) ||
        (this.addForm.type == 'ESCROW' && this.addForm.trusteeshipAgentCheck == false && (this.addForm.trusteeshipAgentUsername == '' || this.addForm.trusteeshipAgentPassword == ''))
      ) {
        this.$message({
          showClose: true,
          duration: 1000,
          type: 'error',
          message: '请输入用户名密码'
        })
        this.link = true
      } else {
        this.link = true
        nodeConnectionTest({
          name: this.addForm.name,
          type: this.addForm.type,
          interType: this.addForm.type == 'BUILT' ? this.addForm.interType : this.addForm.type == 'ESCROW' ? this.addForm.accessType : '',
          interfaceTypeReqs:
            this.addForm.type == 'BUILT'
              ? [
                {
                  interType: 'LAS',
                  url: this.addForm.oneselfAgentUrl,
                  token: !this.addForm.oneselfAgentCheck,
                  username: this.addForm.oneselfAgentUsername,
                  password: this.addForm.oneselfAgentPassword
                },
                {
                  interType: 'LBS',
                  url: this.addForm.oneselfBasicsUrl,
                  token: !this.addForm.oneselfBasicsCheck,
                  username: this.addForm.oneselfBasicsUsername,
                  password: this.addForm.oneselfBasicsPassword
                }
              ]
              : this.addForm.type == 'ESCROW'
                ? [
                  {
                    interType: 'SNMS',
                    url: this.addForm.trusteeshipSnmsUrl,
                    username: this.addForm.trusteeshipSnmsUsername,
                    password: this.addForm.trusteeshipSnmsPassword
                  },
                  {
                    interType: 'LAS',
                    url: this.addForm.trusteeshipAgentUrl,
                    token: !this.addForm.trusteeshipAgentCheck,
                    username: this.addForm.trusteeshipAgentUsername,
                    password: this.addForm.trusteeshipAgentPassword
                  }
                ]
                : []
        }).then(res => {
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
              duration: 3000,
              type: 'error',
              message: res.msg
            })
            this.link = false
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
                this.addForm.oneselfAgentId = res.data.interfaceTypes[i].id
              } else if (res.data.interfaceTypes[i].type == '标识基础服务') {
                this.addForm.oneselfBasicsUrl = res.data.interfaceTypes[i].url
                this.addForm.oneselfBasicsCheck = res.data.interfaceTypes[i].token
                this.addForm.oneselfBasicsUsername = res.data.interfaceTypes[i].username
                this.addForm.oneselfBasicsPassword = res.data.interfaceTypes[i].password
                this.addForm.oneselfBasicsId = res.data.interfaceTypes[i].id
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
                this.addForm.trusteeshipSnmsId = res.data.interfaceTypes[i].id
              } else if (res.data.interfaceTypes[j].type == '标识代理服务') {
                this.addForm.trusteeshipAgentUrl = res.data.interfaceTypes[j].url
                this.addForm.trusteeshipAgentCheck = res.data.interfaceTypes[j].token
                this.addForm.trusteeshipAgentUsername = res.data.interfaceTypes[j].username
                this.addForm.trusteeshipAgentPassword = res.data.interfaceTypes[j].password
                this.addForm.trusteeshipAgentId = res.data.interfaceTypes[i].id
              }
            }
            this.selfBuilt = false
            this.managed = true
          }
        }
      })
    },
    // 修改初始化
    modify(id) {
      this.putid = id
      this.changeisanswe = true
      getEnterpriseNode(id).then(res => {
        if (res.code == 0) {
          this.addForm.name = res.data.name
          if (res.data.type == '自建模式') {
            this.addForm.type = 'BUILT'
            this.addForm.interType = res.data.interType == '标识代理服务' ? 'LAS' : ''
            for (var i = 0; i < res.data.interfaceTypes.length; i++) {
              if (res.data.interfaceTypes[i].type == '标识代理服务') {
                this.addForm.oneselfAgentUrl = res.data.interfaceTypes[i].url
                this.addForm.oneselfAgentCheck = res.data.interfaceTypes[i].token
                this.addForm.oneselfAgentUsername = res.data.interfaceTypes[i].username
                this.addForm.oneselfAgentPassword = res.data.interfaceTypes[i].password
                this.addForm.oneselfAgentId = res.data.interfaceTypes[i].id
              } else if (res.data.interfaceTypes[i].type == '标识基础服务') {
                this.addForm.oneselfBasicsUrl = res.data.interfaceTypes[i].url
                this.addForm.oneselfBasicsCheck = res.data.interfaceTypes[i].token
                this.addForm.oneselfBasicsUsername = res.data.interfaceTypes[i].username
                this.addForm.oneselfBasicsPassword = res.data.interfaceTypes[i].password
                this.addForm.oneselfBasicsId = res.data.interfaceTypes[i].id
              }
            }
            this.selfBuilt = true
            this.managed = false
          } else if (res.data.type == '托管模式') {
            this.addForm.type = 'ESCROW'
            this.addForm.accessType = res.data.interType == 'snms系统' ? 'SNMS' : res.data.interType == '标识代理服务' ? 'LAS' : ''
            for (var j = 0; j < res.data.interfaceTypes.length; j++) {
              if (res.data.interfaceTypes[j].type == 'snms系统') {
                this.addForm.trusteeshipSnmsUrl = res.data.interfaceTypes[j].url
                this.addForm.trusteeshipSnmsUsername = res.data.interfaceTypes[j].username
                this.addForm.trusteeshipSnmsPassword = res.data.interfaceTypes[j].password
                this.addForm.trusteeshipSnmsId = res.data.interfaceTypes[i].id
              } else if (res.data.interfaceTypes[j].type == '标识代理服务') {
                this.addForm.trusteeshipAgentUrl = res.data.interfaceTypes[j].url
                this.addForm.trusteeshipAgentCheck = res.data.interfaceTypes[j].token
                this.addForm.trusteeshipAgentUsername = res.data.interfaceTypes[j].username
                this.addForm.trusteeshipAgentPassword = res.data.interfaceTypes[j].password
                this.addForm.trusteeshipAgentId = res.data.interfaceTypes[i].id
              }
            }
            this.selfBuilt = false
            this.managed = true
          }
        }
      })
    },
    // 确定修改初始化
    updateDatabase() {
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
          message: '请选择模式'
        })
      } else if ((this.addForm.type == 'ESCROW' && this.addForm.accessType == '') || (this.addForm.type == 'BUILT' && this.addForm.interType == '')) {
        this.$message({
          showClose: true,
          duration: 1000,
          type: 'error',
          message: '请选择接口访问类型'
        })
      } else if (
        (this.addForm.type == 'BUILT' && (this.addForm.oneselfAgentUrl == '' || this.addForm.oneselfBasicsUrl == '')) ||
        (this.addForm.type == 'ESCROW' && (this.addForm.trusteeshipSnmsUrl == '' || this.addForm.trusteeshipAgentUrl == ''))
      ) {
        this.$message({
          showClose: true,
          duration: 1000,
          type: 'error',
          message: '请输入地址'
        })
      } else if (
        (this.addForm.type == 'BUILT' && this.addForm.oneselfAgentCheck == false && (this.addForm.oneselfAgentUsername == '' || this.addForm.oneselfAgentPassword == '')) ||
        (this.addForm.type == 'BUILT' && this.addForm.oneselfBasicsCheck == false && (this.addForm.oneselfBasicsUsername == '' || this.addForm.oneselfBasicsPassword == '')) ||
        (this.addForm.type == 'ESCROW' && this.addForm.trusteeshipAgentCheck == false && (this.addForm.trusteeshipAgentUsername == '' || this.addForm.trusteeshipAgentPassword == ''))
      ) {
        this.$message({
          showClose: true,
          duration: 1000,
          type: 'error',
          message: '请输入用户名密码'
        })
      } else {
        putEnterpriseNode({
          id: this.putid,
          name: this.addForm.name,
          type: this.addForm.type,
          interType: this.addForm.type == 'BUILT' ? this.addForm.interType : this.addForm.type == 'ESCROW' ? this.addForm.accessType : '',
          interfaceTypeReqs:
            this.addForm.type == 'BUILT'
              ? [
                {
                  interType: 'LAS',
                  url: this.addForm.oneselfAgentUrl,
                  token: !this.addForm.oneselfAgentCheck,
                  username: this.addForm.oneselfAgentUsername,
                  password: this.addForm.oneselfAgentPassword,
                  id: this.addForm.oneselfAgentId
                },
                {
                  interType: 'LBS',
                  url: this.addForm.oneselfBasicsUrl,
                  token: !this.addForm.oneselfBasicsCheck,
                  username: this.addForm.oneselfBasicsUsername,
                  password: this.addForm.oneselfBasicsPassword,
                  id: this.addForm.oneselfBasicsId

                }
              ]
              : this.addForm.type == 'ESCROW'
                ? [
                  {
                    interType: 'SNMS',
                    url: this.addForm.trusteeshipSnmsUrl,
                    username: this.addForm.trusteeshipSnmsUsername,
                    password: this.addForm.trusteeshipSnmsPassword,
                    id: this.addForm.trusteeshipSnmsId

                  },
                  {
                    interType: 'LAS',
                    url: this.addForm.trusteeshipAgentUrl,
                    token: !this.addForm.trusteeshipAgentCheck,
                    username: this.addForm.trusteeshipAgentUsername,
                    password: this.addForm.trusteeshipAgentPassword,
                    id: this.addForm.trusteeshipAgentId

                  }
                ]
                : []
        }).then(res => {
          if (res.code == 0) {
            this.$message({
              showClose: true,
              duration: 1000,
              type: 'success',
              message: '修改成功'
            })
            this.list()
            this.changeisanswe = false
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
  min-height: 750px;
  border-radius: 3px;
}
</style>
<style>
.node .el-form-item__label {
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

.dialog .el-form-item {
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
.dialog .el-form-item__label {
  font-size: 12px;
}
.node .el-table th > .cell {
  height: 50px;
  line-height: 50px;
}
</style>

