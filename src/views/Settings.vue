<template>
	<div class="page fade-in-up">
		<Header title="设置" />

		<div class="container">
			<!-- 主题设置 -->
			<div class="settings-group">
				<div class="settings-item">
					<div class="settings-item-left">
						<div class="settings-icon" :style="{ background: uiStore.isDark ? 'var(--accent-blue)' : 'var(--accent-orange)' }">
							<svg v-if="uiStore.isDark" viewBox="0 0 24 24">
								<path
									d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z" />
							</svg>
							<svg v-else viewBox="0 0 24 24">
								<path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z" />
							</svg>
						</div>
						<div class="settings-item-info">
							<div class="settings-item-title">明暗主题</div>
							<div class="settings-item-desc">{{ uiStore.isDark ? '深色模式' : '浅色模式' }}</div>
						</div>
					</div>
					<label class="theme-switch">
						<input type="checkbox" :checked="uiStore.isDark" @change="uiStore.toggleTheme" />
						<span class="slider"></span>
					</label>
				</div>
			</div>

			<!-- 其他设置 -->
			<div class="settings-group">
				<div class="settings-item" @click="goToProfile">
					<div class="settings-item-left">
						<div class="settings-icon" style="background: var(--accent-blue)">
							<svg viewBox="0 0 24 24">
								<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
							</svg>
						</div>
						<div class="settings-item-info">
							<div class="settings-item-title">个人资料</div>
							<div class="settings-item-desc">管理账户信息</div>
						</div>
					</div>
					<div class="settings-arrow">›</div>
				</div>

				<div class="settings-item" @click="goToCategory">
					<div class="settings-item-left">
						<div class="settings-icon" style="background: var(--accent-orange)">
							<svg viewBox="0 0 24 24">
								<path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
							</svg>
						</div>
						<div class="settings-item-info">
							<div class="settings-item-title">分类管理</div>
							<div class="settings-item-desc">自定义收支分类</div>
						</div>
					</div>
					<div class="settings-arrow">›</div>
				</div>

				<div class="settings-item">
					<div class="settings-item-left">
						<div class="settings-icon" style="background: var(--accent-green)">
							<svg viewBox="0 0 24 24">
								<path d="M19 12h-2v3h-3v2h5v-5zM7 9h3V7H5v5h2V9zm14-6H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z" />
							</svg>
						</div>
						<div class="settings-item-info">
							<div class="settings-item-title">数据备份</div>
							<div class="settings-item-desc">云端同步与恢复</div>
						</div>
					</div>
					<div class="settings-arrow">›</div>
				</div>
			</div>

			<div class="settings-group">
				<div class="settings-item" @click="goToAttenion">
					<div class="settings-item-left">
						<div class="settings-icon" style="background: var(--accent-purple)">
							<svg viewBox="0 0 24 24">
								<path
									d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
							</svg>
						</div>
						<div class="settings-item-info">
							<div class="settings-item-title">提醒设置</div>
							<div class="settings-item-desc">记账提醒和预算警告</div>
						</div>
					</div>
					<div class="settings-arrow">›</div>
				</div>
			</div>

			<!-- 清除数据 -->
			<div class="settings-group">
				<div class="settings-item" @click="handleClearData" style="cursor: pointer">
					<div class="settings-item-left">
						<div class="settings-icon" style="background: #ff4757">
							<svg viewBox="0 0 24 24">
								<path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
							</svg>
						</div>
						<div class="settings-item-info">
							<div class="settings-item-title">清除数据</div>
							<div class="settings-item-desc">删除所有记录（不可恢复）</div>
						</div>
					</div>
					<div class="settings-arrow">›</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUIStore } from '@/stores/ui'
import { useRecordsStore } from '@/stores/records'
import { clearStorage } from '@/utils/storage'
import Header from '@/components/layout/Header.vue'
import { message } from '@/utils/message'
import { showConfirmDialog } from 'vant'
import 'vant/lib/dialog/style'

const router = useRouter()
const uiStore = useUIStore()
const recordsStore = useRecordsStore()

const goToProfile = () => {
	router.push('/settings/profile')
}

const goToCategory = () => {
	message.warning('功能开发中，敬请期待~')
}

const goToAttenion = () => {
	message.warning('功能开发中，敬请期待~')
}

const handleClearData = () => {
	showConfirmDialog({
		title: '清除数据',
		message: '确定要清除所有数据吗？此操作不可恢复！',
		confirmButtonColor: '#ff8a5b',
		cancelButtonColor: '#8a8a8a'
	})
		.then(() => {
			clearStorage()
			recordsStore.records = []
			message.success('数据已清除')
		})
		.catch(e => {
			console.log('数据清除失败', e)
			// message.error('数据清除失败', e)
		})
}
</script>

<style scoped>
.settings-group {
	margin-bottom: 24px;
}

.theme-switch {
	position: relative;
	display: inline-block;
	width: 52px;
	height: 28px;
}

.theme-switch input {
	opacity: 0;
	width: 0;
	height: 0;
}

.slider {
	position: absolute;
	cursor: pointer;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: var(--bg-input);
	transition: var(--transition-normal);
	border-radius: 34px;
	border: 1px solid var(--bg-glass-border);
}

.slider:before {
	position: absolute;
	content: '';
	height: 20px;
	width: 20px;
	left: 3px;
	bottom: 3px;
	background-color: var(--text-secondary);
	transition: var(--transition-normal);
	border-radius: 50%;
}

input:checked + .slider {
	background-color: var(--accent-orange);
}

input:checked + .slider:before {
	transform: translateX(24px);
	background-color: white;
}
</style>
