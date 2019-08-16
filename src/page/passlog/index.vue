<!-- 
    author:amin,
    desc:审批
 -->
<template>
    <div  v-loading="loading" element-loading-text="删除中">
        <div class="breadcrumb-wrapper header">
            <h3 class="title">查看开闸记录</h3>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>首页</el-breadcrumb-item>
                <el-breadcrumb-item>开闸记录</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="passlog">
             <el-form :inline="true" :model="passlogForm" class="demo-form-inline" empty-text="暂无数据" :rules='passlogFormRule' ref='passlogForm'>
                <el-form-item label="卡口:" prop='gate_name'>
                    <el-input v-model="passlogForm.gate_name" placeholder="请输入" clearable></el-input>
                </el-form-item>
                <el-form-item label="车牌号码：" prop='plateNumber'>
                    <el-input v-model="passlogForm.plateNumber" placeholder="请输入" clearable></el-input>
                </el-form-item>
                <el-form-item label="起始时间：" prop="start_time">
                    <el-date-picker
                        v-model="passlogForm.start_time"
                        type="datetime"
                        align='right'
                        placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间：" prop="end_time">
                    <el-date-picker
                        v-model="passlogForm.end_time"
                        type="datetime"
                        align='right'
                        placeholder="选择日期时间">
                    </el-date-picker>
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
                        label="开闸时间"
                        min-width="80">
                        <template slot-scope="scope">
                            <p v-if='scope.row.pass_time'>{{scope.row.pass_time | date-format}}</p>
                            <p v-else>--</p>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="路口名称"
                        width="100">
                        <template slot-scope="scope">
                            <p v-if='scope.row.gate_name' >{{scope.row.gate_name}}</p>
                            <p v-else>--</p>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="触发条件"
                        min-width="90">
                        <template slot-scope="scope">
                            <div>
                                <p v-if='scope.row.trigger_type'>{{scope.row.trigger_type}}</p>
                                <p v-else>--</p>
                            </div>
                        </template>
                    </el-table-column>
                  <el-table-column
                    label="操作人员"
                    min-width="90">
                    <template slot-scope="scope">
                      <div>
                        <p v-if='scope.row.manager'>{{scope.row.manager}}</p>
                        <p v-else>--</p>
                      </div>
                    </template>
                  </el-table-column>
                    <el-table-column
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
                        label="截图"
                        min-width="75">
                        <template slot-scope="scope">
                            <div>
                                <a :href="`${baseUrl}`+ scope.row.image_path"
                                    target="_blank"
                                    v-if="scope.row.image_path"
                                    class="table-action"><i class="iconfont iconjietu" title="点击查看图片" style="font-size:18px;"></i></a>
                                <p v-else>--</p>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="paging-wrapper" v-if='totalNum!==0'>
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
.passlog{
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
a:hover{text-decoration: none;}
</style>

<script>
import Api  from '../../api/index.js';
import Util from '../../util/util.js'
export default {
    created : function(){
        
    },
    mounted : function(){
        this.getListData();
    },
    // beforeRouteLeave : function(to, from, next){
        
    // },
    data(){
        return ({
            loading : false,
            passlogForm: {
                plateNumber: '',
                gate_name: '',
                start_time: '',
                end_time: '',
            },
            pageStart:1,
            pageSize:10,
            totalNum:0,
            tableData: [],
            passlogFormRule:{
                plateNumber: [
                    { required: false, message: '请输入车牌号码', trigger: 'blur' },
                ],
                gate_name: [
                    { required: false, message: '请输入卡口名称', trigger: 'blur' },
                ],
                start_time: [
                    //{ type: 'date', required: true, message: '请选择开始时间', trigger: 'change' }
                ],
                end_time: [
                    //{ type: 'date', required: true, message: '请选择结束时间', trigger: 'change' }
                ],
            },
            baseUrl: process.env.API_URL ? process.env.API_URL : '',
        })
    },
    methods : {
        getListData(){
            Api.passLog({
                page: this.pageStart,
                size: this.pageSize,
                gate_name: this.passlogForm.gate_name,
                plate_number: this.passlogForm.plateNumber,
                start_time: new Date(this.passlogForm.start_time).valueOf() || '',
                end_time: new Date(this.passlogForm.end_time).valueOf() || '',
            }).then((response) =>{
                    if(response && response.status === 200){
                        this.tableData = response.data.passLog;
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
        onSubmit (){
            this.pageStart = 1;
            this.getListData();
        },
        onCancel(){
            // 重置：
            this.$refs['passlogForm'].resetFields();
            this.getListData();
        },
    }
}
</script>
