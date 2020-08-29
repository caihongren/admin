<template>
  <div class="configure">
    <div class="information">
      <el-form ref="form" :model="form" label-width="70px">
        <el-form-item label="上传目录" style="margin-bottom:40px">
          <el-input v-model="form.fileRootDirectory" :disabled="true" />
          <el-button
            type="warning"
            size="small"
            icon="el-icon-edit"
            @click="changeflieroot = true"
            >修改上传目录</el-button
          >
        </el-form-item>
        <el-form-item label="重连次数" style="margin-bottom:40px">
          <el-input v-model="form.retry" :disabled="true" type="number" />
          <el-button
            type="warning"
            size="small"
            icon="el-icon-edit"
            @click="changeretry = true"
            >修改重连次数</el-button
          >
        </el-form-item>
        <el-form-item label="间隔时间" style="margin-bottom:40px">
          <el-input
            v-model="form.wait"
            :disabled="true"
            v-enter-number
            type="number"
          />
          <el-button
            type="warning"
            size="small"
            icon="el-icon-edit"
            @click="changewait = true"
            >修改间隔时间</el-button
          >
        </el-form-item>
        <el-form-item label="单次新增" style="margin-bottom:40px">
          <el-input
            v-model="form.insert"
            :disabled="true"
            v-enter-number
            type="number"
          />
          
          <el-button
            type="warning"
            size="small"
            icon="el-icon-edit"
            @click="changeinsert = true"
            >修改单次新增</el-button
          >
          <p style="color: #ebb563;">请输入单次新增数字为10到100</p>
        </el-form-item>
        <el-form-item label="单次读取" style="margin-bottom:40px">
          <el-input
            v-model="form.read"
            :disabled="true"
            v-enter-number
            type="number"
          />
          <el-button
            type="warning"
            size="small"
            icon="el-icon-edit"
            @click="changeread = true"
            >修改单次读取</el-button
          >
           <p style="color: #ebb563;">请输入单次读取数字为10000到20000</p>
        </el-form-item>
      </el-form>
    </div>
    <!-- 修改上传目录 -->
    <el-dialog
      :visible.sync="changeflieroot"
      append-to-body
      width="25%"
      top="15vh"
      title="修改上传目录"
      class="modify"
      :close-on-click-modal="false"
    >
      <el-input
        v-model="textfileRootDirectory"
        placeholder="请输入上传目录地址"
        clearable
      />
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="changeflieroot = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="flieroot()"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 次数 -->
    <el-dialog
      :visible.sync="changeretry"
      append-to-body
      width="25%"
      top="15vh"
      title="修改重连次数"
      class="modify"
      :close-on-click-modal="false"
    >
      <el-form ref="modifyform" :model="modifyform" label-width="70px">
        <el-form-item
          label="次数"
          prop="textretry"
          :rules="[{ type: 'number', message: '年龄必须为数字值' }]"
        >
          <el-input
            v-model.number="modifyform.textretry"
            placeholder="请输入重连次数"
            clearable
            type="textretry"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="changeretry = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="retry('modifyform')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 间隔时间 -->
    <el-dialog
      :visible.sync="changewait"
      append-to-body
      width="25%"
      top="15vh"
      title="修改间隔时间"
      class="modify"
      :close-on-click-modal="false"
    >
      <el-form ref="modifyform" :model="modifyform" label-width="70px">
        <el-form-item
          label="间隔时间"
          prop="textwait"
          :rules="[{ type: 'number', message: '年龄必须为数字值' }]"
        >
          <el-input
            v-model.number="modifyform.textwait"
            placeholder="请输入间隔时间"
            clearable
            type="textwait"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="changewait = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="wait('modifyform')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 单次新增 -->
    <el-dialog
      :visible.sync="changeinsert"
      append-to-body
      width="25%"
      top="15vh"
      title="修改单次新增"
      class="modify"
      :close-on-click-modal="false"
    >
      <el-form ref="modifyform" :model="modifyform" label-width="70px">
        <el-form-item
          label="单次新增"
          prop="textinsert"
          :rules="[ { type: 'number', message: '年龄必须为数字值' }]" >
          <el-input
            v-model.number="modifyform.textinsert"
            placeholder="请输入单次新增"
            clearable
            type="textwait"
          />
          
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="changeinsert = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="insert('modifyform')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 单次读取 -->
    <el-dialog
      :visible.sync="changeread"
      append-to-body
      width="25%"
      top="15vh"
      title="修改单次读取"
      class="modify"
      :close-on-click-modal="false"
    >
      <el-form ref="modifyform" :model="modifyform" label-width="70px">
        <el-form-item
          label="单次读取"
          prop="textread"
          :rules="[{ type: 'number', message: '年龄必须为数字值' }]"
        >
          <el-input
            v-model.number="modifyform.textread"
            placeholder="请输入间隔时间"
            clearable
            type="textwait"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="changeread = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="read('modifyform')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Vue from "vue";
