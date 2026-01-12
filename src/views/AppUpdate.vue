<template>
	<div class="page fade-in-up">
		<Header title="检查更新" />

		<div class="container">
			<!-- 当前版本信息 -->
			<div class="current-version-card">
				<div class="version-icon">
					<svg viewBox="0 0 24 24">
						<path
							d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
					</svg>
				</div>
				<div class="version-info">
					<div class="version-label">当前版本</div>
					<div class="version-number">{{ currentVersion }}</div>
				</div>
			</div>

			<!-- 检查更新按钮 -->
			<div class="check-section">
				<button v-if="!isChecking && !updateInfo && !error" class="check-btn" @click="handleCheckUpdate">
					<svg viewBox="0 0 24 24">
						<path
							d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
					</svg>
					检查更新
				</button>

				<!-- 正在检查 -->
				<div v-if="isChecking" class="checking-state">
					<div class="loading-spinner"></div>
					<div class="checking-text">正在检查更新...</div>
				</div>

				<!-- 已是最新版本 -->
				<div v-if="!isChecking && !updateInfo && !error && hasChecked" class="latest-version">
					<div class="latest-icon">✓</div>
					<div class="latest-text">已是最新版本</div>
				</div>

				<!-- 错误提示 -->
				<div v-if="error" class="error-message">
					<svg viewBox="0 0 24 24">
						<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
					</svg>
					<div>{{ error }}</div>
					<button class="retry-btn" @click="handleCheckUpdate">重试</button>
				</div>
			</div>

			<!-- 发现新版本 -->
			<div v-if="updateInfo" class="update-card">
				<div class="update-header">
					<div class="update-badge">发现新版本</div>
					<div class="new-version">{{ updateInfo.latestVersion }}</div>
				</div>

				<div class="update-details">
					<div class="detail-item">
						<span class="detail-label">发布日期:</span>
						<span class="detail-value">{{ formatDate(updateInfo.publishedAt) }}</span>
					</div>
					<div class="detail-item">
						<span class="detail-label">文件大小:</span>
						<span class="detail-value">{{ formatFileSize(updateInfo.fileSize) }}</span>
					</div>
				</div>

				<div class="update-log">
					<div class="update-log-title">更新日志</div>
					<div class="update-log-content">
						{{ updateInfo.updateLog || '暂无更新日志' }}
					</div>
				</div>

				<!-- 下载按钮 -->
				<div v-if="!isDownloading && !downloadComplete" class="download-section">
					<button class="download-btn" @click="handleDownload">
						<svg viewBox="0 0 24 24">
							<path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
						</svg>
						立即下载更新
					</button>
					<a :href="updateInfo.releaseUrl" target="_blank" class="view-release-link"> 在 GitHub 查看 </a>
				</div>

				<!-- 下载进度 -->
				<div v-if="isDownloading" class="download-progress">
					<div class="progress-info">
						<span>下载中...</span>
						<span>{{ downloadProgress }}%</span>
					</div>
					<div class="progress-bar">
						<div class="progress-fill" :style="{ width: downloadProgress + '%' }"></div>
					</div>
					<div class="download-size-info">{{ formatFileSize(downloadedSize) }} / {{ formatFileSize(updateInfo.fileSize) }}</div>
				</div>

				<!-- 下载完成 -->
				<div v-if="downloadComplete" class="download-complete">
					<div class="complete-icon">✓</div>
					<div class="complete-text">已打开下载页面</div>
					<div class="complete-hint">
						请在浏览器中完成下载。Android 用户可在"文件管理器"的"下载"文件夹找到 APK 文件
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue'
import Header from '@/components/layout/Header.vue'
import { checkForUpdate, downloadAndInstall, formatFileSize, formatDate, saveLastCheckTime } from '@/utils/appUpdate'
import { CURRENT_VERSION } from '@/config/version'
import { message } from '@/utils/message'

const currentVersion = ref(CURRENT_VERSION)
const isChecking = ref(false)
const hasChecked = ref(false)
const updateInfo = ref(null)
const error = ref('')
const isDownloading = ref(false)
const downloadProgress = ref(0)
const downloadedSize = ref(0)
const downloadComplete = ref(false)

// 检查更新
const handleCheckUpdate = async () => {
	isChecking.value = true
	error.value = ''
	updateInfo.value = null
	downloadComplete.value = false

	try {
		const result = await checkForUpdate()

		if (result) {
			updateInfo.value = result
			message.success('发现新版本！')
		} else {
			message.success('已是最新版本')
		}

		saveLastCheckTime()
	} catch (err) {
		console.error('检查更新失败:', err)
		error.value = err.message || '检查更新失败，请检查网络连接'
		message.error(err.message || '检查更新失败')
	} finally {
		isChecking.value = false
		hasChecked.value = true
	}
}

// 下载更新
const handleDownload = async () => {
	isDownloading.value = true
	downloadProgress.value = 0
	downloadedSize.value = 0

	try {
		await downloadAndInstall(updateInfo.value, (percent, received, total) => {
			downloadProgress.value = percent
			downloadedSize.value = received
		})

		downloadComplete.value = true
		message.success('已打开浏览器下载页面，请在浏览器中完成下载')
	} catch (err) {
		console.error('下载失败:', err)
		error.value = '下载失败，请稍后重试'
		message.error('下载失败')
	} finally {
		isDownloading.value = false
	}
}
</script>

<style scoped>
.container {
	padding: 20px;
	padding-bottom: 40px;
}

