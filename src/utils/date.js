/**
 * 日期工具函数
 */

/**
 * 获取某月的天数
 * @param {number} year - 年份
 * @param {number} month - 月份 (0-11)
 * @returns {number} 天数
 */
export function getDaysInMonth(year, month) {
	return new Date(year, month + 1, 0).getDate()
}

/**
 * 获取某月第一天是星期几
 * @param {number} year - 年份
 * @param {number} month - 月份 (0-11)
 * @returns {number} 星期几 (0-6)
 */
export function getFirstDayOfMonth(year, month) {
	return new Date(year, month, 1).getDay()
}

/**
 * 判断是否是今天
 * @param {Date} date - 日期
 * @returns {boolean}
 */
export function isToday(date) {
	const today = new Date()
	return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()
}

/**
 * 获取月份范围
 * @param {number} year - 年份
 * @param {number} month - 月份 (0-11)
 * @returns {object} { start: Date, end: Date }
 */
export function getMonthRange(year, month) {
	const start = new Date(year, month, 1)
	const end = new Date(year, month + 1, 0, 23, 59, 59)
	return { start, end }
}

/**
 * 生成日历数据
 * @param {number} year - 年份
 * @param {number} month - 月份 (0-11)
 * @returns {Array} 日历数组
 */
export function generateCalendar(year, month) {
	const firstDay = getFirstDayOfMonth(year, month)
	const daysInMonth = getDaysInMonth(year, month)
	const calendar = []

	// 填充空白日期
	for (let i = 0; i < firstDay; i++) {
		calendar.push({ type: 'empty', day: null })
	}

	// 填充实际日期
	for (let day = 1; day <= daysInMonth; day++) {
		const date = new Date(year, month, day)
		calendar.push({
			type: 'day',
			day,
			date,
			isToday: isToday(date)
		})
	}

	return calendar
}

/**
 * 获取本周日期范围
 * @returns {object} { start: Date, end: Date }
 */
export function getCurrentWeekRange() {
	const now = new Date()
	const dayOfWeek = now.getDay()
	const start = new Date(now)
	start.setDate(now.getDate() - dayOfWeek)
	start.setHours(0, 0, 0, 0)

	const end = new Date(start)
	end.setDate(start.getDate() + 6)
	end.setHours(23, 59, 59, 999)

	return { start, end }
}

/**
 * 获取今天日期的开始和结束
 * @returns {object} { start: Date, end: Date }
 */
export function getTodayRange() {
	const start = new Date()
	start.setHours(0, 0, 0, 0)

	const end = new Date()
	end.setHours(23, 59, 59, 999)

	return { start, end }
}

/**
 * 将日期格式化为本地日期字符串 (YYYY-MM-DD)
 * @param {Date|string} date - 日期对象或ISO字符串
 * @returns {string} 本地日期字符串
 */
export function formatToLocalISODate(date) {
	const d = date instanceof Date ? date : new Date(date)
	const year = d.getFullYear()
	const month = String(d.getMonth() + 1).padStart(2, '0')
	const day = String(d.getDate()).padStart(2, '0')
	return `${year}-${month}-${day}`
}
