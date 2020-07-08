<template>
  <div class="addtaskall">
    <div style="background:#fff;margin:20px auto;width:98%;padding-top:2px;">
      <el-row>
        <el-col :span="23"> <p style="padding-left:30px;font-size: 22px;">新建任务</p></el-col>
        <el-col :span="1">  <p style="cursor: pointer;" @click="$emit('detpage')">返回</p>
        </el-col>
      </el-row>
      <!-- 新建筛选 -->
      <div style="display: flex; justify-content: left; width: 100%;">
        <el-form ref="newBuild" :inline="true" :model="newBuild" :rules="rulesTou" style="padding-left:6%;width:82%" class="screen">
          <el-form-item label="任务名称" prop="name">
            <el-input v-model="newBuild.name" placeholder="请输入任务名称" />
          </el-form-item>
          <el-form-item label="任务类型" prop="taskType" style="margin:0 35px;">
            <el-select v-model="newBuild.taskType" placeholder="请选择类型" @change="taskTypeDataSource(newBuild.taskType)">
              <el-option label="实时导入任务" value="TIME" />
              <el-option label="存量导入任务" value="STOCK" />
            </el-select>
          </el-form-item>
          <el-form-item label="执行线程数" prop="taskNumber">
            <el-select v-model="newBuild.taskNumber" placeholder="请选择执行线程数">
              <el-option v-for="(item,index) in executive" :key="index" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
        <div>
          <el-button type="primary" class="determine" round size="mini" @click="startNow('operation')">立即开始</el-button>
          <el-button type="warning" class="lianjieBtn" round size="mini" @click="startLater('operation')">稍后开始</el-button>
        </div>
      </div>
    </div>
    <div class="addtask">
      <!-- 数据源  企业节点操作 -->
      <el-form ref="operation" :model="operation" :rules="rules3">
        <el-row>
          <el-col :span="17" class="tttt">
            <p>数据源配置</p>
            <el-form-item label="数据源" prop="dataSource">
              <el-select v-model="operation.dataSource" placeholder="请选择数据源" @change="addFileInput(operation.dataSource)">
                <el-option v-for="(item,index) in sourcelist" :key="index" :label="item.label" style="padding:0px" :value="item.value">

                  <el-popover placement="right" width="200" trigger="hover">
                    <el-button slot="reference" style="width:100%;border:0px;text-align: left;">{{ item.label }}</el-button>
                    <slot name="header">
                      <p> 数据源类型:　{{ item.dataSource.type }}</p>
                      <p v-show="item.type=='数据库'"> 数据库类型:　{{ item.dataSource.databaseType }}</p>
                      <p v-show="item.type=='数据库'"> 数据库名称:　{{ item.dataSource.databaseName }}</p>
                      <p v-show="item.type=='数据库'"> 连接地址:　{{ item.dataSource.databaseUrl }}</p>
                      <p v-show="item.type=='数据库'"> 端口号:　{{ item.dataSource.databasePort }}</p>
                    </slot>
                  </el-popover>
                </el-option>
              </el-select>
              <el-button size="mini" class="bottomColor" type="primary" @click="addDatasource">添加</el-button>
            </el-form-item>
            <el-form-item label="数据表" prop="dataSourceList">
              <el-select v-model="operation.dataSourceList" placeholder="请选择表" @change="addlist(operation.dataSourceList)">
                <el-option v-for="(item,index) in surfacelist" :key="index" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="标　识" prop="setDentity">
              <span v-model="operation.setDentity" style="border:1px solid #dcdfe6;;width:25%;padding-left:10px;display:inline-block;border-radius: 3px;">{{ operation.inputPrefix }}　／　{{ operation.setDentity }}</span>
            </el-form-item>
            <el-form-item v-if="this.newBuild.taskType=='TIME'" label="时间点" style="margin-left: 10px;">

              <el-input v-model="operation.updateAt" style="width:25%" />

            </el-form-item>
            <el-form-item v-if="this.newBuild.taskType=='TIME'" label="时间戳" prop="updateBasis">
              <!-- <span v-model="operation.setDentity" style="border:1px solid #dcdfe6;;width:25%;padding-left:10px;display:inline-block;border-radius: 3px;">{{ operation.updateBasis }}</span> -->
              <el-input v-model="operation.updateBasis" style="width:25%;height: 40px;" :disabled="true" />

            </el-form-item>
          </el-col>
          <el-col :span="7" class="tttwwt">
            <p>企业节点</p>
            <el-form-item label="企业节点" prop="node">
              <el-select v-model="operation.node" placeholder="请选择企业节点" @change="dataNodechange(operation.node)">
                <el-option v-for="(item,index) in nodelist" :key="index" style="padding:0px" :label="item.label" :value="item.value">
                  <el-popover placement="right" width="250" trigger="hover">
                    <el-button slot="reference" style="width:100%;border:0px;text-align: left;">{{ item.label }}</el-button>
                    <slot>
                      <p> 模式:　{{ item.addForm.type }}</p>
                      <p> 接口访问类型:　{{ item.addForm.type == '自建模式' ? item.addForm.interType :item.addForm.type == '托管模式' ? item.addForm.accessType : '' }}</p>
                      <div v-if=" item.addForm.type == '自建模式'">
                        <p>标识代理服务地址:　{{ item.addForm.oneselfAgentUrl }}</p>
                        <p v-if="item.addForm.oneselfAgentUsername">标识代理服务用户名:　{{ item.addForm.oneselfAgentUsername }}</p>
                        <p>标识基础服务地址:　{{ item.addForm.oneselfBasicsUrl }}</p>
                        <p v-if="item.addForm.oneselfBasicsUsername">标识基础服务用户名:　{{ item.addForm.oneselfBasicsUsername }}</p>
                      </div>
                      <div v-if="item.addForm.type == '托管模式'">
                        <p>snms系统地址:　{{ item.addForm.trusteeshipSnmsUrl }}</p>
                        <p v-if="item.addForm.trusteeshipSnmsUsername">snms系统用户名 :　{{ item.addForm.trusteeshipSnmsUsername }}</p>
                        <p>标识代理服务地址:　{{ item.addForm.trusteeshipAgentUrl }}</p>
                        <p v-if="item.addForm.trusteeshipAgentUsername">标识代理服务用户名:　{{ item.addForm.trusteeshipAgentUsername }}</p>

                      </div>
                    </slot>
                  </el-popover>
                </el-option>
              </el-select>
              <el-button size="mini" class="bottomColor" type="primary" @click="addEnterprise">添加</el-button>
            </el-form-item>
            <el-form-item v-show="this.newBuild.taskType=='STOCK'" label="操作类型" prop="operationType">
              <el-select v-model="operation.operationType" placeholder="请选择操作类型" @change="operationType">
                <el-option label="添加" value="ADD" />
                <el-option label="删除" value="DELETE" />
              </el-select>
            </el-form-item>
            <el-form-item v-show="aaa" v-if="addType" label="数据模板" prop="dataTemplate" style="padding-left: 10px;">
              <el-select v-model="operation.dataTemplate" placeholder="请选择数据模板" style="width:61%;" @change="dataTemplateChange(operation.dataTemplate)">
                <el-option v-for="(item,index) in templatelist" :key="index" :label="item.label" :value="item" />
              </el-select>
              <el-button size="mini" class="bottomColor" type="primary" @click="addTemplate=true">添加</el-button>
            </el-form-item>
            <el-form-item v-show="bbb" v-if="addType" label="数据模板" prop="templateLnput" style="padding-left:10px;">
              <el-input v-model="operation.templateLnput" style="width:61%;" />
            </el-form-item>
            <el-form-item label="前　　缀" prop="inputPrefix">

              <el-input v-model="operation.inputPrefix" style="width:60%" />
              <el-button type="primary" size="mini" class="bottomColor" style="margin-left:8px;" icon="el-icon-refresh" @click="Refresh" />
            </el-form-item>

          </el-col>
        </el-row>
        <!-- 左边列表 -->
        <el-row>
          <el-col :span="7">
            <div style="display: flex; justify-content: left; width: 100%;">
              <p style="font-size: 14px;color: #606266;font-weight: 700;padding-left: 10px;">数据项　</p>

              <el-card class="boxCard">
                <div v-for="(item,index) in leftCardData" :key="index" :class="{active: selectActiveName == item}">
                  <el-row>
                    <el-col :span="16">
                      <div class="rightLists" @click="clickSelect(item)">{{ item }}</div>
                    </el-col>
                    <!-- 标识 -->
                    <el-col :span="4">
                      <div class="stars">
                        <div v-if="operation.setDentity == item">
                          <svg t="1590630869162" class="icon" viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6251" width="16" height="16">
                            <path d="M778.479 1002.496c-12.288 0-24.576-3.071-37.888-10.239L533.742 883.713c-5.12-3.072-12.288-5.12-20.479-5.12-7.168 0-15.36 2.048-20.48 4.096L286.959 992.257c-12.288 7.168-24.576 10.239-38.912 10.239-24.576 0-48.128-11.264-64.513-29.695-16.384-18.433-22.527-43.008-18.432-67.584l39.937-229.376c2.048-14.336-3.072-28.672-13.313-38.912L25.839 476.16C2.287 453.633-5.905 420.864 4.335 390.144c10.239-30.721 35.84-52.225 67.584-57.345l229.376-33.792c14.336-2.048 27.647-11.264 33.791-23.552l102.4-208.896c14.336-28.672 43.008-46.08 74.752-46.08s60.416 17.408 74.752 46.08l102.4 208.896c7.168 13.313 19.456 21.504 33.792 23.552L952.559 332.8c31.744 5.12 57.344 26.624 67.584 56.32 10.24 30.72 2.048 63.488-20.48 86.017L834.799 636.928c-11.265 10.24-15.36 24.576-13.313 38.912l38.912 228.352c4.096 24.576-2.048 49.152-18.432 67.584C826.607 991.232 803.055 1002.496 778.479 1002.496z" p-id="6252" fill="#d81e06" />
                          </svg>
                        </div>
                        <div v-if="operation.setDentity != item" title="设置为标识列" @click="operation.setDentity = item">
                          <svg t="1590550499072" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2109" width="16" height="16">
                            <path d="M733.653 918.642c-12.368 0-25.232-2.968-36.116-8.905l-184.043-96.474-183.548 96.969c-11.379 5.937-23.747 8.905-36.611 8.905-15.337 0-30.674-4.453-43.042-12.863-23.747-16.326-36.116-44.032-31.169-71.737l35.621-209.274L99.894 473.872c-20.284-19.79-27.211-47.99-17.811-74.211 9.4-26.221 32.158-44.526 60.358-48.484L353.2 320.503l91.527-186.022C457.095 109.25 484.305 92.924 513 92.924c29.19 0 55.905 16.326 68.274 41.558L672.8 320.503l210.758 30.674c28.2 3.958 51.453 22.758 60.358 48.484 9.4 26.221 2.474 54.916-17.811 74.705L771.253 625.262l35.621 209.274c4.947 27.705-7.421 55.411-31.169 71.737-11.873 7.916-26.715 12.369-42.052 12.369zM513.495 743.504c8.905 0 17.316 1.979 25.232 5.937l190.969 100.432c0.989 0.495 2.474 0.99 3.958 0.99 1.979 0 3.463-0.495 4.947-1.484s2.474-2.968 2.474-4.453l-37.105-217.19c-2.968-16.821 2.969-34.137 14.842-46.011l160.295-156.337c0.989-0.989 1.979-2.474 1.484-4.453-0.495-1.484-2.968-3.463-5.937-3.958L655.98 385.314c-17.316-2.474-32.653-13.358-40.074-29.19l-94.99-192.948c-0.989-1.979-3.958-3.463-6.926-3.463s-5.937 1.484-6.926 3.958l-94.99 192.948c-7.916 15.832-22.758 26.221-40.074 29.19l-219.664 31.663c-2.968 0.495-5.442 2.474-5.937 3.958-0.495 1.484 0 2.968 1.484 4.453l160.295 156.832c12.368 11.874 17.811 29.19 14.842 46.011l-37.105 216.695c-0.495 1.484 0.495 3.463 2.474 4.947 1.484 0.989 2.968 1.484 4.947 1.484 1.484 0 2.968-0.495 4.453-0.989l190.474-100.432c7.916-4.453 16.326-6.927 25.232-6.927z" p-id="2110" data-spm-anchor-id="a313x.7781069.0.i0" class="" fill="#d25d18" />
                          </svg>
                        </div>
                      </div>
                    </el-col>
                    <!-- 黄色对勾 -->
                    <el-col :span="4">
                      <div class="stars">
                        <div v-if="operation.updateBasis == item">
                          <svg t="1593513002609" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9938" data-spm-anchor-id="a313x.7781069.0.i28" width="16" height="16"><path d="M146.211994 844.07324l366.562069-631.635813 363.63783 633.355954z" fill="#d81e06" p-id="9939" data-spm-anchor-id="a313x.7781069.0.i24" class="" /><path d="M512.602049 246.840249l333.879389 581.579707-670.683017-1.548127L512.602049 246.840249m0.172014-68.805645L116.281539 861.102637l789.888795 1.892156-393.396271-684.960189z" fill="#d81e06" p-id="9940" data-spm-anchor-id="a313x.7781069.0.i25" class="" /></svg>
                        </div>
                        <div v-if="operation.updateBasis != item" title="设置时间戳" @click="operation.updateBasis = item">
                          <svg t="1593513002609" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9938" data-spm-anchor-id="a313x.7781069.0.i28" width="16" height="16"><path d="M146.211994 844.07324l366.562069-631.635813 363.63783 633.355954z" fill="#ffffff" p-id="9939" data-spm-anchor-id="a313x.7781069.0.i24" class="selected" /><path d="M512.602049 246.840249l333.879389 581.579707-670.683017-1.548127L512.602049 246.840249m0.172014-68.805645L116.281539 861.102637l789.888795 1.892156-393.396271-684.960189z" fill="#d25d18" p-id="9940" data-spm-anchor-id="a313x.7781069.0.i25" class="" /></svg>
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </el-card>
            </div>

          </el-col>
          <!-- 中间对应 -->

          <el-col :span="10">
            <div class="corresponding">
              <!-- <el-button size="small" style="margin-bottom: 3%;"  @click="Connection">添加</el-button> -->
              <div v-for="(domain,index) in middle" v-show="addType" :key="index" style="text-align: center;padding-top: 0px;">
                <el-input v-model="domain.activeName" style="width: 40%;" :disabled="true" />--
                <el-input v-model="domain.value" style="width: 40%;" :disabled="true" />
                <!-- <el-button size="small" round @click.prevent="removeDomain(domain.id)">删除</el-button> -->
              </div>
            </div>
          </el-col>

          <!-- 右边列表 -->
          <el-col :span="7">
            <div style="display: flex; justify-content: left; width: 100%;">
              <p style="font-size: 14px;color: #606266;font-weight: 700;padding-left: 10px;">数据类型　</p>

              <el-card class="boxCard">
                <div v-for="(items,index) in rightCardData" v-show="addType" :key="index" style="cursor: pointer;" @click="value = items">
                  <!-- <span>s</span> -->
                  <div class="leftLists">
                    <i v-if="items.requiredlist" style="color:red;">*</i>　{{ items.name }}
                    <div style="float:right;padding-right: 20px;">
                      <!-- <span v-if="items.selectedState"> -->
                      <el-checkbox v-model="items.selectedState" :disabled="activeNameIsValue" @change="checked=>rightEelected(items.name, checked)" />
                      <!-- <svg t="1590566150435" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4834" width="16" height="16">
                        <path d="M997.888 70.144C686.592 261.12 460.8 502.272 358.912 623.104L110.08 428.032 0 516.608l429.568 437.248C503.296 764.416 737.792 394.24 1024 131.072l-26.112-60.928m0 0z" p-id="4835" data-spm-anchor-id="a313x.7781069.0.i31" fill="#4283d8" class="selected" />
                      </svg> -->
                      <!-- </span> -->
                    </div>
                  </div>
                </div>
              </el-card>

            </div>
          </el-col>
        </el-row>
        <div style="margin-top:2%;">
          <p style="color: rgb(96, 98, 102);font-weight: 700; font-size: 14px; padding-right: 10px;display: inline-block;">数据列表</p>
          <el-button type="primary" size="mini" class="bottomColor" @click="open">{{ tablelists?'隐藏':'查看' }}</el-button>
        </div>
        <el-table v-if="tablelists" :data="tableDatas" :cell-style="rowClass" stripe :header-cell-style="headClass" style="margin:20px  0;">
          <el-table-column v-for="(item, index) in leftCardData" :key="index" :prop="item" min-width="60" :label="item" />
        </el-table>

      </el-form>
      <!-- 添加数据源弹窗 -->
      <el-dialog width="35%" :visible.sync="addisanswer" append-to-body title="添加数据源" :close-on-click-modal="false">
        <el-form ref="addData" :model="addData" label-width="100px" class="dialog">
          <el-form-item label="名　称">
            <el-input v-model="addData.name" placeholder="请输入数据源名称" />
          </el-form-item>
          <el-form-item label="描　述">
            <el-input v-model="addData.introduction" placeholder="请输入描述" />
          </el-form-item>
          <el-form-item label="源类型">
            <el-select v-model="addData.type" placeholder="请选择类型" style="width: 100%;" @change="updateAdddisplay">
              <el-option label="数据库" value="database" />
              <el-option label="文件" value="file" />
            </el-select>
          </el-form-item>

          <el-form-item v-show="addDataShow" label="库类型">
            <el-select v-model="addData.databaseType" placeholder="请选择类型" style="width: 100%;">
              <el-option label="mysql" value="mysql" />
              <el-option label="oracle" value="oracle" />
              <el-option label="postgresql" value="postgresql" />
              <el-option label="sqlserver" value="sqlserver" />
            </el-select>
          </el-form-item>
          <el-form-item v-show="addDataShow" label="库名称">
            <el-input v-model="addData.databaseName" placeholder="请输入数据库名称" />
          </el-form-item>
          <el-form-item v-show="addDataShow" label="地　址">
            <el-input v-model="addData.databaseUrl" placeholder="请输入连接地址" />
          </el-form-item>
          <el-form-item v-show="addDataShow" label="端口号">
            <el-input v-model="addData.databasePort" placeholder="请输入端口号" />
          </el-form-item>
          <el-form-item v-show="addDataShow" label="用户名">
            <el-input v-model="addData.databaseUsername" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item v-show="addDataShow" label="密　码">
            <el-input v-model="addData.databasePassword" placeholder="请输入密码" />
          </el-form-item>
          <el-form-item v-show="addFileShow">
            <el-table
              class="tableColor"
              :cell-style="rowClass"
              stripe
              :header-cell-style="headClass"
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
          <el-form-item style="margin-left: -80px;">

            <el-row :gutter="20">
              <el-col v-show="addFileShow" :span="10" style="padding-left: 30px;">
                <div class="file-upload">
                  上传文件夹
                   <input ref="file"  class="file-upload-input"  type="file" name="file" webkitdirectory  @change.stop="changesData" />
                </div>
              </el-col>
              <el-col v-show="addDataShow" :span="20">
                <el-button type="warning" size="mini" class="lianjieBtn" round :loading="link" @click="connectionTest">连接测试</el-button>
              </el-col>
              <el-col v-show="addFileShow" :span="10" style="padding-left: 30px;">
                <el-upload class="upload-demo" action="#" enctype="multipart/form-data" :before-upload="( file )=>{return uploading( file)}" style="display: inline-block">
                  <el-button type="primary" size="mini" round style="border: 1px solid #4283d8;background:#4283d8;">上传文件</el-button>
                </el-upload>
              </el-col>
              <el-col :span="4">
                <el-button type="primary" round size="mini" class="determine" @click="adddatabase">确定</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 添加企业节点弹窗 -->
      <el-dialog width="40%" top="2vh" :visible.sync="addNode" append-to-body title="添加企业节点" :close-on-click-modal="false">
        <el-form ref="addForm" :model="addForm" label-width="100px" class="dialog">
          <el-form-item label="名　称">
            <el-input v-model="addForm.name" placeholder="请输入数据源名称" />
          </el-form-item>
          <el-form-item label="描　述">
            <el-input v-model="addData.introduction" placeholder="请输入描述" />
          </el-form-item>
          <el-form-item label="模　式">
            <el-select v-model="addForm.type" placeholder="请选择类型" style="width: 100%;" @change="update">
              <el-option label="自建" value="BUILT" />
              <el-option label="托管" value="ESCROW" />
            </el-select>
          </el-form-item>
          <el-form-item v-show="selfBuilt" label="访问类型">
            <el-select v-model="addForm.interType" placeholder="请选择类型" style="width: 100%;">
              <el-option label="标识代理服务" value="LAS" />
            </el-select>
          </el-form-item>
          <el-form-item v-show="managed" label="访问类型">
            <el-select v-model="addForm.accessType" placeholder="请选择类型" style="width: 100%;">
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
                <el-button type="warning" class="lianjieBtn" size="mini" round :loading="link">连接测试</el-button>
              </el-col>
              <el-col :span="4">
                <el-button type="primary" round size="mini" class="determine" @click="database">确定</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 添加数据模板弹窗 -->
      <el-dialog width="70%" top="8vh" style="height:800px" :visible.sync="addTemplate" append-to-body title="添加数据模板" :close-on-click-modal="false">
        <div style="min-height:600px;position: relative;">
          <el-form ref="ruleForm" :model="ruleForm" :rules="rules" class="demo-ruleForm" size="mini" label-width="80px">
            <el-form-item label="节点" style="font-size:12px" prop="dataNode">
              <el-select v-model="ruleForm.dataNode" placeholder="请选择企业节点" style="width: 25%">
                <el-option v-for="(item,index) in nodelist" :key="index" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="前缀" prop="prefix">
              <el-input v-model="ruleForm.prefix" style="width: 25%;" />
            </el-form-item>
            <el-form-item label="名称" prop="product">
              <el-input v-model="ruleForm.product " style="width: 25%;" />
            </el-form-item>
            <el-form-item label="简介">
              <el-input v-model="ruleForm.introduction" style="width: 25%;" />
            </el-form-item>
            <el-form-item style="margin-left: -40px;">
              <el-button type="text" @click="establish=true">添加一行</el-button>
            </el-form-item>
            <el-table :data="DataTemplateForm" border :cell-style="rowClass" :header-cell-style="headClass" :default-sort="{prop: 'name', order: 'descending'}" style="color:#43454a;width: 94%; margin: 0 auto;">
              <el-table-column prop="creatorName" label="中文名称" min-width="100" />
              <el-table-column prop="name" label="英文名称" min-width="100" />
              <el-table-column prop="created" label="数据类型" min-width="100" />
              <el-table-column prop="type" label="最小长度" min-width="100" />
              <el-table-column prop="databaseType" label="最大长度" min-width="100" />
              <el-table-column prop="databaseType" label="必须填" min-width="100" />
              <el-table-column label="操作" width="120">
                <template slot-scope="scope">
                  <el-button type="text" class="tableButton" @click="modify(scope.row.id)">修改</el-button>
                  <el-button type="text" style="color: #d05e5e;" @click="det(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-form-item style="position: absolute;bottom: 0px; right: 5%;">
              <el-button @click="addTemplate=false">取消</el-button>
              <el-button class="bottomColor" type="primary" @click="resetForm('ruleForm')">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>

      <!-- 创建一行弹出框 -->
      <el-dialog width="35%" top="15vh" :visible.sync="establish" append-to-body title="创建一行" :close-on-click-modal="false">
        <el-form ref="createData" :model="createData" :rules="rules2" label-width="80px" class="demo-ruleForm" size="mini">
          <el-form-item label="中文名称" prop="chinese">
            <el-input v-model="createData.chinese" placeholder="请输入中文名称" />
          </el-form-item>
          <el-form-item label="英文名称" prop="english">
            <el-input v-model="createData.english" placeholder="请输入英文名称" />
          </el-form-item>
          <el-form-item label="数据类型">
            <el-select v-model="createData.dataType" placeholder="请选择类型">
              <el-option label="字符串" value="mysql" />
            </el-select>
          </el-form-item>
          <el-form-item label="最小长度" prop="MinLength">
            <el-input v-model="createData.MinLength" placeholder="请输入最小长度" />
          </el-form-item>
          <el-form-item label="最大长度" prop="MaxLength">
            <el-input v-model="createData.MaxLength" placeholder="请输入最大长度" />
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="checked">必填项</el-checkbox>
          </el-form-item>
          <el-form-item style="float: right;">
            <el-button type="primary" @click="establish=false">取消</el-button>
            <el-button type="primary" @click="resetForm('ruleForm')">保存</el-button>
          </el-form-item>
        </el-form>

      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  task, // 添加任务
  tableData, // 获取表结构及数据
  selectList, // 获取数据源列表
  Size,
  dataSourceFile,
  nodeSelectList, // 获取企业节点列表
  tableList, // 获取表
  connectionTest, // 连接测试
  postEnterpriseNode, // 添加企业节点
  getDatabase, // 查看数据库数据源
  getList, // 获取模板数据列表
  info,
  snms, // 刷新
  //   putDatabase, // 修改数据库数据源
  //   deleteDatabase, // 删除数据库数据源
  database, // 添加数据库数据源
  getEnterpriseNode
} from '@/api/user.js'
export default {
  data() {
    return {
      dataSourcetable: [],
      activeNameIsValue: true,
      checked: true,
      // 新建选择
      newBuild: {
        name: '', // 任务名称
        taskType: '', // 任务类型
        taskNumber: ''// 任务线程数
      },
      executive: [
        {
          value: 1,
          label: '1'
        }, {
          value: 2,
          label: '2'
        }, {
          value: 3,
          label: '3'
        }

      ], // 任务线程数数据
      // 操作数据源,企业节点
      operation: {
        dataSource: '', // 数据源
        dataSourceList: '', // 更具数据源获取表
        setDentity: '', // 已设置标识列
        node: '', // 企业节点
        dataTemplate: '', // 数据模板
        templateLnput: '', // 模板输入框

        inputPrefix: '', // 前缀
        operationType: 'ADD', // 操作类型
        updateBasis: '', // 时间戳
        updateAt: ''// 时间点
      },
      sourcelist: [], // 数据源列表
      surfacelist: [], // 表列表
      id3333333: '', // 下拉选择当前一个表数据id

      nodelist: [], // 企业节点列表
      templatelist: [], // 数据模板列表
      templatelistMap: new Map(),
      leftCardData: [], // 左边卡片列表数据和表格数据
      selectActiveName: '', // 左边连线选中状态
      bottomstop: true, // 连线添加按钮置灰
      //   中间数据对应
      middle: [{
        activeName: '', // 左边对应
        value: ''// 右边对应
      }],
      //   右边卡片数据
      rightCardData: [],
      tableDatas: [], // 表格绑定:data数据
      tablelists: true, // 查看隐藏表格
      addisanswer: false, // 添加数据源弹窗
      // 添加数据源数据绑定
      addData: {
        introduction: '',
        fileList: [],
        name: '',
        type: '',
        creatorId: '',
        databaseType: '',
        databaseName: '',
        databasePassword: '',
        databasePort: '',
        databaseUrl: '',
        databaseUsername: '',
        fileName: '',
        id: ''
      },
      addDataShow: false, // 添加数据源类型是数据库的时候显示部分
      addFileShow: false, // 添加数据源类型是文件的时候显示部分
      addNode: false, // 添加企业节点弹窗
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
        trusteeshipAgentPassword: '' // 托管代理密码
      },
      selfBuilt: false, // 添加企业节点选择自建显示的数据
      managed: false, // 添加企业节点选择托管显示的数据

      addTemplate: false, // 添加数据模板弹窗
      // 添加数据模板数据绑定
      ruleForm: {
        dataNode: '',
        prefix: '',
        product: '',
        introduction: ''

      },
      // 第一个表单验证
      rulesTou: {
        name: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        taskType: [
          { required: true, message: '请选择任务类型', trigger: 'change' }
        ],
        taskNumber: [
          { required: true, message: '请选择执行线程数', trigger: 'change' }
        ]
      },
      // 添加数据模板数据验证
      rules: {
        dataNode: [
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
        product: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]

      },
      rules3: {
        dataSource: [
          { required: true, message: '请选择数据源', trigger: 'change' }
        ],
        dataSourceList: [
          { required: true, message: '请选择数据表', trigger: 'change' }
        ],
        setDentity: [
          { required: true, message: '请选择标识', trigger: 'change' }
        ],
        updateBasis: [
          { required: true, message: '请选择时间戳', trigger: 'change' }
        ],
        node: [
          { required: true, message: '请选择企业节点', trigger: 'change' }
        ],
        operationType: [
          { required: true, message: '请选择操作类型', trigger: 'change' }
        ],
        // dataTemplate: [
        //   { required: this.addType && this.aaa, message: '请选择数据模板', trigger: 'change' }
        // ],
        // templateLnput: [
        //   { required: this.addType && this.bbb, message: '请输入数据模板', trigger: 'blur' }
        // ],
        inputPrefix: [
          { required: true, message: '请输入前缀', trigger: 'blur' },
          {
            pattern: /^8[68]\.[0-9]{3}\.[1-9][0-9]{0,3}$/,
            message: '请输入前两位 88或86  .  000-999 . 1-9999',
            trigger: ['blur', 'change']
          }
        ]
      },
      establish: false, // 创建一行弹出框
      DataTemplateForm: [], // 添加数据模板弹出框表单
      // 添加一行数据绑定
      createData: {
        chinese: '',
        english: '',
        dataType: '',
        MinLength: '',
        MaxLength: ''
      },
      // 添加一行数据验证
      rules2: {
        chinese: [
          { required: true, message: '请输入中文名称', trigger: 'blur' },
          {
            pattern: /^[\u0391-\uFFE5]+$/,
            message: '请输入中文名称',
            trigger: ['blur', 'change']
          }
        ],
        english: [
          { required: true, message: '请输入英文名称', trigger: 'change' },
          {
            pattern: /^[a-zA-Z]+$/,
            message: '请输入英文名称',
            trigger: ['blur', 'change']
          }
        ],
        MinLength: [
          { required: true, message: '请输入最小长度', trigger: 'change' },
          {
            pattern: /^[0-9]$/,
            message: '请输入数字',
            trigger: ['blur', 'change']
          }
        ],
        MaxLength: [
          { required: true, message: '请输入最大长度', trigger: 'change' },
          {
            pattern: /^[0-9]$/,
            message: '请输入数字',
            trigger: ['blur', 'change']
          }
        ]

      },
      link: false, // 连接测试加载
      display: false, // 用户名密码  输入框是否可以输入
      display2: false, // 用户名密码  输入框是否可以输入
      display3: false, // 用户名密码  输入框是否可以输入
      //   查看数据源详情
      dataSource: {
        name: '',
        type: '',
        creatorId: '',
        databaseType: '',
        databaseName: '',
        databasePassword: '',
        databasePort: '',
        databaseUrl: '',
        databaseUsername: ''
      },
      query: {
        putid: '',
        order: '',
        orderBy: '',
        pageNum: 1,
        pageSize: 10,
        version: '',
        enterpriseNodeId: '',
        prefix: ''
      },
      Relation: [],
      aaa: false,
      bbb: false,
      addType: true,
      deleteType: true,
      timeImport: false,
      stockImport: false,
      selectListTimeImport: {
        creatorId: '',
        dataBase: ''
      }

    }
  },
  created() {
    // this.sourcelists() // 获取数据源列表
    this.nodelists()// 获取企业节点列表
  },
  methods: {

    // 新增弹出框，数据类型联动
    operationType() {
      this.addType = (this.operation.operationType == 'ADD')
      this.deleteType = (this.operation.operationType == 'DELETE')
    },
    taskTypeDataSource(type) {
      if (type == 'TIME') {
        this.sourcelists()
      } else if (type == 'STOCK') {
        this.sourcelists()
      }
    },
    Refresh() {
      snms({
        enterpriseNodeId: this.operation.node,
        prefix: this.operation.inputPrefix,
        version: this.operation.templateLnput
      }).then(res => {
        if (res.code == 0) {
          for (var i = 0; i < res.data.items.length; i++) {
            this.rightCardData.push({ name: res.data.items[i].idType, requiredlist: res.data.items[i].required, value: res.data.items[i].id })
          }
        }
      })
    },
    // 立即开始
    startNow(formName) {
      this.$refs['newBuild'].validate(valid => {
        if (valid) {
          this.$refs['operation'].validate(valid => {
            if (valid) {
              if (this.operation.operationType == 'ADD' && ((this.templatelist.length > 0 && this.operation.dataTemplate == '') || (this.templatelist.length == 0 && this.operation.templateLnput == ''))) {
                this.$message({
                  showClose: true,
                  duration: 1000,
                  type: 'error',
                  message: '请选择数据模板'
                })
                return
              }
              if (this.operation.operationType == 'ADD') {
                for (var i = 0; i < this.rightCardData.length; i++) {
                  if (this.rightCardData[i].requiredlist) {
                    var flag = false
                    for (var j = 0; j < this.middle.length; j++) {
                      if (this.rightCardData[i].name == this.middle[j].value) {
                        flag = true
                      }
                    }
                    if (!flag) {
                      this.$message({
                        showClose: true,
                        duration: 1000,
                        type: 'error',
                        message: '请完善对应关系'
                      })
                      return
                    }
                  }
                }
              }

              if (sessionStorage.getItem('user')) {
                const user = JSON.parse(sessionStorage.getItem('user'))
                this.Relation = []
                for (let i = 0; i < this.middle.length; i++) {
                  const relationItem = []
                  relationItem.push(this.middle[i].activeName)
                  relationItem.push(this.middle[i].value)
                  this.Relation.push(relationItem)
                }
                task({
                  creatorId: user.id, // 创建人
                  dataSourceId: this.operation.dataSource, // 数据源
                  dataTemplateId: this.operation.dataTemplate.label, // 数据模板id
                  enterpriseNodeId: this.operation.node, // 企业节点
                  handle: this.operation.setDentity, // 标识列
                  name: this.newBuild.name, // 名称
                  operatingType: this.operation.operationType, // 操作类型 ADD添加 DELETE删除
                  prefix: this.operation.inputPrefix, // 前缀
                  updateBasis: this.operation.updateBasis, // 时间戳
                  updateAt: this.operation.updateAt, // 时间点
                  state: 'RUN', // 状态 新建NEW 进行中RUN
                  table: this.operation.dataSourceList, // 表名
                  taskType: this.newBuild.taskType, // 任务类型，TIME实时 STOCK存量
                  thread: this.newBuild.taskNumber, // 线程数量
                  version: this.operation.templateLnput, // 模板名称
                  relation: this.Relation // 对应关系

                }).then(res => {
                  if (res.code == 0) {
                    this.$message({
                      showClose: true,
                      duration: 1000,
                      type: 'success',
                      message: '添加成功'
                    })
                    this.$emit('detpage')
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
        }
      })
    },
    // 稍后开始

    startLater() {
      this.$refs['newBuild'].validate(valid => {
        if (valid) {
          this.$refs['operation'].validate(valid => {
            if (valid) {
              if (this.operation.operationType == 'ADD' && ((this.templatelist.length > 0 && this.operation.dataTemplate == '') || (this.templatelist.length == 0 && this.operation.templateLnput == ''))) {
                this.$message({
                  showClose: true,
                  duration: 1000,
                  type: 'error',
                  message: '请选择数据模板'
                })
                return
              }
              if (this.operation.operationType == 'ADD') {
                for (var i = 0; i < this.rightCardData.length; i++) {
                  if (this.rightCardData[i].requiredlist) {
                    var flag = false
                    for (var j = 0; j < this.middle.length; j++) {
                      if (this.rightCardData[i].name == this.middle[j].value) {
                        flag = true
                      }
                    }
                    if (!flag) {
                      this.$message({
                        showClose: true,
                        duration: 1000,
                        type: 'error',
                        message: '请完善对应关系'
                      })
                      return
                    }
                  }
                }
              }
              if (sessionStorage.getItem('user')) {
                const user = JSON.parse(sessionStorage.getItem('user'))
                this.Relation = []
                for (let i = 0; i < this.middle.length; i++) {
                  const relationItem = []
                  relationItem.push(this.middle[i].activeName)
                  relationItem.push(this.middle[i].value)
                  this.Relation.push(relationItem)
                }
                task({
                  creatorId: user.id, // 创建人
                  dataSourceId: this.operation.dataSource, // 数据源
                  dataTemplateId: this.operation.dataTemplate.label, // 数据模板id
                  enterpriseNodeId: this.operation.node, // 企业节点
                  handle: this.operation.setDentity, // 标识列
                  name: this.newBuild.name, // 名称
                  operatingType: this.operation.operationType, // 操作类型 ADD添加 DELETE删除
                  prefix: this.operation.inputPrefix, // 前缀
                  updateBasis: this.operation.updateBasis, // 时间戳
                  updateAt: this.operation.updateAt, // 时间点
                  state: 'NEW', // 状态 新建NEW 进行中RUN
                  table: this.operation.dataSourceList, // 表名
                  taskType: this.newBuild.taskType, // 任务类型，TIME实时 STOCK存量
                  thread: this.newBuild.taskNumber, // 线程数量
                  version: this.operation.templateLnput, // 模板名称
                  relation: this.Relation // 对应关系
                }).then(res => {
                  if (res.code == 0) {
                    this.$message({
                      showClose: true,
                      duration: 1000,
                      type: 'success',
                      message: '添加成功'
                    })
                    this.$emit('detpage')
                    // this.addTemplate = false
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
        }
      })
    },
    // 选中企业节点获取模板数据
    dataNodechange(id) {
      this.query.enterpriseNodeId = id
      getList(this.query).then(res => {
        this.rightCardData = []
        this.templatelist = []
        this.operation.inputPrefix = ''

        if (res.code == 0) {
          this.templatelist = []
          this.operation.dataTemplate = ''
          for (var i = 0; i < this.middle.length; i++) {
            this.middle[i].value = ''
          }
          if (res.data.result.length > 0) {
            this.operation.dataTemplate = res.data.result[0].version
            this.aaa = true
            this.bbb = false
            // this.dataTemplateChange(res.data[0])
          } else {
            this.aaa = false
            this.bbb = true
          }
          for (let i = 0; i < res.data.result.length; i++) {
            this.templatelist.push({ label: res.data.result[i].version, value: res.data.result[i].id })

            this.aaa = true
          }
        }
      })
    },
    // 选中数据模板 展示前缀
    dataTemplateChange(row) {
      info(row.value).then(res => {
        if (res.code == 0) {
          this.operation.inputPrefix = res.data.prefix
          this.rightCardData = []
          for (let i = 0; i < res.data.dataItems.length; i++) {
            this.rightCardData.push({ name: res.data.dataItems[i].idType, selectedState: false, requiredlist: res.data.dataItems[i].required, value: res.data.dataItems[i].id })
          }
        }
      })
    },
    // 添加数据员弹出框显示
    addDatasource() {
      this.addisanswer = true
      const addData = {
        introduction: '',
        fileList: [],
        name: '',
        type: '',
        creatorId: '',
        databaseType: '',
        databaseName: '',
        databasePassword: '',
        databasePort: '',
        databaseUrl: '',
        databaseUsername: '',
        fileName: '',
        id: ''
      }
      this.addData = addData
    },
    addEnterprise() {
      this.addNode = true
      const addForm = {
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
      }
      this.addForm = addForm
    },
    // 选中数据源获取表
    addFileInput(id) {
      this.id3333333 = id
      tableList(id).then(res => {
        this.surfacelist = []
        this.operation.dataSourceList = ''
        for (var i = 0; i < this.middle.length; i++) {
          this.middle[i].activeName = ''
        }

        if (res.code == 0) {
          if (res.data.length > 0) {
            this.addlist(res.data[0])
            this.operation.dataSourceList = res.data[0]// 点击数据源默认获取第一个表数据
          }
          for (let i = 0; i < res.data.length; i++) {
            this.surfacelist.push({ label: res.data[i], value: res.data[i] })
          }
        } else {
          this.leftCardData = []
          this.tableDatas = []
        }
      })
    },
    // 选中表获取表格数据
    addlist(id) {
      tableData({
        table: id,
        id: this.id3333333
      }).then(res => {
        if (res.code == 0) {
          this.leftCardData = res.data.title
          this.tableDatas = res.data.data
        }
      })
    },
    //   查看隐藏表格
    open() {
      this.tablelists = !this.tablelists
    },
    // 添加一组连线
    Connection() {
      this.bottomstop = true// 连线添加按钮置灰
      this.middle.push({
        id: Number(Math.random().toString().substr(3, 3) + Date.now()).toString(36),
        activeName: '',
        value: ''
      })
    },

    // 点击左边列的其中一行
    clickSelect(item) {
      const domainlength = this.middle.length
      const domain = domainlength > 0 ? this.middle[domainlength - 1] : null
      if (domain != null) {
        for (let i = 0; i < this.middle.length; i++) {
          // if (this.middle[i].value == items && this.middle[i].activeName == rightDo.activeName) {
          if (this.middle[i].activeName == item) {
            this.$message({
              showClose: true,
              duration: 1000,
              type: 'error',
              message: '不能重复'
            })
            return
          }
        }
        if (this.middle[domainlength - 1].activeName != '' && this.middle[domainlength - 1].value != '') {
          this.middle.push({
            activeName: item,
            value: ''
          })
        } else {
          this.middle[domainlength - 1].activeName = item
        }
        this.activeNameIsValue = false // 取消右侧列表复选框禁用
        this.selectActiveName = item // 左边卡片选中对应input
      }
      // if (domain != null && (domain.activeName == null || domain.value == null || domain.activeName == '' || domain.value == '')) {
      //   this.bottomstop = true// 连线添加按钮置灰
      // } else {
      //   this.bottomstop = false// 连线添加按钮置灰
      // }
    },
    // 点击右边列的其中一行
    rightEelected(items, checked) {
      if (checked) {
        this.middle[this.middle.length - 1].value = items
        this.updaterightCraeSelect()
      } else {
        this.$confirm('你确定删除数据类型为' + items + '的对应关系吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          confirmButtonClass: 'classStyle2',
          closeOnClickModal: false,
          showClose: false,
          type: 'warning'
        }).then(() => {
          for (let i = 0; i < this.middle.length; i++) {
            if (this.middle[i].value == items) {
              this.middle.splice(i, 1)
            }
          }
          if (this.middle.length == 0) {
            this.middle.push({
              activeName: '',
              value: ''
            })
          }
          this.updaterightCraeSelect()
        }).catch(() => {
          this.updaterightCraeSelect()
        })
      }
    },
    updaterightCraeSelect() {
      for (let i = 0; i < this.rightCardData.length; i++) {
        this.rightCardData[i].selectedState = false
        for (let j = 0; j < this.middle.length; j++) {
          if (this.middle[j].value == this.rightCardData[i].name) {
            this.rightCardData[i].selectedState = true
          }
        }
      }
    },
    // 删除一组连线
    removeDomain(id) {
      for (let i = 0; i < this.middle.length; i++) {
        if (this.middle[i].id == id) {
          this.middle.splice(i, 1)
        }
      }
      for (let i = 0; i < this.rightCardData.length; i++) {
        this.rightCardData[i].selectedState = false
        for (let j = 0; j < this.middle.length; j++) {
          if (this.middle[j].value == this.rightCardData[i].name) {
            this.rightCardData[i].selectedState = true
          }
        }
      }
      const domainlength = this.middle.length
      const domain = domainlength > 0 ? this.middle[domainlength - 1] : null
      if (domain != null && (domain.activeName == null || domain.value == null || domain.activeName == '' || domain.value == '')) {
        this.bottomstop = true// 连线添加按钮置灰
      } else {
        this.bottomstop = false// 连线添加按钮置灰
      }
    },

    //   获取数据源列表
    sourcelists() {
      if (sessionStorage.getItem('user')) {
        const user = JSON.parse(sessionStorage.getItem('user'))
        this.selectListTimeImport.creatorId = user.accountNumber == 'admin' ? '' : user.id
        this.selectListTimeImport.dataBase = this.newBuild.taskType == 'TIME' ? 'database' : ''
        selectList(this.selectListTimeImport).then(res => {
          if (res.code == 0) {
            this.sourcelist = []
            for (let i = 0; i < res.data.length; i++) {
              getDatabase(res.data[i].id).then(res => {
                if (res.code == 0) {
                  if (res.data.type == '数据库') {
                    this.sourcelist.push(
                      {
                        label: res.data.name,
                        value: res.data.id,
                        type: res.data.type,

                        dataSource: {
                          name: res.data.name,
                          type: res.data.type,
                          databaseType: res.data.databaseType,
                          databaseName: res.data.databaseName,
                          databaseUrl: res.data.databaseUrl,
                          databasePort: res.data.databasePort,
                          databaseUsername: res.data.databaseUsername,
                          databasePassword: res.data.databasePassword
                        }
                      }
                    )
                  } else if (res.data.type == '文件') {
                    this.sourcelist.push(
                      {
                        label: res.data.name,
                        value: res.data.id,
                        type: res.data.type,
                        dataSource: {
                          name: res.data.name,
                          type: res.data.type

                        }
                      }
                    )
                  }
                }
              })
            }
          }
        })
      }
    },
    // 获取企业节点列表
    nodelists() {
      if (sessionStorage.getItem('user')) {
        const user = JSON.parse(sessionStorage.getItem('user'))
        nodeSelectList(user.accountNumber == 'admin' ? '' : user.id).then(res => {
          if (res.code == 0) {
            this.nodelist = []
            for (let i = 0; i < res.data.length; i++) {
              getEnterpriseNode(res.data[i].id).then(res => {
                if (res.code == 0) {
                  if (res.data.type == '自建模式') {
                    const addForm1 = {}
                    addForm1.type = res.data.type
                    addForm1.interType = res.data.interType
                    for (var i = 0; i < res.data.interfaceTypes.length; i++) {
                      if (res.data.interfaceTypes[i].type == '标识代理服务') {
                        addForm1.oneselfAgentUrl = res.data.interfaceTypes[i].url
                        addForm1.oneselfAgentCheck = res.data.interfaceTypes[i].token
                        addForm1.oneselfAgentUsername = res.data.interfaceTypes[i].username
                        addForm1.oneselfAgentPassword = res.data.interfaceTypes[i].password
                      } else if (res.data.interfaceTypes[i].type == '标识基础服务') {
                        addForm1.oneselfBasicsUrl = res.data.interfaceTypes[i].url
                        addForm1.oneselfBasicsCheck = res.data.interfaceTypes[i].token
                        addForm1.oneselfBasicsUsername = res.data.interfaceTypes[i].username
                        addForm1.oneselfBasicsPassword = res.data.interfaceTypes[i].password
                      }
                    }
                    this.nodelist.push(
                      {
                        label: res.data.name,
                        value: res.data.id,
                        addForm: addForm1
                      }
                    )
                    this.selfBuilt = true
                    this.managed = false
                  } else if (res.data.type == '托管模式') {
                    const addForm2 = {}
                    addForm2.type = res.data.type
                    addForm2.accessType = res.data.interType
                    for (var j = 0; j < res.data.interfaceTypes.length; j++) {
                      if (res.data.interfaceTypes[j].type == 'snms系统') {
                        addForm2.trusteeshipSnmsUrl = res.data.interfaceTypes[j].url
                        addForm2.trusteeshipSnmsUsername = res.data.interfaceTypes[j].username
                        addForm2.trusteeshipSnmsPassword = res.data.interfaceTypes[j].password
                      } else if (res.data.interfaceTypes[j].type == '标识代理服务') {
                        addForm2.trusteeshipAgentUrl = res.data.interfaceTypes[j].url
                        addForm2.trusteeshipAgentCheck = res.data.interfaceTypes[j].token
                        addForm2.trusteeshipAgentUsername = res.data.interfaceTypes[j].username
                        addForm2.trusteeshipAgentPassword = res.data.interfaceTypes[j].password
                      }
                    }
                    this.nodelist.push(
                      {
                        label: res.data.name,
                        value: res.data.id,
                        addForm: addForm2
                      }
                    )
                    this.selfBuilt = false
                    this.managed = true
                  }
                }
              })
            }
          }
        })
      }
    },

    // 表格样式设置
    headClass() {
      return 'text-align: center;'
    },
    // 表格样式设置
    rowClass() {
      return 'text-align: center;'
    },
    self1(val) {
      if (val == true) {
        this.display = true
      } else {
        this.display = false
      }
    },
    self2(val) {
      if (val == true) {
        this.display2 = true
      } else {
        this.display2 = false
      }
    },
    self3(val) {
      if (val == true) {
        this.display3 = true
      } else {
        this.display3 = false
      }
    },
    // 新增弹出框，数据类型联动
    updateAdddisplay() {
      this.addDataShow = (this.addData.type == 'database')
      this.addFileShow = (this.addData.type == 'file')
    },

    update() {
      this.selfBuilt = (this.addForm.type == 'BUILT')
      this.managed = (this.addForm.type == 'ESCROW')
    },
    // 数据库连接测试
    connectionTest() {
      if (this.addData.name == '') {
        this.$message({
          showClose: true,
          duration: 1000,
          type: 'error',
          message: '请输入数据源名称'
        })
        this.link = true
      } else if (this.addData.type == '') {
        this.$message({
          showClose: true,
          duration: 1000,
          type: 'error',
          message: '请输入数据源类型'
        })
        this.link = true
      } else if (this.addData.databaseName == '') {
        this.$message({
          showClose: true,
          duration: 1000,
          type: 'error',
          message: '请输入数据库名称'
        })
        this.link = true
      } else if (this.addData.databaseType == '') {
        this.$message({
          showClose: true,
          duration: 1000,
          type: 'error',
          message: '请输入数据源名称'
        })
        this.link = true
      } else if (this.addData.databaseUrl == '') {
        this.$message({
          showClose: true,
          duration: 1000,
          type: 'error',
          message: '请输入连接地址'
        })
        this.link = true
      } else if (this.addData.databasePort == '') {
        this.$message({
          showClose: true,
          duration: 1000,
          type: 'error',
          message: '请输入端口号'
        })
        this.link = true
      } else if (this.addData.databaseUsername == '') {
        this.$message({
          showClose: true,
          duration: 1000,
          type: 'error',
          message: '请输入用户名'
        })
        this.link = true
      } else {
        if (sessionStorage.getItem('user')) {
          const user = JSON.parse(sessionStorage.getItem('user')).id
          this.addData.creatorId = user
          connectionTest(this.addData).then(res => {
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
                duration: 1000,
                type: 'success',
                message: '连接失败'
              })
              this.link = false
            }
          })
            .catch(() => {
              this.$message({
                showClose: true,
                duration: 1000,
                type: 'error',
                message: '连接失败'
              })
            })
        }
      }
    },
    // 上传文件夹
    changesData() {
      const box = this.$refs.file.files
      this.addData.fileList = []
      for (let i = 0; i < box.length; i++) {
        const sort = box[i].name.split('.')
        sort = sort[sort.length - 1]
        if (sort == 'csv' || sort == 'xls' || sort == 'xlsx') {
          this.addData.fileList.push(box[i])
          this.dataSourcetable.push({ name: box[i].name, type: sort, size: Size(box[i].size) })
        }
      }
      if (this.dataSourcetable.length <= 0) {
        this.$message.error({
          showClose: true,
          duration: 1000,
          message: '只能上传csv或者xls,xlsx格式文件',
          type: 'warning'
        })
      }
    },
    // 上传文件
    uploading(file) {
      this.addData.fileList = []
      let sort = file.name.split('.')
      sort = sort[sort.length - 1]
      const size = Size(file.size)
      if (size == '0') {
        this.$message.error({
          showClose: true,
          duration: 1000,
          message: '不允许空文件上传。',
          type: 'warning'
        })
        return
      }
      if (sort == 'csv' || sort == 'xls' || sort == 'xlsx') {
        this.addData.fileList.push(file)
        this.dataSourcetable.push({ name: file.name, type: sort, size: Size(file.size) })
      } else {
        this.$message.error({
          showClose: true,
          duration: 2000,
          message: '只能上传csv或者xls,xlsx格式文件。',
          type: 'warning'
        })
        return
      }
    },
    // 添加数据源
    adddatabase() {
      if (this.addDataShow == true) {
        if (this.addData.name == '') {
          this.$message({
            showClose: true,
            duration: 1000,
            type: 'error',
            message: '请输入数据源名称'
          })
        } else if (this.addData.type == '') {
          this.$message({
            showClose: true,
            duration: 1000,
            type: 'error',
            message: '请输入数据源类型'
          })
        } else if (this.addData.databaseName == '') {
          this.$message({
            showClose: true,
            duration: 1000,
            type: 'error',
            message: '请输入数据库名称'
          })
        } else if (this.addData.databaseType == '') {
          this.$message({
            showClose: true,
            duration: 1000,
            type: 'error',
            message: '请输入数据源名称'
          })
        } else if (this.addData.databaseUrl == '') {
          this.$message({
            showClose: true,
            duration: 1000,
            type: 'error',
            message: '请输入连接地址'
          })
        } else if (this.addData.databasePort == '') {
          this.$message({
            showClose: true,
            duration: 1000,
            type: 'error',
            message: '请输入端口号'
          })
        } else if (this.addData.databaseUsername == '') {
          this.$message({
            showClose: true,
            duration: 1000,
            type: 'error',
            message: '请输入用户名'
          })
        } else {
          if (sessionStorage.getItem('user')) {
            const user = JSON.parse(sessionStorage.getItem('user')).id
            this.addData.creatorId = user
            database(this.addData).then(res => {
              if (res.code == 0) {
                this.$message({
                  showClose: true,
                  duration: 1000,
                  type: 'success',
                  message: '添加成功'
                })
                this.sourcelists() //   获取数据源列表
                this.addisanswer = false
                this.addData.name = ''
                this.addData.type = ''
                this.addData.creatorId = ''
                this.addData.databaseType = ''
                this.addData.databaseName = ''
                this.addData.databasePassword = ''
                this.addData.databasePort = ''
                this.addData.databaseUrl = ''
                this.addData.databaseUsername = ''
              } else {
                this.$message({
                  showClose: true,
                  duration: 1000,
                  type: 'error',
                  message: '添加失败'
                })
              }
            })
          }
        }
      } else if (this.addFileShow == true) {
        if (this.addData.name == '') {
          this.$message({
            showClose: true,
            duration: 1000,
            type: 'error',
            message: '请输入数据源名称'
          })
        } else if (this.addData.type == '') {
          this.$message({
            showClose: true,
            duration: 1000,
            type: 'error',
            message: '请输入数据源类型'
          })
        } else {
          if (sessionStorage.getItem('user')) {
            const user = JSON.parse(sessionStorage.getItem('user')).id
            this.addData.creatorId = user
            if (this.addData.fileList != [] && this.addData.fileList != null && this.addData.fileList != undefined) {
              this.$message({
                showClose: true,
                message: '正在上传文件',
                duration: 1000
              })
              const fd = new FormData()
              const list = this.addData.fileList
              fd.append('length', list.length)
              for (let i = 0; i < list.length; i++) {
                fd.append('fileList' + i, list[i]) // 传多个文件
              }
              fd.append('name', this.addData.name ? this.addData.name : '')
              fd.append('type', this.addData.type ? this.addData.type : '')
              fd.append('creatorId', this.addData.creatorId)
              dataSourceFile(fd).then(res => {
                if (res.code == '0') {
                  this.$message({
                    showClose: true,
                    message: '文件上传成功',
                    type: 'success',
                    duration: 1000
                  })
                  this.sourcelists()
                  this.addisanswer = false
                }
              })
            }
          }
        }
      }
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
                  token: this.addForm.oneselfAgentCheck,
                  username: this.addForm.oneselfAgentUsername,
                  password: this.addForm.oneselfAgentPassword
                },
                {
                  interType: 'LBS',
                  url: this.addForm.oneselfBasicsUrl,
                  token: this.addForm.oneselfBasicsCheck,
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
                    token: this.addForm.trusteeshipAgentCheck,
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
            this.nodelists()
            this.addNode = false
            this.addForm.name = ''
            this.addForm.type = ''
            this.addForm.password = ''
            this.addForm.url = ''
            this.addForm.username = ''
          } else {
            this.$message({
              showClose: true,
              duration: 1000,
              type: 'error',
              message: '添加失败'
            })
          }
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
//  .boxCard::-webkit-scrollbar {
//         display: none;
//     }
.file-upload {
        width: 90px;
        height: 26px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        border: 1px solid #4283d8  ;
        background:#4283d8 ;
        border-radius: 21px;
        font-size: 12px;
        color: #fff;
        text-align: center;
        line-height: 26px;
        margin-top: 5px;
    }
     .file-upload-input {
        background-color: transparent;
        position: absolute;
        width: 9999px;
        height: 999px;
        top: -10px;
        right: -10px;
        cursor: pointer;
    }

.corresponding::-webkit-scrollbar {
  display: none;
}
.addtaskall {
  min-height: 750px;
  //   min-height: 100px;

  position: relative;
}
.addtask {
  background-color: #fff;
  width: 98%;
  height: 100%;

  margin: 0 auto;
  padding: 10px 6%;
  .screen {
    text-align: center;
    // margin-bottom: 20px;
  }

  .boxCard {
    margin-top: 15px;
    height: 200px;
    width: 62%;
    color: rgb(96, 98, 102);

    overflow-x: hidden;
    overflow-y: scroll;
  }
  .corresponding {
    width: 85%;
    background: #f0f2f5;
    margin-top: 3%;
    overflow-x: hidden;
    overflow-y: scroll;
    height: 200px;
  }
  .rightLists {
    font-size: 14px;
    // color: rgb(96, 98, 102);
    line-height: 30px;
    padding-left: 20px;
    cursor: pointer;
  }
  .stars {
    margin-top: 7px;
    cursor: pointer;
  }
  .leftLists {
    font-size: 14px;
    color: rgb(96, 98, 102);
    line-height: 30px;
    padding-left: 20px;
    float: left;
    width: 100%;
  }
}
</style>

<style>
.classStyle2{
    background: #4283d8 !important;
    color:#fff !important;
    border:1px solid #4283d8 !important;
}
.active {
  background-color: #4283d8;
  color: #fff;
}

.addtask .el-table__header tr,
.el-table__header th {
  padding: 0;
  height: 40px;
}
.addtask .el-table__body tr,
.el-table__body td {
  padding: 0;
  height: 40px;
}
.addtask .el-card__body {
  padding: 0;
  /* min-height: 200px; */
}
.corresponding .el-input.is-disabled .el-input__inner {
  /* color: #606266; */
    background-color: #f0f2f5;
    border-color: #f0f2f5;
    height: 25px;
    line-height: 25px;
    text-align: center;
}
.tttt .el-select {
  width: 25%;
  margin-right: 2%;
}
.tttwwt .el-select {
  width: 60%;
  margin-right: 2%;
}
</style>

