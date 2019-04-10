import Vue from 'vue'
import Router from 'vue-router'
import Unexam from '@/page/unexam'
import Examed from '@/page/examed'
import Export from '@/page/export'
import Login from '@/page/login'
import Detail from '@/page/details'
import Permit from '@/page/permit'
import User from '@/page/User'
import ResetPassword from '@/page/resetPassword'
import PassLog from '@/page/passlog'
import GateControl from '@/page/gateControl'

Vue.use(Router)

const router =  new Router({
	routes: [
		{
			path: '/',
			name: 'login',
			component: Login,
			hidden: true,
		},
		{
			path: '/login',
			name: 'login',
			component: Login,
			hidden: true,
		},
		{
			path: '/resetPassword',
			name: 'resetPassword',
			component: ResetPassword,
			hidden: true,
		},
		{
			path: '/unexam',
			name: '通行证审批',
			icon: 'iconshenpi',
			component: Unexam,
			meta: { 
				requireAuth: true,
			},
		},
		{
			path: '/examed',
			name: '审批日志',
			icon: 'iconshenpitongguo',
			component: Examed,
			meta: { 
				requireAuth: true,
			},
		},
		{
			path: '/user',
			name: '平台管理',
			icon: 'iconpingtai_pingtaiyonghu',
			component: User,
			hidden: true,
			meta: { 
				requireAuth: true,
			},
		},
		{
			path: '/passlog',
			name: '开闸记录',
			icon: 'icont',
			component: PassLog,
			hidden: true,
			meta: { 
				requireAuth: true,
			},
		},
		{
			path: '/gateControl',
			name: '卡口控制',
			icon: 'iconqiakou',
			component: GateControl,
			hidden: true,
			meta: { 
				requireAuth: true,
			},
		},
		{
			path: '/export',
			name: '导出日志',
			icon: 'icondaochu',
			component: Export,
			hidden: true,
			meta: {
				requireAuth: true
			}
		},
		{
			path: '/details',
			name: '查看审批详情',
			component: Detail,
			hidden: true,
			meta: {
				requireAuth: true
			}
		},
		{
			path: '/permit',
			name: '通行证',
			component: Permit,
			hidden: true,
			meta: {
				meta: { 
					requireAuth: true,
				}
			}
		}
	]
})

// 路由拦截
router.beforeEach((to, from, next) => {
	if (to.matched.some(res => res.meta.requireAuth )) {// 判断是否需要登录权限
		if (localStorage.getItem('TOKEN') || sessionStorage.getItem('TOKEN')) {// 判断是否登录

			next()

		} else {// 没登录则跳转到登录界面

			next({
				path: '/login',
				query: {redirect: to.fullPath}
			})
		}
	} else {
		next()
	}
})

export default router
