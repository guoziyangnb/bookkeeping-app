/**
 * 收支记录相关操作的接口
 * 所有数据操作都通过 Supabase 进行
 */
import supabase from '.'

/**
 * 添加收支记录
 * @param {Object} record - 记录对象
 * @param {string} record.user_id - 用户ID
 * @param {string} record.type - 记录类型: 'expense' | 'income'
 * @param {number} record.amount - 金额
 * @param {string} record.category - 分类
 * @param {string} record.note - 备注
 * @param {string} record.date - 交易日期 (ISO string)
 * @param {string} [record.image_url] - 图片URL (可选)
 * @returns {Promise<Object>} 新创建的记录
 */
export const addRecord = async record => {
	// 金额处理：支出为负，收入为正
	const amount = record.type === 'expense' ? -Math.abs(record.amount) : Math.abs(record.amount)

	const { data, error } = await supabase
		.from('records')
		.insert({
			user_id: record.user_id,
			type: record.type,
			amount,
			category: record.category,
			note: record.note || '',
			date: record.date,
			image_url: record.image_url || null
		})
		.select()
		.single()

	if (error) throw new Error(error.message)
	return data
}

/**
 * 删除收支记录
 * @param {string} id - 记录ID
 * @returns {Promise<boolean>} 是否删除成功
 */
export const deleteRecord = async id => {
	const { error } = await supabase.from('records').delete().eq('id', id)

	if (error) throw new Error(error.message)
	return true
}

/**
 * 更新收支记录
 * @param {string} id - 记录ID
 * @param {Object} data - 要更新的数据
 * @returns {Promise<Object>} 更新后的记录
 */
export const updateRecord = async (id, data) => {
	// 如果更新了 type，需要重新计算 amount
	let updateData = { ...data }

	if (data.type && data.amount !== undefined) {
		updateData.amount = data.type === 'expense' ? -Math.abs(data.amount) : Math.abs(data.amount)
	}

	const { data: record, error } = await supabase.from('records').update(updateData).eq('id', id).select().single()

	if (error) throw new Error(error.message)
	return record
}

/**
 * 获取用户的所有记录
 * @param {string} userId - 用户ID
 * @param {Object} [options] - 查询选项
 * @param {number} [options.limit] - 限制返回数量
 * @param {number} [options.offset] - 偏移量
 * @param {string} [options.type] - 筛选类型: 'expense' | 'income'
 * @returns {Promise<Array>} 记录列表
 */
export const getRecords = async (userId, options = {}) => {
	let query = supabase.from('records').select('*').eq('user_id', userId).order('date', { ascending: false }).order('created_at', { ascending: false })

	if (options.type) {
		query = query.eq('type', options.type)
	}

	if (options.limit) {
		query = query.limit(options.limit)
	}

	if (options.offset) {
		query = query.range(options.offset, options.offset + (options.limit || 20) - 1)
	}

	const { data, error } = await query

	if (error) throw new Error(error.message)
	return data
}

/**
 * 根据ID获取单条记录
 * @param {string} id - 记录ID
 * @returns {Promise<Object>} 记录对象
 */
export const getRecordById = async id => {
	const { data, error } = await supabase.from('records').select('*').eq('id', id).single()

	if (error) throw new Error(error.message)
	return data
}

/**
 * 获取指定日期的记录
 * @param {string} userId - 用户ID
 * @param {string} date - 日期 (ISO string)
 * @returns {Promise<Array>} 记录列表
 */
export const getRecordsByDate = async (userId, date) => {
	const startDate = new Date(date)
	startDate.setHours(0, 0, 0, 0)

	const endDate = new Date(date)
	endDate.setHours(23, 59, 59, 999)

	const { data, error } = await supabase
		.from('records')
		.select('*')
		.eq('user_id', userId)
		.gte('date', startDate.toISOString())
		.lte('date', endDate.toISOString())
		.order('created_at', { ascending: false })

	if (error) throw new Error(error.message)
	return data
}

/**
 * 获取日期范围内的记录
 * @param {string} userId - 用户ID
 * @param {string} startDate - 开始日期 (ISO string)
 * @param {string} endDate - 结束日期 (ISO string)
 * @returns {Promise<Array>} 记录列表
 */
