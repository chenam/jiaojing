<template>
  <div class="details">
        <div class="header breadcrumb-wrapper">
            <h3 class="title">查看详情</h3>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>首页</el-breadcrumb-item>
                <el-breadcrumb-item>{{ breadcrumbitem }}</el-breadcrumb-item>
                <el-breadcrumb-item>{{ breadcrumbitem == '通行证审批'?'审批':'查看详情' }}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="main">
            <el-row v-loading="loading">
                <el-col :span=" state == 'APPLYING'?16:24">
                    <div class="grid-content bg-purple">
                        <div class="grid-header">
                            <h3 class="title">通行证申请详情</h3>
                        </div>
                        <div class="grid-body">
                            <div class="detailsList">
                                <table class="el-table el-table--border">
                                    <tr v-if="state == 'FINISHED'">
                                        <th width="30%"><div class="cell">审批意见</div></th>
                                        <td><div class="cell">{{ approvalState(tableData.state) }}</div></td>
                                    </tr>
                                    <tr v-if="state == 'FINISHED'">
                                        <th width="30%"><div class="cell">审批备注</div></th>
                                        <td><div class="cell">{{ tableData.approval_opinion }}</div></td>
                                    </tr>
                                    <tr v-if="state == 'FINISHED'">
                                        <th width="30%"><div class="cell">通行证编号</div></th>
                                        <td><div class="cell">{{ tableData.permit_number }}</div></td>
                                    </tr>
                                    <tr>
                                        <th width="30%"><div class="cell">手机号</div></th>
                                        <td><div class="cell">{{ tableData.phone }}</div></td>
                                    </tr>
                                    <tr>
                                        <th width="30%"><div class="cell">出发地</div></th>
                                        <td><div class="cell">{{ tableData.from }}</div></td>
                                    </tr>
                                    <tr>
                                        <th width="30%"><div class="cell">目的地</div></th>
                                        <td><div class="cell">{{ tableData.arrivals }}</div></td>
                                    </tr>
                                     <tr>
                                        <th width="30%"><div class="cell">路线</div></th>
                                        <td><div class="cell">{{ tableData.route }}</div></td>
                                    </tr>
                                    <tr>
                                        <th width="30%"><div class="cell">运输物品</div></th>
                                        <td><div class="cell">{{ tableData.goods }}</div></td>
                                    </tr>
                                    <tr>
                                        <th width="30%"><div class="cell">车辆所有人</div></th>
                                        <td><div class="cell">{{ tableData.owner }}</div></td>
                                    </tr>
                                    <tr>
                                        <th width="30%"><div class="cell">车牌颜色</div></th>
                                        <td><div class="cell">{{ vehicleType(tableData.vehicle_type) }}</div></td>
                                    </tr>
                                    <tr>
                                        <th width="30%"><div class="cell">车牌号码</div></th>
                                        <td><div class="cell">{{ tableData.plate_number }}</div></td>
                                    </tr>
                                    <tr>
                                        <th width="30%"><div class="cell">驾驶人驾驶证号</div></th>
                                        <td><div class="cell">{{ tableData.driving_license }}</div></td>
                                    </tr>
                                    <tr>
                                        <th width="30%"><div class="cell">途经时间起</div></th>
                                        <td><div class="cell">{{ tableData.start_time | date-format }}</div></td>
                                    </tr>
                                    <tr>
                                        <th width="30%"><div class="cell">途经时间止</div></th>
                                        <td><div class="cell">{{ tableData.end_time | date-format }}</div></td>
                                    </tr>
                                    <tr>
                                        <th width="30%"><div class="cell">申请时间</div></th>
                                        <td><div class="cell">{{ tableData.create_time | date-format }}</div></td>
                                    </tr>
                                    <tr v-if="tableData.approve_time">
                                        <th width="30%"><div class="cell">批复时间</div></th>
                                        <td><div class="cell">{{ tableData.approve_time | date-format }}</div></td>
                                    </tr>
                                    <tr>
                                        <th width="30%"><div class="cell">车辆左前方现状图</div></th>
                                        <td><div class="cell"><img :src="`${baseUrl}`+ tableData.photo_car_path1"></div></td>
                                    </tr>
                                    <tr>
                                        <th width="30%"><div class="cell">行驶证正面</div></th>
                                        <td><div class="cell"><img :src="`${baseUrl}`+ tableData.photo_vehicle_license_path1"></div></td>
                                    </tr>
                                    <tr>
                                        <th width="30%"><div class="cell">行驶证反面</div></th>
                                        <td><div class="cell"><img :src="`${baseUrl}`+ tableData.photo_vehicle_license_path2"></div></td>
                                    </tr>
                                    <tr>
                                        <th width="30%"><div class="cell">车辆尾部照片</div></th>
                                        <td><div class="cell"><img :src="`${baseUrl}`+ tableData.photo_car_path2"></div></td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="7" style="float:right;width:31.66667%;" v-if="state == 'APPLYING'">
                    <div class="grid-content bg-purple-light">
                        <div class="grid-header">
                            <h3 class="title">处理通行证申请</h3>
                        </div>
                        <div class="grid-body">
                            <div class="detailsForm">
                                <el-form ref="form" :model="form" label-width="100px">
                                   <el-form-item label="审批状态">
                                        <el-select v-model="form.state" placeholder="未处理">
                                            <el-option label="未处理" value=""></el-option>
                                            <el-option label="通过" value="ACCEPTED"></el-option>
                                            <el-option label="未通过" value="REFUSED"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="审批备注">
                                        <el-select v-model="form.remarks" placeholder="无">
                                            <el-option 
                                                v-for="(item, index) in options" 
                                                :key="index" 
                                                :label="item.content" 
                                                :value="item.content">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="途经时间起">
                                        <el-date-picker
                                            v-model="form.start_time"
                                            type="datetime"
                                            placeholder="选择日期时间">
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="途经时间止">
                                        <el-date-picker
                                            v-model="form.end_time"
                                            type="datetime"
                                            placeholder="选择日期时间">
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="允许进入关口">
                                        <el-select v-model="form.gates" multiple placeholder="">
                                            <el-option 
                                                v-for="(item, index) in gateNames" 
                                                :key="index" 
                                                :label="item" 
                                                :value="item">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="高峰时间">
                                        <el-select v-model="form.peak_time" placeholder="夏季">
                                            <el-option label="无" value=""></el-option>
                                            <el-option label="夏季" value="7:00-8:30,11:30-12:30,18:00-20:00"></el-option>
                                            <el-option label="冬季" value="7:00-8:30,11:30-12:30,17:30-19:30"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="限制时间">
                                        <el-input v-model="form.limit_time" placeholder="请输入自定义时间段" clearable></el-input>
                                    </el-form-item>
                                    <el-form-item label="途径路线">
                                        <el-input type="textarea" v-model="form.desc"></el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button type="primary" @click="onSubmit">确定</el-button>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
  </div>
