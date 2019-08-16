<!-- 
    author:amin,
    desc:审批
 -->
<template>
    <div  v-loading="loading" element-loading-text="关闭中">
        <div class="breadcrumb-wrapper header">
            <h3 class="title">卡口状态</h3>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>首页</el-breadcrumb-item>
                <el-breadcrumb-item>卡口控制</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="gateControl">
            <p class="form-notice red">注意：锁定状态，只可以通过手持终端机手动开闸，请谨慎操作。特殊情况解除后请及时打开。</p>
            <div>
                <el-table
                    :data="tableData"
                    style="width: 100%"
                    border
                >
                    <el-table-column
                        label="卡口名称">
                        <template slot-scope="scope">
                            <p  v-if='scope.row.group_name' >{{scope.row.group_name}}</p>
                            <p v-else>--</p>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="卡口状态">
                        <template slot-scope="scope">
                            <p 
                                :class="{green: scope.row.status == 'NORMAL', gray: scope.row.status == 'CLOSED', red: scope.row.status == 'FAULT',}"
                                v-if='scope.row.status'>
                                {{gateState(scope.row.status)}}
                            </p>
                            <p v-else>--</p>
                        </template>
                    </el-table-column>
                    <el-table-column 
                        label="操作"
                    >
                        <template slot-scope="scope">
                            
                            <a href="javascript:;" 
                                size="small"
                                v-if="scope.row.status != 'CLOSED'"
                                type="danger"
                                @click="handleClose(scope.$index, scope.row)" class="table-action mr10"><i class="iconfont iconclose" title="锁定" style="font-size:17px;"></i></a>
                            <a href="javascript:;"
                                size="small"
                                v-if="scope.row.status != 'NORMAL'"
                                @click="handleRecover(scope.$index, scope.row)" class="table-action"><i class="iconfont iconqidong" title="恢复" style="font-size:16px;"></i></a>
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
.gateControl{
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
.green{
    color: #62c400;
}
.gray{
    color: gray;
}
.red{
    color: red;
}
.form-notice{
    margin-bottom: 20px;
    font-weight: normal; 
    font-size: 14px;
}
a,a:hover{text-decoration: none;}
</style>

<script>
import Api  from '../../api/index.js';
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
            pageStart:1,
            pageSize:10,
            totalNum:0,
            tableData: [],
        })
    },
    methods : {
        getListData(){
            Api.gateStatus({
                page: this.pageStart,
                size: this.pageSize,
            }).then((response) =>{                    
                    if(response && response.status === 200){
                        this.tableData = response.data;
                        this.totalNum = response.data.length;
                    }
                })
                .catch(function (error) {
                    
                });
        },
        //卡口状态合集
        gateState(state) {
            switch (state) {
                case "NORMAL":
                return "正常";
                break;
                case "CLOSED":
                return "锁定";
                break;
                case "FAULT":
                return "离线";
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
        //恢复卡口
        handleRecover(index,row){
            let self = this;
            let gateNums = [];
            gateNums.push(self.tableData[index].gate_num);
            let param = {gate_nums: gateNums}
            Api.gateRecover(param).then((response) =>{    
                if(response && response.status === 200){
                    this.getListData();
                    // this.$message({
                    //     type: 'success',
                    //     message: '恢复成功'
                    // }); 
                }
            })
            .catch(function (error) {
                // this.$message({
                //     type: 'warning',
                //     message: '恢复失败'
                // }); 
            });
        },
        //关闭卡口
        handleClose(index,row){
           let self = this;
           let gateNums = [];
           gateNums.push(self.tableData[index].gate_num)
           let param = {gate_nums: gateNums}
            // 点击关闭确定
            this.$confirm('是否关闭该卡口?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                self.loading = true;
                Api.gateClose(param).then((response) =>{    
                    if(response && response.status === 200){
                        self.loading = false;
                        this.getListData();
                        // this.$message({
                        //     type: 'success',
                        //     message: '关闭成功'
                        // }); 
                    }else{
                        self.loading = false;
                        // this.$message({
                        //     type: 'warning',
                        //     message: '关闭失败'
                        // }); 
                    }
                })
                .catch(function (error) {
                    self.loading = false;
                    // this.$message({
                    //     type: 'warning',
                    //     message: '关闭失败'
                    // }); 
                });
            }).catch(() => {
                // this.$message({
                //     type: 'info',
                //     message: '已取消删除'
                // });          
            });
        },
    }
}
</script>