export const getRecordsByDateRange = async (userId, startDate, endDate) => {
	const start = new Date(startDate)
	start.setHours(0, 0, 0, 0)

	const end = new Date(endDate)
	end.setHours(23, 59, 59, 999)

	const { data, error } = await supabase
		.from('records')
		.select('*')
		.eq('user_id', userId)
		.gte('date', start.toISOString())
		.lte('date', end.toISOString())
		.order('date', { ascending: false })

	if (error) throw new Error(error.message)
	return data
}

/**
 * 获取月度记录
 * @param {string} userId - 用户ID
 * @param {number} year - 年份
 * @param {number} month - 月份 (0-11)
 * @returns {Promise<Array>} 记录列表
 */
export const getMonthlyRecords = async (userId, year, month) => {
	const startDate = new Date(year, month, 1)
	const endDate = new Date(year, month + 1, 0, 23, 59, 59)

	const { data, error } = await supabase
		.from('records')
		.select('*')
		.eq('user_id', userId)
		.gte('date', startDate.toISOString())
		.lte('date', endDate.toISOString())
		.order('date', { ascending: false })

	if (error) throw new Error(error.message)
	return data
}

/**
 * 获取本周记录
 * @param {string} userId - 用户ID
 * @returns {Promise<Array>} 记录列表
 */
export const getThisWeekRecords = async userId => {
	const now = new Date()
	const dayOfWeek = now.getDay()
	const startOfWeek = new Date(now)
	startOfWeek.setDate(now.getDate() - dayOfWeek)
	startOfWeek.setHours(0, 0, 0, 0)

	const { data, error } = await supabase
		.from('records')
		.select('*')
		.eq('user_id', userId)
		.gte('date', startOfWeek.toISOString())
		.order('date', { ascending: false })

	if (error) throw new Error(error.message)
	return data
}

/**
 * 获取最近的记录
 * @param {string} userId - 用户ID
 * @param {number} [limit=20] - 返回数量
 * @returns {Promise<Array>} 记录列表
 */
export const getRecentRecords = async (userId, limit = 20) => {
	const { data, error } = await supabase
		.from('records')
		.select('*')
		.eq('user_id', userId)
		.order('created_at', { ascending: false })
		.limit(limit)

	if (error) throw new Error(error.message)
	return data
}

/**
 * 获取按分类分组的记录统计
 * @param {string} userId - 用户ID
 * @param {string} type - 类型: 'expense' | 'income'
 * @returns {Promise<Object>} 分类统计对象
 */
export const getCategoryStats = async (userId, type) => {
	const { data, error } = await supabase
		.from('records')
		.select('category, amount')
		.eq('user_id', userId)
		.eq('type', type)

	if (error) throw new Error(error.message)

	// 按分类统计
	const stats = {}
	data.forEach(record => {
		const amount = Math.abs(record.amount)
		if (!stats[record.category]) {
			stats[record.category] = 0
		}
		stats[record.category] += amount
	})

	return stats
}

/**
 * 批量删除记录
 * @param {Array<string>} ids - 记录ID数组
 * @returns {Promise<boolean>} 是否删除成功
 */
export const batchDeleteRecords = async ids => {
	const { error } = await supabase.from('records').delete().in('id', ids)

	if (error) throw new Error(error.message)
	return true
}

/**
 * 获取用户统计数据概览
 * @param {string} userId - 用户ID
 * @returns {Promise<Object>} 统计数据
 */
export const getRecordsStats = async userId => {
	// 获取所有记录
	const { data, error } = await supabase.from('records').select('type, amount').eq('user_id', userId)

	if (error) throw new Error(error.message)

	// 计算统计数据
	const totalIncome = data.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0)
	const totalExpense = data.filter(r => r.type === 'expense').reduce((sum, r) => sum + Math.abs(r.amount), 0)
	const totalBalance = totalIncome - totalExpense

	return {
		totalIncome,
		totalExpense,
		totalBalance,
		recordCount: data.length
	}
}
