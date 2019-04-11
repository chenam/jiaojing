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
                <el-col :span=" state == 'APPLYING'?16:24" :class="state == 'APPLYING' ? 'grid-left': '' ">
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
                                    <tr v-if='tableData.gate'>
                                        <th width="30%"><div class="cell">允许进入卡口</div></th>
                                        <td><div class="cell">{{ tableData.gate }}</div></td>
                                    </tr>
                                    <tr v-if='tableData.peak_hour'>
                                        <th width="30%"><div class="cell">高峰时间</div></th>
                                        <td><div class="cell">{{ tableData.peak_hour }}</div></td>
                                    </tr>
                                    <tr v-if='tableData.limit_time'>
                                        <th width="30%"><div class="cell">限制时间</div></th>
                                        <td><div class="cell">{{ tableData.limit_time }}</div></td>
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
                <el-col :span="7" style="float:right;width:400px;" v-if="state == 'APPLYING'">
                    <div class="grid-content bg-purple-light">
                        <div class="grid-header">
                            <h3 class="title">处理通行证申请</h3>
                        </div>
                        <div class="grid-body">
                            <div class="detailsForm">
                                <el-form ref="form" :model="form" label-width="100px"  :rules=formRule>
                                   <el-form-item label="审批状态" prop="state">
                                        <el-select v-model="form.state" placeholder="未处理" class="w220">
                                            <el-option label="未处理" value=""></el-option>
                                            <el-option label="通过" value="ACCEPTED"></el-option>
                                            <el-option label="未通过" value="REFUSED"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="审批备注" prop="remarks">
                                        <el-select v-model="form.remarks" placeholder="无"  class="w220">
                                            <el-option 
                                                v-for="(item, index) in options" 
                                                :key="index" 
                                                :label="item.content" 
                                                :value="item.content">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="途经时间起" prop="start_time">
                                        <el-date-picker
                                            class="w220"
                                            v-model="form.start_time"
                                            type="datetime"
                                            placeholder="选择日期时间">
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="途经时间止" prop="end_time">
                                        <el-date-picker
                                            class="w220"
                                            v-model="form.end_time"
                                            type="datetime"
                                            placeholder="选择日期时间">
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="允许进入卡口" prop="gates">
                                        <el-select 
                                            v-model="form.gates" 
                                            multiple 
                                            placeholder="请选择"
                                            clearable
                                            class="w220"
                                        >
                                            <el-option 
                                                v-for="(item, index) in gateNames" 
                                                :key="index" 
                                                :label="item" 
                                                :value="item">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="高峰时间">
                                        <el-select v-model="form.peak_time" placeholder="夏季"  class="w220">
                                            <el-option label="无" value=""></el-option>
                                            <el-option label="夏季（7:00-8:30,11:30-12:30,18:00-20:00）" value="7:00-8:30,11:30-12:30,18:00-20:00"></el-option>
                                            <el-option label="冬季（7:00-8:30,11:30-12:30,17:30-19:30）" value="7:00-8:30,11:30-12:30,17:30-19:30"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="限制时间">
                                        <!-- <el-input v-model="form.limit_time" placeholder="请输入自定义时间段" clearable></el-input> -->
                                        <template v-for="(item,index) in form.limit_time">
                                            <!-- <el-time-picker
                                                is-range
                                                :key="index + '1'"
                                                v-model="form.limit_time[index].value"
                                                range-separator="至"
                                                start-placeholder="开始时间"
                                                end-placeholder="结束时间"
                                                clearable
                                                class="detail-time-range w220"
                                                placeholder="选择时间范围"
                                                default-value= default_limit_time
                                                editable
                                            >
                                            </el-time-picker> -->
                                            <el-time-select
                                                :key="index + 'a'"
                                                placeholder="起始时间"
                                                v-model="form.limit_time[index].startTime"
                                                :picker-options="{
                                                start: '00:00',
                                                step: '00:15',
                                                end: '24:00'
                                                }"
                                                default-value=‘00:00’
                                                class="w110"
                                            >
                                            </el-time-select>
                                            <el-time-select
                                                :key="index + 'b'"
                                                placeholder="结束时间"
                                                v-model="form.limit_time[index].endTime"
                                                :picker-options="{
                                                start: '00:00',
                                                step: '00:15',
                                                end: '24:00',
                                                minTime: form.limit_time[index].startTime
                                                }"
                                                default-value=‘00:00’
                                                class="w110"
                                            >
                                            
                                            </el-time-select>
                                            <!-- <el-time-select
                                            :key="index + '1'"
                                            v-model="form.limit_time[index].value"
                                            :picker-options="{
                                                start: '08:30',
                                                step: '00:15',
                                                end: '18:30'
                                            }"
                                            placeholder="选择时间">
                                            </el-time-select> -->
                                            <span
                                                :key="index + '2'"
                                                class="el-icon-remove-outline delete-icon" 
                                                @click="deleteLimitTime(item, index)"
                                                v-if='form.limit_time.length > 1'
                                            ></span>
                                        </template>
                                        <div>
                                            <span
                                                class="el-icon-circle-plus-outline add-icon" 
                                                @click="addLimitTime"
                                            ></span>
                                        </div>
                                    </el-form-item>
                                    <el-form-item label="途径路线">
                                        <el-input type="textarea" v-model="form.desc" ></el-input>
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
import Util from '../../util/util.js'
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
                limit_time:[{
                    // value: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)]
                    startTime: '',
                    endTime: ''
                }],
                default_limit_time: [new Date(2019, 4, 1, 0, 0), new Date(2019, 4, 2, 1, 0)]
            },
            formRule: {
                state: [
                    // { required: true, message: '请输入活动名称', trigger: 'blur' },
                ],
                remarks: [
                    // { required: true, message: '请选择活动区域', trigger: 'change' }
                ],
                start_time: [
                    // { type: 'date', required: true, message: '请选择开始时间', trigger: 'change' }
                ],
                end_time: [
                    // { type: 'date', required: true, message: '请选择结束时间', trigger: 'change' }
                ],
                gates: [
                    // { required: true, message: '请选择允许进入关口', trigger: 'change' }
                ],
                
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
            
            
            if(this.form.state !== ""){
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        // console.log(this.form.limit_time,'ddd')
                        let _limit_time = [];
                        let isPass = true;
                        this.form.limit_time.forEach((val, ind) => {
                            if((val.startTime && !val.endTime) || (!val.startTime && val.endTime)){
                                this.$message({
                                    message: '请选择完整起止时间',
                                    type: 'warning'
                                });
                                isPass = false
                            }
                            if(val.startTime && val.endTime){
                                _limit_time.push(val.startTime + '-' + val.endTime);
                            }
                            
                        })
                        if(!isPass){
                            return;
                        }
                        
                        let params = {
                            state: this.form.state,
                            route: this.form.desc,
                            approval_opinion: this.form.remarks,
                            start_time: new Date(this.form.start_time).valueOf(),
                            end_time: new Date(this.form.end_time).valueOf(),
                            gate: this.form.gates.join(','),
                            peak_hour: this.form.peak_time,
                            limit_time: _limit_time.join(','),
                        }
                        // console.log(params,'params')
                        Api.approvalPermits(params,this.$route.query.id)
                        .then((response) =>{
                            if(response && response.status === 200){
                                this.$router.push({path: "/unexam"});
                            }else{

                            }            
                        })
                        .catch(function (error) {
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                
                
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
        // 添加限制时间
        addLimitTime(){
            this.form.limit_time.push({
                startTime: '',
                endTime: ''
            })
        },
        // 减少限制时间
        deleteLimitTime(item,index){
            this.form.limit_time.splice(index);
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
                this.form.gates = response.data;
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
                console.log(this.form,'ddd')
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

.grid-left{
    width: calc(~'100% - 400px');
}
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
.add-icon,.delete-icon{
    font-size: 18px;
    cursor: pointer;
    &:hover{
        color: #409EFF;
    }
}
</style>
<style lang='less'> 
.grid-body{
    div.w220{
        width: 240px!important;
    }
    div.w110{
        width: 118px!important;
        margin-bottom: 10px;
    }
}

.detail-time-range.el-input__inner{
        width: calc(~'100% - 40px');
        margin-bottom: 15px;
        .el-range-separator{
            width: 20px;
        }
}

</style>

