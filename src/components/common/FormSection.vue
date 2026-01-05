<template>
	<div class="form-section">
		<div class="form-label">{{ title }}</div>
		<div
			v-for="(item, index) in items"
			:key="item.field"
			class="form-card"
			:class="{
				clickable: item.clickable !== false,
				'first-card': index === 0,
				'last-card': index === items.length - 1
			}"
			@click="handleClick(item)">
			<svg class="form-icon" viewBox="0 0 24 24">
				<path :d="item.icon" />
			</svg>
			<span class="form-label-text">{{ item.label }}</span>
			<span class="form-value">{{ item.value || item.emptyText || '未设置' }}</span>
			<div v-if="item.clickable !== false" class="arrow-icon">›</div>
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	items: {
		type: Array,
		required: true,
		validator: items => {
			return items.every(item => item.icon && item.label && item.field !== undefined)
		}
	},
	title: {
		type: String,
		default: ''
	}
})

const emit = defineEmits(['click'])

const handleClick = item => {
	if (item.clickable !== false) {
		emit('click', item.field, item)
	}
}
</script>

<style scoped>
/* ==================== 表单区域 ==================== */
.form-section {
	margin-bottom: 32px;
	display: flex;
	flex-direction: column;
}

.form-label {
	font-size: 14px;
	line-height: 2;
	color: var(--text-secondary);
	padding: 0 16px;
}

.form-card {
	background: var(--bg-glass-border);
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	border-radius: 0;
	padding: 16px 20px;
	display: flex;
	align-items: center;
	gap: 12px;
	transition: all 0.3s ease;
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
	position: relative;
}

.form-card::after {
	content: '';
	position: absolute;
	bottom: 0;
	right: 0;
	width: calc(100% - 44px);
	border-bottom: 0.5px solid var(--van-gray-5);
}

.form-card:last-child::after {
	border-bottom: none;
}

.form-card.clickable {
	cursor: pointer;
	overflow: hidden;
}

.form-card.clickable:active {
	background: var(--bg-glass-hover);
}

.form-card.clickable:hover {
	background: var(--bg-glass-hover);
}

/* 第一个卡片：顶部圆角 */
.form-card.first-card {
	border-top-left-radius: var(--radius-md);
	border-top-right-radius: var(--radius-md);
}

/* 最后一个卡片：底部圆角 */
.form-card.last-card {
	border-bottom-left-radius: var(--radius-md);
	border-bottom-right-radius: var(--radius-md);
}

/* 图标 */
.form-icon {
	width: 20px;
	height: 20px;
	fill: var(--accent-orange);
	flex-shrink: 0;
}

/* 标签文本 */
.form-label-text {
	font-size: 15px;
	font-weight: 600;
	color: var(--text-primary);
	min-width: 80px;
	flex-shrink: 0;
}

/* 值 */
.form-value {
	font-size: 15px;
	font-weight: 500;
	color: var(--text-secondary);
	flex: 1;
	text-align: right;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

/* 箭头图标 */
.arrow-icon {
	font-size: 24px;
	color: var(--text-tertiary);
	font-weight: 300;
	transition: transform 0.3s ease;
	flex-shrink: 0;
	margin-left: 4px;
}

.form-card.clickable:hover .arrow-icon {
	transform: translateX(4px);
}

/* ==================== 响应式设计 ==================== */
@media (max-width: 480px) {
	.form-card {
		padding: 10px 16px;
	}

	.form-icon {
		width: 18px;
		height: 18px;
	}

	.form-label-text {
		font-size: 14px;
		min-width: 70px;
	}

	.form-value {
		font-size: 14px;
	}
}
</style>
