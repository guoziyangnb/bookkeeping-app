<template>
	<div id="app" :class="{ 'dark-theme': uiStore.isDark, 'hide-tabbar': isSubPage }">
		<!-- 背景装饰圆 -->
		<div class="bg-decoration bg-decoration-1"></div>
		<div class="bg-decoration bg-decoration-2"></div>
		<div class="bg-decoration bg-decoration-3"></div>

		<router-view></router-view>
		<TabBar v-if="!isSubPage" />
		<AddRecordModal />
		<!-- 全局 Toast 组件 -->
		<Toast :message="toastState.message" :type="toastState.type" :visible="toastState.visible" />
	</div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUIStore } from '@/stores/ui'
import { useRecordsStore } from '@/stores/records'
import { useUserStore } from '@/stores/user'
import TabBar from '@/components/layout/TabBar.vue'
import AddRecordModal from '@/components/features/AddRecordModal.vue'
import Toast from '@/components/common/Toast.vue'
import { useToast } from '@/utils/message'
import { getStorage } from '@/utils/storage'

const route = useRoute()
const router = useRouter()
const uiStore = useUIStore()
const recordsStore = useRecordsStore()
const userStore = useUserStore()
const { state: toastState } = useToast()

// 判断是否是子页面（不需要显示 TabBar 的页面）
const isSubPage = computed(() => {
	return route.meta?.isSubPage
})

onMounted(async () => {
	// 初始化主题
	uiStore.initTheme()

	// 初始化用户认证状态
	const user = await userStore.initializeAuth()
	const settings = getStorage('backupSettings', {})
	const isCloud = settings['cloudBackup']
	console.log('🚀 ~ isCloud:', isCloud)
	// 开启了云存储且本地没有用户数据，跳转到登录页
	if (!user && isCloud) {
		router.push('/welcome')
	}

	// 如果没有数据，添加示例数据
	// （数据已经在 store 初始化时自动从 localStorage 加载）
	// if (recordsStore.records.length === 0) {
	// 	addSampleData()
	// }
})

// 样本数据
// function addSampleData() {
// 	const sampleRecords = [
// 		{
// 			type: 'income',
// 			amount: 8500,
// 			category: '工资',
// 			note: '12月工资',
// 			date: new Date().toISOString()
// 		},
// 		{
// 			type: 'expense',
// 			amount: 35.5,
// 			category: '餐饮',
// 			note: '午餐',
// 			date: new Date().toISOString()
// 		},
// 		{
// 			type: 'expense',
// 			amount: 8.0,
// 			category: '交通',
// 			note: '地铁',
// 			date: new Date().toISOString()
// 		},
// 		{
// 			type: 'expense',
// 			amount: 299.0,
// 			category: '购物',
// 			note: '日用品',
// 			date: new Date(Date.now() - 86400000).toISOString()
// 		}
// 	]

// 	sampleRecords.forEach(record => {
// 		recordsStore.addRecord(record)
// 	})
// }
</script>

<style scoped>
#app {
	min-height: 100vh;
	min-width: 375px;
	width: 100%;
	padding-bottom: 120px;
	position: relative;
	z-index: 1;
}
</style>

<style>
/* 子页面隐藏底部 TabBar 时的样式调整 - 需要非 scoped 才能覆盖全局样式 */
#app.hide-tabbar {
	padding-bottom: 0 !important;
}
</style>
