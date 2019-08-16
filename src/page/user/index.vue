<!-- 
    author:amin,
    desc:平台管理
 -->
<template>
    <div  v-loading="loading" element-loading-text="删除中">
        <div class="breadcrumb-wrapper header">
            <h3 class="title">平台管理</h3>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>首页</el-breadcrumb-item>
                <el-breadcrumb-item>平台管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="examed">
             <el-form :inline="true" class="demo-form-inline" empty-text="暂无数据">
                <el-form-item>
                    <el-button type="primary" @click="addAccount" >创建用户</el-button>
                    <p class="form-notice">您还可以创建{{ userNum }}个用户</p>
                </el-form-item>
            </el-form>
            <div>
                <el-table
                    class="demo-table"
                    :data="tableData"
                    style="width: 100%"
                    border
                >
                    <el-table-column type="expand">
                        <template slot-scope="scope">
                            <el-form label-position="left" label-width="200px" inline class="demo-table-expand">
                                <el-form-item label="用户名">
                                    <span>{{ scope.row.name }}</span>
                                </el-form-item>
                                <el-form-item label="管理员权限">
                                    <span>{{ scope.row.role.admin == "0"?"无":"有" }}</span>
                                </el-form-item>
                                <el-form-item label="通行证查询权限">
                                    <span>{{ scope.row.role.permit_list == "0"?"无":"有" }}</span>
                                </el-form-item>
                                <el-form-item label="通行证审批同意权限">
                                    <span>{{ scope.row.role.permit_agree == "0"?"无":"有" }}</span>
                                </el-form-item>
                                <el-form-item label="通行证审批拒绝权限">
                                    <span>{{ scope.row.role.permit_refuse == "0"?"无":"有" }}</span>
                                </el-form-item>
                                <el-form-item label="通行证删除权限">
                                    <span>{{ scope.row.role.permit_delete == "0"?"无":"有" }}</span>
                                </el-form-item>
                                <el-form-item label="卡口管理控制权限">
                                  <span>{{ scope.row.role.gate_controller == "0"?"无":"有" }}</span>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                     <el-table-column
                        label="用户名"
                        >
                        <template slot-scope="scope">
                            <p  v-if='scope.row.name' >{{scope.row.name}}</p>
                            <p v-else>--</p>
                        </template>
                    </el-table-column>
                    <el-table-column 
                        label="操作"
                        width="200px"
                    >
                        <template slot-scope="scope">
                            <el-button type="text" @click="handleEdit(scope.$index, scope.row)" icon="el-icon-edit" title="修改" style="font-size:16px;"></el-button>
                            <el-button type="text" @click="handleDelete(scope.$index, scope.row)" icon="el-icon-delete" title="删除" style="font-size:16px;"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="paging-wrapper" v-if='tableData.length!==0'>
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageStart"
                :page-sizes="[10, 20, 50]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableData.length">
                </el-pagination>
            </div>
        </div>
        <div class="examed pt0" v-if='isWhite'>
            <el-form :inline="true" class="demo-form-inline" empty-text="暂无数据">
                <el-form-item>
                    <el-button type="primary" @click="addWhite" >添加车辆白名单</el-button>
                </el-form-item>
            </el-form>
            <el-table
                :data="whitelist"
                border>
                <el-table-column
                    label="ID"
                    min-width="50">
                    <template slot-scope="scope">
                        <p  v-if='scope.row.id' >{{scope.row.id}}</p>
                        <p v-else>--</p>
                    </template>
                </el-table-column>
                <el-table-column
                    label="车牌类型"
                    min-width="85">
                    <template slot-scope="scope">
                        <p v-if='scope.row.vehicle_type'>{{vehicleType(scope.row.vehicle_type)}}</p>
                        <p v-else>--</p>
                    </template>
                </el-table-column>
                <el-table-column
                    label="车牌号码"
                    min-width="75">
                    <template slot-scope="scope">
                        <p v-if='scope.row.plate_number'>{{scope.row.plate_number}}</p>
                        <p v-else>--</p>
                    </template>
                </el-table-column>
                <el-table-column
                  label="允许卡口"
                  min-width="75">
                  <template slot-scope="scope">
                    <p v-if='scope.row.org_name'>{{scope.row.org_name}}</p>
                    <p v-else>--</p>
                  </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    min-width='70'
                    fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" @click="handleDeleteWhite(scope.$index, scope.row)" icon="el-icon-delete" title="删除" style="font-size:16px;"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="paging-wrapper" v-if='totalNum!==0'>
                <el-pagination
                @size-change="handleSizeChangeWhite"
                @current-change="handleCurrentChangeWhite"
                :current-page="pageStartWhite"
                :page-sizes="[10, 20, 50]"
                :page-size="pageSizeWhite"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalNum">
                </el-pagination>
            </div>
        </div>
        <el-dialog 
            :title="title" 
            :visible.sync="dialogFormVisible"
            @closed="handleClose">
            <el-row>
                <el-col :span="14">
                    <el-form :model="form" :rules="rules" ref="loginForm">
                        <el-form-item 
                            label="用户名" 
                            :label-width="formLabelWidth"
                            prop="username"
                            v-if="isRegister">
                            <el-input
                                v-model="form.username" 
                                class="w220"
                                placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item 
                            label="密码" 
                            :label-width="formLabelWidth" 
                            prop="password"
                            v-if="isRegister">
                            <el-input
                                v-model="form.password" 
                                type="password" 
                                class="w220"
                                placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item 
                            label="权限" 
                            :label-width="formLabelWidth">
                            <el-select 
                                class="w220"
                                v-model="form.region"
                                multiple 
                                clearable  
                                placeholder="请设置权限">
                                <el-option
                                    v-for="(item, index) in options"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="10">
                    <div class="introduce">
                        <p><b>权限介绍：</b></p>
                        <p>① 通行证查询权限→通行证审批拒绝权限→通行证审批同意权限→通行证删除权限</p>
                        <p>权限依次增强，每个权限包含之前所有权限</p>
                        <p><b>举例：</b>只允许过滤通行证权限，拒绝部分不合理的通行证，可赋权“通行证查询权限”，“通行证审批拒绝权限”或者“通行证审批拒绝权限”</p>
                        <p>② 卡口控制权限可以控制各个卡口的锁定恢复及手持终端机的使用</p>
                    </div>
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onSubmit" v-if="isEdit">确 定</el-button>
                <el-button type="primary" @click="onRegister" v-if="isRegister">创 建</el-button>
            </div>
        </el-dialog>
        <el-dialog 
            :title="titleWhite" 
            :visible.sync="dialogWhiteVisible">
            <el-row>
                <el-form :model="formWhite" ref="loginWhiteForm">
                    <el-form-item 
                        label="车牌号" 
                        :label-width="formLabelWidth"
                        prop="plate_number">
                        <el-input
                            v-model="formWhite.plate_number" 
                            class="w220"
                            placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item 
                        label="车牌类型" 
                        :label-width="formLabelWidth">
                        <el-select 
                            class="w220"
                            v-model="formWhite.region"
                            clearable  
                            placeholder="请选择车牌类型">
                            <el-option
                                v-for="(item, index) in optionsWhite"
                                :key="index"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onAddWhite">添加</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<style lang="less" scoped>
