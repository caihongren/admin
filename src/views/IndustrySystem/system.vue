<template>
  <div class="system">
    <el-tabs type="border-card">
      <el-tab-pane label="LOGO管理">
        <div class="LOGO">
          <div style="width:500px;height:300px;margin: 0 auto;">
            <img :src="dialogImageUrl" alt style="width:100%;height:100%">
          </div>
          <div class="upload">
            <el-upload action="/img/add_resource" :before-upload="beforeUploadimg" :on-remove="handleRemove">
              <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
            </el-upload>
          </div>
          <div class="operation">
            <el-button size="small" type="info">确定</el-button>
            <el-button size="small">取消</el-button>
          </div>

        </div>
      </el-tab-pane>
      <el-tab-pane label="主题风格管理">
        <div class="theme">
          <p class="current">当前主提</p>
          <div style="width:500px;height:250px;">
            <img src="./../../img/个人中心.jpg" alt style="width:100%;height:100%">
          </div>
          <div style="width: 100%;margin-top:4%;">
            <p class="current">选择主题</p>
            <el-row :gutter="20">
              <el-col :span="11"><div style="width:50%;">
                <img src="./../../img/个人中心.jpg" alt style="width:100%;">
                <p style="text-align: center;">默认主题</p>
              </div></el-col>
              <el-col :span="11"><div style="width:50%;">
                <img src="./../../img/个人中心.jpg" alt style="width:100%;">
                <p style="text-align: center;">科技主题</p>
              </div></el-col>
            </el-row>
            <div class="currentbotton">
              <el-button size="small" type="info">确定</el-button>
              <el-button size="small">取消</el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import Vue from 'vue'
import {
  resource
} from '@/api/user.js'
export default Vue.extend({
  components: {},

  data() {
    return {
      dialogImageUrl: require('./../../img/个人中心.jpg'),

      imageUrl: ''

    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    beforeUploadimg(file) {
      const isJPG = file.type
      if (isJPG.indexOf('image/') == -1) {
        this.$message.error('只能上传图片')
        return false // 屏蔽了action的默认上传
      } else {
        const fd = new FormData()
        fd.append('file', file) // 传图片

        fd.append('resourceTypeId', '')
        fd.append('resourceTypeName', 'annex')
        // fd.append('id',this.srid);//传其他参数
        resource(fd).then(res => {
          // 图片验证

          this.dialogImageUrl = res.data.object.path
          // "http://192.168.2.223:8081/static/annex/4919ab72-350b-42bc-be46-50d061f1ac71tonglifanglogo.png";

          // this.dialogImageUrl = file.url;
          this.dialogVisibleImg = true
          this.addtest.iconId = res.data.object.id
        })
        return false // 屏蔽了action的默认上传
      }
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }

})
</script>
<style lang="less" scoped>
.system {
  width: 98%;
  margin: 2% auto;
  height: 850px;
  .LOGO {
    width: 100%;
    margin: 0 auto;
    padding: 50px;
  }
  .theme {
    width: 100%;
    .current {
      color: #4283d8;
      border-bottom: 2px solid #abc5c0;
      padding-bottom: 10px;
    }
  }
  .currentbotton{
    margin-left: 25%;
  }
}
</style>
<style>
.system .el-tabs__content {
  width: 100%;
}
.system .el-tabs--border-card {
  height: 100%;
}
.system .upload {
  text-align: center;
}
.operation {
  text-align: center;
}
.btnFalses {
  background: #4283d8 !important;
  color: #fff !important;
  border: #4283d8 !important;
}
.system .el-tabs__nav-wrap::after {
  height: 0px;
}
.system .el-tabs__item.is-active {
  color: #4283d8;
}
.system .el-tabs__header {
  margin: 0 auto;
  width: 100%;
}
.system .el-tabs__item {
  height: 40px;
  font-size: 14px;
  line-height: 40px;
}
.system .el-tabs__active-bar {
  background-color: #4283d8;
}

.system .el-form-item__label {
  line-height: 60px;
}
.system .el-form-item__content {
  line-height: 60px;
}
.system .el-tabs__item:hover {
  color: #4283d8;
}
.system .el-button--primary {
  background-color: #ebb563;
  border-color: #ebb563;
}
.system .el-button--info {
  background-color: #4283d8;
  border-color: #4283d8;
}
.el-upload {
  margin-top: 3%;
}
.upload .el-button--small {
  padding: 13px 80px;
  font-size: 14px;
}
.operation .el-button--small {
  margin-top: 3%;
  margin-left: 2%;
  margin-right: 0%;
  padding: 10px 30px;
}
.currentbotton .el-button--small{
   margin-top: 4%;
  margin-left: 5%;
  margin-right: 0%;
  padding: 10px 30px;
}
.system .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
  color: #4283d8;
}
.system
  .el-tabs--border-card
  > .el-tabs__header
  .el-tabs__item:not(.is-disabled):hover {
  color: #4283d8;
}
</style>
