<template>
  <div class="node">
    <div class="head">
      <!-- <div style="display: flex; justify-content: left; width: 100%;" :model="query">
        <div style="display: flex;padding-right:20px;width: 30%;">
          <span style="color: #606266;line-height: 35px;font-weight: 700;font-size: 12px;">数据模板</span>
          <el-input v-model="query.version" placeholder="请输入数据模板名称" />
        </div>
        <div style="display: flex;padding-right:20px;">
          <span style="width: 17%;color: #606266;line-height: 35px;font-weight: 700;font-size: 12px;">前缀</span>
          <el-input v-model="query.prefix" placeholder="请输入前缀" />
        </div>
        <div style="display: flex;padding-right:20px;">
          <span style="width: 22%;color: #606266;line-height: 35px;font-weight: 700;font-size: 12px;">企业节点</span>
          <el-select v-model="query.enterpriseNodeId" placeholder="请选择企业节点">
            <el-option v-for="(item,index) in nodelist" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div style="display: flex;">
          <el-button type="primary" size="mini" round icon="el-icon-search" @click="getLists">查询</el-button>
          <el-button type="primary" size="mini" round icon="el-icon-search" @click="getQuery">从SNMS查询</el-button>

          <el-button type="warning" size="mini" round icon="el-icon-refresh" @click="Reset">重置</el-button>
        </div>

      </div> -->
      <el-form :inline="true" :model="query" class="demo-form-inline">
        <el-form-item label="数据模板" style="font-size:12px">
          <el-input v-model="query.version" placeholder="请输入数据模板名称" />
        </el-form-item>
        <el-form-item label="前缀" style="font-size:12px">
          <el-input v-model="query.prefix" placeholder="请输入前缀" />
        </el-form-item>
        <el-form-item label="企业节点" style="font-size:12px">
          <el-select v-model="query.enterpriseNodeId" placeholder="请选择企业节点">
            <el-option v-for="(item,index) in nodelist" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" round icon="el-icon-search" @click="getLists">查询</el-button>
          <el-button type="primary" size="mini" round icon="el-icon-search" @click="getQuery">从SNMS查询</el-button>

          <el-button type="warning" size="mini" round icon="el-icon-refresh" @click="Reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="conter">
      <div style="padding:10px 0;">
        <p class="tableList" style="float:left;padding-left: 10px;">数据模板列表</p>
        <el-button type="text" icon="el-icon-plus" class="tableButton" style="float:right;padding-top: 18px;" @click="addNode()">添加数据模板</el-button>
      </div>
      <el-table :data="tableData" style="color:#43454a;" :cell-style="rowClass" stripe :header-cell-style="headClass" @sort-change="sort_change">
        <el-table-column fixed label="序号" type="index" min-width="100" />
        <el-table-column prop="version" label="数据模板" min-width="100" sortable="custom" />
        <el-table-column prop="prefix" label="所属前缀" min-width="100" sortable="custom" />
        <el-table-column prop="enterpriseNodeName" label="所属企业节点" min-width="100" sortable="custom" />

        <el-table-column label="操作" min-width="100">
          <template slot-scope="scope">
            <el-button type="text" class="tableButton" @click="see(scope.row.id)">查看</el-button>
            <el-button type="text" class="tableButton" @click="modify(scope.row.id)">修改</el-button>
            <el-button type="text" style="color: #d05e5e;" @click="det(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: center;margin-top: 5%;">
        <el-pagination :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="length" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>

    <!-- 添加数据模板弹窗 -->
    <el-dialog width="70%" top="8vh" :close-on-click-modal="false" :visible.sync="addTemplate" append-to-body title="添加数据模板">
      <div style="min-height:600px;position: relative;">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" size="mini">

          <el-row :gutter="20">
            <el-col :span="9">
              <el-form-item label="节点" prop="enterpriseNodeId">
                <el-select v-model="ruleForm.enterpriseNodeId" placeholder="请选择企业节点" style="width:100%">
                  <el-option v-for="(item,index) in nodelist" :key="index" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="前缀" prop="prefix">
                <el-input v-model="ruleForm.prefix" style="width: 100%;" />
              </el-form-item>
              <el-form-item label="名称" prop="version">
                <el-input v-model="ruleForm.version " style="width: 100%;" />
              </el-form-item>
            </el-col>
            <el-col :span="15">
              <el-form-item label="简介">
                <el-input v-model="ruleForm.description" type="textarea" style="width: 95%;letter-spacing: 1px;font-size: 14px;" maxlength="30" show-word-limit />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item style="margin-left:-40px;">
            <el-button type="text" @click="addEstablishType(true, 'add')">添加一行</el-button>
          </el-form-item>
          <el-table :data="ruleForm.dataItems" border :cell-style="rowClass" :header-cell-style="headClass" style="color:#43454a;width: 94%; margin: 0 auto;">
            <el-table-column fixed label="序号" type="index" width="100" />

            <el-table-column prop="name" label="中文名称" min-width="100" />
            <el-table-column prop="idType" label="英文名称" min-width="100" />
            <el-table-column prop="type" label="数据类型" min-width="100" />
            <el-table-column prop="minLength" label="最小长度" min-width="100" />
            <el-table-column prop="maxLength" label="最大长度" min-width="100" />
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                <el-button type="text" class="tableButton" @click="updataModifyLine(scope.$index)">修改</el-button>
                <el-button type="text" style="color: #d05e5e;" @click="detLine(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-form-item style="position: absolute;bottom: 0px; right: 5%;">
            <el-button @click="addTemplate=false">取消</el-button>
            <el-button type="primary" @click="addSubmission('ruleForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!-- 修改数据模板弹窗 -->
    <el-dialog width="70%" top="8vh" :visible.sync="upTemplate" :close-on-click-modal="false" append-to-body title="修改数据模板">
      <div style="min-height:600px;position: relative;">
        <el-form ref="ruleForm" :model="ruleForm" label-width="80px" class="demo-ruleForm" size="mini">
          <el-row :gutter="20">
            <el-col :span="9">
              <el-form-item label="节点" style="font-size:12px">
                <el-input v-model="ruleForm.enterpriseNodeName" style="width: 100%;" :disabled="true" />
                <!-- <el-select v-model="ruleForm.enterpriseNodeId" placeholder="请选择企业节点" style="width:100%">
                  <el-option v-for="(item,index) in nodelist" :key="index" :label="item.label" :value="item.value" :disabled="true" />
                </el-select> -->
              </el-form-item>
              <el-form-item label="前缀" prop="prefix">
                <el-input v-model="ruleForm.prefix" style="width: 100%;" :disabled="true" />
              </el-form-item>
              <el-form-item label="名称" prop="version">
                <el-input v-model="ruleForm.version " style="width: 100%;" :disabled="true" />
              </el-form-item>
            </el-col>
            <el-col :span="15">
              <el-form-item label="简介">
                <el-input v-model="ruleForm.description" type="textarea" style="width: 95%;letter-spacing: 1px;font-size: 14px;" maxlength="30" show-word-limit />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item style="margin-left:-40px;">
            <el-button type="text" @click="addEstablishType(true, 'add')">添加一行</el-button>
          </el-form-item>
          <el-table :data="ruleForm.dataItems" border :cell-style="rowClass" :header-cell-style="headClass" style="color:#43454a;width: 94%; margin: 0 auto;">
            <el-table-column fixed label="序号" type="index" width="100" />
            <el-table-column prop="name" label="中文名称" min-width="100" />
            <el-table-column prop="idType" label="英文名称" min-width="100" />
            <el-table-column prop="type" label="数据类型" min-width="100" />
            <el-table-column prop="minLength" label="最小长度" min-width="100" />
            <el-table-column prop="maxLength" label="最大长度" min-width="100" />
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                <el-button type="text" style="color: #4283d8;" @click="updataModifyLine(scope.$index)">修改</el-button>
                <el-button type="text" style="color: #d05e5e;" @click="detLine(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-form-item style="position: absolute;bottom: 0px; right: 5%;">
            <el-button @click="upTemplate=false">取消</el-button>
            <el-button type="primary" @click="modifyTemplate">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!-- 查看数据模板弹窗 -->
    <el-dialog width="70%" top="8vh" :visible.sync="lookTemplate" append-to-body title="查看数据模板" :close-on-click-modal="false">
      <div style="min-height:600px;position: relative;">
        <el-form ref="ruleForm" :model="ruleForm" label-width="80px" class="demo-ruleForm" size="mini">
          <el-row :gutter="20">
            <el-col :span="9">
              <el-form-item label="节点" style="font-size:12px">
                <el-input v-model="ruleForm.enterpriseNodeName" style="width: 100%;" :disabled="true" />

                <!-- <el-select v-model="ruleForm.enterpriseNodeN" placeholder="请选择企业节点" style="width:100%">
                  <el-option v-for="(item,index) in nodelist" :key="index" :label="item.label" :value="item.value" :disabled="true" />
                </el-select> -->
              </el-form-item>
              <el-form-item label="前缀">
                <el-input v-model="ruleForm.prefix" style="width: 100%;" :disabled="true" />
              </el-form-item>
              <el-form-item label="名称">
                <el-input v-model="ruleForm.version " style="width: 100%;" :disabled="true" />
              </el-form-item>
            </el-col>
            <el-col :span="15">
              <el-form-item label="简介">
                <el-input v-model="ruleForm.description" type="textarea" style="width: 95%;letter-spacing: 1px;font-size: 14px;" :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-table :data="ruleForm.dataItems" border :cell-style="rowClass" :header-cell-style="headClass" style="color:#43454a;width: 94%; margin: 0 auto;">
            <el-table-column prop="name" label="中文名称" min-width="100" />
            <el-table-column prop="idType" label="英文名称" min-width="100" />
            <el-table-column prop="type" label="数据类型" min-width="100" />
            <el-table-column prop="minLength" label="最小长度" min-width="100" />
            <el-table-column prop="maxLength" label="最大长度" min-width="100" />
          </el-table>
        </el-form>
      </div>
    </el-dialog>
    <!-- 添加数据模板的创建一行弹出框 -->
    <el-dialog width="35%" top="15vh" :visible.sync="addEstablish" append-to-body title="创建一行" :close-on-click-modal="false">
      <el-form ref="createData" :model="createData" :rules="rules2" label-width="80px" class="demo-ruleForm" size="mini">
        <el-form-item label="中文名称" prop="name">
          <el-input v-model="createData.name" placeholder="请输入中文名称" />
        </el-form-item>
        <el-form-item label="英文名称" prop="idType">
          <el-input v-model="createData.idType" placeholder="请输入英文名称" />
        </el-form-item>
        <el-form-item label="数据类型" prop="type">
          <el-select v-model="createData.type" placeholder="请选择类型" style="width:100%">
            <el-option label="字符串" value="String" />
          </el-select>
        </el-form-item>
        <el-form-item label="最小长度" prop="minLength">
          <el-input v-model="createData.minLength" placeholder="请输入最小长度" />
        </el-form-item>
        <el-form-item label="最大长度" prop="maxLength">
          <el-input v-model="createData.maxLength" placeholder="请输入最大长度" />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="createData.required">必填项</el-checkbox>
        </el-form-item>
        <el-form-item style="text-align: right;">
          <el-button @click="addEstablishType(false, '')">取消</el-button>
          <el-button type="primary" @click="resetForm2('createData')">保存</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>

  </div>
