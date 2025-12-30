import { defineStore } from 'pinia'
import { getStorage, setStorage } from '@/utils/storage'
import { formatAmount } from '@/utils/format'

export const useRecordsStore = defineStore('records', {
  state: () => ({
    records: [],
    categories: {
      expense: ['餐饮', '交通', '购物', '娱乐', '医疗', '其他'],
      income: ['工资', '投资', '礼金', '其他']
    },
    idCounter: Date.now()
  }),

  getters: {
    // 总余额
    totalBalance: (state) => {
      return state.records.reduce((sum, record) => sum + record.amount, 0)
    },

    // 总收入
    totalIncome: (state) => {
      return state.records
        .filter(r => r.type === 'income')
        .reduce((sum, r) => sum + r.amount, 0)
    },

    // 总支出
    totalExpense: (state) => {
      return state.records
        .filter(r => r.type === 'expense')
        .reduce((sum, r) => sum + Math.abs(r.amount), 0)
    },

    // 按日期分组的记录
    recordsByDate: (state) => {
      const grouped = {}
      state.records.forEach(record => {
        const date = record.date.split('T')[0]
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
    recordsByCategory: (state) => {
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
    expenseByCategory: (state) => {
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
    recentRecords: (state) => {
      return [...state.records]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 20)
    },

    // 获取本周记录
    thisWeekRecords: (state) => {
      const now = new Date()
      const dayOfWeek = now.getDay()
      const startOfWeek = new Date(now)
      startOfWeek.setDate(now.getDate() - dayOfWeek)
      startOfWeek.setHours(0, 0, 0, 0)

      return state.records.filter(r => new Date(r.date) >= startOfWeek)
    }
  },

  actions: {
    // 添加记录
    addRecord(record) {
      this.idCounter++
      const newRecord = {
        ...record,
        id: this.idCounter.toString(),
        amount: record.type === 'expense' ? -Math.abs(record.amount) : Math.abs(record.amount),
        createdAt: new Date().toISOString()
      }
      this.records.push(newRecord)
      this.saveToStorage()
      return newRecord
    },

    // 删除记录
    deleteRecord(id) {
      const index = this.records.findIndex(r => r.id === id)
      if (index !== -1) {
        this.records.splice(index, 1)
        this.saveToStorage()
        return true
      }
      return false
    },

    // 更新记录
    updateRecord(id, data) {
      const index = this.records.findIndex(r => r.id === id)
      if (index !== -1) {
        const record = this.records[index]
        const updatedRecord = {
          ...record,
          ...data,
          amount: data.type === 'expense'
            ? -Math.abs(data.amount || record.amount)
            : Math.abs(data.amount || record.amount)
        }
        this.records[index] = updatedRecord
        this.saveToStorage()
        return updatedRecord
      }
      return null
    },

    // 从localStorage加载
    loadFromStorage() {
      const data = getStorage('records', [])
      this.records = data
    },

    // 保存到localStorage
    saveToStorage() {
      setStorage('records', this.records)
    },

    // 获取指定日期的记录
    getRecordsByDate(date) {
      const dateStr = date.split('T')[0]
      return this.records.filter(r => r.date.split('T')[0] === dateStr)
    },

    // 获取日期范围内的记录
    getRecordsByDateRange(startDate, endDate) {
      return this.records.filter(r => {
        const recordDate = new Date(r.date)
        return recordDate >= new Date(startDate) && recordDate <= new Date(endDate)
      })
    },

    // 获取月度记录
    getMonthlyRecords(year, month) {
      return this.records.filter(r => {
        const date = new Date(r.date)
        return date.getFullYear() === year && date.getMonth() === month
      })
    }
  }
})
