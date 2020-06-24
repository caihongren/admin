<template>
  <div class="systemDataSource">
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
        <p class="tableList" style="float:left;padding-left: 10px;">数据源列表</p>
      </div>
      <el-table :data="tableData" style="color:#43454a;" stripe>
        <el-table-column fixed label="序号" type="index" min-width="100" />

        <el-table-column prop="creatorName" label="创建人" min-width="100" sortable />
        <el-table-column prop="name" label="名称" min-width="100" sortable />
        <el-table-column prop="created" label="创建时间" min-width="100" sortable />
        <el-table-column prop="type" label="类型 / 数据库类型" :formatter="completionStatusc" min-width="100">
          <template slot-scope="scope">
            <span>{{ completionStatusc(scope.row) }}</span>
            <span v-if="scope.row.databaseType"> / {{ scope.row.databaseType }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="type" label="类型" :formatter="completionStatusc" min-width="100" />
        <el-table-column prop="databaseType" label="数据库类型" min-width="100" /> -->
        <el-table-column label="操作" min-width="100">
          <template slot-scope="scope">
            <el-button type="text" class="tableButton" @click="see(scope.row.id)">查看</el-button>

          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: center;margin-top: 5%;">
        <el-pagination :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="length" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>
    <!-- 数据表格查看弹出框 -->
    <el-dialog width="35%" :visible.sync="isanswer" append-to-body title="数据源详情" :close-on-click-modal="false">
      <el-form ref="lookForm" :model="lookForm" label-width="100px">
        <el-form-item label="名　称">
          <el-input v-model="lookForm.name" :disabled="true" />
        </el-form-item>
        <el-form-item label="源类型">
          <el-input v-model="lookForm.type" :disabled="true" />
        </el-form-item>
        <el-form-item label="库类型">
          <el-input v-model="lookForm.databaseType" :disabled="true" />
        </el-form-item>
        <el-form-item label="库名称">
          <el-input v-model="lookForm.databaseName" :disabled="true" />
        </el-form-item>
        <el-form-item label="地　址">
          <el-input v-model="lookForm.databaseUrl" :disabled="true" />
        </el-form-item>
        <el-form-item label="端口号">
          <el-input v-model="lookForm.databasePort" :disabled="true" />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="lookForm.databaseUsername" :disabled="true" />
        </el-form-item>
        <el-form-item label="密　码">
          <el-input v-model="lookForm.databasePassword" :disabled="true" />
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 文件表格查看弹出框 -->
    <el-dialog width="35%" :visible.sync="isanswerFile" append-to-body title="查看文件数据源" :close-on-click-modal="false">
      <el-form ref="lookForm" :model="lookForm" label-width="100px">
        <el-form-item label="名　称">
          <el-input v-model="lookForm.name" :disabled="true" />
        </el-form-item>
        <el-form-item label="源类型">
          <el-input v-model="lookForm.type" :disabled="true" />
        </el-form-item>
        <el-form-item>
          <el-table
            class="tableColor"
            stripe
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
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {
  list, // 获取数据源列表
  Size, // 计算大小

  getDatabase // 查看数据库数据源
} from '@/api/user.js'
export default {
  data() {
    return {
      times: null,
      dataSourcetable: [],

      query: {
        order: '',
        orderBy: '',
        pageNum: 1,
        pageSize: 10,
        startTime: null,
        endTime: null,
        type: '',
        name: '',
        startTimeStr: null,
        endTimeStr: null
      },
      lookForm: {
        name: '',
        type: '',
        databaseType: '',
        databaseName: '',
        databaseUrl: '',
        databasePort: '',
        databaseUsername: '',
        databasePassword: ''

      },
      teacherOptions: [],

      formInline: {
        user: '',
        region: ''
      },
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
      isanswerFile: false,
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
      this.query.pageSize = this.pageSize
      this.query.pageNum = this.currentPage

      if (this.times != null && this.times.length == 2) {
        this.query.startTimeStr = this.times[0]
        this.query.endTimeStr = this.times[1]
      }
      list(this.query).then(res => {
        if (res.code == 0) {
          this.tableData = res.data.result
          this.length = res.data.total
        }
      })
    },
    // headClass() {
    //   return 'text-align: center;'
    // },
    // // 表格样式设置
    // rowClass() {
    //   return 'text-align: center;'
    // },
    // 分页
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
      this.query.order = ''
      this.query.orderBy = ''
      this.query.type = ''
      this.query.startTimeStr = ''
      this.query.endTimeStr = ''

      this.list()
    },
    // 查看按钮
    see(id) {
      this.dataSourcetable = []
      getDatabase(id).then(res => {
        if (res.data.type == '数据库') {
          this.isanswer = true
          if (res.code == 0) {
            this.lookForm.name = res.data.name
            this.lookForm.type = res.data.type
            this.lookForm.databaseType = res.data.databaseType
            this.lookForm.databaseName = res.data.databaseName
            this.lookForm.databaseUrl = res.data.databaseUrl
            this.lookForm.databasePort = res.data.databasePort
            this.lookForm.databaseUsername = res.data.databaseUsername
            this.lookForm.databasePassword = res.data.databasePassword
          }
        } else if (res.data.type == '文件') {
          this.isanswerFile = true
          this.lookForm.name = res.data.name
          this.lookForm.type = res.data.type
          for (let i = 0; i < res.data.files.length; i++) {
            this.dataSourcetable.push({ name: res.data.files[i].fileName, type: res.data.files[i].fileType, size: Size(res.data.files[i].fileSize) })
          }
        }
      })
    }

  }

}
</script>
<style lang="less" scoped>
.systemDataSource {
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

  padding-left: 1%;
  padding-right: 1%;

  min-height: 750px;
  border-radius: 3px;
}
</style>
<style>
.systemDataSource .el-form-item__label {
  font-size: 12px;
}
.systemDataSource .el-input__inner {
  height: 33px;
  line-height: 33px;
}
.systemDataSource .el-table__header tr,
.el-table__header th {
  padding: 0;
  height: 40px;
}
.systemDataSource .el-table__body tr,
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
 .systemDataSource .el-table th>.cell{
  height: 50px;
  line-height:50px;
}

</style>

