<template>
	<header class="header">
		<div>
			<div class="header-greeting">{{ greeting }}</div>
			<div class="header-title">{{ title }}</div>
		</div>
		<div class="header-avatar" v-if="showAvatar">
			<img :src="uiStore.userAvatar || defaultAvatar" alt="头像" />
		</div>
	</header>
</template>

<script setup>
import { computed } from 'vue'
import { useUIStore } from '@/stores/ui'

const uiStore = useUIStore()

// 默认头像
const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face'

const props = defineProps({
	title: {
		type: String,
		default: '我的钱包'
	},
	showAvatar: {
		type: Boolean,
		default: true
	}
})

const greeting = computed(() => {
	const hour = new Date().getHours()
	if (hour < 12) return '上午好'
	if (hour < 18) return '下午好'
	return '晚上好'
})
</script>