import { configList, putConfig } from "@/api/user.js";
export default Vue.extend({
  components: {},

  data() {
    return {
      changeflieroot: false, // 更改姓名弹出框

      changeretry: false,
      changewait: false,
      changeinsert: false,
      changeread: false,
      form: {
        // 编辑表单
        fileRootDirectory: "",
        retry: "",
        wait: "",
        insert: "",
        read: ""
      },
      modifyform: {
        textretry: "",
        textwait: "",
        textinsert: "",
        textread: ""
      },
      textfileRootDirectory: ""
    };
  },
  created() {
    this.personalInformation(); // 获取个人信息
  },
  mounted() {},
  methods: {
    // 获取个人信息
    personalInformation() {
      configList().then(res => {
        if (res.code == 0) {
          console.log(res, "4444");
          const from = {
            fileRootDirectory: res.data.fileRootDirectory,
            retry: res.data.retry,
            wait: res.data.wait,
            insert: res.data.insert,
            read: res.data.read
          };
          this.form = from;
        }
      });
    },
    // 更改上传目录
    flieroot() {
      putConfig({
        configName: "FILEROOTDIRECTORY",
        configValue: this.textfileRootDirectory
      }).then(res => {
        if (res.code == 0) {
          this.changeflieroot = true;
          this.$message({
            showClose: true,
            duration: 1000,
            type: "success",
            message: "更改上传目录成功!"
          });
          this.changeflieroot = false;
          this.personalInformation();
        } else {
          this.$message.error({
            showClose: true,
            duration: 1000,
            message: res.msg,
            type: "warning"
          });
        }
      });
    },
    // 更改重连次数
    retry(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          putConfig({
            configName: "RETRY",
            configValue: this.modifyform.textretry
          }).then(res => {
            if (res.code == 0) {
              console.log(res, "77777");
              this.changeretry = true;
              this.$message({
                showClose: true,
                duration: 1000,
                type: "success",
                message: "更改重连次数成功!"
              });
              this.changeretry = false;
              this.personalInformation();
            } else {
              this.$message.error({
                showClose: true,
                duration: 1000,
                message: res.msg,
                type: "warning"
              });
            }
          });
        }
      });
    },
    // 更改间隔时间
    wait(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          putConfig({
            configName: "WAIT",
            configValue: this.modifyform.textwait
          }).then(res => {
            if (res.code == 0) {
              this.changewait = true;
              this.$message({
                showClose: true,
                duration: 1000,
                type: "success",
                message: "更改间隔时间成功!"
              });
              this.changewait = false;
              this.personalInformation();
            } else {
              this.$message.error({
                showClose: true,
                duration: 1000,
                message: res.msg,
                type: "warning"
              });
            }
          });
        }
      });
    },
    // 更改单次新增
    insert(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (
            this.modifyform.textinsert < 10 ||
            this.modifyform.textinsert > 100
          ) {
            this.$message({
              showClose: true,
              duration: 1000,
              message: "请输入正确的单次新增数字10-100",
              type: "error"
            });
            return;
          } else {
            putConfig({
              configName: "INSERT",
              configValue: this.modifyform.textinsert
            }).then(res => {
              if (res.code == 0) {
                this.changeinsert = true;
                this.$message({
                  showClose: true,
                  duration: 1000,
                  type: "success",
                  message: "更改单次新增成功!"
                });
                this.changeinsert = false;
                this.personalInformation();
              } else {
                this.$message.error({
                  showClose: true,
                  duration: 1000,
                  message: res.msg,
                  type: "warning"
                });
              }
            });
          }
        }
      });
    },
    // 更改单次读取
    read(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (
            this.modifyform.textread < 10000 ||
            this.modifyform.textread > 20000
          ) {
            this.$message({
              showClose: true,
              duration: 1000,
              message: "请输入正确的单次读取数字10000-20000",
              type: "error"
            });
            return;
          } else {
            putConfig({
              configName: "READ",
              configValue: this.modifyform.textread
            }).then(res => {
              if (res.code == 0) {
                this.changeread = true;
                this.$message({
                  showClose: true,
                  duration: 1000,
                  type: "success",
                  message: "更改单次读取成功!"
                });
                this.changeread = false;
                this.personalInformation();
              } else {
                this.$message.error({
                  showClose: true,
                  duration: 1000,
                  message: res.msg,
                  type: "warning"
                });
              }
            });
          }
        }
      });
    }
  }
});
</script>
<style lang="less" scoped>
.configure {
  width: 98%;
  margin: 2% auto;
  background-color: #fff;
  height: 850px;
  padding-top: 5%;
  .information {
    width: 70%;
    background-color: #fff;
    margin: 0px auto;
    padding: 50px;

    box-shadow: darkgrey 5px 5px 30px 2px;
  }
  .history {
    width: 70%;
    background-color: #fff;
    margin: 5% auto;
    padding: 50px;
    box-shadow: darkgrey 5px 5px 30px 2px;
  }
}
</style>
<style>
.configure .el-tabs__nav-wrap::after {
  height: 0px;
}
.configure .el-tabs__item.is-active {
  color: #4283d8;
  /* background-color: #cdd9f1; */
}
.configure .el-tabs__header {
  margin: 0 auto;
  width: 70%;
}
.configure .el-tabs__item {
  height: 60px;
  font-size: 16px;
  line-height: 60px;
}
.configure .el-tabs__active-bar {
  background-color: #4283d8;
}

.configure .el-form-item__label {
  line-height: 40px;
}
.configure .el-form-item__content {
  line-height: 0px;
}
.configure .el-tabs__item:hover {
  color: #4283d8;
}
.configure .el-input__inner {
  height: 33px;
  line-height: 33px;
}
.configure .el-table__header tr,
.el-table__header th {
  padding: 0;
  height: 40px;
}
.configure .el-table__body tr,
.el-table__body td {
  padding: 0;
  height: 40px;
}
.configure .el-table th > .cell {
  height: 50px;
  line-height: 50px;
}
.configure .el-input {
  width: 75%;
}
</style>
