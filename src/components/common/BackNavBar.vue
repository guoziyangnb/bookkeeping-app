<template>
	<div class="back-nav">
		<button class="nav-back-btn" @click="handleBack">
			<svg viewBox="0 0 24 24">
				<path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
			</svg>
		</button>
		<h1 class="nav-title">{{ title }}</h1>
		<div class="nav-spacer"></div>
	</div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
	title: {
		type: String,
		required: true
	},
	customBack: {
		type: Function,
		default: null
	}
})

const router = useRouter()

const handleBack = () => {
	if (props.customBack) {
		props.customBack()
	} else {
		router.back()
	}
}
</script>

<style scoped>
/* 导航栏 */
.back-nav {
	position: sticky;
	top: 0;
	z-index: 100;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 10px 12px;
	background: var(--bg-secondary);
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
}

.nav-back-btn {
	width: 40px;
	height: 40px;
	border-radius: var(--radius-full);
	background: var(--bg-glass);
	border: 1.5px solid var(--bg-glass-border);
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: all 0.3s ease;
}

.nav-back-btn:hover {
	background: var(--bg-glass-hover);
	transform: translateX(-2px);
}

.nav-back-btn svg {
	width: 20px;
	height: 20px;
	fill: var(--text-primary);
}

.nav-title {
	font-size: 18px;
	font-weight: 600;
	color: var(--text-primary);
}

.nav-spacer {
	width: 40px;
}
</style>
