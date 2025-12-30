import { defineStore } from 'pinia'
import { getStorage, setStorage } from '@/utils/storage'

export const useUIStore = defineStore('ui', {
  state: () => ({
    theme: getStorage('theme', 'light'),
    currentTab: 'home',
    isModalOpen: false,
    modalType: 'expense' // 'expense' | 'income'
  }),

  getters: {
    // 当前是否是暗黑主题
    isDark: (state) => state.theme === 'dark'
  },

  actions: {
    // 切换主题
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
      this.applyTheme()
      setStorage('theme', this.theme)
    },

    // 设置主题
    setTheme(theme) {
      this.theme = theme
      this.applyTheme()
      setStorage('theme', this.theme)
    },

    // 应用主题到DOM
    applyTheme() {
      document.documentElement.setAttribute('data-theme', this.theme)
    },

    // 初始化主题
    initTheme() {
      this.applyTheme()
    },

    // 设置当前标签
    setCurrentTab(tab) {
      this.currentTab = tab
    },

    // 打开添加记录弹窗
    openModal(type = 'expense') {
      this.modalType = type
      this.isModalOpen = true
    },

    // 关闭弹窗
    closeModal() {
      this.isModalOpen = false
    }
  }
})
