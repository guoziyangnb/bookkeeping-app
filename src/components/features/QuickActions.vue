<template>
	<div
		ref="containerRef"
		class="quick-actions"
		@mousedown="handleMouseDown"
		@mouseleave="handleMouseLeave"
		@mouseup="handleMouseUp"
		@mousemove="handleMouseMove"
		@wheel="handleWheel">
		<div v-for="action in actions" :key="action.name" class="quick-action-item" @click="handleClick(action)">
			<div class="quick-action-icon">
				<svg viewBox="0 0 24 24" v-html="action.icon"></svg>
			</div>
			<div class="quick-action-label">{{ action.label }}</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['click'])
const containerRef = ref(null)

const actions = [
	{
		name: 'food',
		label: '餐饮',
		type: 'expense',
		category: '餐饮',
		icon: '<path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/>'
	},
	{
		name: 'transport',
		label: '交通',
		type: 'expense',
		category: '交通',
		icon: '<path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>'
	},
	{
		name: 'shopping',
		label: '购物',
		type: 'expense',
		category: '购物',
		icon: '<path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>'
	},
	{
		name: 'income',
		label: '收入',
		type: 'income',
		category: '工资',
		icon: '<path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>'
	},
	{
		name: 'entertainment',
		label: '娱乐',
		type: 'expense',
		category: '娱乐',
		icon: '<path d="M21 5.71v12.58c0 1.45-1.38 2.58-2.91 2.58H2.91C1.38 20.87 0 19.74 0 18.29V5.71C0 4.26 1.38 3.13 2.91 3.13h15.18C19.62 3.13 21 4.26 21 5.71zM12 17c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5z"/>'
	},
	{
		name: 'hospital',
		label: '医疗',
		type: 'expense',
		category: '医疗',
		icon: '<path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"/>'
	},
	{
		name: 'invest',
		label: '投资',
		type: 'income',
		category: '投资',
		icon: '<path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/>'
	},
	{
		name: 'gift',
		label: '礼金',
		type: 'income',
		category: '礼金',
		icon: '<path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>'
	},
	{
		name: 'other',
		label: '其他',
		type: 'both',
		category: '其他',
		icon: '<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>'
	}
]

// 鼠标拖拽滚动相关状态
const isDragging = ref(false)
const startX = ref(0)
const scrollLeft = ref(0)

function handleClick(action) {
	emit('click', action)
}

// 鼠标按下
function handleMouseDown(e) {
	isDragging.value = true
	startX.value = e.pageX - containerRef.value.offsetLeft
	scrollLeft.value = containerRef.value.scrollLeft
	containerRef.value.style.cursor = 'grabbing'
	containerRef.value.style.userSelect = 'none'
}

// 鼠标离开
function handleMouseLeave() {
	isDragging.value = false
	if (containerRef.value) {
		containerRef.value.style.cursor = 'grab'
		containerRef.value.style.userSelect = ''
	}
}

// 鼠标松开
function handleMouseUp() {
	isDragging.value = false
	if (containerRef.value) {
		containerRef.value.style.cursor = 'grab'
		containerRef.value.style.userSelect = ''
	}
}

// 鼠标移动
function handleMouseMove(e) {
	if (!isDragging.value) return
	e.preventDefault()
	const x = e.pageX - containerRef.value.offsetLeft
	const walk = (x - startX.value) * 2 // 滚动速度系数
	containerRef.value.scrollLeft = scrollLeft.value - walk
}

// 鼠标滚轮支持（将垂直滚动转换为横向滚动）
function handleWheel(e) {
	if (!containerRef.value) return

	// 检查是否可以横向滚动
	const canScrollLeft = containerRef.value.scrollLeft > 0
	const canScrollRight =
		containerRef.value.scrollLeft < containerRef.value.scrollWidth - containerRef.value.clientWidth

	// 如果可以横向滚动，则转换滚轮方向
	if (canScrollLeft || canScrollRight) {
		// 阻止默认的垂直滚动
		e.preventDefault()
		// 将垂直滚动转换为横向滚动
		containerRef.value.scrollLeft += e.deltaY
	}
}
</script>
