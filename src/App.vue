<template>
	<div id="app" :class="{ 'dark-theme': uiStore.isDark, 'hide-tabbar': isSubPage }">
		<!-- 背景装饰圆 -->
		<div class="bg-decoration bg-decoration-1"></div>
		<div class="bg-decoration bg-decoration-2"></div>
		<div class="bg-decoration bg-decoration-3"></div>

		<router-view></router-view>
		<TabBar v-if="!isSubPage" />
		<AddRecordModal />
	</div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUIStore } from '@/stores/ui'
import { useUserStore } from '@/stores/user'
import TabBar from '@/components/layout/TabBar.vue'
import AddRecordModal from '@/components/features/AddRecordModal.vue'
// import { getStorage, setStorage } from '@/utils/storage'

const route = useRoute()
// const router = useRouter()
const uiStore = useUIStore()
const userStore = useUserStore()

// 判断是否是子页面（不需要显示 TabBar 的页面）
const isSubPage = computed(() => {
	return route.meta?.isSubPage
})

onMounted(async () => {
	// 初始化主题
	uiStore.initTheme()

	// 初始化用户认证状态
	await userStore.initializeAuth()
	// const backupSettings = {
	// 	localBackup: false, // 本地存储，默认打开
	// 	cloudBackup: true // 云端存储，默认关闭
	// }
	// setStorage('backupSettings', backupSettings)
	// const settings = getStorage('backupSettings', {})
	// const isCloud = settings['cloudBackup']
	// console.log('🚀 ~ isCloud:', isCloud)
	// 开启了云存储且本地没有用户数据，跳转到登录页
	// if (!user && isCloud) {
	// 	router.push('/welcome')
	// }
})
</script>

<style scoped>
#app {
	min-height: 100vh;
	width: 100%;
	padding-bottom: 120px;
	position: relative;
	z-index: 1;
	overflow-x: hidden;
}
</style>

<style>
/* 子页面隐藏底部 TabBar 时的样式调整 - 需要非 scoped 才能覆盖全局样式 */
#app.hide-tabbar {
	padding-bottom: 0 !important;
}
</style>
