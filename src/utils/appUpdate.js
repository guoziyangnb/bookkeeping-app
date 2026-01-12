/**
 * 应用更新工具 - 基于 GitHub Releases
 * 功能：检查更新、下载APK、安装
 */

import { CURRENT_VERSION, GITHUB_REPO, getGithubApiUrl, VERSION_CONFIG, GH_PROXY } from '@/config/version'

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

		const response = await fetch(apiUrl, {
			headers: {
				Accept: 'application/vnd.github.v3+json'
			}
		})

		if (!response.ok) {
			throw new Error(`GitHub API 请求失败: ${response.status}`)
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
 * 下载 APK 文件
 * @param {string} url - 下载地址
 * @param {string} fileName - 文件名
 * @param {Function} onProgress - 进度回调
 * @returns {Promise<Blob>} 文件 Blob 对象
 */
export async function downloadAPK(url, fileName, onProgress) {
	try {
		const response = await fetch(url)

		if (!response.ok) {
			throw new Error(`下载失败: ${response.status}`)
		}

		const contentLength = response.headers.get('content-length')
		const total = contentLength ? parseInt(contentLength, 10) : 0

		const reader = response.body.getReader()
		let receivedLength = 0
		const chunks = []

		while (true) {
			const { done, value } = await reader.read()

			if (done) break

			chunks.push(value)
			receivedLength += value.length

			// 调用进度回调
			if (onProgress && total > 0) {
				const percent = Math.round((receivedLength / total) * 100)
				onProgress(percent, receivedLength, total)
			}
		}

		// 合并所有 chunks
		const blob = new Blob(chunks, { type: 'application/vnd.android.package-archive' })
		return blob
	} catch (error) {
		console.error('下载 APK 失败:', error)
		throw error
	}
}

/**
 * 保存并安装 APK（适用于 Webview/5+ 环境）
 * @param {Blob} blob - APK 文件 Blob
 * @param {string} fileName - 文件名
 */
export async function installAPK(blob, fileName) {
	// 检测运行环境
	const isPlus = typeof plus !== 'undefined'
	const isAndroid = /Android/i.test(navigator.userAgent)

	if (!isAndroid) {
		throw new Error('当前平台不支持 APK 安装')
	}

	// 创建下载链接
	const url = URL.createObjectURL(blob)
	const a = document.createElement('a')
	a.href = url
	a.download = fileName
	document.body.appendChild(a)
	a.click()

	// 清理
	setTimeout(() => {
		document.body.removeChild(a)
		URL.revokeObjectURL(url)
	}, 100)

	// 如果在 5+ Runtime 环境，可以调用原生安装
	if (isPlus && plus.runtime) {
		try {
			// 保存到本地文件系统
			const filePath = `_downloads/${fileName}`
			const entry = await new Promise((resolve, reject) => {
				plus.io.resolveLocalFileSystemURL(
					'_downloads',
					dirEntry => {
						dirEntry.getFile(fileName, { create: true }, fileEntry => {
							fileEntry.createWriter(writer => {
								writer.write(blob)
								resolve(fileEntry)
							}, reject)
						}, reject)
					},
					reject
				)
			})

			// 调用安装
			plus.runtime.install(
				entry.toLocalURL(),
				{},
				() => {
					console.log('APK 安装成功')
				},
				error => {
					console.error('APK 安装失败:', error)
				}
			)
		} catch (error) {
			console.error('原生安装失败，使用浏览器下载:', error)
		}
	}
}

/**
 * 下载并安装更新（完整流程）
 * @param {Object} updateInfo - 更新信息
 * @param {Function} onProgress - 进度回调
 */
export async function downloadAndInstall(updateInfo, onProgress) {
	try {
		// 下载 APK
		const blob = await downloadAPK(updateInfo.downloadUrl, updateInfo.fileName, onProgress)

		// 安装 APK
		await installAPK(blob, updateInfo.fileName)

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
