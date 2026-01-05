import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
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
		meta: { title: '个人资料' }
	},
	{
		path: '/settings/edit-field',
		name: 'editField',
		component: () => import('@/views/FieldEditPage.vue'),
		meta: { title: '编辑资料' }
	},
	{
		path: '/settings/backup',
		name: 'backup',
		component: () => import('@/views/Backup.vue'),
		meta: { title: '数据备份' }
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
