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
                            <el-form label-position="left" label-width="148px" inline class="demo-table-expand">
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
                    >
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                            <el-button type="text" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
        <el-dialog 
            :title="title" 
            :visible.sync="dialogFormVisible"
            @closed="handleClose">
            <el-form :model="form" :rules="rules" ref="loginForm">
                <el-form-item 
                    label="用户名" 
                    :label-width="formLabelWidth"
                    prop="username"
                    v-if="isRegister">
                    <el-input
                        v-model="form.name" 
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
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onSubmit" v-if="isEdit">确 定</el-button>
                <el-button type="primary" @click="onRegister" v-if="isRegister">创 建</el-button>
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
    width: 50%;
}
.w220{
    width: 230px!important;
}
.dialog-footer{
    padding-left: 120px;
    text-align: left;
}
</style>
<style lang='less'>
.demo-table .demo-table-expand .el-form-item label{
    width: 148px;
    color: #99a9bf;
}
</style>

<script>
import Api  from '../../api/index.js';
export default {
    created : function(){
        let self = this;
        // 判断当前角色
        // ajax({
        //     url:'/user/getInitInfo',
        //     type:'post',
        //     data:{
        //     },
        //     success(res){
        //         if(res.success){
        //             // self.isProfessor = res.data.userVO.isProfessor;
        //             self.orgCodeShow = res.data.userVO.isProfessor;
        //             self.belongOrg = res.data.userVO.orgCode;
        //         }else{
        //             self.$message({
        //                 message: res.errorMsg,
        //                 type: 'warning'
        //             });
        //         };
        //     }
            
        // });
        // 获取机构列表
        // this.getOrg();
    },
    mounted : function(){
        this.getListData();
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
            tableData: [],
            userNum: 5,
            dialogFormVisible: false,
            form: {
                name: '',
                password: '',
                region:['PERMIT_LIST','PERMIT_AGREE','PERMIT_REFUSE','PERMIT_DELETE'],
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
            }],
            title:"创建用户",
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
        //删除用户
        handleDelete(index,row){
            let self = this;
            this.form.name = this.tableData[index].name;
            // 点击删除确定
            this.$confirm('是否删除该用户?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                self.loading = true;
                let params = {}
                Api.deleteAccount(params,this.form.name).then((response) =>{    
                    if(response && response.status === 200){
                        self.loading = false;
                        this.getListData();
                    }
                })
                .catch(function (error) {
                });
            }).catch(() => {
                // this.$message({
                //     type: 'info',
                //     message: '已取消删除'
                // });          
            });
        },
        //关闭弹框
        handleClose(){
            this.isRegister = false;
            this.isEdit = false;
        },
        //点击创建用户按钮
        addAccount(){
            this.form.name = "";
            this.dialogFormVisible = true;
            this.isRegister = true;
        },
        //注册用户
        onRegister(){
            this.$refs.loginForm.validate((valid) =>{
                if(valid){
                    Api.register({
                        username: this.form.name.trim(),
                        password: this.form.password.trim(),
                        permissions: this.form.region,
                    }).then((response) =>{
                            
                        if(response && response.status === 200){
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
            this.form.name = this.tableData[index].name;
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
                username: this.form.name,
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
    }
}
</script>
