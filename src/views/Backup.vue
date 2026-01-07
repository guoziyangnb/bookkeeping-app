<template>
	<div class="backup-page">
		<!-- 返回导航栏 -->
		<BackNavBar title="数据备份" />

		<div class="backup-container">
			<!-- 备份说明 -->
			<div class="backup-info">
				<div class="info-icon">
					<svg viewBox="0 0 24 24">
						<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
					</svg>
				</div>
				<p class="info-text">
					开启备份功能后，您的记账数据将自动保存到指定的存储位置，确保数据安全<br /><span style="color: red">
						<strong>*</strong> 推荐数据保存在<strong>云端</strong>，而不是本地，对手机占用空间小。如果担忧数据安全以及隐私，可以打开本地存储</span
					>
				</p>
			</div>
			<p class="info-text" style="color: red"></p>

			<!-- 备份设置 -->
			<FormSection title="备份设置" :items="backupItems" @switch-change="handleSwitchChange" />

			<!-- 备份操作 -->
			<div class="backup-actions">
				<van-button type="primary" block :loading="isBackingUp" :disabled="isRestoring" loading-text="备份中..." @click="handleBackup">
					<template #icon>
						<svg viewBox="0 0 24 24" class="btn-icon">
							<path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z" />
						</svg>
					</template>
					立即备份
				</van-button>
				<van-button type="default" block :loading="isRestoring" :disabled="isBackingUp" loading-text="恢复中..." @click="handleRestore">
					<template #icon>
						<svg viewBox="0 0 24 24" class="btn-icon">
							<path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z" />
						</svg>
					</template>
					恢复数据
				</van-button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import FormSection from '@/components/common/FormSection.vue'
import BackNavBar from '@/components/common/BackNavBar.vue'
import { message } from '@/utils/message'
import { getStorage, setStorage } from '@/utils/storage'
import { Button as VanButton } from 'vant'
import 'vant/lib/button/style'

// 备份设置数据
const backupSettings = reactive({
	localBackup: false, // 本地存储，默认打开
	cloudBackup: true // 云端存储，默认关闭
})

// Loading 状态
const isBackingUp = ref(false)
const isRestoring = ref(false)

// 表单项配置
const backupItems = computed(() => [
	{
		icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
		label: '本地存储',
		field: 'localBackup',
		switchable: true,
		switchValue: backupSettings.localBackup
	},
	{
		icon: 'M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4s1.79-4 4-4h.71C7.37 7.69 9.48 6 12 6c3.04 0 5.5 2.46 5.5 5.5v.5H19c1.66 0 3 1.34 3 3s-1.34 3-3 3z',
		label: '云端存储',
		field: 'cloudBackup',
		switchable: true,
		switchValue: backupSettings.cloudBackup
	}
])

// 处理开关变化
const handleSwitchChange = (field, newValue, item) => {
	// console.log('🚀 ~ handleSwitchChange ~ item:', item) //backupItems的元素
	// console.log('🚀 ~ handleSwitchChange ~ newValue:', newValue) //值是true还是false
	// console.log('🚀 ~ handleSwitchChange ~ field:', field) //值是localBackup还是cloudBackup
	backupSettings[field] = newValue
	console.log(`${item.label} ${newValue ? '已开启' : '已关闭'}`)

	/**
	 * ! 这个可以保存到 localStorage,保存按钮的状态
	 */
	const settings = getStorage('backupSettings', {})
	settings[field] = newValue
	setStorage('backupSettings', settings)

	// 显示提示
	if (newValue) {
		message.success(`${item.label}已开启`)
	} else {
		message.success(`${item.label}已关闭`)
	}

	// 如果关闭本地存储，提示用户
	// if (field === 'localBackup' && !newValue) {
	// 	message.warning('关闭本地存储可能导致数据丢失')
	// }
	if (field === 'localBackup' && !newValue) {
		message.warning('关闭本地存储新数据将不再存储在本地！', 3000)
	}

	// 如果关闭云端存储，提示用户
	if (field === 'cloudBackup' && !newValue) {
		message.warning('关闭云端存储本地数据会越来越大导致卡顿！', 3000)
	}
}

// 立即备份
const handleBackup = async () => {
	if (!backupSettings.localBackup && !backupSettings.cloudBackup) {
		message.warning('请先开启至少一种备份方式')
		return
	}

	isBackingUp.value = true

	try {
		// 模拟异步操作
		await new Promise(resolve => setTimeout(resolve, 1000))

		/**
		 * TODO 如果开了云端备份，则调用接口下载数据，并导出文件下载；如果只开了本地备份，则识别本地的localStorage数据并导出文件下载
		 */
		// 获取当前数据
		const records = getStorage('records', [])
		const userProfile = getStorage('userProfile', {})
		const users = getStorage('users', {})

		const backupData = {
			records: records,
			userProfile: userProfile,
			users: users,
			backupTime: new Date().toISOString()
		}

		// 本地备份
		if (backupSettings.localBackup) {
			setStorage('backupData', backupData)
			message.success('本地备份成功')
		}
		// 模拟异步操作
		await new Promise(resolve => setTimeout(resolve, 1000))

		// 云端备份（模拟）
		if (backupSettings.cloudBackup) {
			// TODO: 实现云端备份逻辑
			message.warning('云端备份功能开发中...')
		}
	} catch (error) {
		message.error('备份失败：' + error.message)
	} finally {
		isBackingUp.value = false
	}
}

