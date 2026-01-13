<template>
	<Teleport to="body">
		<Transition name="toast">
			<div v-if="visible" class="toast-container" :class="[`toast-${type}`]">
				<svg v-if="type === 'success'" class="toast-icon" viewBox="0 0 24 24">
					<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
				</svg>
				<svg v-else-if="type === 'error'" class="toast-icon" viewBox="0 0 24 24">
					<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
				</svg>
				<svg v-else-if="type === 'warning'" class="toast-icon" viewBox="0 0 24 24">
					<path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
				</svg>
				<span class="toast-message">{{ message }}</span>
			</div>
		</Transition>
	</Teleport>
</template>

<script setup>
defineProps({
	message: {
		type: String,
		required: true
	},
	type: {
		type: String,
		default: 'success',
		validator: value => ['success', 'warning', 'error'].includes(value)
	},
	visible: {
		type: Boolean,
		default: false
	}
})
</script>

<style scoped>
.toast-container {
	position: fixed;
	top: 80px;
	left: 20px;
	right: 20px;
	/* 桌面端最大800px，移动端自动填满左右20px的间距 */
	margin: 0 auto;
	max-width: 800px;
	padding: 14px 20px;
	border-radius: 16px;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10px;
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
	z-index: 9999;
	font-size: 15px;
	font-weight: 500;
	width: fit-content;
}

.toast-success {
	background: rgba(76, 175, 80, 0.9);
	color: white;
}

.toast-warning {
	background: rgba(255, 152, 0, 0.9);
	color: white;
}

.toast-error {
	background: rgba(244, 67, 54, 0.9);
	color: white;
}

.toast-icon {
	width: 20px;
	height: 20px;
	flex-shrink: 0;
	fill: currentColor;
}

.toast-message {
	/* 根据内容自适应宽度，不拉伸 */
	flex: 0 1 auto;
	/* 正常的换行行为，不要在单词中间断开 */
	word-break: normal;
	overflow-wrap: break-word;
}

/* 过渡动画 */
.toast-enter-active,
.toast-leave-active {
	transition: all 0.3s ease;
}

.toast-enter-from {
	opacity: 0;
	transform: translateY(-20px);
}

.toast-leave-to {
	opacity: 0;
	transform: translateY(-20px);
}

/* 移动端适配 */
@media (max-width: 768px) {
	.toast-container {
		padding: 12px 16px;
		font-size: 14px;
	}
}
</style>
