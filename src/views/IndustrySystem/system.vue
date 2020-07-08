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
              accept=".png, .jpg, .gif, .svg"
              action
            >
              <p style="color:#e6a23c;font-size:12px;">建议上传比列4:1的图片，否则变形</p>

              <p style="color:red;font-size:12px;">仅允许上传png, jpg, gif, svg文件格式，且文件大小不超过100kb</p>
              <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
            </el-upload>
          </div>
          <div class="operation">
            <el-button
              type="primary"
              size="small"
              class="determine"
              @click="ImgUploadSectionFile"
            >确定</el-button>
            <el-button size="small">取消</el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="主题风格管理">
        <div class="theme">
          <p class="current">当前主提</p>
          <div style="width:500px;height:250px;">
            <img :src="bbb" alt style="width:100%;height:100%">
          </div>
          <div style="width: 100%;margin-top:4%;">
            <p class="current">选择主题</p>
            <el-row :gutter="20">
              <el-col :span="11">
                <div style="width:50%;">
                  <img :src="defaultPiuck" alt style="width:100%;" :class="{'pageBackground':page=='DEFAULT'}" @click="lookTheme(0)">
                  <p style="text-align: center;" :class="{'pageColor':page=='DEFAULT'}">默认主题</p>
                </div>
              </el-col>
              <el-col :span="11">
                <div style="width:50%;">
                  <img :src="sciencePiuck" alt style="width:100%;" :class="{'pageBackground':page=='TECHNOLOGY'}" @click="lookTheme(1)">
                  <p style="text-align: center;" :class="{'pageColor':page=='TECHNOLOGY'}">科技主题</p>
                </div>
              </el-col>
            </el-row>
            <div class="currentbotton">
              <el-button size="small" type="primary" class="determine" @click="scienceTheme()">确定</el-button>
              <el-button size="small" @click="detcolor()">取消</el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import Vue from 'vue'
import store from '../../store/index.js'
import { postLogo, logo, putThemeStyle, themeStyle, Size } from '@/api/user.js'
export default Vue.extend({
  components: {},

  data() {
    return {
      fileList: {},
      dialogImageUrl: '', // 上传图片后的图片地址
      imageUrl: '',
      oldColor: '',
      page: '',
      defaultPiuck: require('./../../img/个人中心.jpg'),
      sciencePiuck: require('./../../img/loginbeijin.jpg'),
      bbb: ''

    }
  },
  created() {
    this.themeStyle()
    this.getColor()
    this.getLogo()
    // this.lookTheme()
  },
  mounted() {},

  methods: {
    getLogo() {
      logo().then(res => {
        if (res.code == 0) {
          this.dialogImageUrl = res.data
        }
      })
    },
    beforeUpload(file) {
      console.log(file, 'beforeUpload')
      const isLt2M = file.size / 1024 < 100
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 100kb!')
      } else {
        this.fileList = file
      }
      return isLt2M
    },
    ImgUploadSectionFile(param) {
      if (this.fileList == '' || this.fileList == 'undefined') {
        this.$message({
          showClose: true,
          type: 'error',
          message: '上传文件为空',
          duration: 1000
        })
        return
      }
      const formData = new FormData() // formdata格式
      formData.append('logo', this.fileList.raw)
      console.log(this.fileList, 'befo222reUpload')
      postLogo(formData).then(res => {
        if (res.code == 0) {
          this.$confirm('更换logo需重新登录, 是否继续?', '提示', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$router.push('/login')
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消重新登录，再次登录方可看到更换的logo'
            })
          })
        }
      })
    },
    // 文件改变时勾子函数
    handlePictureCardPreview(file) {
      console.log(file, 'file')
      const aaa = this.beforeUpload(file)
      if (aaa) {
        this.dialogImageUrl = file.url
      }
    },
    themeStyle() {
      themeStyle().then(res => {
        if (res.code == 0) {
          console.log(res, '6')
          if (res.data == 'DEFAULT') {
            this.bbb = this.defaultPiuck
            this.lookTheme(0)
            console.log(this.bbb, 'this.bbb')
          } else if (res.data == 'TECHNOLOGY') {
            this.bbb = this.sciencePiuck
            this.lookTheme(1)
          }
        }
      })
    },
    // 主题风格确定按钮
    scienceTheme() {
      putThemeStyle({
        style: this.$store.state.color
      }).then(res => {
        if (res.code == 0) {
          this.$message({
            showClose: true,
            duration: 1000,
            type: 'success',
            message: '主题更改成功'
          })
          this.themeStyle()
          this.getColor()
        }
      })
    },
    // 预览主题
    lookTheme(type) {
      const list = ['DEFAULT', 'TECHNOLOGY']
      if (type >= 0 && type <= 1) {
        this.$store.state.color = list[type]
        this.page = this.$store.state.color
      } else {
        return
      }
    },
    // 取消或者退出
    detcolor() {
      this.$store.state.color = this.oldColor
    },
    // 获取到原先的主题
    getColor() {
      this.oldColor = this.$store.state.color
    }
  }
})
</script>
<style lang="less" scoped>
.pageBackground{
border: 1px solid rgb(172, 106, 32);
padding:20px;
  box-shadow: 5px 5px 10px 10px rgba(190,200,220,0.5)
}
.pageColor{
color:#4283d8;
}
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
  .currentbotton {
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
.currentbotton .el-button--small {
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