/* 当前版本卡片 */
.current-version-card {
	display: flex;
	align-items: center;
	gap: 16px;
	padding: 20px;
	background: var(--bg-glass);
	backdrop-filter: blur(20px);
	border-radius: 20px;
	border: 1px solid var(--bg-glass-border);
	margin-bottom: 24px;
}

.version-icon {
	width: 56px;
	height: 56px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: var(--accent-orange);
	border-radius: 16px;
}

.version-icon svg {
	width: 32px;
	height: 32px;
	fill: white;
}

.version-info {
	flex: 1;
}

.version-label {
	font-size: 14px;
	color: var(--text-secondary);
	margin-bottom: 4px;
}

.version-number {
	font-size: 24px;
	font-weight: 700;
	color: var(--text-primary);
}

/* 检查按钮区域 */
.check-section {
	min-height: 200px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.check-btn {
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 16px 32px;
	background: var(--accent-orange);
	color: white;
	border: none;
	border-radius: 16px;
	font-size: 16px;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s ease;
}

.check-btn:hover {
	transform: translateY(-2px);
	box-shadow: 0 8px 24px rgba(255, 138, 91, 0.3);
}

.check-btn svg {
	width: 24px;
	height: 24px;
	fill: currentColor;
}

/* 检查中状态 */
.checking-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16px;
}

.loading-spinner {
	width: 48px;
	height: 48px;
	border: 4px solid var(--bg-input);
	border-top-color: var(--accent-orange);
	border-radius: 50%;
	animation: spin 1s linear infinite;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}

.checking-text {
	color: var(--text-secondary);
	font-size: 16px;
}

/* 最新版本状态 */
.latest-version {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12px;
}

.latest-icon {
	width: 64px;
	height: 64px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: var(--accent-green);
	color: white;
	border-radius: 50%;
	font-size: 32px;
	font-weight: bold;
}

.latest-text {
	color: var(--text-primary);
	font-size: 16px;
	font-weight: 600;
}

/* 错误提示 */
.error-message {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16px;
	color: var(--text-secondary);
}

.error-message svg {
	width: 48px;
	height: 48px;
	fill: #ff4757;
}

.retry-btn {
	padding: 10px 24px;
	background: var(--accent-orange);
	color: white;
	border: none;
	border-radius: 12px;
	font-size: 14px;
	cursor: pointer;
}

/* 更新卡片 */
.update-card {
	background: var(--bg-glass);
	backdrop-filter: blur(20px);
	border-radius: 20px;
	border: 1px solid var(--bg-glass-border);
	padding: 24px;
	margin-top: 24px;
}

.update-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 20px;
}

.update-badge {
	padding: 6px 16px;
	background: var(--accent-blue);
	color: white;
	border-radius: 20px;
	font-size: 14px;
	font-weight: 600;
}

.new-version {
	font-size: 24px;
	font-weight: 700;
	color: var(--text-primary);
}

.update-details {
	display: flex;
	flex-direction: column;
	gap: 12px;
	margin-bottom: 20px;
	padding-bottom: 20px;
	border-bottom: 1px solid var(--bg-glass-border);
}

.detail-item {
	display: flex;
	justify-content: space-between;
}

.detail-label {
	color: var(--text-secondary);
	font-size: 14px;
}

.detail-value {
	color: var(--text-primary);
	font-weight: 600;
}

.update-log-title {
	color: var(--text-primary);
	font-weight: 600;
	margin-bottom: 12px;
}

.update-log-content {
	background: var(--bg-input);
	padding: 16px;
	border-radius: 12px;
	color: var(--text-secondary);
	font-size: 14px;
	line-height: 1.6;
	white-space: pre-wrap;
}

/* 下载区域 */
.download-section {
	margin-top: 24px;
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.download-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 12px;
	width: 100%;
	padding: 16px;
	background: var(--accent-orange);
	color: white;
	border: none;
	border-radius: 16px;
	font-size: 16px;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s ease;
}

.download-btn:hover {
	transform: translateY(-2px);
	box-shadow: 0 8px 24px rgba(255, 138, 91, 0.3);
}

.download-btn svg {
	width: 24px;
	height: 24px;
	fill: currentColor;
}

.view-release-link {
	text-align: center;
	color: var(--text-secondary);
	font-size: 14px;
	text-decoration: none;
}

.view-release-link:hover {
	color: var(--accent-orange);
}

/* 下载进度 */
.download-progress {
	margin-top: 24px;
}

.progress-info {
	display: flex;
	justify-content: space-between;
	margin-bottom: 12px;
	color: var(--text-primary);
	font-weight: 600;
}

.progress-bar {
	width: 100%;
	height: 8px;
	background: var(--bg-input);
	border-radius: 4px;
	overflow: hidden;
}

.progress-fill {
	height: 100%;
	background: var(--accent-orange);
	transition: width 0.3s ease;
}

.download-size-info {
	text-align: center;
	color: var(--text-secondary);
	font-size: 14px;
	margin-top: 12px;
}

/* 下载完成 */
.download-complete {
	margin-top: 24px;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12px;
	text-align: center;
}

.complete-icon {
	width: 64px;
	height: 64px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: var(--accent-green);
	color: white;
	border-radius: 50%;
	font-size: 32px;
	font-weight: bold;
}

.complete-text {
	color: var(--text-primary);
	font-size: 16px;
	font-weight: 600;
}

.complete-hint {
	color: var(--text-secondary);
	font-size: 14px;
}
</style>
