/**
 * 格式化工具函数
 */

/**
 * 格式化金额
 * @param {number} amount - 金额
 * @param {boolean} showSign - 是否显示符号
 * @returns {string} 格式化后的金额
 */
export function formatAmount(amount, showSign = true) {
	const absAmount = Math.abs(amount)

	let formatted

	// 小于1万：正常显示货币格式
	if (absAmount < 10_000) {
		formatted = new Intl.NumberFormat('zh-CN', {
			style: 'currency',
			currency: 'CNY',
			minimumFractionDigits: 2
		}).format(absAmount)
	}
	// 1万-1000万：显示"万"
	else if (absAmount < 10_000_000) {
		const wan = absAmount / 10_000
		formatted = `¥${wan.toFixed(1)}万`
	}
	// 1000万-1亿：显示"千万"
	else if (absAmount < 100_000_000) {
		const qianwan = absAmount / 10_000_000
		formatted = `¥${qianwan.toFixed(2)}千万`
	}
	// 1亿-1000亿：显示"亿"
	else if (absAmount < 100_000_000_000) {
		const yi = absAmount / 100_000_000
		formatted = `¥${yi.toFixed(1)}亿`
	}
	// 1000亿-10000亿：显示"千亿"
	else if (absAmount < 1_000_000_000_000) {
		const qianyi = absAmount / 100_000_000_000
		formatted = `¥${qianyi.toFixed(1)}千亿`
	}
	// 1000亿-10000亿：显示"千亿"
	else {
		const wanyi = absAmount / 1_000_000_000_000
		formatted = `¥${wanyi.toFixed(1)}万亿`
	}

	if (showSign) {
		return amount >= 0 ? `${formatted}` : `- ${formatted}`
	}
	return formatted
}

/**
 * 格式化日期
 * @param {string|Date} date - 日期
 * @param {string} format - 格式类型 'full' | 'date' | 'time' | 'month'
 * @returns {string} 格式化后的日期
 */
export function formatDate(date, format = 'date') {
	const d = new Date(date)
	const year = d.getFullYear()
	const month = String(d.getMonth() + 1).padStart(2, '0')
	const day = String(d.getDate()).padStart(2, '0')
	const hours = String(d.getHours()).padStart(2, '0')
	const minutes = String(d.getMinutes()).padStart(2, '0')

	switch (format) {
		case 'full':
			return `${year}年${month}月${day}日 ${hours}:${minutes}`
		case 'date':
			return `${year}-${month}-${day}`
		case 'time':
			return `${hours}:${minutes}`
		case 'month':
			return `${year}年 ${month}月`
		default:
			return `${year}-${month}-${day}`
	}
}

/**
 * 格式化相对时间
 * @param {string|Date} date - 日期
 * @returns {string} 相对时间描述
 */
export function formatRelativeTime(date) {
	const d = new Date(date)
	const now = new Date()
	const diff = now - d
	const days = Math.floor(diff / (1000 * 60 * 60 * 24))

	if (days === 0) {
		return `今天 ${formatDate(date, 'time')}`
	} else if (days === 1) {
		return `昨天 ${formatDate(date, 'time')}`
	} else if (days < 7) {
		return `${Math.abs(days)}天前`
	} else {
		return formatDate(date, 'date')
	}
}

/**
 * 格式化百分比
 * @param {number} value - 数值
 * @param {number} total - 总数
 * @returns {string} 百分比
 */
export function formatPercentage(value, total) {
	if (total === 0) return '0%'
	return `${Math.round((value / total) * 100)}%`
}
