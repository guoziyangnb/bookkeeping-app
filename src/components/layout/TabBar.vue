<template>
	<div class="floating-tabbar">
		<div class="tabbar-container">
			<button
				v-for="item in tabs"
				:key="item.name"
				class="tabbar-item"
				:class="{ active: uiStore.currentTab === item.name }"
				@click="handleTabClick(item.name)">
				<div class="tabbar-icon">
					<svg v-html="item.icon"></svg>
				</div>
				<!-- <div class="tabbar-label">{{ item.label }}</div> -->
			</button>

			<button class="tabbar-add-btn" @click="handleAddClick">
				<svg viewBox="0 0 24 24">
					<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
				</svg>
			</button>

			<button
				v-for="item in tabsRight"
				:key="item.name"
				class="tabbar-item"
				:class="{ active: uiStore.currentTab === item.name }"
				@click="handleTabClick(item.name)">
				<div class="tabbar-icon">
					<svg v-html="item.icon"></svg>
				</div>
				<!-- <div class="tabbar-label">{{ item.label }}</div> -->
			</button>
		</div>
	</div>
</template>

<script setup>
import { watch } from 'vue'
import { useUIStore } from '@/stores/ui'
import { useRouter, useRoute } from 'vue-router'

const uiStore = useUIStore()
const router = useRouter()
const route = useRoute()

// 监听路由变化，自动同步 currentTab
watch(
	() => route.name,
	(newRouteName) => {
		if (newRouteName && ['home', 'calendar', 'stats', 'settings'].includes(newRouteName)) {
			uiStore.setCurrentTab(newRouteName)
		}
	},
	{ immediate: true } // 立即执行一次，确保初始状态正确
)

const tabs = [
	{
		name: 'home',
		label: '首页',
		icon: '<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>'
	},
	{
		name: 'calendar',
		label: '日历',
		icon: '<path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>'
	}
]

const tabsRight = [
	{
		name: 'stats',
		label: '统计',
		icon: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>'
	},
	{
		name: 'settings',
		label: '设置',
		icon: '<path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>'
	}
]

function handleTabClick(name) {
	uiStore.setCurrentTab(name)
	router.push({ name })
}

function handleAddClick() {
	uiStore.openModal('expense')
}
</script>
