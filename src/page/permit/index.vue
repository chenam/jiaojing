<template>
  <div class="permit">
        <div class="main">
            <el-row v-loading="loading">
                <el-col :span="24">
                    <div class="grid-content bg-purple">
                        <div class="grid-header">
                            <h3 class="title">电子通行证</h3>
                        </div>
                        <div class="grid-body">
                            <div class="permitList">
                                <table class="el-table el-table--border">
                                    <tr>
                                        <th width="30%"><div class="cell">通行证编号</div></th>
                                        <td><div class="cell">{{ tableData.permit_number }}</div></td>
                                    </tr>
                                    <tr>
                                        <th><div class="cell">车牌号码</div></th>
                                        <td><div class="cell">{{ tableData.plate_number }}</div></td>
                                    </tr>
                                    <tr>
                                        <th><div class="cell">车牌类型</div></th>
                                        <td><div class="cell">{{ vehicleType(tableData.vehicle_type) }}</div></td>
                                    </tr>
                                    <tr>
                                        <th><div class="cell">出发地</div></th>
                                        <td><div class="cell">{{ tableData.from }}</div></td>
                                    </tr>
                                    <tr>
                                        <th><div class="cell">目的地</div></th>
                                        <td><div class="cell">{{ tableData.arrivals }}</div></td>
                                    </tr>
                                    <tr>
                                        <th><div class="cell">途径路线</div></th>
                                        <td><div class="cell">{{ tableData.route }}</div></td>
                                    </tr>
                                    <tr>
                                        <th><div class="cell">运输物品</div></th>
                                        <td><div class="cell">{{ tableData.goods }}</div></td>
                                    </tr>
                                    <tr v-if="tableData.gate">
                                        <th><div class="cell">城市入口</div></th>
                                        <td><div class="cell">{{ tableData.gate }}</div></td>
                                    </tr>
                                    <tr>
                                        <th><div class="cell">途经时间起</div></th>
                                        <td><div class="cell">{{ tableData.start_time | date-format }}</div></td>
                                    </tr>
                                    <tr>
                                        <th><div class="cell">途经时间止</div></th>
                                        <td><div class="cell">{{ tableData.end_time | date-format }}</div></td>
                                    </tr>
                                    <tr v-if="tableData.peak_hour">
                                        <th><div class="cell">高峰时间</div></th>
                                        <td><div class="cell">{{ tableData.peak_hour }}</div></td>
                                    </tr>
                                    <tr v-if="tableData.limit_time">
                                        <th><div class="cell">限制时间</div></th>
                                        <td><div class="cell">{{ tableData.limit_time }}</div></td>
                                    </tr>
                                    <tr>
                                        <th><div class="cell">发证时间</div></th>
                                        <td><div class="cell">{{ tableData.approve_time | date-format }}</div></td>
                                    </tr>
                                    <tr>
                                        <th><div class="cell">发证单位</div></th>
                                        <td><div class="cell"><img :src="`${baseUrl}`+ tableData.seal_path"></div></td>
                                    </tr>
                                    <tr>
                                        <th><div class="cell">二维码</div></th>
                                        <td><div class="cell"><img :src="`${baseUrl}`+ tableData.qr_path"></div></td>
                                    </tr>
                                </table>
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
    name: "permit",
    components: {},
    data() {
        return {
            tableData: [],
            baseUrl: process.env.API_URL ? process.env.API_URL : '',
            loading: true,
        };
    },
    props: {

    },
    methods: {
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
        }
    },
    computed: {
        
    },
    beforeCreate() {},
    created() {},
    updated() {},
    beforeUpdate() {},
    beforeMount() {},
    mounted() {
        let params = {
            plate_number: this.$route.query.plate_number,
            permit_number: this.$route.query.permit_number,
            phone: this.$route.query.phone,
        }
        Api.permitsInfo(params,this.$route.query.id)
        .then((response) =>{
            if(response && response.status === 200){
                this.tableData = response.data;
                this.loading = false;
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
.permit{
    padding:0 8%;
}
.main{
    padding: 15px;
}
.el-col{
    background: #409EFF;
}
.el-table tr:nth-child(2n+1) th,.el-table tr:nth-child(2n+1) td{
    background: #fafafa;
}
.grid-header .title{
    line-height: 50px;
    font-size: 20px;
    font-weight: normal;
    padding: 0 10px;
    text-align: center;
    color: #fff;
}
.grid-body{
    padding: 0 10px 10px;
}
.permitList{
    padding: 10px;
    background: #fff;
}
@media (max-width: 768px){
    .main{
        padding: 10px;
    }
    .permit{
        padding: 0;
    }
}
.el-table td img{
    max-width: 100%;
}

</style>
