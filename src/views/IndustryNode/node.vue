<template>
  <div class="node">
    <div class="head">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="企业节点" style="font-size:12px">
          <el-input v-model="formInline.user" placeholder="请输入数据源名称" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="formInline.region" placeholder="请选择类型">
            <el-option v-for="item in teacherOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker v-model="value2" style="margin-right:20px" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" />
        </el-form-item>
        <el-form-item label="创建者">
          <el-input v-model="formInline.user" placeholder="请输入创建者名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" round icon="el-icon-search" @click="query">查询</el-button>
          <el-button type="warning" size="mini" round icon="el-icon-refresh" @click="Reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="conter">
      <div style="padding:10px 0;">
        <p style="float:left;border-left: 5px solid #4283d8;padding-left: 10px;color: #4283d8;">企业节点列表</p>
        <el-button type="text" icon="el-icon-plus" style="float:right;color: #4283d8;padding-top: 18px;" @click="addisanswer=true">添加企业节点</el-button>
      </div>
      <el-table :data="tableData" :cell-style="rowClass" stripe :header-cell-style="headClass">
        <el-table-column fixed label="序号" type="index" min-width="100" />
        <el-table-column prop="date" label="创建人" min-width="180" />
        <el-table-column prop="name" label="名称" min-width="180" />
        <el-table-column prop="address" label="创建时间" min-width="180" />
        <el-table-column prop="address" label="类型" min-width="180" />
        <el-table-column label="操作" min-width="250">
          <template slot-scope="scope">
            <el-button type="text" style="color: #4283d8;" @click="see(scope.row)">查看</el-button>
            <el-button type="text" style="color: #4283d8;" @click="modify(scope.row)">修改</el-button>
            <el-button type="text" style="color: #d05e5e;" @click="det(scope.row.id)">删除</el-button>

          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: center;margin-top: 5%;">
        <el-pagination :current-page="currentPage4" :page-sizes="[10, 20, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="length" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>

    <!-- 添加数据源弹窗 -->
    <el-dialog width="35%" :visible.sync="addisanswer" append-to-body title="数据源详情">
      <el-form ref="form" :model="form" label-width="100px" class="dialog">
        <el-form-item label="企业节点名称">
          <el-input v-model="form.name" placeholder="请输入数据源名称" />
        </el-form-item>
        <el-form-item label="企业节点类型">
          <el-select v-model="form.roleId" placeholder="请选择类型">
            <el-option v-for="item in teacherOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="接口地址">
          <el-input v-model="form.name" placeholder="请输入连接地址" />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="form.name" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.name" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item style="margin-left: -80px;">
          <el-row :gutter="20">
            <el-col :span="20">
              <el-button type="warning" size="mini" round @click="isanswer=false">连接测试</el-button>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" size="mini" round @click="isanswer=false">确定</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 修改数据源弹窗 -->
    <el-dialog width="35%" :visible.sync="changeisanswe" append-to-body title="修改企业节点">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="企业节点名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="企业节点类型">
          <el-input v-model="form.name" :disabled="true" />
        </el-form-item>
        <el-form-item label="企业节点类型">
          <el-input v-model="form.name" :disabled="true" />
        </el-form-item>
        <el-form-item label="接口地址">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item style="margin-left: -80px;">
          <el-row :gutter="20">
            <el-col :span="20">
              <el-button @click="isanswer=false">连接测试</el-button>
            </el-col>
            <el-col :span="4">
              <el-button @click="isanswer=false">确定</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 数据表格查看弹出框 -->
    <el-dialog width="35%" :visible.sync="isanswer" append-to-body title="企业节点详情">
      <el-form ref="form" :model="form" label-width="100px" class="dialog">
        <el-form-item label="企业节点名称">
          <el-input v-model="form.name" :disabled="true" />
        </el-form-item>
        <el-form-item label="企业节点类型">
          <el-input v-model="form.name" :disabled="true" />
        </el-form-item>
        <el-form-item label="接口地址">
          <el-input v-model="form.name" :disabled="true" />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="form.name" :disabled="true" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.name" :disabled="true" />
        </el-form-item>
        <el-form-item>
          <el-button @click="isanswer=false">确定</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
  </div>
</template>
<script>
import {
  roleList // 获取角色
} from '@/api/user.js'
export default {
  data() {
    return {
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
      changeisanswe: false,
      addisanswer: false,
      isanswer: false,
      offset: 0,
      limit: 10,
      length: 10,
      currentPage4: 1,
      newName: '',
      value: '',
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
      value1: '',
      value2: '',
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  methods: {
    // 获取角色
    roleList() {
      roleList().then(res => {
        if (res.code == 0) {
          this.teacherOptions = []
          for (let i = 0; i < res.data.length; i++) {
            this.teacherOptions.push({ label: res.data[i].alias, value: res.data[i].id })
          }
        } else {
          this.$message.error({
            showClose: true,
            duration: 1000,
            message: res.data.msg,
            type: 'warning'
          })
        }
      })
    },
    headClass() {
      return 'text-align: center;background:#4283d8;color:#fff'
    },
    // 表格样式设置
    rowClass() {
      return 'text-align: center;'
    },
    // 分页
    handleSizeChange(val) {
      this.limit = val
      this.getCourseListNew()
    },
    handleCurrentChange(val) {
      this.offset = val
      this.getCourseListNew()
    },
    // 查询按钮
    query() {

    },
    // 重置按钮
    Reset() {

    },
    // 查看按钮
    see(row) {
      this.name = row.name
      this.row = row

      this.isanswer = true
    },
    // 修改按钮
    modify() {
      this.changeisanswe = true
    },
    // 删除按钮
    det() {

    },
    // 归档按钮
    file() {

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
.dialog .el-button--primary {
  background-color: #4283d8;
  border-color: #4283d8;
}
.dialog .el-form-item__label{
  font-size: 12px;

}
</style>