@theme-color:#409EFF;
.examed{
    padding: 20px;
}
.btns-wrapper{
    padding-bottom: 15px;
}
.paging-wrapper{
    padding-top: 15px;
    text-align: right;
}
.table-action{
    word-break: keep-all;
}
.mr10{
    margin-right: 10px;
}
.w192{
    width: 192px;
}
.el-breadcrumb{
    float: right;
}
.header .title{
    float: left;
    font-size: 18px;
    font-weight: normal;
}
.form-notice{
    font-weight: normal; 
}
.demo-table .demo-table-expand .el-form-item{
    margin-right: 0;
    margin-bottom: 0;
    width: 80%;
}
.w220{
    width: 230px!important;
}
.dialog-footer{
    padding-left: 120px;
    text-align: left;
}
.introduce{
    font-weight: normal;
    line-height: 28px;
}
.pt0{
    padding-top:0;
}
</style>
<style lang='less'>
.demo-table .demo-table-expand .el-form-item label{
    width: 200px;
    color: #99a9bf;
}
</style>

<script>
import Api  from '../../api/index.js';
export default {
    created : function(){
        
    },
    mounted : function(){
        this.getListData();
        this.whitelistData();
        this.setAdminMenu();
    },
    // beforeRouteLeave : function(to, from, next){
        
    // },
    data(){
        // 校验用户名
		let verifyUserName = function(rule, value, callback){
            let val = value;
            if(!val){
                callback('请输入用户名');
            }else if(!/^[a-zA-Z0-9_\u4e00-\u9fa5]{2,20}$/.test(val)){
                // callback('用户名仅支持2-20位中英文、数字和下划线  ');
                callback()
            }else{
                callback();
            }
		};
		// 校验密码
		let verifyPassWord = function(rule, value, callback){
			let val = value;
			if(!val){
				callback('请输入密码');
			}else if(!/^[a-zA-Z0-9_!@#$%^&*()_+]{6,14}$/.test(val)){
				callback()
				// callback('密码仅支持6-14位大小写字母，数字和标点符号');
			}else{
				callback();
			}
		}
        return ({
            loading : false,
            pageStart:1,
            pageSize:10,
            pageStartWhite:1,
            pageSizeWhite:10,
            totalNum:0,
            tableData: [],
            userNum: 5,
            dialogFormVisible: false,
            dialogWhiteVisible: false,
            form: {
                username: '',
                password: '',
                region:['PERMIT_LIST','PERMIT_AGREE','PERMIT_REFUSE','PERMIT_DELETE'],
            },
            formWhite: {
                plate_number: '',
                region:[],
            },
            formLabelWidth: '120px',
            options: [{
                value: 'PERMIT_LIST',
                label: '通行证查询权限'
                }, {
                value: 'PERMIT_AGREE',
                label: '通行证审批同意权限'
                }, {
                value: 'PERMIT_REFUSE',
                label: '通行证审批拒绝权限'
                }, {
                value: 'PERMIT_DELETE',
                label: '通行证删除权限'
                }, {
                value: 'GATE_CONTROLLER',
                label: '卡口控制权限'
            }],
            optionsWhite: [{
                value: 'yellow',
                label: '黄牌'
                }, {
                value: 'blue',
                label: '蓝牌'
                }, {
                value: 'green',
                label: '绿牌'
                }],
            title:"创建用户",
            titleWhite:"添加白名单",
            isRegister: false,
            isEdit: false,
            rules : {
				username : [
					{ required:true,validator : verifyUserName, trigger: 'blur'}
				],
				password : [
					{ required:true,validator : verifyPassWord, trigger: 'blur' }
				]
            },
            whitelist: [],
            isWhite: false,
        })
    },
    methods : {
        getListData(){
            Api.accountLists({
                page: this.pageStart,
                size: this.pageSize,
            }).then((response) =>{
                if(response && response.status === 200){
                    this.tableData = response.data;
                }
            })
            .catch(function (error) {

            });

            Api.quota().then((response) =>{
                if(response && response.status === 200){
                    this.userNum = response.data.total - response.data.use;
                }
            })
            .catch(function (error) {

            });
        },
        whitelistData(){
            Api.gateWhitelist({
                page: this.pageStartWhite,
                size: this.pageSizeWhite,
            }).then((response) =>{
                if(response && response.status === 200){
                    this.whitelist = response.data.whiteLists;
                    this.totalNum = response.data.total;
                }
            })
            .catch(function (error) {

            });
        },
        handleSizeChange(value){
            // pageSize变化
            this.pageSize = value;
            this.getListData();
        },
        handleCurrentChange(value){
            // pageStart变化
            this.pageStart = value;
            this.getListData();
        },
        handleSizeChangeWhite(value){
            // pageSize变化
            this.pageSizeWhite = value;
            this.whitelistData();
        },
        handleCurrentChangeWhite(value){
            // pageStart变化
            this.pageStartWhite = value;
            this.whitelistData();
        },
        //删除用户
        handleDelete(index,row){
            let self = this;
            this.form.username = this.tableData[index].name;
            // 点击删除确定
            this.$confirm('是否删除该用户?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                self.loading = true;
                Api.deleteAccount(this.form.username).then((response) =>{    
                    if(response && response.status === 200){
                        self.loading = false;
                        this.getListData();
                    }else{
                        self.loading = false;
                    }
                })
                .catch(function (error) {
                    self.loading = false;
                });
            }).catch(() => {
                self.loading = false;
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        //删除白名单
        handleDeleteWhite(index,row){
            let self = this;
            let id = this.whitelist[index].id;
            // 点击删除确定
            this.$confirm('是否删除该白名单?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                self.loading = true;
                Api.deleteWhitelist(id).then((response) =>{    
                    if(response && response.status === 200){
                        self.loading = false;
                        this.whitelistData();
                    }else{
                        self.loading = false;
                    }
                })
                .catch(function (error) {
                    self.loading = false;
                });
            }).catch(() => {
                self.loading = false;
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        //关闭弹框
        handleClose(){
            this.isRegister = false;
            this.isEdit = false;
        },
        //点击创建用户按钮
        addAccount(){
            if(this.userNum == 0){
                this.$message({
                    message: '您已经达到创建用户数的极限',
                    type: 'warning'
                });
            }else{
                this.form.username = "";
                this.form.password = "";
                this.form.region = ['PERMIT_LIST','PERMIT_AGREE','PERMIT_REFUSE','PERMIT_DELETE'];
                this.dialogFormVisible = true;
                this.isRegister = true;
            }
        },
        addWhite(){
            this.formWhite.plate_number = "";
            this.formWhite.region = [];
            this.dialogWhiteVisible = true;
        },
        //添加白名单
        onAddWhite(){
            Api.addWhitelist({
                plate_number: this.formWhite.plate_number.trim(),
                vehicle_type: this.formWhite.region,
            }).then((response) =>{
                if(response && response.status === 200){
                    this.whitelistData();
                    this.dialogWhiteVisible = false;
                }
            })
            .catch(function (error) {
                this.dialogWhiteVisible = false;
            });
        },
        //注册用户
        onRegister(){
            this.$refs.loginForm.validate((valid) =>{
                if(valid){
                    Api.register({
                        username: this.form.username.trim(),
                        password: this.form.password.trim(),
                        permissions: this.form.region,
                    }).then((response) =>{
                        if(response && response.status === 201){
                            this.getListData();
                            this.isRegister = false;
                            this.dialogFormVisible = false;
                        }
                    })
                    .catch(function (error) {
                        this.isRegister = false;
                        this.dialogFormVisible = false;
                    });
                }else{
					return false;
				}
            });
        },
        //点击修改按钮
        handleEdit(index,row){
            this.dialogFormVisible = true;
            this.isEdit = true;
            this.title = "修改用户权限";
            this.form.username = this.tableData[index].name;
            let _roles = [];
            let i = this.tableData[index].role;
            if(i.permit_list == "1"){
                _roles.push('PERMIT_LIST')
            }
            if(i.permit_agree == "1"){
                _roles.push('PERMIT_AGREE')
            }
            if(i.permit_refuse == "1"){
                _roles.push('PERMIT_REFUSE')
            }
            if(i.permit_delete == "1"){
                _roles.push('PERMIT_DELETE')
            }
            this.form.region = _roles
        },
        //修改用户权限
        onSubmit (){
            Api.editAccount({
                username: this.form.username,
                permissions: this.form.region,
            }).then((response) =>{
                if(response && response.status === 200){
                    this.getListData();
                    this.isEdit = false;
                    this.dialogFormVisible = false;
                }
            })
            .catch(function (error) {
                this.isEdit = false;
                this.dialogFormVisible = false;
            });
        },
        //车牌类型
        vehicleType(type){
            switch (type) {
                case "yellow":
                return "黄牌";
                break;
                case "blue":
                return "蓝牌";
                break;
                case "green":
                return "绿牌";
                break;
                default:
                break;
            }
        },
        //判断是否有添加修改白名单的权限
        setAdminMenu(){
            let  authList = this.$store.state.authorities;
            if(authList.indexOf('ADMIN') > -1 && authList.indexOf('GATE_CONTROLLER') > -1){
                this.isWhite = true;
            }
        }
    },
    computed: {
        authorities(){
            return this.$store.state.authorities
        }
    }
}
</script>
