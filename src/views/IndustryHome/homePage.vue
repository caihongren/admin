<template>
  <div>
    <div style="width:95%;margin: 10px auto;min-height: 35px;">
      <div style=" display: inline-block; vertical-align: middle;"><img src="./../../img/data.png" alt=""></div>
      <div class="infos" style="display: inline-block;margin-right:30px;">数据总览</div>
      <el-select v-if="isstudent" v-model="HomePage" placeholder="请选择数据" @change="HomeClick(HomePage)">
        <el-option label="全部" value="" />
        <el-option v-for="(item,index) in pageData" :key="index" :label="item.label" :value="item.value" />
      </el-select>
    </div>
    <el-row style="width:95%;margin: 0 auto;" :gutter="20">

      <el-col :span="5" style="padding-right: 0px;padding-left: 0px;">
        <div style="width: 100%; height: 200px;background-color: #fff;border-radius: 10px;">
          <div style="width:100%;background: #bdc4ce; border-radius: 10px 10px 0 0;text-align: center;height: 50px;line-height: 50px;font-size: 20px;">
            <img src="../../img/图标1 (7).png" style="width:12%;display: inline-block; vertical-align: middle; ">
            <div style="display: inline-block;">存量导入任务</div>
          </div>

          <div style="text-align: center;font-size:30px;padding-top:20px;">{{ taskStockCount }}</div>
          <div class="clearfix">
            <div style=" float: left;padding-left:10%">进行中</div>
            <div style=" float: right;padding-right:10%">{{ taskStockRunCount }}</div>
          </div>
          <div class="clearfix">
            <p style=" float: left;padding-left:10%">已结束</p>
            <p style=" float: right;padding-right:10%">{{ taskStockEndCount }}</p>
          </div>
          <div class="clearfix">
            <div style=" float: left;padding-left:10%">异常终止</div>
            <div style=" float: right;padding-right:10%">{{ taskStockAbnormalCount }}</div>
          </div>

        </div>
        <div style="width: 100%; height: 200px;background-color: #fff;border-radius: 10px;margin-top:4%;">
          <div style="width:100%;background: #bdc4ce; border-radius: 10px 10px 0 0;text-align: center;height: 50px;line-height: 50px;font-size: 20px;">
            <img src="../../img/图标1 (10).png" style="width:12%;display: inline-block; vertical-align: middle; ">
            <div style="display: inline-block;">实时导入任务</div>
          </div>

          <div style="text-align: center;font-size:30px;padding-top:20px;">{{ taskTimeCount }}</div>
          <div class="clearfix">
            <div style=" float: left;padding-left:10%">进行中</div>
            <div style=" float: right;padding-right:10%">{{ taskTimeRunCount }}</div>
          </div>
          <div class="clearfix">
            <p style=" float: left;padding-left:10%">手动终止</p>
            <p style=" float: right;padding-right:10%">{{ taskTimeManualCount }}</p>
          </div>

        </div>
      </el-col>
      <el-col :span="19" style="padding-right: 0px;padding-left: 20px;">
        <div class="nine">
          <div class="ddd">
            <div class="divIcon">

              <img src="./../../img/图标1 (1).png">
              <p class="text">数据源</p>

              <div style="font-size:20px;">{{ dataSourceCount }}</div>

            </div>
            <div class="divIcon" style="margin: 0px 10px 20px 15px;">

              <img src="./../../img/图标1 (2).png">
              <p class="text">企业节点</p>
              <div style="font-size:20px;">{{ enterpriseNodeCount }}</div>

            </div>
            <div class="divIcon" style="margin: 0px 15px 20px 5px;">

              <img src="./../../img/图标1 (3).png">
              <p class="text">任务总数</p>
              <div style="font-size:20px;">{{ taskCount }}</div>

            </div>
            <div class="divIcon">

              <img src="./../../img/图标1 (4).png">
              <p class="text">进行中任务</p>
              <div style="font-size:20px;">{{ taskRunCount }}</div>

            </div>

          </div>

        </div>
        <div style="margin-top:20px">
          <div class="divIcon">

            <img src="./../../img/图标1 (5).png">
            <p class="text">已结束任务</p>
            <div style="font-size:20px;">{{ taskEndCount }}</div>

          </div>
          <div class="divIcon" style="margin: 0px 10px 20px 15px;">

            <img src="./../../img/图标1 (8).png">
            <p class="text">手动停止任务</p>
            <div style="font-size:20px;">{{ taskManualCount }}</div>

          </div>
          <div class="divIcon" style="margin: 0px 15px 20px 5px;">

            <img src="./../../img/图标1 (9).png">
            <p class="text">归档任务</p>
            <div style="font-size:20px;">{{ taskArchiveCount }}</div>

          </div>
          <div class="divIcon">

            <img src="./../../img/图标1 (6).png">
            <p class="text">异常终止任务</p>
            <div style="font-size:20px;">{{ taskAbnormalCount }}</div>

          </div>

        </div>
      </el-col>
    </el-row>
    <div id="myChart" style="width: 95%; min-height: 400px;margin:10px auto; border-radius: 10px;border-radius: 10px;" />
  </div>
