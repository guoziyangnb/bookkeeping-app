import { defineStore } from 'pinia'
import { getStorage, setStorage, removeStorage } from '@/utils/storage'
import router from '@/router'
import { signUp, signIn, logout, getCurrentUser } from '@/service/user'

export const useUserStore = defineStore('user', {
	state: () => {
		// 在初始化时从 localStorage 加载用户数据
		const savedUser = getStorage('currentUser', null)

		return {
			currentUser: savedUser,
			isAuthenticated: !!savedUser
		}
	},

	getters: {
		// 获取当前用户信息
		userInfo: state => state.currentUser,

		// 检查是否已登录
		isLoggedIn: state => state.isAuthenticated,

		// 获取用户头像
		userAvatar: state => state.currentUser?.user_metadata?.avatar || '',

		// 获取用户名
		userName: state => state.currentUser?.user_metadata?.username || state.currentUser?.email?.split('@')[0] || '游客',

		// 获取用户ID
		userId: state => state.currentUser?.id || '',

		// 获取用户邮箱
		userEmail: state => state.currentUser?.email || ''
	},

	actions: {
		// 初始化：检查用户登录状态
		async initializeAuth() {
			try {
				// 先检查本地是否有用户信息
				if (this.currentUser) {
					this.isAuthenticated = true
					return this.currentUser
				}

				// 尝试从supabase获取当前用户
				const user = await getCurrentUser()
				if (user) {
					this.currentUser = user
					this.isAuthenticated = true
					setStorage('currentUser', user)
				}
				return user
			} catch (error) {
				console.error('初始化认证状态失败:', error)
				return null
			}
		},

		// 注册
		async register({ username, email, password }) {
			try {
				// 调用supabase注册接口，并传递username
				const user = await signUp({ email, password, username })

				// 存储用户元数据（包含username）
				if (user) {
					this.currentUser = user
					// this.isAuthenticated = true
					// setStorage('currentUser', user)
				}

				return user
			} catch (error) {
				throw error
			}
		},

		// 登录
		async login({ email, password }) {
			try {
				// 调用supabase登录接口
				const user = await signIn({ email, password })

				// 设置当前用户
				this.currentUser = user
				this.isAuthenticated = true
				setStorage('currentUser', user)

				return user
			} catch (error) {
				throw error
			}
		},

		// 登出
		async logout() {
			try {
				// 调用supabase登出接口
				await logout()
			} catch (error) {
				console.error('退出登录失败:', error)
			} finally {
				// 清除本地状态
				this.currentUser = null
				this.isAuthenticated = false
				removeStorage('currentUser')
				router.push('/welcome')
			}
		},

		// 更新用户信息（Supabase需要通过updateUser方法更新user_metadata）
		async updateProfile(data) {
			if (!this.currentUser) {
				throw new Error('未登录')
			}

			try {
				// 更新本地状态
				this.currentUser = {
					...this.currentUser,
					user_metadata: {
						...this.currentUser.user_metadata,
						...data
					}
				}

				// 保存到localStorage
				setStorage('currentUser', this.currentUser)

				return this.currentUser
			} catch (error) {
				console.error('更新用户信息失败:', error)
				throw error
			}
		},

		// 更新头像
		async updateAvatar(avatarUrl) {
			await this.updateProfile({ avatar: avatarUrl })
		},

		// 修改密码（需要通过supabase的updateUser方法）
		async changePassword(newPassword) {
			// Supabase的密码修改需要在用户已登录状态下调用
			// 这里可以后续添加supabase的updateUser调用
			throw new Error('此功能需要集成Supabase的updateUser方法')
		},

		// 删除账户（需要通过supabase的admin API）
		async deleteAccount() {
			if (!this.currentUser) return

			// 先登出
			await this.logout()

			// Supabase的账户删除需要使用admin API，这里需要后续添加
			throw new Error('此功能需要集成Supabase的admin API')
		}
	}
})
