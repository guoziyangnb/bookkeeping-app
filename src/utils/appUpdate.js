/**
 * 应用更新工具 - 基于 GitHub Releases
 * 功能：检查更新、下载APK、安装
 */

import { CURRENT_VERSION, GITHUB_REPO, getGithubApiUrl, VERSION_CONFIG, GH_PROXY, GITHUB_TOKEN } from '@/config/version'

/**
 * 比较版本号
 * @param {string} version1 - 版本1 (如 "1.0.0")
 * @param {string} version2 - 版本2 (如 "1.0.1")
 * @returns {number} 1: version1 > version2, -1: version1 < version2, 0: 相等
 */
export function compareVersions(version1, version2) {
	// 移除 'v' 前缀（如果有）
	const v1 = version1.replace(/^v/, '')
	const v2 = version2.replace(/^v/, '')

	const parts1 = v1.split('.').map(Number)
	const parts2 = v2.split('.').map(Number)

	const maxLength = Math.max(parts1.length, parts2.length)

	for (let i = 0; i < maxLength; i++) {
		const num1 = parts1[i] || 0
		const num2 = parts2[i] || 0

		if (num1 > num2) return 1
		if (num1 < num2) return -1
	}

	return 0
}

/**
 * 检查是否有新版本
 * @returns {Promise<Object|null>} 返回更新信息，如果无更新则返回 null
 */
export async function checkForUpdate() {
	try {
		const apiUrl = getGithubApiUrl(GITHUB_REPO.owner, GITHUB_REPO.repo)
		// 构建请求头
		const headers = {
			Accept: 'application/vnd.github.v3+json'
		}

		// 如果配置了 GitHub Token，添加认证头
		if (GITHUB_TOKEN) {
			headers.Authorization = `Bearer ${GITHUB_TOKEN}`
		} else {
			console.warn('未配置 GitHub Token，可能受速率限制影响')
		}

		const response = await fetch(apiUrl, { headers })

		console.log('GitHub API 响应状态:', response.status)

		if (!response.ok) {
			const errorText = await response.text()
			console.error('GitHub API 错误响应:', errorText)
			throw new Error(`GitHub API 请求失败: ${response.status} - ${errorText}`)
		}

		const releaseData = await response.json()

		// 解析最新版本号
		const latestVersion = releaseData.tag_name // 如 "v1.0.1"

		// 比较版本
		const comparison = compareVersions(latestVersion, CURRENT_VERSION)

		if (comparison <= 0) {
			// 当前版本已经是最新或更高
			return null
		}

		// 查找 APK 文件（通常文件名包含 .apk）
		const apkAsset = releaseData.assets.find(asset => asset.name.endsWith('.apk'))

		if (!apkAsset) {
			console.warn('Release 中未找到 APK 文件')
			return null
		}

		// 使用代理加速下载
		const originalUrl = apkAsset.browser_download_url
		const downloadUrl = GH_PROXY ? GH_PROXY + originalUrl : originalUrl

		// 返回更新信息
		return {
			latestVersion,
			currentVersion: CURRENT_VERSION,
			downloadUrl,
			fileSize: apkAsset.size,
			fileName: apkAsset.name,
			updateLog: releaseData.body || releaseData.name,
			releaseUrl: releaseData.html_url,
			publishedAt: releaseData.published_at
		}
	} catch (error) {
		console.error('检查更新失败:', error)
		throw error
	}
}

/**
 * 格式化文件大小
 * @param {number} bytes - 字节数
 * @returns {string} 格式化后的大小
 */
export function formatFileSize(bytes) {
	if (bytes === 0) return '0 B'

	const k = 1024
	const sizes = ['B', 'KB', 'MB', 'GB']
	const i = Math.floor(Math.log(bytes) / Math.log(k))

	return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * 下载 APK 文件（使用打开新浏览器窗口的方式）
 * @param {string} url - 下载地址
 * @param {string} fileName - 文件名
 * @param {Function} onProgress - 进度回调（此方式不支持实时进度）
 * @returns {Promise<void>}
 */
export async function downloadAPK(url, fileName, onProgress) {
	try {
		console.log('准备打开浏览器下载链接:', url)

		// 立即调用进度回调，显示为完成（因为无法获取实际进度）
		if (onProgress) {
			onProgress(100, 0, 0)
		}

		// 跳转到手机默认浏览器打开链接（无需额外权限）
		if (typeof plus !== 'undefined' && plus.runtime) {
			// 在 5+ App 环境中使用 plus.runtime.openURL
			plus.runtime.openURL(url, function(res) {
				console.log('跳转成功')
			}, function(err) {
				console.error('跳转失败：', err)
				throw new Error('打开浏览器失败')
			})
		} else {
			// 在普通浏览器中使用 window.open 作为降级方案
			const opened = window.open(url, '_blank')
			if (!opened) {
				// 如果被弹窗拦截器阻止，尝试使用 <a> 标签方式
				console.warn('window.open 被阻止，尝试使用 <a> 标签方式')
				const a = document.createElement('a')
				a.href = url
				a.target = '_blank'
				a.rel = 'noopener noreferrer'
				a.style.display = 'none'

				document.body.appendChild(a)
				a.click()

				setTimeout(() => {
					document.body.removeChild(a)
				}, 100)
			} else {
				console.log('已在新窗口打开下载链接')
			}
		}

		// 不返回 Blob，直接返回成功
		return
	} catch (error) {
		console.error('下载 APK 失败:', error)
		throw error
	}
}

/**
 * 保存并安装 APK（适用于 Webview/5+ 环境）
 * 注意：由于使用直接下载方式，此函数已不再需要
 * @param {any} blob - 保留参数（兼容性）
 * @param {string} fileName - 文件名
 */
export async function installAPK(blob, fileName) {
	// 直接下载方式已经触发了浏览器的下载，无需额外处理
	// 用户可以在浏览器下载列表中查看下载的文件
	console.log('APK 下载已触发，请查看浏览器下载列表')
	return
}

/**
 * 下载并安装更新（完整流程）
 * @param {Object} updateInfo - 更新信息
 * @param {Function} onProgress - 进度回调
 */
export async function downloadAndInstall(updateInfo, onProgress) {
	try {
		// 直接下载 APK（会触发浏览器下载）
		await downloadAPK(updateInfo.downloadUrl, updateInfo.fileName, onProgress)

		// 提示用户查看浏览器下载
		console.log('下载完成，请查看浏览器下载列表')

		return true
	} catch (error) {
		console.error('下载安装失败:', error)
		throw error
	}
}

/**
 * 格式化日期
 * @param {string} dateString - ISO 日期字符串
 * @returns {string} 格式化后的日期
 */
export function formatDate(dateString) {
	const date = new Date(dateString)
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')

	return `${year}-${month}-${day}`
}

/**
 * 检查是否需要自动检查更新（基于时间间隔）
 * @returns {boolean}
 */
export function shouldAutoCheck() {
	const lastCheckTime = localStorage.getItem('last_update_check')
	if (!lastCheckTime) return true

	const now = Date.now()
	const lastCheck = parseInt(lastCheckTime, 10)

	return now - lastCheck > VERSION_CONFIG.checkInterval
}

/**
 * 保存最后检查时间
 */
export function saveLastCheckTime() {
	localStorage.setItem('last_update_check', Date.now().toString())
}
