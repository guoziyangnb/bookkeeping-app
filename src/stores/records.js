import { defineStore } from 'pinia'
import { formatToLocalISODate } from '@/utils/date'
import * as recordsApi from '@/service/records'

export const useRecordsStore = defineStore('records', {
	state: () => {
		return {
			// 临时缓存，从 Supabase 获取的数据
			records: [],
			// 分类配置
			categories: {
				expense: ['餐饮', '交通', '购物', '娱乐', '医疗', '其他'],
				income: ['工资', '投资', '礼金', '其他']
			},
			// 加载状态
			loading: false,
			// 错误信息
			error: null
		}
	},

	getters: {
		// 总余额
		totalBalance: state => {
			return state.records.reduce((sum, record) => sum + record.amount, 0)
		},

		// 总收入
		totalIncome: state => {
			return state.records.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0)
		},

		// 总支出
		totalExpense: state => {
			return state.records.filter(r => r.type === 'expense').reduce((sum, r) => sum + Math.abs(r.amount), 0)
		},

		// 按日期分组的记录
		recordsByDate: state => {
			const grouped = {}
			state.records.forEach(record => {
				const date = formatToLocalISODate(record.date)
				if (!grouped[date]) {
					grouped[date] = []
				}
				grouped[date].push(record)
			})
			// 按日期倒序排序
			Object.keys(grouped).forEach(date => {
				grouped[date].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
			})
			return grouped
		},

		// 按分类分组的记录
		recordsByCategory: state => {
			const grouped = { expense: {}, income: {} }
			state.records.forEach(record => {
				if (!grouped[record.type][record.category]) {
					grouped[record.type][record.category] = []
				}
				grouped[record.type][record.category].push(record)
			})
			return grouped
		},

		// 按分类统计支出
		expenseByCategory: state => {
			const stats = {}
			state.records
				.filter(r => r.type === 'expense')
				.forEach(record => {
					if (!stats[record.category]) {
						stats[record.category] = 0
					}
					stats[record.category] += Math.abs(record.amount)
				})
			return stats
		},

		// 获取最近的记录
		recentRecords: state => {
			return [...state.records].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 20)
		},

		// 获取本周记录
		thisWeekRecords: state => {
			const now = new Date()
			const dayOfWeek = now.getDay()
			const startOfWeek = new Date(now)
			startOfWeek.setDate(now.getDate() - dayOfWeek)
			startOfWeek.setHours(0, 0, 0, 0)

			return state.records.filter(r => new Date(r.date) >= startOfWeek)
		}
	},

	actions: {
		// ==========================================
		// 数据获取方法（从 Supabase）
		// ==========================================

		/**
		 * 获取用户所有记录并缓存到本地
		 * @param {string} userId - 用户ID
		 * @param {Object} options - 查询选项
		 */
		async fetchRecords(userId, options = {}) {
			try {
				this.loading = true
				this.error = null
				this.records = await recordsApi.getRecords(userId, options)
			} catch (error) {
				this.error = error.message
				throw error
			} finally {
				this.loading = false
			}
		},

		/**
		 * 获取指定日期的记录
		 * @param {string} userId - 用户ID
		 * @param {string} date - 日期
		 */
		async fetchRecordsByDate(userId, date) {
			try {
				this.loading = true
				this.error = null
				this.records = await recordsApi.getRecordsByDate(userId, date)
			} catch (error) {
				this.error = error.message
				throw error
			} finally {
				this.loading = false
			}
		},

		/**
		 * 获取日期范围内的记录
		 * @param {string} userId - 用户ID
		 * @param {string} startDate - 开始日期
		 * @param {string} endDate - 结束日期
		 */
		async fetchRecordsByDateRange(userId, startDate, endDate) {
			try {
				this.loading = true
				this.error = null
				this.records = await recordsApi.getRecordsByDateRange(userId, startDate, endDate)
			} catch (error) {
				this.error = error.message
				throw error
			} finally {
				this.loading = false
			}
		},

		/**
		 * 获取月度记录
		 * @param {string} userId - 用户ID
		 * @param {number} year - 年份
		 * @param {number} month - 月份
		 */
		async fetchMonthlyRecords(userId, year, month) {
			try {
				this.loading = true
				this.error = null
				this.records = await recordsApi.getMonthlyRecords(userId, year, month)
			} catch (error) {
				this.error = error.message
				throw error
			} finally {
				this.loading = false
			}
		},

		/**
		 * 获取本周记录
		 * @param {string} userId - 用户ID
		 */
		async fetchThisWeekRecords(userId) {
			try {
				this.loading = true
				this.error = null
				this.records = await recordsApi.getThisWeekRecords(userId)
			} catch (error) {
				this.error = error.message
				throw error
			} finally {
				this.loading = false
			}
		},

		/**
		 * 获取最近的记录
		 * @param {string} userId - 用户ID
		 * @param {number} limit - 返回数量
		 */
		async fetchRecentRecords(userId, limit = 20) {
			try {
				this.loading = true
				this.error = null
				this.records = await recordsApi.getRecentRecords(userId, limit)
			} catch (error) {
				this.error = error.message
				throw error
			} finally {
				this.loading = false
			}
		},

		// ==========================================
		// CRUD 操作（调用 Supabase API）
		// ==========================================

		/**
		 * 添加记录
		 * @param {string} userId - 用户ID
		 * @param {Object} record - 记录对象
		 * @returns {Promise<Object>} 新创建的记录
		 */
		async addRecord(userId, record) {
			try {
				this.error = null
				const newRecord = await recordsApi.addRecord({ ...record, user_id: userId })
				// 添加到本地缓存
				this.records.unshift(newRecord)
				return newRecord
			} catch (error) {
				this.error = error.message
				throw error
			}
		},

		/**
		 * 删除记录
		 * @param {string} id - 记录ID
		 * @returns {Promise<boolean>}
		 */
		async deleteRecord(id) {
			try {
				this.error = null
				await recordsApi.deleteRecord(id)
				// 从本地缓存移除
				const index = this.records.findIndex(r => r.id === id)
				if (index !== -1) {
					this.records.splice(index, 1)
				}
				return true
			} catch (error) {
				this.error = error.message
				throw error
			}
		},

		/**
		 * 更新记录
		 * @param {string} id - 记录ID
		 * @param {Object} data - 更新数据
		 * @returns {Promise<Object>}
		 */
		async updateRecord(id, data) {
			try {
				this.error = null
				const updatedRecord = await recordsApi.updateRecord(id, data)
				// 更新本地缓存
				const index = this.records.findIndex(r => r.id === id)
				if (index !== -1) {
					this.records[index] = updatedRecord
				}
				return updatedRecord
			} catch (error) {
				this.error = error.message
				throw error
			}
		},

		// ==========================================
		// 辅助方法
		// ==========================================

		/**
		 * 清空本地缓存
		 */
		clearCache() {
			this.records = []
			this.error = null
		},

		/**
		 * 获取统计概览
		 * @param {string} userId - 用户ID
		 */
		async fetchStats(userId) {
			try {
				return await recordsApi.getRecordsStats(userId)
			} catch (error) {
				this.error = error.message
				throw error
			}
		}
	}
})
