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
             <el-form :inline="true" :model="examedForm" class="demo-form-inline" empty-text="暂无数据" :rules='examedFormRule' ref='examedForm'>
                <el-form-item label="用户名：" prop='plateNumber'>
                    <el-input v-model="examedForm.plateNumber" placeholder="请输入" clearable></el-input>
                </el-form-item>
                
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                    <el-button  class='el-button-reset' @click="onCancel">重置</el-button>
                    <!-- <el-button  class='el-button-reset' @click="onExport">导出</el-button> -->
                </el-form-item>
            </el-form>
        
            <div>
                <el-table
                    :data="tableData"
                    style="width: 100%"
                    border
                >
                    <el-table-column
                        label="ID"
                        min-width="50"
                        >
                        <template slot-scope="scope">
                            <p  v-if='scope.row.id' >{{scope.row.id}}</p>
                            <p v-else>--</p>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="通行证编号"
                        min-width="110">
                        <template slot-scope="scope">
                            <p v-if='scope.row.permit_number'>{{scope.row.permit_number}}</p>
                            <p v-else>--</p>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="orgCodeShow"
                        label="出发地"
                        width="100">
                        <template slot-scope="scope">
                            <p v-if='scope.row.from' >{{scope.row.from}}</p>
                            <!-- <p v-if='scope.row.from' class="ellipsis" :title="scope.row.orgName">{{scope.row.orgName}}</p> -->
                            <p v-else>--</p>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="目的地"
                        min-width="100">
                        <template slot-scope="scope">
                            <p v-if='scope.row.arrivals'>{{scope.row.arrivals}}</p>
                            <p v-else>--</p>
                        </template>
                    </el-table-column>
                    
                    <el-table-column
                        label="途径路线"
                        min-width="140"
                    >
                        <template slot-scope="scope">
                            <p v-if='scope.row.route'>{{scope.row.route}}</p>
                            <p v-else>--</p>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="gmtCreateStr"
                        label="运输物品"
                        min-width="90">
                        <template slot-scope="scope">
                            <div>
                                <p v-if='scope.row.goods'>{{scope.row.goods}}</p>
                            <p v-else>--</p>
                            </div>
                            
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="gmtCreateStr"
                        label="车牌号码"
                        min-width="75">
                        <template slot-scope="scope">
                            <div>
                                <p v-if='scope.row.plate_number'>{{scope.row.plate_number}}</p>
                                <p v-else>--</p>
                            </div>
                            
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="gmtCreateStr"
                        label="审批意见"
                        min-width="75">
                        <template slot-scope="scope">
                            <div>
                                <p v-if='scope.row.state'>{{approvalState(scope.row.state)}}</p>
                                <p v-else>--</p>
                            </div>
                            
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="gmtCreateStr"
                        label="途径时间起"
                        min-width="110">
                        <template slot-scope="scope">
                            <div>
                                <p v-if='scope.row.start_time'>{{scope.row.start_time | date-format}}</p>
                                <p v-else>--</p>
                            </div>
                            
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="gmtCreateStr"
                        label="途径时间止"
                        min-width="110">
                        <template slot-scope="scope">
                            <div>
                                <p v-if='scope.row.end_time'>{{scope.row.end_time | date-format}}</p>
                                <p v-else>--</p>
                            </div>
                            
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="gmtCreateStr"
                        label="批复时间"
                        min-width="110">
                        <template slot-scope="scope">
                            <div>
                                <p v-if='scope.row.approve_time'>{{scope.row.approve_time | date-format}}</p>
                                <p v-else>--</p>
                            </div>
                            
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="gmtCreateStr"
                        label="审批人"
                        min-width="75">
                        <template slot-scope="scope">
                            <div>
                                <p v-if='scope.row.approver'>{{scope.row.approver}}</p>
                                <p v-else>--</p>
                            </div>
                            
                        </template>
                    </el-table-column>
                    <el-table-column 
                        label="操作"
                        min-width='135'
                        fixed="right"
                    >
                        <template slot-scope="scope">
                            
                            <a href="javascript:;" 
                                size="small"
                                @click="handleEdit(scope.$index, scope.row)" v-if='scope.row.modifyButton' class="table-action">修订</a>
                            <router-link :to='{path:"/details",query:{id:scope.row.id,state:"FINISHED",breadcrumbitem:"审批日志"}}'
                            class="table-action mr10">查看</router-link>
                            <router-link v-if='scope.row.state !== "REFUSED"' :to='{path:"/permit",query:{id:scope.row.id,plate_number:scope.row.plate_number,permit_number:scope.row.permit_number,phone:scope.row.phone}}'
                            class="table-action">查看电子通行证</router-link>
                            <a href="javascript:;"
                                size="small"
                                type="danger"
                                @click="handleDelete(scope.$index, scope.row)" v-if='scope.row.modifyButton' class="table-action">删除</a>
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
                :total="totalNum">
                </el-pagination>
            </div>
        </div>
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
        return ({
            loading : false,
            // 根据角色 判断是否显示 机构名称
            orgCodeShow : true,
            examedForm: {
                plateNumber: ''
            },
            pageStart:1,
            pageSize:10,
            totalNum:0,
            tableData: [],
            // 是否是教授
            isProfessor:false,
            // 所属机构
            belongOrg:'',
            multipleSelection:'',
            examedFormRule:{
                plateNumber: [
                    { required: false, message: '请输入车牌号码', trigger: 'blur' },
                ]
            },
            // 机构名称下拉数据
            orgData:[]

        })
    },
    methods : {
        getListData(){
            // 点击查询
            let self = this;
            // ajax({
            //     url:'/literature/getLiteraturePollListByCond',
            //     type:'post',
            //     data:{
            //         titleName:self.examedForm.titleName,
            //         orgCode:self.examedForm.orgCode,
            //         // keyWords:self.examedForm.keyWords,
            //         fileType:self.examedForm.fileType,
            //         pageStart:(self.pageStart-1)*self.pageSize,
            //         pageSize:self.pageSize 
            //     },
            //     success(res){
            //         if(res.success){
            //             self.tableData = res.rows;
            //             self.totalNum = res.results;
            //         }else{
            //             self.$message({
            //                 message: res.errorMsg,
            //                 type: 'warning'
            //             });
            //         };
            //     }
                
            // });
            Api.examList({
                page: this.pageStart,
                size: this.pageSize,
                state: 'FINISHED',
                plate_number: this.examedForm.plateNumber
            }).then((response) =>{
                    console.log(response)
                    
                    if(response && response.status === 200){
                        this.tableData = response.data.permits;
                        this.totalNum = response.data.total;
                    }
                })
                .catch(function (error) {
                    this.disabled = false;
                });
        },
        getOrg(){
            let self = this;
            // 获取组织机构下拉列表
            // ajax({
            //     url:'/org/getALLOrgList',
            //     type:'post',
            //     data:{
            //     },
            //     success(res){
            //         if(res.success){
            //             res.rows.forEach((val,ind,arr) => {
            //                 self.orgData.push({'title':val.orgName,'key':val.orgCode});
            //             });
                        
            //         }else{
            //             self.$message({
            //                 message: res.errorMsg,
            //                 type: 'warning'
            //             });
            //         };
            //     }
                
            // });
        },
        //审批意见合集
        approvalState(state) {
            switch (state) {
                case "REFUSED":
                return "未通过";
                break;
                case "EXPIRED":
                return "已过期";
                break;
                case "ACCEPTED":
                return "通过";
                break;
                default:
                break;
            }
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
        handleDelete(index,row){
            let self = this;
            // 点击删除确定
            this.$confirm('是否删除该文献?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                self.loading = true;
                // ajax({
                //     url:'/literature/deleteLiterature',
                //     type:'post',
                //     data:{
                //         fileCode:row.fileCode
                //     },
                //     success(res){
                //         self.loading = false;
                //         if(res.success){
                //             self.getListData();
                //             self.$message({
                //                 message: "删除成功",
                //                 type: 'success'
                //             });
                //         }else{
                //             self.$message({
                //                 message: res.errorMsg,
                //                 type: 'warning'
                //             });
                //         };
                //     }
                    
                // });
            }).catch(() => {
                // this.$message({
                //     type: 'info',
                //     message: '已取消删除'
                // });          
            });
        },
        onSubmit (){
            this.pageStart = 1;
            this.getListData();
        },
        onCancel(){
            // 重置：
            this.$refs['examedForm'].resetFields();

        },
        handleEdit(index,row){
            // 修订
        
            // 修改路径
            let url = '';
            if(row.fileType == 'ts'){//图书
                url = '/editBook';
            }else if(row.fileType == 'zb'){//档案
                url = '/editRecord';
            }else if(row.fileType == 'qk'){//期刊
                url = '/editPeriodical';
            }else if(row.fileType == 'bz'){//报纸
                url = '/editSpaper';
            }else if(row.fileType == 'kb'){//线装
                url = '/editAncient';
            }else if(row.fileType == 'sp'){//视频
                url = '/editVideo';
            }else if(row.fileType == 'yp'){//音频
                url = '/editAudio';
            }else if(row.fileType == 'tp'){//图片
                url = '/editImg';
            }else if(row.fileType == 'yt'){//舆图
                url = '/editYutu';
            }else{

            };
            let query = {
                fileType : row.fileType,
                fileCode : row.fileCode,
                type : 'totalLib'
            };
            this.$router.push({
                path : url,
                query : query
            });
        },
        onExport(){
            // 导出
            const self = this;

            if(!this.examedForm.orgCode && this.isProfessor){
                this.$message({
                    message: '请选择机构',
                    type: 'warning'
                });
            }else{
                let orgCode = '';
                // 所属机构处理
                if(this.isProfessor){
                    orgCode = this.examedForm.orgCode;
                }else{
                    orgCode = this.belongOrg;
                };
                window.open(`/literature/exportBookInfoByOrg?titleName=${self.examedForm.titleName}&orgCode=${orgCode}&fileType=${self.totalSearchForm.fileType}`);
            };
        }
    }
}
</script>