</template>
<script>
import { mGetDateThis, homeTask, handleDataECharts, dataList } from '@/api/user.js'
import echarts from 'echarts'
export default {
  data() {
    return {
      isstudent: false,
      creatorId: '',
      dataSourceCount: '',
      enterpriseNodeCount: '',
      taskAbnormalCount: '',
      taskArchiveCount: '',
      taskCount: '',
      taskEndCount: '',
      taskManualCount: '',
      taskStockCount: '',
      taskStockEndCount: '',
      taskStockRunCount: '',
      taskTimeCount: '',
      taskTimeManualCount: '',
      taskTimeRunCount: '',
      taskStockAbnormalCount: '',
      taskRunCount: '',
      value: [],
      data: [],
      HomePage: '',
      pageData: []
    }
  },
  mounted() {
    this.dataPage()
    this.drawLine()
  },
  created() {
    this.supervisor()
    this.getChart()
    this.homeTaskList()
  },
  methods: {
    HomeClick(HomePage) {
      this.getChart(HomePage)
      this.homeTaskList(HomePage)
    },
    // 判断教导主任
    supervisor() {
      const user = JSON.parse(sessionStorage.getItem('user'))

      if (user.role == 'data') {
        this.isstudent = false
      } else if (user.role == 'admin') {
        this.isstudent = true
      }
    },
    dataPage() {
      dataList().then(res => {
        this.pageData = []
        for (let i = 0; i < res.data.length; i++) {
          this.pageData.push({ label: res.data[i].name, value: res.data[i].id })
        }
      })
    },
    homeTaskList(id) {
      let crId = ''
      if (sessionStorage.getItem('user')) {
        const user = JSON.parse(sessionStorage.getItem('user')).role
        if (user == 'admin') {
          crId = id
        } else {
          crId = JSON.parse(sessionStorage.getItem('user')).id
        }
      }
      homeTask(crId || '').then(res => {
        if (res.code == 0) {
          this.dataSourceCount = res.data.dataSourceCount// 数据源
          this.enterpriseNodeCount = res.data.enterpriseNodeCount// 企业节点
          this.taskAbnormalCount = res.data.taskAbnormalCount// 异常终止任务
          this.taskArchiveCount = res.data.taskArchiveCount// 归档任务
          this.taskCount = res.data.taskCount// 任务总数
          this.taskEndCount = res.data.taskEndCount// 已结束任务
          this.taskManualCount = res.data.taskManualCount// 手动停止任务
          this.taskRunCount = res.data.taskRunCount// 进行中任务
          this.taskStockAbnormalCount = res.data.taskStockAbnormalCount// 存量异常终止

          this.taskStockCount = res.data.taskStockCount// 存量导入任务
          this.taskStockEndCount = res.data.taskStockEndCount// 存量已结束
          this.taskStockRunCount = res.data.taskStockRunCount// 存量进行中
          this.taskTimeCount = res.data.taskTimeCount// 实时导入任务
          this.taskTimeManualCount = res.data.taskTimeManualCount// 实时手动终止
          this.taskTimeRunCount = res.data.taskTimeRunCount// 实时进行中
        }
      })
    },
    getChart(id) {
      let crId = ''
      if (sessionStorage.getItem('user')) {
        const user = JSON.parse(sessionStorage.getItem('user')).role
        if (user == 'admin') {
          crId = id
        } else {
          crId = JSON.parse(sessionStorage.getItem('user')).id
        }
      }
      handleDataECharts(crId || '').then(res => {
        if (res.code == 0) {
          this.value = []
          this.data = []
          for (let i = 0; i < res.data.length; i++) {
            const item = res.data[i]
            this.value.push(item.value)
            this.data.push(item.data)
          }
        }
        this.drawLine() // 初始化图标对象
      })
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = this.$echarts.init(document.getElementById('myChart'))
      var category = []
      const dottedBase = mGetDateThis(0)
      const year = new Date().getFullYear()
      const month = new Date().getMonth() + 1

      for (var i = 1; i <= dottedBase; i++) {
        category.push(
          year + '-' + month + '-' + i
        )
      }

      var option = {
        grid: {
          x: 195,
          y: 50
        },
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 10,
        borderColor: 'pink',
        title: {
          text: '标识统计'
        },

        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['line', 'bar'],
          icon: 'roundRect',
          textStyle: {
            color: 'black'
          }

        },
        xAxis: {
          name: '时间', // 坐标名字

          data: category,
          axisLine: {
            lineStyle: {
              color: 'black'
            }
          }
        },
        yAxis: {
          name: '数据量', // 坐标名字
          splitLine: { show: false },
          axisLine: {
            lineStyle: {
              color: 'black'
            }
          }
        },
        series: [{
          name: '标识统计',
          type: 'bar',
          barWidth: 15,
          itemStyle: {
            barBorderRadius: 5,
            color: new echarts.graphic.LinearGradient(
              0, 0, 0, 5,
              [
                { offset: 0, color: '#8a929c' },
                { offset: 0.5, color: '#2d7de6' },

                { offset: 1, color: '#605ad8' }
              ]
            )
          },
          data: this.value
        }]
      }
      myChart.setOption(option)
      window.onresize = function() {
        myChart.resize()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.clearfix:after{/*伪元素是行内元素 正常浏览器清除浮动方法*/
        content: "";
        display: block;
        height: 0;
        clear:both;
        visibility: hidden;
    }

.nine {
  width: 100%;
  min-height: 200px;
}
.divIcon {
  border-radius: 15px;
  border-collapse: collapse;
  width: 24%;
  height: 190px;
  text-align: center;
  float: left;

  transition: all 0.4s;
  padding-top: 1%;
  position: relative;
  position: relative;
  background: #fff;
  box-shadow: 0 0 0 1px #e2e9ed;
  padding: 5px;
  box-sizing: border-box;
  -webkit-transition: box-shadow 0.2s ease, -webkit-transform 0.2s ease;
  transition: box-shadow 0.2s ease, -webkit-transform 0.2s ease;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
  transition: box-shadow 0.2s ease, transform 0.2s ease,
    -webkit-transform 0.2s ease;
  img {
    width: 25%;
    position: absolute;
    top: -12%;
    left: 38%;
  }
  .text {
    margin-top: 25%;
    color:#8a8787;
  }
}
.divIcon:hover {
  border: none;
  z-index: 1;
  box-shadow: 0 8px 50px rgba(0, 0, 0, 0.2);
  transform: scale(1.05);
}
</style>