</template>
<script>
import {
  nodeSelectList,
  getList, // 获取数据模板列表
  deleteDataTemplate, // 删除数据模板
  info, // 获取数据模板详情
  insert, // 添加数据模板
  update, // 修改数据模板
  snms // 从SNMS查询
} from '@/api/user.js'
import uuid from 'uuid'
export default {
  data() {
    return {
      nodelistsCreatorId: '',
      addid: '',
      checked: true,
      nodelist: [], // 企业节点列表
      operationType: '', // 标识是新增还是修改
      // 添加一行数据绑定
      createData: {
        id: '',
        idType: '',
        required: false,
        name: '',
        type: '',
        minLength: 1,
        maxLength: 1
      },

      // 添加数据模板数据绑定
      ruleForm: {
        order: '',
        id: '',
        uuid: '',
        creatorId: '',
        enterpriseNodeId: '', // 企业节点
        enterpriseNodeName: '',
        prefix: '', // 前缀
        version: '', // 数据模板
        description: '', // 简介
        dataItems: []
      },
      // 添加数据模板数据验证
      rules: {
        enterpriseNodeId: [
          { required: true, message: '请选择企业节点', trigger: 'change' }
        ],
        prefix: [
          { required: true, message: '请输入前缀', trigger: 'blur' },
          {
            pattern: /^8[68]\.[0-9]{3}\.[1-9][0-9]{0,3}$/,
            message: '请输入前两位 88或86  .  000-999 . 1-9999',
            trigger: ['blur', 'change']
          }
        ],
        version: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]

      },
      // 添加一行数据验证
      rules2: {
        name: [
          { required: true, message: '请输入中文名称', trigger: 'blur' }
        ],
        idType: [
          { required: true, message: '请输入英文名称', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z]*$/,
            message: '请输入英文'
          }
        ],
        type: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        minLength: [
          { required: true, message: '请输入最小长度', trigger: 'blur' },
          {
            pattern: /^[0-9]*$/,
            message: '请输入数字',
            trigger: ['blur', 'change']
          }
        ],
        maxLength: [
          { required: true, message: '请输入最大长度', trigger: 'blur' },
          {
            pattern: /^[0-9]*$/,
            message: '请输入数字',
            trigger: ['blur', 'change']
          }
        ]

      },
      query: {
        putid: '',
        creatorId: '',
        order: '',
        orderBy: '',
        pageNum: 1,
        pageSize: 10,
        version: '',
        enterpriseNodeId: '',
        prefix: ''
      },

      addTemplate: false, // 添加数据模板弹窗
      lookTemplate: false, // 查看数据模板弹窗
      upTemplate: false, // 修改数据模板弹框
      addEstablish: false, // 添加一行弹窗
      offset: 0,
      limit: 10,
      length: 0, // 总条数
      pageSize: 10, // 每页个数
      currentPage: 1, // 当前页数
      pageNum: 1,
      tableData: [], // 表格数据
      putid2id: ''
    }
  },
  created() {
    this.addid = uuid.v4()
    // this.nodelists() // 获取企业节点列表
    this.nodelists2() // 获取企业节点列表

    this.getLists()// 获取模板数据列表
  },
  methods: {
    addEstablishType(establish, type) {
      this.createData.id = ''
      this.createData.idType = ''
      this.createData.required = ''
      this.createData.name = ''
      this.createData.type = ''
      this.createData.minLength = ''
      this.createData.maxLength = ''
      this.addEstablish = establish
      this.operationType = type
    },
    // 查看按钮
    see(id) {
      this.lookTemplate = true
      info(id).then(res => {
        if (res.code == 0) {
          this.ruleForm = res.data
          // this.ruleForm.enterpriseNodeId = res.data.enterpriseNodeId // 企业节点
          // this.ruleForm.prefix = res.data.prefix // 前缀
          // this.ruleForm.version = res.data.version // 数据模板
          // this.ruleForm.description = res.data.description // 简介
          // console.log(this.ruleForm.dataItems, 'chakan444 ')

          // for (var i = 0; i < res.data.dataItems.length; i++) {
          //   console.log(res.data.dataItems, 'chakan444 res')

          //   this.ruleForm.dataItems.push({
          //   // this.addid = res.data.dataItems[i].id
          //     idType: res.data.dataItems[i].idType,
          //     required: res.data.dataItems[i].required,
          //     name: res.data.dataItems[i].name,
          //     type: res.data.dataItems[i].type,
          //     minLength: res.data.dataItems[i].minLength,
          //     maxLength: res.data.dataItems[i].maxLength
          //   }
          //   )
          // }
        }
      })
    },
    // 修改初始化
    modify(id) {
      this.ruleForm.dataItems = []
      this.putid2id = id
      this.upTemplate = true
      info(id).then(res => {
        if (res.code == 0) {
          this.ruleForm.enterpriseNodeName = res.data.enterpriseNodeName // 企业节点
          this.ruleForm.enterpriseNodeId = res.data.enterpriseNodeId // 企业节点

          this.ruleForm.prefix = res.data.prefix // 前缀
          this.ruleForm.version = res.data.version // 数据模板
          this.ruleForm.description = res.data.description // 简介
          for (var i = 0; i < res.data.dataItems.length; i++) {
            this.ruleForm.dataItems.push({

              id: res.data.dataItems[i].id,
              idType: res.data.dataItems[i].idType,
              required: res.data.dataItems[i].required,
              name: res.data.dataItems[i].name,
              type: res.data.dataItems[i].type,
              minLength: res.data.dataItems[i].minLength,
              maxLength: res.data.dataItems[i].maxLength
            })
          }
        }
      })
    },
    // 修改模板数据确定按钮
    modifyTemplate() {
      if (sessionStorage.getItem('user')) {
        const user = JSON.parse(sessionStorage.getItem('user'))
        this.ruleForm.creatorId = user.id
        const list = this.ruleForm.dataItems
        const dataList = []
        for (var i = 0; i < list.length; i++) {
          dataList.push({
            order: i,
            id: list[i].id,
            idType: list[i].idType,
            required: list[i].required,
            name: list[i].name,
            type: list[i].type,
            minLength: list[i].minLength,
            maxLength: list[i].maxLength
          })
        }
        this.ruleForm.dataItems = dataList,
        this.ruleForm.id = this.putid2id
        update(this.ruleForm).then(res => {
          if (res.code == 0) {
            this.$message({
              showClose: true,
              duration: 1000,
              type: 'success',
              message: '修改成功'
            })

            this.upTemplate = false
            this.getLists()
            this.ruleForm.dataItems = []
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

    // 获取模板数据列表
    getLists() {
      this.query.pageSize = this.limit
      this.query.pageNum = this.offset
      if (sessionStorage.getItem('user')) {
        const user = JSON.parse(sessionStorage.getItem('user'))
        this.query.creatorId = user.id
        getList(this.query).then(res => {
          if (res.code == 0) {
            this.tableData = res.data.result
            this.length = res.data.total
          }
        })
      }
    },
    getQuery() {
      const ruleForm = {
        id: '',
        uuid: '',
        creatorId: '',
        enterpriseNodeId: '', // 企业节点
        enterpriseNodeName: '',
        prefix: '', // 前缀
        version: '', // 数据模板
        description: '', // 简介
        dataItems: []
      }
      this.ruleForm = ruleForm
      this.lookTemplate = true
      snms({
        enterpriseNodeId: this.query.enterpriseNodeId,
        prefix: this.query.prefix,
        version: this.query.version
      }).then(res => {
        if (res.code == 0) {
          this.ruleForm.enterpriseNodeId = res.data.enterpriseNodeId
          this.ruleForm.prefix = res.data.prefix
          this.ruleForm.version = res.data.version
          this.ruleForm.description = res.data.description
          for (var i = 0; i < res.data.items.length; i++) {
            this.ruleForm.dataItems.push({
              idType: res.data.items[i].idType,
              required: res.data.items[i].required,
              name: res.data.items[i].name,
              type: res.data.items[i].metadata.type,
              minLength: res.data.items[i].metadata.minLength,
              maxLength: res.data.items[i].metadata.maxLength
            })
          }
        }
      })
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
    nodelists2() {
      if (sessionStorage.getItem('user')) {
        const user = JSON.parse(sessionStorage.getItem('user')).id
        this.nodelistsCreatorId = user
        nodeSelectList(this.nodelistsCreatorId).then(res => {
          if (res.code == 0) {
            this.nodelist = []
            for (let i = 0; i < res.data.length; i++) {
              this.nodelist.push({ label: res.data[i].name, value: res.data[i].id })
            }
          }
        })
      }
    },
    // 重置按钮
    Reset() {
      this.query.version = ''
      this.query.enterpriseNodeId = ''
      this.query.prefix = ''
      this.getLists()
    },
    // 添加模板数据清空
    addNode() {
      this.addTemplate = true,
      this.ruleForm.enterpriseNodeId = ''
      this.ruleForm.prefix = '' // 前缀
      this.ruleForm.version = '' // 数据模板
      this.ruleForm.description = '' // 简介
      this.ruleForm.dataItems = []
    },
    // 添加数据模板
    addSubmission(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (sessionStorage.getItem('user')) {
            const user = JSON.parse(sessionStorage.getItem('user')).id
            this.ruleForm.creatorId = user
            insert(this.ruleForm).then(res => {
              if (res.code == 0) {
                this.$message({
                  showClose: true,
                  duration: 1000,
                  type: 'success',
                  message: '添加成功'
                })
                this.getLists()
                this.addTemplate = false
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
      })
    },
    // 添加一行数据
    resetForm2(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.operationType == 'add') {
            this.ruleForm.dataItems.push({
              idType: this.createData.idType,
              required: this.createData.required,
              name: this.createData.name,
              type: this.createData.type,
              minLength: this.createData.minLength,
              maxLength: this.createData.maxLength,
              id: this.addid
            })
          } else {
            this.ruleForm.dataItems[this.operationType].idType = this.createData.idType
            this.ruleForm.dataItems[this.operationType].required = this.createData.required
            this.ruleForm.dataItems[this.operationType].name = this.createData.name
            this.ruleForm.dataItems[this.operationType].type = this.createData.type
            this.ruleForm.dataItems[this.operationType].minLength = this.createData.minLength
            this.ruleForm.dataItems[this.operationType].maxLength = this.createData.maxLength
          }
          this.addEstablishType(false, '')
        }
      })
    },
    // 修改一行数据
    updataModifyLine(index) {
      this.addEstablishType(true, index)
      this.createData.id = this.ruleForm.dataItems[index].id
      this.createData.idType = this.ruleForm.dataItems[index].idType
      this.createData.required = this.ruleForm.dataItems[index].required
      this.createData.name = this.ruleForm.dataItems[index].name
      this.createData.type = this.ruleForm.dataItems[index].type
      this.createData.minLength = this.ruleForm.dataItems[index].minLength
      this.createData.maxLength = this.ruleForm.dataItems[index].maxLength
      // for (var i = 0; i < this.ruleForm.dataItems.length; i++) {
      //   const id = this.ruleForm.dataItems[i].id
      //   if (id1 == id) {
      //     this.createData.id = this.ruleForm.dataItems[i].id
      //     this.createData.idType = this.ruleForm.dataItems[i].idType
      //     this.createData.required = this.ruleForm.dataItems[i].required
      //     this.createData.name = this.ruleForm.dataItems[i].name
      //     this.createData.type = this.ruleForm.dataItems[i].type
      //     this.createData.minLength = this.ruleForm.dataItems[i].minLength
      //     this.createData.maxLength = this.ruleForm.dataItems[i].maxLength
      //   }
      // }
    //   this.establish = false
    },
    detLine(id1) {
      this.$confirm('此操作将删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '取消',
        cancelButtonText: '确定',
        confirmButtonClass: 'classStyle2',
        closeOnClickModal: false,
        showClose: false,

        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
        .catch(() => {
          for (var i = 0; i < this.ruleForm.dataItems.length; i++) {
            const id = this.ruleForm.dataItems[i].id
            if (id1 == id) {
              this.ruleForm.dataItems.splice(i, 1)
              this.$message({
                showClose: true,
                duration: 1000,
                type: 'success',
                message: '删除成功!'
              })
            }
          }
        })
    },
    // 排序功能
    sort_change(column) {
      if (column.order == 'desc') {
        this.query.order = 'desc'
      } else if (column.order == 'asc') {
        this.query.order = 'asc'
      }
      if (column.prop == 'perfix ') {
        this.query.orderBy = ' e.creator_id'
      } else if (column.prop == 'version') {
        this.query.orderBy = 'e.name'
      }
      this.getLists()
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
      this.getLists()
    },
    handleCurrentChange(val) {
      this.offset = val
      this.getLists()
    },
    // 删除
    det(id) {
      this.$confirm('此操作将删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '取消',
        cancelButtonText: '确定',
        confirmButtonClass: 'classStyle2',
        closeOnClickModal: false,
        showClose: false,

        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'info',
          duration: 1000,

          message: '已取消删除'
        })
      }).catch(() => {
        deleteDataTemplate({
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
.head {
  background-color: #ffffff;
  border-radius: 3px;
  padding-top: 2%;
  padding-left: 1%;
  padding-right: 1%;
  margin-bottom: 10px;
}
.conter {
  padding: 0 1%;
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
.dialog .el-form-item__label {
  font-size: 12px;
}
.node .el-table th > .cell {
  height: 50px;
  line-height: 50px;
}
.classStyle2{
    background: #4283d8 !important;
    color:#fff !important;
    border:1px solid #4283d8 !important;
}
</style>

