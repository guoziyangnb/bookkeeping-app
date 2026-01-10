import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
	{
		path: '/welcome',
		name: 'welcome',
		component: () => import('@/views/Welcome.vue'),
		meta: { title: '欢迎使用 阳阳记账', isSubPage: true }
	},
	{
		path: '/login',
		name: 'login',
		component: () => import('@/views/Auth.vue'),
		meta: { title: '登录', isSubPage: true }
	},
	{
		path: '/register',
		name: 'register',
		component: () => import('@/views/Auth.vue'),
		meta: { title: '注册', isSubPage: true }
	},
	{
		path: '/',
		name: 'home',
		component: () => import('@/views/Home.vue'),
		meta: { title: '我的钱包' }
	},
	{
		path: '/calendar',
		name: 'calendar',
		component: () => import('@/views/Calendar.vue'),
		meta: { title: '记账日历' }
	},
	{
		path: '/stats',
		name: 'stats',
		component: () => import('@/views/Stats.vue'),
		meta: { title: '财务统计' }
	},
	{
		path: '/settings',
		name: 'settings',
		component: () => import('@/views/Settings.vue'),
		meta: { title: '设置' }
	},
	{
		path: '/settings/profile',
		name: 'profile',
		component: () => import('@/views/Profile.vue'),
		meta: { title: '个人资料', isSubPage: true }
	},
	{
		path: '/settings/edit-field',
		name: 'editField',
		component: () => import('@/views/FieldEditPage.vue'),
		meta: { title: '编辑资料', isSubPage: true }
	},
	{
		path: '/settings/backup',
		name: 'backup',
		component: () => import('@/views/Backup.vue'),
		meta: { title: '数据备份', isSubPage: true }
	},
	{
		path: '/welcome/user-agreement',
		name: 'userAgreement',
		component: () => import('@/views/UserAgreement.vue'),
		meta: { title: '用户协议', isSubPage: true }
	},
	{
		path: '/welcome/privacy-policy',
		name: 'privacyPolicy',
		component: () => import('@/views/PrivacyPolicy.vue'),
		meta: { title: '隐私政策', isSubPage: true }
	}
]

const router = createRouter({
	history: createWebHashHistory(),
	routes,
	scrollBehavior(to, from, savedPosition) {
		// 每次路由切换时滚动到顶部
		return { top: 0, behavior: 'smooth' }
	}
})

export default router
