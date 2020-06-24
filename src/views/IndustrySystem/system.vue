<template>
  <div class="system">
    <el-tabs type="border-card">
      <el-tab-pane label="LOGO管理">
        <div class="LOGO">
          <div style="width:500px;height:300px;margin: 0 auto;">
            <img :src="dialogImageUrl" alt style="width:100%;height:100%">
          </div>
          <div class="upload">
            <el-upload
              ref="upload"
              class="upload-demo"
              :limit="1"
              list-type="picture"
              :show-file-list="false"
              :on-change="handlePictureCardPreview"
              :with-credentials="true"
              :before-upload="beforeUpload"
              :auto-upload="true"
              accept=".png,.jpg,.gif,.svg"
              action=""
            >
              <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
            </el-upload>
          </div>
          <div class="operation">
            <el-button type="primary" size="small" class="determine" @click="ImgUploadSectionFile">确定</el-button>
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
                <img src="./../../img/个人中心.jpg" alt style="width:100%;" @click="defaultTheme">
                <p style="text-align: center;">默认主题</p>
              </div>
              </el-col>
              <el-col :span="11"><div style="width:50%;">
                <img src="./../../img/个人中心.jpg" alt style="width:100%;" @click="scienceTheme">
                <p style="text-align: center;">科技主题</p>
              </div>
              </el-col>
            </el-row>
            <div class="currentbotton">
              <el-button size="small" type="primary" class="determine">确定</el-button>
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
  postLogo,
  logo,
  putThemeStyle,
  Size
} from '@/api/user.js'
export default Vue.extend({
  components: {},

  data() {
    return {
      // dialogImageUrl: require('./../../img/个人中心.jpg'),
      fileList: [],
      dialogImageUrl: '', // 上传图片后的图片地址
      uploadImgBase64: '', // 存储将图片转化为base64后的字符
      imageUrl: ''

    }
  },
  created() {
    this.getLogo()
  },
  mounted() {

  },
  methods: {
    theme() {
      putThemeStyle({
        // DEFAULT:
        // TECHNOLOGY:
      }).then(res => {
        if (res.code == 0) {

        }
      })
    },
    getLogo() {
      logo().then(res => {
        if (res.code == 0) {
          console.log(res, 'tupian')
        }
      })
    },
    beforeUpload(file) {
      this.fileList = file
    },
    ImgUploadSectionFile(param) {
      console.log(param, 'param')
      const formData = new FormData()// formdata格式
      formData.append('logo', this.fileList)
      postLogo(formData).then(res => {
        if (res.code == 0) { // 成功
          console.log(res)
        }
      })
    },
    // 文件改变时勾子函数
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
    },
    // 默认主题
    defaultTheme() {
      putThemeStyle({
        // DEFAULT:
      }).then(res => {
        if (res.code == 0) {

        }
      })
    },
    // 科技主题
    scienceTheme() {
      putThemeStyle({
        // TECHNOLOGY:
      }).then(res => {
        if (res.code == 0) {

        }
      })
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
.system .el-form-item__label {
  line-height: 60px;
}
.system .el-form-item__content {
  line-height: 60px;
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
