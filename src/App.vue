<template>
	<div id="app" :class="{ 'dark-theme': uiStore.isDark }">
		<!-- 背景装饰圆 -->
		<div class="bg-decoration bg-decoration-1"></div>
		<div class="bg-decoration bg-decoration-2"></div>
		<div class="bg-decoration bg-decoration-3"></div>

		<router-view></router-view>
		<TabBar />
		<AddRecordModal />
	</div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useUIStore } from '@/stores/ui'
import { useRecordsStore } from '@/stores/records'
import TabBar from '@/components/layout/TabBar.vue'
import AddRecordModal from '@/components/features/AddRecordModal.vue'

const uiStore = useUIStore()
const recordsStore = useRecordsStore()

onMounted(() => {
	// 初始化主题
	uiStore.initTheme()

	// 如果没有数据，添加示例数据
	// （数据已经在 store 初始化时自动从 localStorage 加载）
	if (recordsStore.records.length === 0) {
		addSampleData()
	}
})

function addSampleData() {
	const sampleRecords = [
		{
			type: 'income',
			amount: 8500,
			category: '工资',
			note: '12月工资',
			date: new Date().toISOString()
		},
		{
			type: 'expense',
			amount: 35.5,
			category: '餐饮',
			note: '午餐',
			date: new Date().toISOString()
		},
		{
			type: 'expense',
			amount: 8.0,
			category: '交通',
			note: '地铁',
			date: new Date().toISOString()
		},
		{
			type: 'expense',
			amount: 299.0,
			category: '购物',
			note: '日用品',
			date: new Date(Date.now() - 86400000).toISOString()
		}
	]

	sampleRecords.forEach(record => {
		recordsStore.addRecord(record)
	})
}
</script>

<style scoped>
#app {
	position: relative;
	z-index: 1;
}
</style>