// 恢复数据
/**
 * TODO: 恢复数据时，需要先判断本地是否有备份数据，如果没有，则提示用户没有备份数据，如果有；则弹出一个对话框，让用户确认是否恢复数据
 */
const handleRestore = async () => {
	if (!backupSettings.localBackup) {
		message.warning('恢复数据仅支持本地存储，请先开启')
		return
	}
	const backupData = getStorage('backupData', null)
	if (!backupData) {
		message.warning('本地没有找到备份数据')
		return
	}

	isRestoring.value = true

	try {
		// 模拟异步操作
		await new Promise(resolve => setTimeout(resolve, 1000))

		// TODO: 添加确认对话框
		// 恢复记账数据
		if (backupData.records && backupData.records.length > 0) {
			setStorage('records', backupData.records)
		}

		// 恢复用户资料
		if (backupData.userProfile) {
			setStorage('userProfile', backupData.userProfile)
		}

		// 恢复用户数据
		if (backupData.users) {
			setStorage('users', backupData.users)
		}

		message.success('数据恢复成功，页面将刷新')
		setTimeout(() => {
			window.location.reload()
		}, 1500)
	} catch (error) {
		message.error('数据恢复失败：' + error.message)
		isRestoring.value = false
	}
}

// 加载备份设置
const loadBackupSettings = () => {
	const settings = getStorage('backupSettings', {})
	if (settings.localBackup !== undefined) {
		backupSettings.localBackup = settings.localBackup
	}
	if (settings.cloudBackup !== undefined) {
		backupSettings.cloudBackup = settings.cloudBackup
	}
}

// 初始化时加载设置
onMounted(() => {
	loadBackupSettings()
})
</script>

<style scoped>
/* ==================== 页面布局 ==================== */
.backup-page {
	min-height: 100vh;
	background: var(--bg-primary);
	position: relative;
	padding-bottom: 20px;
}

/* 主容器 */
.backup-container {
	max-width: 600px;
	margin: 0 auto;
	padding: 0 20px;
}

/* ==================== 备份说明 ==================== */
.backup-info {
	display: flex;
	align-items: flex-start;
	gap: 12px;
	padding: 20px;
	margin: 20px 0;
	background: var(--bg-glass);
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	border: 1px solid var(--bg-glass-border);
	border-radius: var(--radius-md);
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.info-icon {
	width: 40px;
	height: 40px;
	border-radius: var(--radius-full);
	background: rgba(255, 138, 91, 0.1);
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}

.info-icon svg {
	width: 24px;
	height: 24px;
	fill: var(--accent-orange);
}

.info-text {
	font-size: 14px;
	line-height: 1.6;
	color: var(--text-secondary);
	flex: 1;
}

/* ==================== 备份操作按钮 ==================== */
.backup-actions {
	display: flex;
	flex-direction: column;
	gap: 12px;
	margin-top: 32px;
}

.backup-actions :deep(.van-button) {
	height: 50px;
	border-radius: var(--radius-md);
	font-size: 16px;
	font-weight: 600;
}

.backup-actions :deep(.van-button--primary) {
	background: var(--accent-orange);
	border: none;
	box-shadow: 0 4px 16px rgba(255, 138, 91, 0.3);
}

.backup-actions :deep(.van-button--primary:active) {
	background: var(--accent-orange-hover);
}

.backup-actions :deep(.van-button--default) {
	background: var(--bg-glass);
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	box-shadow: 0 4px 16px rgba(255, 138, 91, 0.3);
	border: 1.5px solid var(--bg-glass-border);
	color: var(--text-primary);
}

.backup-actions :deep(.van-button--default:active) {
	background: var(--bg-glass-hover);
	border-color: var(--accent-orange);
}

.backup-actions :deep(.van-button__disabled) {
	opacity: 0.5;
}

.backup-actions :deep(.van-button--disabled) {
	opacity: 0.5;
}

.btn-icon {
	width: 20px;
	height: 20px;
	fill: currentColor;
}

/* ==================== 响应式设计 ==================== */
@media (max-width: 480px) {
	.backup-info {
		padding: 16px;
	}

	.info-icon {
		width: 36px;
		height: 36px;
	}

	.info-icon svg {
		width: 20px;
		height: 20px;
	}

	.info-text {
		font-size: 13px;
	}

	.backup-actions :deep(.van-button) {
		height: 46px;
		font-size: 15px;
	}
}
</style>