</template>

<script>
import Api  from '../../api/index.js';
import { mapState } from "vuex";
export default {
    name: "details",
    components: {},
    data() {
        return {
            tableData: [],
            form: {
                state: '',
                remarks: '无',
                start_time: '',
                end_time: '',
                desc: '',
                peak_time:'7:00-8:30,11:30-12:30,18:00-20:00',
                gates:'',
                limit_time:'',
            },
            options: [],
            urls:[],
            state:'',
            baseUrl: process.env.API_URL ? process.env.API_URL : '',
            breadcrumbitem:'通行证审批',
            loading: true,
            gateNames:[],
        };
    },
    props: {

    },
    methods: {
        onSubmit(){
            let params = {
                state: this.form.state,
                route: this.form.desc,
                approval_opinion: this.form.remarks,
                start_time: new Date(this.form.start_time).valueOf(),
                end_time: new Date(this.form.end_time).valueOf(),
                gate: this.form.gates,
                peak_time: this.form.peak_time,
                limit_time: this.limit_time,
            }
            if(this.form.state !== ""){
                debugger
                Api.approvalPermits(params,this.$route.query.id)
                .then((response) =>{
                    if(response && response.status === 200){
                        this.$router.push({path: "/unexam"});
                    }else{

                    }            
                })
                .catch(function (error) {
                });
            }else{
                this.$router.push({path: "/unexam"});
            }
        },
        imgUrl(url){
            if(url){
                Api.photoPath({path: url})
                .then((response) =>{
                    if(response && response.status === 200){
                        //return  response.request.responseURL;
                        this.urls.push(response.request.responseURL);
                    }else{

                    }            
                })
                .catch(function (error) {
                });
            }
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
        //车牌颜色合集
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
        }
    },
    computed: {
        // ...mapState({
        //     permitsList: store => {
        //         return store.managementPermits.permitsList.permits;
        //     },
        // }),
    },
    beforeCreate() {},
    created() {
        this.state = this.$route.query.state;
        this.breadcrumbitem = this.$route.query.breadcrumbitem;
        if(this.state == "APPLYING" && localStorage.getItem('uid') == null){
            this.$router.push({path: "/login"});
        }
    },
    updated() {},
    beforeUpdate() {},
    beforeMount() {},
    mounted() {
        let params = {};
        Api.opinions(params)
        .then((response) =>{
            if(response && response.status === 200){
                this.options = response.data;
            }else{

            }            
        })
        .catch(function (error) {
        });
        Api.gateNames(params)
        .then((response) =>{
            if(response && response.status === 200){
                this.gateNames = response.data;
            }else{

            }            
        })
        .catch(function (error) {
        });
        //查看通行证详情
        // this.$store.dispatch("fetchPermitsList", {
        //     id: this.$route.query.id,
        // });
        Api.lookPermits(this.$route.query.id)
        .then((response) =>{
            if(response && response.status === 200){
                this.tableData = response.data;
                this.form.start_time = this.tableData.start_time;
                this.form.end_time = this.tableData.end_time;
                this.form.desc = this.tableData.route;
                this.loading = false;
                // this.imgUrl(this.tableData.photo_car_path1);
                // this.imgUrl(this.tableData.photo_vehicle_license_path1);
                // this.imgUrl(this.tableData.photo_vehicle_license_path2);
                // this.imgUrl(this.tableData.photo_car_path2);
            }else{

            }            
        })
        .catch(function (error) {
        });
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
.el-col{
    background: #f5f5f5;
}
.grid-header{
    border-top: 3px rgba(84, 92, 100,0.5) solid;
}
.grid-header .title{
    line-height: 40px;
    font-size: 16px;
    font-weight: normal;
    padding: 0 10px;
}
.grid-body{
    padding: 0 10px 10px;
}
.el-table td img{
    max-width: 100%;
}
</style>
