/**
 * 版本配置 - GitHub Releases
 *
 * 使用说明：
 * 1. 在你的 GitHub 仓库中创建 Release（Releases -> Draft a new release）
 * 2. 标签格式：v1.0.0、v1.0.1 等
 * 3. 上传 APK 文件到 Release
 * 4. 发布 Release
 * 5. 应用会自动检测到更新
 */

// 当前应用版本号（需要与 package.json 和 HBuilderX 的 manifest.json 保持一致）
export const CURRENT_VERSION = '1.0.7'

// GitHub 仓库配置（请替换为你的仓库信息）
export const GITHUB_REPO = {
	owner: 'guoziyangnb', // GitHub 用户名
	repo: 'bookkeeping-app' // 仓库名称
}

// GitHub API 获取最新 Release
// 格式：https://api.github.com/repos/{owner}/{repo}/releases/latest
export const getGithubApiUrl = (owner, repo) => `https://api.github.com/repos/${owner}/${repo}/releases/latest`

/**
 * GitHub Release API 返回数据格式：
 * {
 *   "tag_name": "v1.0.1",
 *   "name": "版本 1.0.1",
 *   "body": "更新日志内容",
 *   "html_url": "https://github.com/...",
 *   "published_at": "2024-01-01T00:00:00Z",
 *   "assets": [
 *     {
 *       "name": "app-release.apk",
 *       "size": 15728640,
 *       "browser_download_url": "https://github.com/.../app-release.apk"
 *     }
 *   ]
 * }
 */

// 版本比较配置
export const VERSION_CONFIG = {
	// 是否在启动时自动检查更新（建议开启）
	autoCheckOnLaunch: false,
	// 自动检查更新的间隔时间（毫秒）- 24小时
	checkInterval: 24 * 60 * 60 * 1000
}

// GitHub 下载加速代理（可选）
// 留空则不使用代理，直接从 GitHub 下载
// 常用代理：https://hk.gh-proxy.org/、https://ghproxy.com/、https://mirror.ghproxy.com/
export const GH_PROXY = 'https://hk.gh-proxy.org/'

// GitHub Personal Access Token（可选）
// 用于提高 API 速率限制（从 60次/小时 提升到 5000次/小时）
// 获取方式：GitHub Settings -> Developer settings -> Personal access tokens -> Tokens (classic)
// 创建一个 token，只需要选择 public_repo 权限即可
// 留空则不使用认证（受速率限制）
export const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || ''
