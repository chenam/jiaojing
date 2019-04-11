<template>
  <div id="app">
	<template v-if="path === 'default'">
		<el-container>
            
			<!--  -->
			<el-container class="container-wrap">
                
				<div class="container-aside">
					<el-menu
						:default-active="$route.path"
						class="el-menu-vertical-demo"
						router
						unique-opened
						:default-openeds="openeds"
                        text-color="#fff"
						background-color="#545c64"
                        active-text-color="#409EFF"
                        :collapse = isCollapse
					>
                        <div  class="container-logo">
                            <!-- <img :src="logoImg" alt="安阳交警管理平台"> -->
                            <span v-show='!isCollapse'>安阳交警管理平台</span>
                            <span v-show='isCollapse'>交警</span>
                        </div>
						<template v-for="(item,index) in routesData" v-if="!item.hidden">
							<el-submenu :index="index+''" :key="index" v-if="item.isPull">
								<template slot="title"><i :class="item.iconCls + ' iconfont'"></i>{{item.name}}</template>
								<el-menu-item v-for="child in item.children" :index="item.path + '/' + child.path" v-if="!child.hidden"  :key="child.name">{{child.name}}</el-menu-item>
							</el-submenu>
							<el-menu-item
								:index="item.path + '/' + item.children[0].path"
								:key="index"
								v-if='!item.isPull && item.children && item.children.length > 0'
								:class="$route.path.split('/').indexOf(item.path.replace('/','')) > -1 ? 'is-active' : ''"
							>
                                <template>
                                    <span :class="item.icon + ' iconfont'"></span>
                                    <span slot="title">{{item.name}}</span>
                                </template>
							</el-menu-item>
							<el-menu-item
								:index="item.path"
								:key="index"
								v-if='(!item.isPull && !item.children) || (!item.isPull && item.children && item.children.length === 0)'
								:class="$route.path === item.path ? 'is-active' : ''"
							>
								<template>
                                    <i :class="item.icon + ' iconfont'"></i>
                                    <span slot="title">{{item.name}}</span>
                                </template>
							</el-menu-item>
						</template>
					</el-menu>
				</div>
				<el-main class="container-main">
                    <el-header class="app-header">
                       <i class="iconindent collapse-icon iconfont" @click="toggleMenu" v-show="isCollapse"></i>
                       <i class="iconoutdent collapse-icon iconfont" @click="toggleMenu" v-show="!isCollapse"></i>
					   <div class="user-wrapper">
						   <el-dropdown trigger="click" @command="command">
								<span class="el-dropdown-link">
									<img :src="logoImg" alt="安阳交警管理平台">
									<span>{{userName}}</span>
								</span>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item command="xgmm">修改密码</el-dropdown-item>
									<el-dropdown-item command="tc">退出</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						   
					   </div>
                    </el-header>
                    <div class="app-main">
                        <router-view/>
                    </div>
                    
                </el-main>
			</el-container>
		</el-container>
	</template>
	<!-- 登陆页面 -->
	<template v-else-if="path === 'login' || path === 'permit' || path === 'resetPassword'">
		<router-view/>
	</template>
	
  </div>
</template>


<script>
import '@/assets/icon/iconfont.css'
import logoImg from '@/assets/images/coin.png'
import localDb from './util/localDb.js'
export default {
    name: 'App',
    data () {
        return {
            // 默认打开的左侧菜单
			openeds: [],
            path: 'default',
            isCollapse: false,
			logoImg: logoImg,
			routesData: []
			// userName: ''
        }
	},
	computed: {
		userName () {
			return this.$store.state.userName
		}
	},
	created(){
		

	},
	updated : function(){
		/* 判断显示的组件 */
		let path = this.$route.path;
		if(path === '/login' || path === '/'){
			this.path = 'login';
		}else if(path === '/permit'){
			this.path = 'permit';
		}else if(path === '/resetPassword'){
            this.path = 'resetPassword';
        }else{
			this.path = 'default';
		}
	},
    mounted () {
		this.routesData = this.$router.options.routes;
		// 判断是否有管理员权限
		let  authList = this.$store.state.authorities;
		let isAdmin = false ;
		if(authList.indexOf('ADMIN') > -1){
			isAdmin = true;
		}
		// 管理员权限的有平台管理
		this.routesData.forEach(v => {
			if(isAdmin && v.path === '/user'){
				v.hidden = false;
			}
			if(isAdmin && v.path === '/gateControl'){
				v.hidden = false;
			}
		})

        const openeds = [];
        for (let i = 0; i < this.$router.options.routes.length; i++) {
            if (this.$route.path.indexOf(this.$router.options.routes[i].path) > -1) {
                openeds.push(i + '');
                break;
            };
            if (openeds.length > 0) {
                break;
            };
        };
        this.openeds = openeds;
        // console.log(this.$router);
    },
    methods: {
        toggleMenu(){
            this.isCollapse = !this.isCollapse;
        },
        // 菜单点击
        command(key){
            
            if(key === 'tc'){
                this.tc();
            }else if(key === 'xgmm'){
                this.xgmm()
            }
        },
        // 点击退出
        tc(){
            localDb.clear('3')
            this.$router.push({path: "/login"});
        },
        // 修改密码
        xgmm(){
            this.$router.push({path: "/resetPassword"});
        }
    }
}
</script>

<style lang='less' scoped>
@theme-color: #409EFF;
.collapse-icon{
	font-size: 18px;
    cursor: pointer;
    &:hover{
        color: @theme-color;
    }
}

// 
.container-main{
	max-height: 100vh;
	position: relative;
}
// 右侧头部
.app-header{
	position: absolute;
	left: 0px;
	top: 0px;
	right: 0px;
    line-height: 60px;
	box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
	.user-wrapper{
		position: absolute;
		right: 20px;
		top: 0px;
		line-height: 60px;
		img{
			display: inline-block;
			vertical-align: middle;
			width: 20px;
			position: relative;
			top: -2px;
		}
		span{
			display: inline-block;
			cursor: pointer;
		}
	}
	
}
// 右侧内容
.app-main{
	position: absolute;
	left: 0;
	right: 0;
	top: 60px;
	padding-top: 50px;
}
.el-main{
    padding : 0px;
}
.container-aside{
    color: #fff;
    font-size: 16px;
    
    img{
        display: inline-block;
        width: 20px;
        vertical-align: middle;
        position: relative;
        top: -4px;
        margin-right: 2px;
    }
    .container-logo{
        height: 60px;
        line-height: 60px;
        text-align: center;
    }
}
.el-menu-vertical-demo {
    .is-active{
        outline: 0;
        background-color: rgb(234, 247, 239);
    }
}
.el-menu-vertical-demo{
    height: 100vh;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    
}
</style>


