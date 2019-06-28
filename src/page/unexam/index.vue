<template>
  <div class="unexam">
        <div class="header breadcrumb-wrapper">
            <h3 class="title">通行证审批</h3>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>首页</el-breadcrumb-item>
                <el-breadcrumb-item>通行证审批</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="main">
            <div class="conditions">
                <el-form :inline="true" :model="exportForm" class="demo-form-inline" empty-text="暂无数据" :rules='exportFormRule' ref='exportForm'>
                    <el-form-item label="车牌号码:" prop='plateNumber'>
                        <el-input v-model="exportForm.plateNumber" placeholder="车牌号码" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="手机号:" prop='phone'>
                        <el-input v-model="exportForm.phone" placeholder="手机号" clearable></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="通行证状态">
                        <el-select v-model="formInline.state" placeholder="未审批">
                            <el-option label="未审批" value="APPLYING"></el-option>
                            <el-option label="已审批" value="FINISHED"></el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                        <el-button  class='el-button-reset' @click="onCancel">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="resultList">
                <el-table
                    :data="permitsList"
                    @sort-change="orderList"
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
                        label="出发地"
                        min-width="100">
                        <template slot-scope="scope">
                            <p v-if='scope.row.from' >{{scope.row.from}}</p>
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
                        label="途经路线"
                        min-width="140">
                        <template slot-scope="scope">
                            <p v-if='scope.row.route'>{{scope.row.route}}</p>
                            <p v-else>--</p>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="运输物品"
                        min-width="90">
                        <template slot-scope="scope">
                            <p v-if='scope.row.goods'>{{scope.row.goods}}</p>
                            <p v-else>--</p>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="车辆所有人"
                        min-width="85">
                        <template slot-scope="scope">
                            <p v-if='scope.row.owner'>{{scope.row.owner}}</p>
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
                        label="途经时间起"
                        prop="start_time"
                        sortable="custom"
                        min-width="105">
                        <template slot-scope="scope">
                            <p v-if='scope.row.start_time'>{{scope.row.start_time | date-format}}</p>
                            <p v-else>--</p>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="途经时间止"
                        prop="end_time"
                        sortable="custom"
                        min-width="105">
                        <template slot-scope="scope">
                            <p v-if='scope.row.end_time'>{{scope.row.end_time | date-format}}</p>
                            <p v-else>--</p>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="申请时间"
                        prop="create_time"
                        sortable="custom"
                        min-width="105">
                        <template slot-scope="scope">
                            <p v-if='scope.row.create_time'>{{scope.row.create_time | date-format}}</p>
                            <p v-else>--</p>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        min-width='70'
                        fixed="right"
                        v-if="isApproval">
                        <template slot-scope="scope">
                            <router-link :to='{path:"/details",query:{id:scope.row.id,state:"APPLYING",breadcrumbitem:"通行证审批"}}'
                            class="table-action mr10"><i class="iconfont icontonghangzhengshenpi" title="审批" style="font-size:18px;"></i></router-link>
                            <!-- <el-button type="text" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
                            <a href="javascript:void(0);" v-if="isDelete" @click="handleDelete(scope.$index, scope.row)"><i class="el-icon-delete" title="删除" style="font-size:16px;"></i></a>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="paging-wrapper" v-if='permitsListLength !== 0'>
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page"
                :page-sizes="[10, 20, 50]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
                </el-pagination>
            </div>
        </div>
  </div>
</template>

<script>
import Api  from '../../api/index.js';
import { mapState } from "vuex";
export default {
  name: "unexam",
  components: {},
  data() {
    return {
        page: 1,
        pageSize: 10,
        state: "APPLYING",
        plate_number: "",
        value: "",
        order_by:"",
        sort: 1,
        // formInline: {
        //   number: '',
        //   state: ''
        // },
        exportForm: {
            plateNumber: '',
            phone: '',
        },
        exportFormRule:{
            plateNumber: [
                { required: false, message: '请输入车牌号码', trigger: 'blur' },
            ],
            phone: [
                { required: false, message: '请输入手机号', trigger: 'blur' },
            ]
        },
        isApproval: true,
        isDelete: false,
        loading : false,
    };
  },
  props: {},
  methods: {
        getListData(){
            this.$store.dispatch("fetchPermitsList", {
                page: this.page,
                size: this.pageSize,
                state: "APPLYING",
                plate_number: this.exportForm.plateNumber,
                phone: this.exportForm.phone,
                order_by: this.order_by,
                sort: this.sort,
            });
        },
        onSubmit(){
            this.getListData();
        },
        handleSizeChange(value){
            // pageSize变化
            this.pageSize = value;
            this.getListData();
        },
        handleCurrentChange(value){
            // page变化
            this.page = value;
            this.getListData();
        },
        onCancel(){
            // 重置：
            this.$refs['exportForm'].resetFields();
            this.order_by="";
            this.sort= 1;
            this.getListData();
        },
        //删除通行证
        handleDelete(index,row){
            let self = this;
            let id = self.permitsList[index].id;
            // 点击删除确定
            this.$confirm('是否删除该通行证?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                self.loading = true;
                Api.deletePermits(id).then((response) =>{    
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
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        //排序
        orderList(column){
            this.order_by = column.prop;
            if (column.order === 'ascending') {
                this.sort = 0;
            } else {
                this.sort = 1;
            }
            this.getListData();
        }
  },
  computed: {
        ...mapState({
            //通行证列表
            permitsList: store => {
                return store.managementPermits.permitsList.permits;
            },
            total: store => {
                return store.managementPermits.permitsList.total;
            },
            authorities: store => {
                return store.authorities;
            },
        }),
        permitsListLength(){
            if(this.permitsList){
                return this.permitsList.length;
            }
        },
  },
  beforeCreate() {},
  created() {},
  updated() {},
  beforeUpdate() {},
  beforeMount() {},
  mounted() {
        // let params = {
        //     "page": this.page,
        //     "size": this.size,
        //     "state": "APPLYING",
        //     "plate_number": this.formInline.number,
        // }
        // Api.managementPermits(params)
        // .then((response) =>{
        //     if(response && response.status === 200){
        //         console.log(response)
        //         this.tableData = response.permits;
        //     }else{

        //     }            
        // })
        // .catch(function (error) {
        // });
        this.getListData();
        // 判断是否有通行政审批权限
		let  authList = this.$store.state.authorities;
		if(authList.length == 1 && authList.indexOf('PERMIT_LIST') > -1){
			this.isApproval = false;
        }
        if(authList.indexOf('PERMIT_LIST') > -1 && authList.indexOf('PERMIT_AGREE') > -1 && authList.indexOf('PERMIT_REFUSE') > -1 && authList.indexOf('PERMIT_DELETE') > -1){
			this.isDelete = true;
        }
  },
  destroyed() {},
  beforeDestroy() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
.main{
    padding: 15px;
}
.header .title{
    float: left;
    font-size: 18px;
    font-weight: normal;
}
.el-breadcrumb{
    float: right;
}
.demo-input-suffix{
    display: inline-block;
    margin:0 10px 10px 0; 
    font-weight: normal;
}
.demo-input-suffix .el-input{
    width:180px;
}
.paging-wrapper{
    padding-top: 15px;
    text-align: right;
}
.mr10{
    margin-right: 10px;
}
a:hover{text-decoration: none;}
</style>